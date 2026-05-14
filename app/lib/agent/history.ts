import type { ChatTurn } from "./gemini";

// History compaction — keeps prompt token count bounded for long sessions.
// No second LLM call: we collapse the older turns into a single synthetic
// "model" turn that summarizes what the visitor said earlier. The recent
// turns are kept verbatim so the model has full fidelity for what's in flight.

const COMPACT_THRESHOLD = 12; // start compacting when total turns > this
const KEEP_LAST = 8; // always preserve this many recent turns verbatim
const MAX_SUMMARY_BULLETS = 6;
const MAX_BULLET_LEN = 140;

function summarizeUserText(t: string): string {
  const cleaned = t.replace(/\s+/g, " ").trim();
  return cleaned.length > MAX_BULLET_LEN
    ? cleaned.slice(0, MAX_BULLET_LEN - 1) + "…"
    : cleaned;
}

export function compactHistory(turns: ChatTurn[]): ChatTurn[] {
  if (turns.length <= COMPACT_THRESHOLD) return turns;

  const tail = turns.slice(-KEEP_LAST);
  const head = turns.slice(0, turns.length - KEEP_LAST);

  // Pull the visitor's earlier messages — those are the high-signal bits.
  // Bot responses are reconstructable from the visitor's questions.
  const userBullets = head
    .filter((t) => t.role === "user")
    .map((t) => summarizeUserText(t.text))
    .filter((s) => s.length > 0)
    .slice(-MAX_SUMMARY_BULLETS) // most recent of the dropped half
    .map((s) => `- ${s}`);

  if (userBullets.length === 0) return tail;

  const summary: ChatTurn = {
    role: "model",
    text: `Earlier in this conversation, the visitor mentioned:\n${userBullets.join("\n")}`,
  };

  return [summary, ...tail];
}
