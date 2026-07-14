import { NextResponse } from "next/server";
import { sendContactEmail } from "@/app/lib/email/sendContactEmail";
import { getClientIp, slidingWindowLimiter } from "@/app/lib/agent/rate-limit";

// Edge runtime — fetch-based dependencies (Resend, Turnstile) work
// natively here. Cold starts ~50ms instead of ~700ms on Node.
export const runtime = "edge";

const TURNSTILE_VERIFY_ENDPOINT =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

// Sliding-window rate limiter — keyed by IP, in-memory.
// Edge instances are short-lived but for a portfolio contact form
// this is sufficient bot deterrent on top of Turnstile.
const contactLimit = slidingWindowLimiter({
  windowMs: 60_000,
  maxRequests: 3,
});

type Payload = {
  name?: string;
  email?: string;
  message?: string;
  turnstileToken?: string;
};

const isValidEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

export async function POST(req: Request) {
  const ip = getClientIp(req);

  const limit = contactLimit(ip);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Too many requests. Please slow down and try again." },
      {
        status: 429,
        headers: { "Retry-After": String(limit.retryAfter ?? 60) },
      }
    );
  }

  let body: Payload;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const name = (body.name || "").trim().slice(0, 200);
  const email = (body.email || "").trim().slice(0, 320);
  const message = (body.message || "").trim().slice(0, 5000);
  const turnstileToken = (body.turnstileToken || "").trim();

  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ error: "A valid email is required." }, { status: 400 });
  }
  if (!message) {
    return NextResponse.json({ error: "Message can't be empty." }, { status: 400 });
  }

  // Bot check — verify Cloudflare Turnstile token if a secret is configured.
  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
  if (turnstileSecret) {
    if (!turnstileToken) {
      return NextResponse.json(
        { error: "Please complete the verification challenge." },
        { status: 400 }
      );
    }
    try {
      const params = new URLSearchParams();
      params.append("secret", turnstileSecret);
      params.append("response", turnstileToken);
      if (ip && ip !== "unknown") params.append("remoteip", ip);

      const verify = await fetch(TURNSTILE_VERIFY_ENDPOINT, {
        method: "POST",
        body: params,
      });
      const verifyData = (await verify.json()) as {
        success?: boolean;
        "error-codes"?: string[];
      };
      if (!verifyData.success) {
        return NextResponse.json(
          { error: "Verification failed. Please try the challenge again." },
          { status: 400 }
        );
      }
    } catch {
      return NextResponse.json(
        { error: "Couldn't verify the challenge. Please refresh and try again." },
        { status: 502 }
      );
    }
  }

  const result = await sendContactEmail({
    name,
    email,
    message,
    source: "contact-form",
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  return NextResponse.json({ ok: true });
}
