/**
 * Validate a `next` path so it can only redirect within this app.
 * Rejects absolute URLs, protocol-relative URLs (`//evil.com`),
 * backslashes, and anything that doesn't start with a single `/`.
 *
 * Pure / no Node imports — safe to use from middleware (edge runtime).
 */
export function safeNextPath(value: string | null | undefined, fallback = "/admin"): string {
  if (!value || typeof value !== "string") return fallback;
  if (!value.startsWith("/")) return fallback;
  if (value.startsWith("//") || value.startsWith("/\\")) return fallback;
  if (value.includes("\\")) return fallback;
  return value;
}
