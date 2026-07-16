"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Check, Clock, Mail, MapPin, Phone } from "lucide-react";
import Script from "next/script";
import { useEffect, useRef, useState } from "react";

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

declare global {
  interface Window {
    turnstile?: {
      render: (
        el: HTMLElement | string,
        opts: {
          sitekey: string;
          callback?: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
          theme?: "light" | "dark" | "auto";
          size?: "normal" | "flexible" | "compact";
          appearance?: "always" | "execute" | "interaction-only";
        }
      ) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

function InstagramIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function GitlabIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="m23.6004 9.5927-.0337-.0863L20.3.7572a.851.851 0 0 0-.3362-.405.8748.8748 0 0 0-.9997.0539.8748.8748 0 0 0-.29.4399l-2.2055 6.748H7.5375l-2.2057-6.748a.8573.8573 0 0 0-.29-.4412.8748.8748 0 0 0-.9997-.0537.8585.8585 0 0 0-.3362.4049L.4332 9.5015l-.0325.0862a6.0657 6.0657 0 0 0 2.0119 7.0105l.0113.0087.03.0213 4.976 3.7264 2.462 1.8633 1.4995 1.1321a1.0085 1.0085 0 0 0 1.2197 0l1.4995-1.1321 2.4619-1.8633 5.006-3.7489.0125-.01a6.0682 6.0682 0 0 0 2.0094-7.003z" />
    </svg>
  );
}
import SectionHead from "./SectionHead";

const EMAIL = "msameerdevelops@gmail.com";

function GithubIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

function LinkedInIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 12 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] as const },
});

const TOPICS = ["New project", "Job / role", "Collaboration", "Just saying hi"];

