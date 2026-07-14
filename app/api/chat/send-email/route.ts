import { NextResponse } from "next/server";
import { emailLimit, getClientIp } from "@/app/lib/agent/rate-limit";
import { sendContactEmail } from "@/app/lib/email/sendContactEmail";

export const runtime = "edge";

type Payload = {
  name?: string;
  email?: string;
  message?: string;
};

const isValidEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

export async function POST(req: Request) {
  const ip = getClientIp(req);

  // 1 email per IP per 60 seconds — the hard cap.
  const limit = emailLimit(ip);
  if (!limit.ok) {
    return NextResponse.json(
      {
        error: `One message per minute. Try again in ${limit.retryAfter}s.`,
        retryAfter: limit.retryAfter,
      },
      {
        status: 429,
        headers: { "Retry-After": String(limit.retryAfter) },
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

  if (!name) {
    return NextResponse.json({ error: "Name is required." }, { status: 400 });
  }
  if (!email || !isValidEmail(email)) {
    return NextResponse.json(
      { error: "A valid email is required." },
      { status: 400 }
    );
  }
  if (!message) {
    return NextResponse.json({ error: "Message can't be empty." }, { status: 400 });
  }

  const result = await sendContactEmail({
    name,
    email,
    message,
    source: "ask-saran-bot",
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  return NextResponse.json({ ok: true });
}
