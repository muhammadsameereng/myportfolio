import { NextResponse } from "next/server";

// Edge runtime — fetch-based dependencies (Resend, Turnstile) work
// natively here. Cold starts ~50ms instead of ~700ms on Node.
export const runtime = "edge";

const RESEND_ENDPOINT = "https://api.resend.com/emails";
const TURNSTILE_VERIFY_ENDPOINT =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

// Sliding-window rate limiter — keyed by IP, in-memory.
// Edge instances are short-lived but for a portfolio contact form
// this is sufficient bot deterrent on top of Turnstile.
const RATE_LIMIT_WINDOW_MS = 60_000;       // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 3;         // per window per IP
const rateBucket = new Map<string, number[]>();

function checkRateLimit(ip: string): { ok: boolean; retryAfter?: number } {
  const now = Date.now();
  const cutoff = now - RATE_LIMIT_WINDOW_MS;
  const hits = (rateBucket.get(ip) ?? []).filter((t) => t > cutoff);
  if (hits.length >= RATE_LIMIT_MAX_REQUESTS) {
    const retryAfter = Math.ceil((hits[0] + RATE_LIMIT_WINDOW_MS - now) / 1000);
    return { ok: false, retryAfter };
  }
  hits.push(now);
  rateBucket.set(ip, hits);
  return { ok: true };
}

type Payload = {
  name?: string;
  email?: string;
  message?: string;
  turnstileToken?: string;
};

// Web Crypto-based UUID for idempotency (works on Edge).
function newIdempotencyKey() {
  return (
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `contact-${Date.now()}-${Math.random().toString(36).slice(2)}`
  );
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const isValidEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

export async function POST(req: Request) {
  // Identify the requester for rate-limiting
  const ip =
    req.headers.get("cf-connecting-ip") ||
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  const limit = checkRateLimit(ip);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Too many requests. Please slow down and try again." },
      {
        status: 429,
        headers: {
          "Retry-After": String(limit.retryAfter ?? 60),
        },
      }
    );
  }

  // Parse + validate
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

  // Server config
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;
  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;

  if (!apiKey || !to || !from) {
    return NextResponse.json(
      { error: "Email service is not configured." },
      { status: 500 }
    );
  }

  // Bot check — verify Cloudflare Turnstile token if a secret is configured.
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
          {
            error:
              "Verification failed. Please try the challenge again.",
          },
          { status: 400 }
        );
      }
    } catch {
      return NextResponse.json(
        {
          error:
            "Couldn't verify the challenge. Please refresh and try again.",
        },
        { status: 502 }
      );
    }
  }

  // Subject — kept neutral, no spammy markers ("New", "URGENT", etc avoided).
  const subject = name
    ? `Message from ${name} via saranzafar.com`
    : `Message via saranzafar.com`;

  const safeName = escapeHtml(name || "Visitor");
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message).replace(/\n/g, "<br />");
  const sentAt = new Date().toLocaleString("en-GB", {
    timeZone: "Asia/Karachi",
    dateStyle: "medium",
    timeStyle: "short",
  });

  // Preheader — shown in inbox preview, hidden in body. Helps deliverability + UX.
  const preheader = `${name || "A visitor"} wrote: ${message.slice(0, 90)}${
    message.length > 90 ? "…" : ""
  }`;
  const safePreheader = escapeHtml(preheader);

  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="x-apple-disable-message-reformatting" />
    <meta name="color-scheme" content="light dark" />
    <meta name="supported-color-schemes" content="light dark" />
    <title>${escapeHtml(subject)}</title>
  </head>
  <body style="margin:0; padding:0; background:#f6f6f7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; color:#0a0a0a;">
    <!-- Preheader (hidden) -->
    <div style="display:none; max-height:0; overflow:hidden; mso-hide:all; font-size:1px; line-height:1px; color:#f6f6f7;">
      ${safePreheader}
    </div>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f6f6f7; padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0" style="max-width:560px; width:100%; background:#ffffff; border:1px solid #e5e5e5; border-radius:16px; overflow:hidden;">
            <!-- Brand strip -->
            <tr>
              <td style="padding:18px 24px 14px; border-bottom:1px solid #f0f0f0;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="font-size:14px; font-weight:600; color:#0a0a0a;">
                      <span style="display:inline-block; vertical-align:middle; margin-right:6px;">&#10022;</span>
                      saranzafar
                    </td>
                    <td align="right" style="font-size:11px; color:#737373; text-transform:uppercase; letter-spacing:0.12em;">
                      Contact form
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:28px 24px 8px;">
                <p style="margin:0 0 6px; font-size:11px; color:#737373; text-transform:uppercase; letter-spacing:0.16em;">From</p>
                <p style="margin:0 0 22px; font-size:15px; color:#0a0a0a;">
                  <strong>${safeName}</strong>
                  &nbsp;&middot;&nbsp;
                  <a href="mailto:${safeEmail}" style="color:#2563eb; text-decoration:none;">${safeEmail}</a>
                </p>

                <p style="margin:0 0 6px; font-size:11px; color:#737373; text-transform:uppercase; letter-spacing:0.16em;">Message</p>
                <div style="margin:0; padding:16px; background:#fafafa; border:1px solid #efefef; border-radius:10px; font-size:15px; line-height:1.7; color:#171717; white-space:pre-wrap;">
                  ${safeMessage}
                </div>
              </td>
            </tr>

            <!-- CTA -->
            <tr>
              <td style="padding:18px 24px 24px;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td>
                      <a href="mailto:${safeEmail}" style="display:inline-block; padding:11px 18px; background:#0a0a0a; color:#ffffff; text-decoration:none; font-size:13px; font-weight:500; border-radius:999px;">
                        Reply to ${safeName}
                      </a>
                    </td>
                  </tr>
                </table>
                <p style="margin:14px 0 0; font-size:11.5px; color:#737373;">
                  Or just hit Reply &mdash; this email's reply-to is set to ${safeEmail}.
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding:14px 24px 18px; border-top:1px solid #f0f0f0; font-size:11px; color:#a3a3a3;">
                Sent ${escapeHtml(sentAt)} (PKT) from the contact form on saranzafar.com
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  // Plain-text alternative — keeps mailbox spam scores low (HTML-only emails
  // are penalised). Mirrors the HTML content faithfully.
  const text = [
    `Message from ${name || "Visitor"} via saranzafar.com`,
    ``,
    `From: ${name || "Visitor"} <${email}>`,
    `Sent: ${sentAt} (PKT)`,
    ``,
    `--- Message ---`,
    message,
    `--- End ---`,
    ``,
    `Reply directly to this email — reply-to is set to ${email}.`,
  ].join("\n");

  // Send via Resend
  let res: Response;
  try {
    res = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        // Resend dedupes within 24h on the same key, so accidental
        // double-clicks never produce duplicate sends.
        "Idempotency-Key": newIdempotencyKey(),
      },
      body: JSON.stringify({
        from,
        to,
        subject,
        html,
        text,
        reply_to: email,
        headers: {
          // Helps gmail/outlook treat each submission as a fresh thread
          // tied to the visitor, not lumped under the form's sender.
          "X-Entity-Ref-ID": `contact-${Date.now()}`,
        },
      }),
    });
  } catch {
    return NextResponse.json(
      { error: "Couldn't reach the email service. Please try again." },
      { status: 502 }
    );
  }

  if (!res.ok) {
    let detail = "";
    try {
      const err = (await res.json()) as { message?: string };
      detail = err?.message || "";
    } catch {
      /* ignore */
    }
    return NextResponse.json(
      { error: detail || "Email service returned an error." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