export default function ContactPageContent() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [topic, setTopic] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  const turnstileContainerRef = useRef<HTMLDivElement>(null);
  const turnstileWidgetIdRef = useRef<string | null>(null);

  // Render the Turnstile widget once the script has loaded and we have
  // a container.  Skipped entirely if no site key is configured.
  useEffect(() => {
    if (!TURNSTILE_SITE_KEY) return;
    if (!scriptLoaded) return;
    if (!turnstileContainerRef.current) return;
    if (!window.turnstile) return;
    if (turnstileWidgetIdRef.current) return; // already mounted

    turnstileWidgetIdRef.current = window.turnstile.render(
      turnstileContainerRef.current,
      {
        sitekey: TURNSTILE_SITE_KEY,
        theme: "auto",
        size: "flexible",
        appearance: "always",
        callback: (token) => setTurnstileToken(token),
        "expired-callback": () => setTurnstileToken(null),
        "error-callback": () => setTurnstileToken(null),
      }
    );
  }, [scriptLoaded, sent]);

  // When the user resets the form ("Send another"), tear down and re-mount
  // the widget so it gets a fresh token.
  useEffect(() => {
    if (!sent) return;
    if (window.turnstile && turnstileWidgetIdRef.current) {
      try {
        window.turnstile.remove(turnstileWidgetIdRef.current);
      } catch {
        /* ignore */
      }
    }
    turnstileWidgetIdRef.current = null;
    // Defer the state update so we don't cascade-render synchronously.
    queueMicrotask(() => setTurnstileToken(null));
  }, [sent]);

  const canSend =
    email.trim().length > 0 &&
    message.trim().length > 0 &&
    !sending &&
    (!TURNSTILE_SITE_KEY || !!turnstileToken);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSend) return;
    setSending(true);
    setError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          message: topic ? `[${topic}] ${message.trim()}` : message.trim(),
          turnstileToken: turnstileToken || undefined,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };
      if (!res.ok || !data.ok) {
        setError(
          data.error ||
            "Couldn't send the message. Please try again, or email me directly."
        );
        // Reset Turnstile so the visitor gets a fresh token to retry with.
        if (window.turnstile && turnstileWidgetIdRef.current) {
          window.turnstile.reset(turnstileWidgetIdRef.current);
        }
        setTurnstileToken(null);
        setSending(false);
        return;
      }
      setSent(true);
    } catch {
      setError("Network error. Please try again, or email me directly.");
      if (window.turnstile && turnstileWidgetIdRef.current) {
        window.turnstile.reset(turnstileWidgetIdRef.current);
      }
      setTurnstileToken(null);
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="relative">
      {/* Cloudflare Turnstile loader (only when configured) */}
      {TURNSTILE_SITE_KEY && (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
          strategy="afterInteractive"
          onLoad={() => setScriptLoaded(true)}
          onReady={() => setScriptLoaded(true)}
        />
      )}

      <div className="mx-auto max-w-5xl px-6 py-16 md:py-20">
        <SectionHead
          title="Contact"
          description="Have a project in mind, a role to fill, or just want to say hello? Send a note — I read everything and reply within 24 hours from the valley."
        />

        {/* Two columns: info left, form right */}
        <div className="mt-12 grid gap-12 md:grid-cols-[1fr_1.4fr] md:gap-14">
          {/* ── LEFT — contact details ─────────────────── */}
          <motion.aside {...fadeUp(0)}>
            <h3 className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
              Get in touch
            </h3>
            <p className="mt-4 text-[15px] leading-[1.7] text-foreground/85">
              Best by email — that&apos;s where I actually respond. For the
              quick stuff, the socials below work too.
            </p>

            {/* Detail rows */}
            <ul className="mt-6 space-y-4 rounded-2xl border border-border bg-card p-5 sm:p-6">
              <li className="flex items-start gap-3">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border bg-accent/10 text-accent">
                  <Mail size={15} />
                </span>
                <div className="min-w-0">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                    Email
                  </p>
                  <a
                    href={`mailto:${EMAIL}`}
                    className="mt-0.5 block truncate text-[13.5px] font-medium text-foreground transition-colors hover:text-accent"
                  >
                    {EMAIL}
                  </a>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border bg-accent/10 text-accent">
                  <Phone size={15} />
                </span>
                <div className="min-w-0">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                    Phone
                  </p>
                  <a
                    href="tel:+923430159930"
                    className="mt-0.5 block text-[13.5px] font-medium text-foreground transition-colors hover:text-accent"
                  >
                    +92 343 015 9930
                  </a>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border bg-accent/10 text-accent">
                  <MapPin size={15} />
                </span>
                <div className="min-w-0">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                    Based in
                  </p>
                  <p className="mt-0.5 text-[13.5px] font-medium text-foreground">
                    Kotli, Azad Kashmir
                  </p>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border bg-accent/10 text-accent">
                  <Clock size={15} />
                </span>
                <div className="min-w-0">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                    Timezone
                  </p>
                  <p className="mt-0.5 text-[13.5px] font-medium text-foreground">
                    PKT (UTC +5) — replies within 24h
                  </p>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border bg-card">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                  </span>
                </span>
                <div className="min-w-0">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                    Status
                  </p>
                  <p className="mt-0.5 text-[13.5px] font-medium text-foreground">
                    Ready to work
                  </p>
                </div>
              </li>
            </ul>

            {/* Socials — all five, matching the footer */}
            <div className="mt-8 border-t border-border pt-6">
              <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                Find me elsewhere
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <a
                  href="https://github.com/muhammadsameereng"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-full border border-border bg-background px-3.5 text-[12.5px] font-medium text-foreground transition-colors hover:border-accent/50 hover:bg-card hover:text-accent"
                >
                  <GithubIcon size={13} />
                  GitHub
                </a>
                <a
                  href="https://www.linkedin.com/in/muhammad-sameer"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-full border border-border bg-background px-3.5 text-[12.5px] font-medium text-foreground transition-colors hover:border-accent/50 hover:bg-card hover:text-accent"
                >
                  <LinkedInIcon size={13} />
                  LinkedIn
                </a>
                <a
                  href="https://www.instagram.com/m.sameer.dev/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-full border border-border bg-background px-3.5 text-[12.5px] font-medium text-foreground transition-colors hover:border-accent/50 hover:bg-card hover:text-accent"
                >
                  <InstagramIcon size={13} />
                  Instagram
                </a>
                <a
                  href="https://gitlab.com/sameerorg-group/sameerorg-project/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-full border border-border bg-background px-3.5 text-[12.5px] font-medium text-foreground transition-colors hover:border-accent/50 hover:bg-card hover:text-accent"
                >
                  <GitlabIcon size={13} />
                  GitLab
                </a>
                <a
                  href={`mailto:${EMAIL}`}
                  className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-full border border-border bg-background px-3.5 text-[12.5px] font-medium text-foreground transition-colors hover:border-accent/50 hover:bg-card hover:text-accent"
                >
                  <Mail size={13} />
                  Email
                </a>
              </div>
            </div>
          </motion.aside>

          {/* ── RIGHT — form / sent state ─────────────────── */}
          <motion.div {...fadeUp(0.05)} className="relative">
            {!sent ? (
              <form
                onSubmit={handleSubmit}
                className="rounded-2xl border border-border bg-card p-6 sm:p-7"
              >
                <h3 className="text-[16px] font-semibold tracking-tight text-foreground">
                  Send a note
                </h3>
                <p className="mt-1 text-[13px] text-muted-foreground">
                  Tell me what you&apos;re building and how I can help.
                </p>

                {/* Topic quick-select — prepended to the message so I can
                    triage the note at a glance. */}
                <div className="mt-6">
                  <p className="block text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                    What&apos;s this about?
                  </p>
                  <div className="mt-2.5 flex flex-wrap gap-2">
                    {TOPICS.map((t) => {
                      const active = topic === t;
                      return (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setTopic(active ? "" : t)}
                          aria-pressed={active}
                          className={`rounded-full border px-3 py-1.5 text-[12.5px] font-medium transition-colors ${
                            active
                              ? "border-accent/50 bg-accent/10 text-accent"
                              : "border-border bg-background text-muted-foreground hover:border-foreground/30 hover:text-foreground"
                          }`}
                        >
                          {t}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-5 space-y-4">
                  {/* Name */}
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="block text-[11px] uppercase tracking-[0.18em] text-muted-foreground"
                    >
                      Your name
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      autoComplete="name"
                      className="mt-2 h-11 w-full appearance-none rounded-xl border border-border bg-background px-3.5 font-sans text-[14px] text-foreground outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-muted-foreground/70 hover:border-foreground/30 focus:border-accent/70 focus:shadow-[0_0_0_3px_rgba(14,116,144,0.15)] focus-visible:outline-none"
                      placeholder="What should I call you?"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="contact-email"
                      className="block text-[11px] uppercase tracking-[0.18em] text-muted-foreground"
                    >
                      Email <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                      className="mt-2 h-11 w-full appearance-none rounded-xl border border-border bg-background px-3.5 font-sans text-[14px] text-foreground outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-muted-foreground/70 hover:border-foreground/30 focus:border-accent/70 focus:shadow-[0_0_0_3px_rgba(14,116,144,0.15)] focus-visible:outline-none"
                      placeholder="you@example.com"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label
                      htmlFor="contact-message"
                      className="block text-[11px] uppercase tracking-[0.18em] text-muted-foreground"
                    >
                      Message <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      id="contact-message"
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={6}
                      className="mt-2 w-full resize-none appearance-none rounded-xl border border-border bg-background px-3.5 py-3 font-sans text-[14px] leading-[1.6] text-foreground outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-muted-foreground/70 hover:border-foreground/30 focus:border-accent/70 focus:shadow-[0_0_0_3px_rgba(14,116,144,0.15)] focus-visible:outline-none"
                      placeholder="A short note about the project, the timeline, and what success looks like."
                    />
                    <p className="mt-1.5 text-right text-[11px] text-muted-foreground/70">
                      {message.trim().length < 12
                        ? "A sentence or two helps me reply well."
                        : `${message.trim().length} characters`}
                    </p>
                  </div>
                </div>

                {/* Cloudflare Turnstile — always visible so visitors
                    can see the form is protected. Reads as a real part
                    of the form rather than a stray third-party badge. */}
                {TURNSTILE_SITE_KEY && (
                  <div className="mt-5">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                      Verification
                    </p>
                    <div className="mt-2 flex flex-col gap-2">
                      <div ref={turnstileContainerRef} />
                      <p className="text-[11px] leading-relaxed text-muted-foreground">
                        Protected by Cloudflare. We don&apos;t use cookies or
                        trackers — this is just to keep bots out.
                      </p>
                    </div>
                  </div>
                )}

                {/* Inline error */}
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-[12.5px] text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/40 dark:text-rose-200"
                  >
                    {error}
                  </motion.p>
                )}

                {/* Footer */}
                <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                  <p className="text-[11.5px] text-muted-foreground">
                    Direct to my inbox — usually answered within 24h.
                  </p>
                  <button
                    type="submit"
                    disabled={!canSend}
                    className="group inline-flex h-10 cursor-pointer items-center gap-1.5 rounded-full bg-foreground px-5 text-[13px] font-medium text-background transition-all duration-200 hover:scale-[1.02] hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
                  >
                    {sending ? (
                      <>
                        <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-background/40 border-t-background" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send message
                        <ArrowUpRight
                          size={13}
                          className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        />
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="rounded-2xl border border-border bg-card p-8 text-center sm:p-10"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-500">
                  <Check size={20} strokeWidth={2.4} />
                </div>
                <h3 className="mt-5 text-[18px] font-semibold tracking-tight text-foreground">
                  Message on its way.
                </h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-muted-foreground">
                  Sameer is reading this on his phone, in Azad Kashmir, probably
                  with chai. Expect a reply within 24 hours.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSent(false);
                    setError(null);
                    setName("");
                    setEmail("");
                    setMessage("");
                  }}
                  className="mt-6 inline-flex h-9 cursor-pointer items-center rounded-full border border-border bg-background px-4 text-[12.5px] font-medium text-foreground transition-colors hover:border-accent/50 hover:bg-card hover:text-accent"
                >
                  Send another
                </button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
