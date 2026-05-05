/**
 * Toast messages — surfaced as a small capsule above the dock every time
 * the visitor toggles play/pause. Two pools: warm welcomes for "play",
 * quiet acknowledgements for "pause". One is picked at random each time.
 *
 * Voice: warm, first-person, lowercased. No coding/terminal vocabulary.
 */
export const PLAY_MESSAGES: ReadonlyArray<string> = [
  "welcome. the music is on me.",
  "stay a while — the page is yours.",
  "enjoy the moment.",
  "if you like it, scroll slow.",
  "made in kashmir. mixed by someone kind.",
  "good vibes incoming.",
  "pause anytime. the page is patient.",
  "headphones recommended. shoes optional.",
  "you brought the attention. i brought the soundtrack.",
  "a small thank-you for visiting.",
];

export const PAUSE_MESSAGES: ReadonlyArray<string> = [
  "paused. the page will wait.",
  "shh. taking five.",
  "silence is also a soundtrack.",
  "muted. carry on reading.",
  "intermission.",
  "quiet mode.",
  "holding the note.",
  "press play when you're ready.",
  "okay, we'll be quiet now.",
  "take your time.",
];

export function pickMessage(action: "play" | "pause"): string {
  const pool = action === "play" ? PLAY_MESSAGES : PAUSE_MESSAGES;
  const i = Math.floor(Math.random() * pool.length);
  return pool[i] ?? pool[0]!;
}
