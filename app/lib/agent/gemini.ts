import "server-only";

// Direct REST against Gemini's streamGenerateContent endpoint with alt=sse.
// We avoid @google/generative-ai to keep the edge bundle slim and the
// failure modes obvious — this is just `fetch` + line parsing.

// Flash-lite is plenty for a grounded portfolio chat — we hand the model
// a curated knowledge file + few-shot examples + retrieval-ranked items
// + intent hint, so it doesn't need to "think" much. Higher free-tier
// quota (~15 RPM, ~1,000 RPD) and ~5× cheaper per token than flash.
const MODEL = "gemini-2.5-flash-lite";
const ENDPOINT = (key: string) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:streamGenerateContent?alt=sse&key=${encodeURIComponent(
    key
  )}`;

export type ChatRole = "user" | "model";

export type ChatTurn = {
  role: ChatRole;
  text: string;
};

export type GeminiChunk =
  | { kind: "text"; text: string }
  | {
      kind: "tool";
      name: string;
      args: Record<string, unknown>;
    };

const sendEmailToolDeclaration = {
  name: "sendEmailToSaran",
  description:
    "Compose an email to Sameer on behalf of the visitor. Only call AFTER the visitor has supplied name, email, message AND explicitly confirmed they want it sent.",
  parameters: {
    type: "OBJECT",
    properties: {
      name: { type: "STRING", description: "Visitor's name." },
      email: {
        type: "STRING",
        description: "Visitor's email address — must look like a valid email.",
      },
      message: {
        type: "STRING",
        description: "The message Sameer will receive.",
      },
    },
    required: ["name", "email", "message"],
  },
};

type GeminiPart =
  | { text: string }
  | { functionCall: { name: string; args: Record<string, unknown> } };

type GeminiResponseChunk = {
  candidates?: Array<{
    content?: { parts?: GeminiPart[] };
    finishReason?: string;
  }>;
};

export async function* streamGemini(opts: {
  apiKey: string;
  systemPrompt: string;
  history: ChatTurn[];
}): AsyncGenerator<GeminiChunk> {
  const { apiKey, systemPrompt, history } = opts;

  const body = {
    systemInstruction: { parts: [{ text: systemPrompt }] },
    contents: history.map((t) => ({
      role: t.role,
      parts: [{ text: t.text }],
    })),
    tools: [{ functionDeclarations: [sendEmailToolDeclaration] }],
    toolConfig: { functionCallingConfig: { mode: "AUTO" } },
    generationConfig: {
      temperature: 0.6,
      topP: 0.9,
      maxOutputTokens: 800,
      // gemini-2.5-flash enables an internal thinking phase by default.
      // For a short, grounded chat that's pure latency burn — and on
      // short prompts the model often emits ZERO visible tokens because
      // it spent the whole budget thinking. Disable it.
      thinkingConfig: { thinkingBudget: 0 },
    },
    safetySettings: [
      { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_ONLY_HIGH" },
      { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_ONLY_HIGH" },
      {
        category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
        threshold: "BLOCK_ONLY_HIGH",
      },
      {
        category: "HARM_CATEGORY_DANGEROUS_CONTENT",
        threshold: "BLOCK_ONLY_HIGH",
      },
    ],
  };

  const res = await fetch(ENDPOINT(apiKey), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok || !res.body) {
    const detail = await res.text().catch(() => "");
    throw new Error(
      `Gemini request failed (${res.status}): ${detail.slice(0, 200)}`
    );
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  // Robust to \n\n and \r\n\r\n frame separators.
  const flushFrame = function* (frame: string): Generator<GeminiChunk> {
    for (const rawLine of frame.split(/\r?\n/)) {
      const line = rawLine.trimStart();
      if (!line.startsWith("data:")) continue;
      const json = line.slice(5).trim();
      if (!json || json === "[DONE]") continue;
      let chunk: GeminiResponseChunk;
      try {
        chunk = JSON.parse(json);
      } catch {
        continue;
      }
      const parts = chunk.candidates?.[0]?.content?.parts ?? [];
      for (const part of parts) {
        if ("text" in part && part.text) {
          yield { kind: "text", text: part.text };
        } else if ("functionCall" in part && part.functionCall) {
          yield {
            kind: "tool",
            name: part.functionCall.name,
            args: part.functionCall.args || {},
          };
        }
      }
    }
  };

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    let sepIdx = buffer.search(/\r?\n\r?\n/);
    while (sepIdx !== -1) {
      const match = buffer.slice(sepIdx).match(/^\r?\n\r?\n/);
      const sepLen = match ? match[0].length : 2;
      const frame = buffer.slice(0, sepIdx);
      buffer = buffer.slice(sepIdx + sepLen);
      yield* flushFrame(frame);
      sepIdx = buffer.search(/\r?\n\r?\n/);
    }
  }

  // Flush whatever's left — some servers omit the trailing blank line.
  if (buffer.trim()) {
    yield* flushFrame(buffer);
  }
}
