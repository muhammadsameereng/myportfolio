import { chatLimit, getClientIp } from "@/app/lib/agent/rate-limit";
import {
  buildSystemPrompt,
  getValidSlugs,
} from "@/app/lib/agent/system-prompt";
import { streamGemini, type ChatTurn } from "@/app/lib/agent/gemini";
import { compactHistory } from "@/app/lib/agent/history";

// Node runtime, not Edge. The Vercel/Workers V8 fetch implementation has
// a documented bug where long-lived streaming bodies from Gemini's
// streamGenerateContent?alt=sse endpoint terminate with "fetch failed"
// before the first chunk arrives. Node's undici fetch handles them
// cleanly. See https://github.com/cline/cline/issues/918,
// https://github.com/livekit/agents/issues/4706.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Payload = {
  history?: ChatTurn[];
};

const MAX_TURNS = 24;
const MAX_CHARS_PER_TURN = 2000;

function sse(event: string, data: unknown): string {
  return `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
}

function jsonError(message: string, status: number, headers?: HeadersInit) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "Content-Type": "application/json", ...headers },
  });
}

/* ── Citation validator (streaming-safe) ───────────────────────────────
   The model is instructed to emit `[ref:projects/<slug>|Title]` and
   `[ref:blog/<slug>|Title]`. We never want a hallucinated slug (404 link)
   reaching the client.

   `makeCitationFilter()` returns push() and flush() functions:
   - push(chunk) appends the chunk to a small carry buffer, then emits the
     longest "safe" prefix (text up to but not including any incomplete
     `[ref:` marker). Complete markers are validated against the live slug
     sets — invalid ones are silently dropped.
   - flush() emits whatever's left, dropping any half-typed marker tail. */
function makeCitationFilter(validSlugs: {
  projects: Set<string>;
  posts: Set<string>;
}) {
  let carry = "";
  const REF_FULL = /^\[ref:(projects|blog)\/([a-z0-9][a-z0-9-]*)(?:\|([^\]]+))?\]/i;

  function isValid(marker: string): boolean {
    const m = marker.match(REF_FULL);
    if (!m) return false;
    const kind = m[1].toLowerCase();
    const slug = m[2];
    if (kind === "projects") return validSlugs.projects.has(slug);
    if (kind === "blog") return validSlugs.posts.has(slug);
    return false;
  }

  function push(chunk: string, emit: (text: string) => void) {
    carry += chunk;

    while (true) {
      const openIdx = carry.indexOf("[ref:");

      if (openIdx === -1) {
        // No pending marker — emit everything.
        if (carry) emit(carry);
        carry = "";
        return;
      }

      // Emit the safe prefix before the marker.
      if (openIdx > 0) {
        emit(carry.slice(0, openIdx));
        carry = carry.slice(openIdx);
      }

      const closeIdx = carry.indexOf("]");
      if (closeIdx === -1) {
        // Marker not yet complete — wait for more chunks.
        return;
      }

      const marker = carry.slice(0, closeIdx + 1);
      if (isValid(marker)) {
        emit(marker);
      }
      // else: drop silently
      carry = carry.slice(closeIdx + 1);
    }
  }

  function flush(emit: (text: string) => void) {
    if (!carry) return;
    // Drop any incomplete marker tail; emit the rest.
    const openIdx = carry.indexOf("[ref:");
    const tail = openIdx === -1 ? carry : carry.slice(0, openIdx);
    if (tail) emit(tail);
    carry = "";
  }

  return { push, flush };
}

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const limit = chatLimit(ip);
  if (!limit.ok) {
    return jsonError(
      "You're chatting a bit fast — give me a moment.",
      429,
      { "Retry-After": String(limit.retryAfter) }
    );
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return jsonError("Chat is not configured.", 500);
  }

  let body: Payload;
  try {
    body = await req.json();
  } catch {
    return jsonError("Invalid request body.", 400);
  }

  const rawHistory = (body.history || [])
    .filter(
      (t): t is ChatTurn =>
        !!t &&
        (t.role === "user" || t.role === "model") &&
        typeof t.text === "string" &&
        t.text.trim().length > 0
    )
    .slice(-MAX_TURNS)
    .map((t) => ({ role: t.role, text: t.text.slice(0, MAX_CHARS_PER_TURN) }));

  if (rawHistory.length === 0 || rawHistory[rawHistory.length - 1].role !== "user") {
    return jsonError("Last message must be from the visitor.", 400);
  }

  // Latest user turn drives intent + retrieval; full (compacted) history goes
  // to Gemini as `contents`.
  const latestUserMessage = rawHistory[rawHistory.length - 1].text;
  const history = compactHistory(rawHistory);

  const [systemPrompt, validSlugs] = await Promise.all([
    buildSystemPrompt(latestUserMessage),
    getValidSlugs(),
  ]);

  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (event: string, data: unknown) => {
        controller.enqueue(encoder.encode(sse(event, data)));
      };
      const filter = makeCitationFilter(validSlugs);
      const emitToken = (text: string) => {
        if (text) send("token", { text });
      };

      let emittedAnything = false;
      try {
        for await (const chunk of streamGemini({
          apiKey,
          systemPrompt,
          history,
        })) {
          if (chunk.kind === "text") {
            filter.push(chunk.text, (clean) => {
              emitToken(clean);
              emittedAnything = true;
            });
          } else if (chunk.kind === "tool") {
            // Flush any pending text before the tool intent so the order
            // visitor sees matches the order the model produced.
            filter.flush(emitToken);
            send("tool", { name: chunk.name, args: chunk.args });
            emittedAnything = true;
          }
        }
        filter.flush(emitToken);

        // Safety net — if the model emitted nothing usable, give the visitor
        // a graceful fallback instead of a silent typing indicator.
        if (!emittedAnything) {
          send("token", {
            text:
              "I couldn't generate a response. Try rephrasing — or ask me to email Saran directly.",
          });
        }
        send("done", {});
      } catch (err) {
        send("error", {
          message:
            err instanceof Error
              ? err.message
              : "I'm having trouble reaching the model.",
        });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
