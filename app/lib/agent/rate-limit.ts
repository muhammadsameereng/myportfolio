// Edge-safe in-memory sliding window. Per-instance, not globally shared.
// Sufficient for portfolio-scale traffic; upgrade to Supabase / KV if abuse appears.

export type RateLimitResult = { ok: true } | { ok: false; retryAfter: number };

export function slidingWindowLimiter(opts: {
  windowMs: number;
  maxRequests: number;
}) {
  const bucket = new Map<string, number[]>();
  const { windowMs, maxRequests } = opts;

  return function check(ip: string): RateLimitResult {
    const now = Date.now();
    const cutoff = now - windowMs;
    const hits = (bucket.get(ip) ?? []).filter((t) => t > cutoff);
    if (hits.length >= maxRequests) {
      const retryAfter = Math.ceil((hits[0] + windowMs - now) / 1000);
      return { ok: false, retryAfter };
    }
    hits.push(now);
    bucket.set(ip, hits);
    return { ok: true };
  };
}

// Standard chain — Cloudflare first (most accurate when in front of the
// origin), then the generic forwarded headers, then the platform header.
export function getClientIp(req: Request): string {
  return (
    req.headers.get("cf-connecting-ip") ||
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

// Pre-built limiters used by chat routes. The contact form constructs
// its own with different thresholds.
export const chatLimit = slidingWindowLimiter({
  windowMs: 60_000,
  maxRequests: 20,
});

export const emailLimit = slidingWindowLimiter({
  windowMs: 60_000,
  maxRequests: 1,
});
