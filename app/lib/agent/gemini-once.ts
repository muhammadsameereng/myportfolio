import "server-only";
import type { Safety } from "@/app/lib/pipeline/config";

/**
 * Non-streaming sibling of `gemini.ts` for the blog pipeline. Single
 * request/response (`:generateContent`), optional Google Search grounding,
 * and built-in retry/backoff on 429/5xx. Same hand-rolled fetch approach —
 * no SDK — so failure modes stay obvious.
 */

const ENDPOINT = (model: string, key: string) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(
    key
  )}`;

const SAFETY_CATEGORIES = [
  "HARM_CATEGORY_HARASSMENT",
  "HARM_CATEGORY_HATE_SPEECH",
  "HARM_CATEGORY_SEXUALLY_EXPLICIT",
  "HARM_CATEGORY_DANGEROUS_CONTENT",
] as const;

export class GeminiError extends Error {
  retryable: boolean;
  safetyBlocked: boolean;
  constructor(message: string, opts: { retryable?: boolean; safety?: boolean } = {}) {
    super(message);
    this.name = "GeminiError";
    this.retryable = opts.retryable ?? false;
    this.safetyBlocked = opts.safety ?? false;
  }
}

export type GeminiSource = { uri: string; title?: string };

export type GenerateResult = {
  text: string;
  finishReason?: string;
  sources: GeminiSource[];
};

type GeminiPart = { text?: string };
type GeminiResponse = {
  candidates?: Array<{
    content?: { parts?: GeminiPart[] };
    finishReason?: string;
    groundingMetadata?: {
      groundingChunks?: Array<{ web?: { uri?: string; title?: string } }>;
    };
  }>;
  promptFeedback?: { blockReason?: string };
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function generateOnce(opts: {
  apiKey: string;
  model: string;
  prompt: string;
  systemPrompt?: string;
  temperature: number;
  maxOutputTokens: number;
  thinkingBudget?: number;
  grounding?: boolean;
  safety?: Safety;
  maxRetries?: number;
}): Promise<GenerateResult> {
  const {
    apiKey,
    model,
    prompt,
    systemPrompt,
    temperature,
    maxOutputTokens,
    thinkingBudget = 0,
    grounding = false,
    safety = "BLOCK_ONLY_HIGH",
    maxRetries = 3,
  } = opts;

  const body: Record<string, unknown> = {
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      temperature,
      maxOutputTokens,
      thinkingConfig: { thinkingBudget },
    },
    safetySettings: SAFETY_CATEGORIES.map((category) => ({
      category,
      threshold: safety,
    })),
  };
  if (systemPrompt) {
    body.systemInstruction = { parts: [{ text: systemPrompt }] };
  }
  if (grounding) {
    body.tools = [{ google_search: {} }];
  }

  const backoffs = [1000, 3000, 8000];
  let lastErr: GeminiError | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    let res: Response;
    try {
      res = await fetch(ENDPOINT(model, apiKey), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } catch (e) {
      lastErr = new GeminiError(
        `network error reaching Gemini: ${e instanceof Error ? e.message : String(e)}`,
        { retryable: true }
      );
      if (attempt < maxRetries) await sleep(backoffs[Math.min(attempt, backoffs.length - 1)]);
      continue;
    }

    if (res.status === 429 || res.status >= 500) {
      const retryAfter = Number(res.headers.get("retry-after"));
      const detail = await res.text().catch(() => "");
      lastErr = new GeminiError(`Gemini ${res.status}: ${detail.slice(0, 200)}`, {
        retryable: true,
      });
      if (attempt < maxRetries) {
        const wait = Number.isFinite(retryAfter) && retryAfter > 0
          ? retryAfter * 1000
          : backoffs[Math.min(attempt, backoffs.length - 1)];
        await sleep(wait);
      }
      continue;
    }

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      // 4xx (other than 429) is a request problem — not worth retrying.
      throw new GeminiError(`Gemini ${res.status}: ${detail.slice(0, 300)}`);
    }

    const data = (await res.json()) as GeminiResponse;
    const cand = data.candidates?.[0];
    const finishReason = cand?.finishReason;

    if (data.promptFeedback?.blockReason || finishReason === "SAFETY") {
      throw new GeminiError(
        `Gemini blocked the request (${data.promptFeedback?.blockReason || finishReason})`,
        { safety: true }
      );
    }

    const text = (cand?.content?.parts ?? [])
      .map((p) => p.text ?? "")
      .join("")
      .trim();

    if (!text) {
      // Empty output — usually transient (budget spent thinking). Retry once.
      lastErr = new GeminiError("Gemini returned no text", { retryable: true });
      if (attempt < maxRetries) {
        await sleep(backoffs[Math.min(attempt, backoffs.length - 1)]);
        continue;
      }
      throw lastErr;
    }

    const sources: GeminiSource[] = (cand?.groundingMetadata?.groundingChunks ?? [])
      .map((g) => g.web)
      .filter((w): w is { uri?: string; title?: string } => !!w && !!w.uri)
      .map((w) => ({ uri: w.uri as string, title: w.title }));

    return { text, finishReason, sources };
  }

  throw lastErr ?? new GeminiError("Gemini request failed after retries", { retryable: true });
}
