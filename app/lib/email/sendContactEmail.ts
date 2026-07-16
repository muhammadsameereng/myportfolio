// Edge-safe Resend email sender shared by /api/contact and /api/chat/send-email.
// Single source of truth for the HTML template, plain-text alternative,
// idempotency key, and POST request shape.

const RESEND_ENDPOINT = "https://api.resend.com/emails";

export type SendContactEmailInput = {
  name: string;
  email: string;
  message: string;
  // Where the message originated. Drives subject suffix, the footer line,
  // and the X-Entity-Ref-ID prefix so replies thread cleanly.
  source: "contact-form" | "ask-saran-bot";
};

export type SendContactEmailResult =
  | { ok: true }
  | { ok: false; status: number; error: string };

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function newIdempotencyKey(prefix: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export async function sendContactEmail(
  input: SendContactEmailInput
): Promise<SendContactEmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !to || !from) {
    return { ok: false, status: 500, error: "Email service is not configured." };
  }

  const { name, email, message, source } = input;
  const sourceLabel =
    source === "ask-saran-bot" ? "Ask-Sameer bot" : "Contact form";
  const idempotencyPrefix =
    source === "ask-saran-bot" ? "ask-saran" : "contact";

  const isAi = source === "ask-saran-bot";
  const aiSuffix = isAi ? " (by AI)" : "";
  const subject = name
    ? `Message from ${name} via msameer.vercel.app${aiSuffix}`
    : `Message via msameer.vercel.app${aiSuffix}`;

  const safeName = escapeHtml(name || "Visitor");
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message).replace(/\n/g, "<br />");
  const safeSourceLabel = escapeHtml(sourceLabel);
  const sentAt = new Date().toLocaleString("en-GB", {
    timeZone: "Asia/Karachi",
    dateStyle: "medium",
    timeStyle: "short",
  });

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
    <div style="display:none; max-height:0; overflow:hidden; mso-hide:all; font-size:1px; line-height:1px; color:#f6f6f7;">
      ${safePreheader}
    </div>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f6f6f7; padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0" style="max-width:560px; width:100%; background:#ffffff; border:1px solid #e5e5e5; border-radius:16px; overflow:hidden;">
            <tr>
              <td style="padding:18px 24px 14px; border-bottom:1px solid #f0f0f0;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="font-size:14px; font-weight:600; color:#0a0a0a;">
                      <span style="display:inline-block; vertical-align:middle; margin-right:6px;">&#10022;</span>
                      msameer
                    </td>
                    <td align="right" style="font-size:11px; color:#737373; text-transform:uppercase; letter-spacing:0.12em;">
                      ${safeSourceLabel}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            ${
              isAi
                ? `<tr>
              <td style="padding:18px 24px 0;">
                <div style="display:inline-block; padding:6px 12px; background:#fef3c7; border:1px solid #fde68a; border-radius:999px; font-size:11px; font-weight:600; color:#854d0e; letter-spacing:0.04em;">
                  ✦ Sent by AI &mdash; this message was composed by a visitor and dispatched through Caret, your site assistant.
                </div>
              </td>
            </tr>`
                : ""
            }
            <tr>
              <td style="padding:28px 24px 8px;">
                <p style="margin:0 0 6px; font-size:11px; color:#737373; text-transform:uppercase; letter-spacing:0.16em;">From${
                  isAi ? " (via AI)" : ""
                }</p>
                <p style="margin:0 0 22px; font-size:15px; color:#0a0a0a;">
                  <strong>${safeName}</strong>
                  &nbsp;&middot;&nbsp;
                  <a href="mailto:${safeEmail}" style="color:#0e7490; text-decoration:none;">${safeEmail}</a>
                </p>

                <p style="margin:0 0 6px; font-size:11px; color:#737373; text-transform:uppercase; letter-spacing:0.16em;">Message</p>
                <div style="margin:0; padding:16px; background:#fafafa; border:1px solid #efefef; border-radius:10px; font-size:15px; line-height:1.7; color:#171717; white-space:pre-wrap;">
                  ${safeMessage}
                </div>
              </td>
            </tr>

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

            <tr>
              <td style="padding:14px 24px 18px; border-top:1px solid #f0f0f0; font-size:11px; color:#a3a3a3;">
                Sent ${escapeHtml(sentAt)} (PKT) from ${safeSourceLabel.toLowerCase()} on msameer.vercel.app
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  const text = [
    `Message from ${name || "Visitor"} via msameer.vercel.app${
      isAi ? " (by AI)" : ""
    }`,
    ...(isAi
      ? [
          ``,
          `[Sent by AI — composed by a visitor, dispatched through Caret, your site assistant.]`,
        ]
      : []),
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

  let res: Response;
  try {
    res = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "Idempotency-Key": newIdempotencyKey(idempotencyPrefix),
      },
      body: JSON.stringify({
        from,
        to,
        subject,
        html,
        text,
        reply_to: email,
        headers: {
          "X-Entity-Ref-ID": `${idempotencyPrefix}-${Date.now()}`,
        },
      }),
    });
  } catch {
    return {
      ok: false,
      status: 502,
      error: "Couldn't reach the email service. Please try again.",
    };
  }

  if (!res.ok) {
    let detail = "";
    try {
      const err = (await res.json()) as { message?: string };
      detail = err?.message || "";
    } catch {
      /* ignore */
    }
    return {
      ok: false,
      status: 502,
      error: detail || "Email service returned an error.",
    };
  }

  return { ok: true };
}
