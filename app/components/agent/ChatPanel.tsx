"use client";

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowUp,
  ArrowUpRight,
  Loader2,
  Mail,
  RotateCcw,
  Sparkles,
  X,
} from "lucide-react";
import Link from "next/link";
import ConfirmEmailPill, { type EmailDraft } from "./ConfirmEmailPill";

type Role = "user" | "model";
type Reference = { kind: "projects" | "blog"; slug: string; title: string };

type Message = {
  id: string;
  role: Role;
  text: string;
  pendingEmail?: EmailDraft;
  emailHandled?: boolean;
};

type RenderPart =
  | { kind: "text"; text: string }
  | { kind: "ref"; ref: Reference }
  | { kind: "link"; label: string; href: string };

// Combined parser that matches:
//   1. Internal site references — [ref:projects/slug|Title], [ref:blog/slug|Title]
//   2. External markdown links — [Label](https://…) or [Label](mailto:…)
// Anything else stays as plain text.
const PART_RE =
  /\[ref:(projects|blog)\/([a-z0-9][a-z0-9-]*)(?:\|([^\]]+))?\]|\[([^\]\n]+)\]\(((?:https?:\/\/|mailto:)[^\s)]+)\)/gi;

const STARTER_PROMPTS = [
  "What does Saran build?",
  "Show me a project",
  "How do I hire him?",
  "Email Saran for me",
];

const WELCOME_TEXT =
  "Hi, I'm Caret — Saran's assistant. Ask me about his work, writing, or how to reach him.";

const newId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `m-${Date.now()}-${Math.random().toString(36).slice(2)}`;

function welcomeMessage(): Message {
  return { id: newId(), role: "model", text: WELCOME_TEXT };
}

function parseMessage(text: string): RenderPart[] {
  const parts: RenderPart[] = [];
  let lastIdx = 0;
  for (const m of text.matchAll(PART_RE)) {
    if (m.index === undefined) continue;
    if (m.index > lastIdx) {
      parts.push({ kind: "text", text: text.slice(lastIdx, m.index) });
    }
    if (m[1]) {
      // Internal ref marker
      const slug = m[2];
      const title = (m[3] || "").trim() || slug;
      parts.push({
        kind: "ref",
        ref: { kind: m[1] as Reference["kind"], slug, title },
      });
    } else if (m[4] && m[5]) {
      // External markdown link
      parts.push({ kind: "link", label: m[4].trim(), href: m[5].trim() });
    }
    lastIdx = m.index + m[0].length;
  }
  if (lastIdx < text.length) {
    parts.push({ kind: "text", text: text.slice(lastIdx) });
  }
  return parts;
}

function MessageBody({
  text,
  showCaret,
}: {
  text: string;
  showCaret?: boolean;
}) {
  const parts = useMemo(() => parseMessage(text), [text]);
  return (
    <div className="text-[14px] leading-relaxed text-foreground/90">
      {parts.map((p, i) => {
        if (p.kind === "text") {
          return (
            <span key={i} className="whitespace-pre-wrap break-words">
              {p.text}
            </span>
          );
        }
        if (p.kind === "link") {
          return (
            <a
              key={i}
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground underline decoration-foreground/30 underline-offset-[3px] transition-colors hover:decoration-foreground"
            >
              {p.label}
            </a>
          );
        }
        const href =
          p.ref.kind === "projects"
            ? `/projects/${p.ref.slug}`
            : `/blog/${p.ref.slug}`;
        return (
          <Link
            key={i}
            href={href}
            className="mx-0.5 inline-flex h-6 max-w-full animate-[ask-saran-chip-in_280ms_cubic-bezier(0.22,1,0.36,1)_both] items-center gap-1 truncate rounded-full border border-border bg-background px-2.5 align-[-1px] text-[12px] font-medium text-foreground transition-colors hover:border-foreground/40 hover:bg-card"
          >
            <span aria-hidden className="text-[10px] text-muted-foreground">
              {p.ref.kind === "projects" ? "↗" : "✎"}
            </span>
            <span className="truncate">{p.ref.title}</span>
          </Link>
        );
      })}
      {showCaret && (
        <span
          aria-hidden
          className="ml-0.5 inline-block h-[0.95em] w-[2px] -translate-y-[1px] animate-[ask-saran-caret_900ms_steps(2,end)_infinite] bg-foreground/70 align-middle"
        />
      )}
    </div>
  );
}

export default function ChatPanel({
  onClose,
  returnFocusRef,
}: {
  onClose: () => void;
  returnFocusRef?: React.RefObject<HTMLElement | null>;
}) {
  const reduceMotion = useReducedMotion();
  const dialogTitleId = useId();

  const [messages, setMessages] = useState<Message[]>(() => [welcomeMessage()]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const hasUserSent = useMemo(
    () => messages.some((m) => m.role === "user"),
    [messages]
  );

  // Last message check — drives the inline "thinking" line placement.
  const showThinkingLine =
    streaming &&
    messages.length > 0 &&
    messages[messages.length - 1].role === "user";

  // The currently-streaming bot message (if any) — gets the blinking caret.
  const streamingMessageId =
    streaming &&
    messages.length > 0 &&
    messages[messages.length - 1].role === "model"
      ? messages[messages.length - 1].id
      : null;

  /* ── Lifecycle: focus, esc, focus restore ─────────────────────── */
  useEffect(() => {
    inputRef.current?.focus();
    return () => abortRef.current?.abort();
  }, []);

  // Focus restore — when the panel unmounts, return focus to the launcher.
  // Capture the ref inside the effect so the cleanup uses the value that
  // existed when the panel mounted (lints clean and matches intent).
  useEffect(() => {
    const restoreTarget = returnFocusRef?.current ?? null;
    return () => {
      // Defer to allow the AnimatePresence exit animation to complete.
      setTimeout(() => restoreTarget?.focus(), 0);
    };
  }, [returnFocusRef]);

  // Esc closes; Tab traps focus inside the dialog.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const root = dialogRef.current;
      if (!root) return;
      const focusables = Array.from(
        root.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Pin to bottom on new content.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, streaming]);

  /* ── Send ────────────────────────────────────────────────────── */
  const send = useCallback(
    async (textOverride?: string) => {
      const text = (textOverride ?? input).trim();
      if (!text || streaming) return;

      const userMsg: Message = { id: newId(), role: "user", text };
      const nextMessages = [...messages, userMsg];
      setMessages(nextMessages);
      if (textOverride === undefined) setInput("");
      setStreaming(true);
      setError(null);

      const ctrl = new AbortController();
      abortRef.current = ctrl;

      const history = nextMessages.map((m) => ({ role: m.role, text: m.text }));
      const modelMsgId = newId();
      let modelBubbleAdded = false;

      const ensureModelBubble = () => {
        if (modelBubbleAdded) return;
        modelBubbleAdded = true;
        setMessages((prev) => [
          ...prev,
          { id: modelMsgId, role: "model", text: "" },
        ]);
      };

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ history }),
          signal: ctrl.signal,
        });

        if (!res.ok || !res.body) {
          const data = (await res.json().catch(() => ({}))) as {
            error?: string;
          };
          setError(data.error || `Chat failed (${res.status}).`);
          return;
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          let sepIdx: number;
          while ((sepIdx = buffer.indexOf("\n\n")) !== -1) {
            const frame = buffer.slice(0, sepIdx);
            buffer = buffer.slice(sepIdx + 2);

            let event = "message";
            let data = "";
            for (const line of frame.split("\n")) {
              if (line.startsWith("event:")) event = line.slice(6).trim();
              else if (line.startsWith("data:")) data += line.slice(5).trim();
            }
            if (!data) continue;
            let payload: Record<string, unknown>;
            try {
              payload = JSON.parse(data);
            } catch {
              continue;
            }

            if (event === "token" && typeof payload.text === "string") {
              ensureModelBubble();
              const chunk = payload.text;
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === modelMsgId ? { ...m, text: m.text + chunk } : m
                )
              );
            } else if (
              event === "tool" &&
              payload.name === "sendEmailToSaran"
            ) {
              ensureModelBubble();
              const args = (payload.args as Partial<EmailDraft>) || {};
              const draft: EmailDraft = {
                name: String(args.name || "").trim(),
                email: String(args.email || "").trim(),
                message: String(args.message || "").trim(),
              };
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === modelMsgId ? { ...m, pendingEmail: draft } : m
                )
              );
            } else if (
              event === "error" &&
              typeof payload.message === "string"
            ) {
              setError(payload.message);
            }
          }
        }
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        setError("Network error. Check your connection.");
      } finally {
        setStreaming(false);
        abortRef.current = null;
      }
    },
    [input, streaming, messages]
  );

  const handleEmailResolved = (msgId: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === msgId ? { ...m, emailHandled: true } : m))
    );
  };

  const handleNewChat = () => {
    abortRef.current?.abort();
    setMessages([welcomeMessage()]);
    setInput("");
    setError(null);
    setStreaming(false);
    inputRef.current?.focus();
  };

  /* ── Composer details ────────────────────────────────────────── */
  const MAX_CHARS = 2000;
  const charCountVisible = input.length >= 1700;

  const enter = reduceMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 };
  const enterFrom = reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 };

  return (
    <>
      {/* Mobile backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
        onClick={onClose}
        className="fixed inset-0 z-40 bg-background/55 backdrop-blur-[2px] sm:hidden"
        aria-hidden
      />
      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={dialogTitleId}
        initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        className="fixed z-50 flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-background/95 text-foreground shadow-[0_24px_60px_-20px_rgba(0,0,0,0.28)] backdrop-blur-xl backdrop-saturate-150
                   inset-x-3 bottom-3 max-h-[80vh]
                   sm:left-8 sm:right-auto sm:bottom-24 sm:inset-x-auto sm:w-[420px] sm:max-h-[620px]"
      >
        {/* ── Header — single line: avatar (with status dot) · title · actions */}
        <div className="flex items-center justify-between gap-3 border-b border-border/40 px-4 py-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <motion.span
              animate={
                streaming && !reduceMotion
                  ? { scale: [1, 1.05, 1] }
                  : { scale: 1 }
              }
              transition={
                streaming && !reduceMotion
                  ? { duration: 1.8, repeat: Infinity, ease: "easeInOut" }
                  : { duration: 0.3 }
              }
              className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-card text-foreground/80"
            >
              <Sparkles size={13} strokeWidth={2} />
              {/* Slack-style status pip — small, alive, but quiet */}
              <span
                aria-hidden
                className="absolute -bottom-0.5 -right-0.5 flex h-2 w-2"
              >
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full border border-background bg-emerald-500" />
              </span>
            </motion.span>
            <p
              id={dialogTitleId}
              className="truncate text-[14px] font-semibold tracking-tight text-foreground"
            >
              Caret
            </p>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleNewChat}
              aria-label="New chat"
              title="New chat"
              className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-card hover:text-foreground"
            >
              <RotateCcw size={13} />
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close chat"
              className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-card hover:text-foreground"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* ── Messages ─────────────────────────────────────────── */}
        <div
          ref={scrollRef}
          className={`ask-saran-scroll flex-1 overflow-y-auto px-4 py-5 ${
            reduceMotion || streaming ? "" : "scroll-smooth"
          }`}
        >
          <ul className="space-y-4">
            <AnimatePresence initial={false}>
              {messages.map((m) => (
                <motion.li
                  key={m.id}
                  layout="position"
                  initial={enterFrom}
                  animate={enter}
                  transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                  className={m.role === "user" ? "flex justify-end" : "flex"}
                >
                  <div
                    className={
                      m.role === "user"
                        ? "max-w-[82%] rounded-2xl rounded-br-md bg-foreground px-4 py-3 text-background shadow-[0_4px_12px_-6px_rgba(0,0,0,0.18)]"
                        : "max-w-[88%] rounded-2xl rounded-bl-md border border-border/60 bg-card/80 px-4 py-3 shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
                    }
                  >
                    {m.role === "user" ? (
                      <p className="whitespace-pre-wrap break-words text-[14px] leading-relaxed">
                        {m.text}
                      </p>
                    ) : (
                      <MessageBody
                        text={m.text}
                        showCaret={
                          !reduceMotion && m.id === streamingMessageId
                        }
                      />
                    )}
                    {m.pendingEmail && !m.emailHandled && (
                      <ConfirmEmailPill
                        draft={m.pendingEmail}
                        onSent={() => handleEmailResolved(m.id)}
                        onCancel={() => handleEmailResolved(m.id)}
                      />
                    )}
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>

            {/* Thinking line — appears only between a user message and the
                first streamed token. Subtler than an empty bot bubble. */}
            <AnimatePresence>
              {showThinkingLine && (
                <motion.li
                  key="thinking"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-2 pl-1 text-[12px] text-muted-foreground"
                >
                  <span className="flex items-center gap-1.5">
                    <span aria-hidden className="flex items-center gap-0.5">
                      <span
                        className="h-1 w-1 rounded-full bg-foreground/40"
                        style={
                          reduceMotion
                            ? undefined
                            : {
                                animation:
                                  "ask-saran-pulse 1.2s ease-in-out infinite",
                                animationDelay: "0ms",
                              }
                        }
                      />
                      <span
                        className="h-1 w-1 rounded-full bg-foreground/40"
                        style={
                          reduceMotion
                            ? undefined
                            : {
                                animation:
                                  "ask-saran-pulse 1.2s ease-in-out infinite",
                                animationDelay: "180ms",
                              }
                        }
                      />
                      <span
                        className="h-1 w-1 rounded-full bg-foreground/40"
                        style={
                          reduceMotion
                            ? undefined
                            : {
                                animation:
                                  "ask-saran-pulse 1.2s ease-in-out infinite",
                                animationDelay: "360ms",
                              }
                        }
                      />
                    </span>
                    Thinking…
                  </span>
                </motion.li>
              )}
            </AnimatePresence>

            {/* Suggested prompts — cold-open only. */}
            <AnimatePresence>
              {!hasUserSent && !streaming && (
                <motion.li
                  key="starters"
                  initial={enterFrom}
                  animate={enter}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <div className="flex flex-wrap gap-1.5">
                    {STARTER_PROMPTS.map((p, idx) => (
                      <motion.button
                        key={p}
                        type="button"
                        onClick={() => send(p)}
                        initial={
                          reduceMotion ? { opacity: 0 } : { opacity: 0, y: 6 }
                        }
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.32,
                          delay: 0.05 + idx * 0.07,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        whileHover={
                          reduceMotion ? undefined : { y: -1 }
                        }
                        whileTap={reduceMotion ? undefined : { scale: 0.97 }}
                        className="group inline-flex h-8 cursor-pointer items-center gap-1 rounded-full border border-border bg-background pl-3 pr-2.5 text-[12px] font-medium text-foreground/85 transition-colors hover:border-foreground/40 hover:bg-card hover:text-foreground"
                      >
                        {p}
                        <ArrowUpRight
                          size={11}
                          strokeWidth={2}
                          className="text-muted-foreground/60 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground"
                        />
                      </motion.button>
                    ))}
                  </div>
                </motion.li>
              )}
            </AnimatePresence>
          </ul>

          {error && (
            <div className="mt-3 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-[12.5px] text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/40 dark:text-rose-200">
              {error}
            </div>
          )}
        </div>

        {/* ── Composer — input + send button unified in one rounded surface */}
        <div className="border-t border-border/40 px-3 pt-3 pb-2.5">
          <div className="group relative rounded-2xl border border-border bg-background transition-[border-color,box-shadow] duration-200 hover:border-foreground/30 focus-within:border-blue-400/70 focus-within:shadow-[0_0_0_3px_rgba(59,130,246,0.12)]">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              rows={1}
              placeholder="Ask about Saran's work…"
              maxLength={MAX_CHARS}
              disabled={streaming}
              aria-label="Message Caret"
              className="block max-h-[140px] min-h-[44px] w-full resize-none appearance-none rounded-2xl bg-transparent px-4 py-3 pr-12 font-sans text-[14px] leading-relaxed text-foreground outline-none placeholder:text-muted-foreground/70 focus-visible:outline-none disabled:opacity-60"
            />
            <button
              type="button"
              onClick={() => send()}
              disabled={streaming || !input.trim()}
              aria-label="Send message"
              className="absolute bottom-2 right-2 inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-foreground text-background transition-all duration-200 hover:scale-[1.06] hover:opacity-95 disabled:cursor-not-allowed disabled:bg-foreground/20 disabled:text-background/60 disabled:hover:scale-100"
            >
              {streaming ? (
                <Loader2 size={13} className="animate-spin" />
              ) : (
                <ArrowUp size={14} strokeWidth={2.2} />
              )}
            </button>
          </div>
          <div className="mt-2 flex min-h-[14px] items-center justify-between gap-2 px-1 text-[10.5px] text-muted-foreground/80">
            <button
              type="button"
              onClick={() => send("I'd like to email Saran.")}
              disabled={streaming}
              className="inline-flex cursor-pointer items-center gap-1.5 text-muted-foreground/80 transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Mail size={11} strokeWidth={2} />
              Email Saran
            </button>
            {charCountVisible && (
              <span className="tabular-nums">
                {input.length} / {MAX_CHARS}
              </span>
            )}
          </div>
        </div>

        {/* Inline keyframes + scoped scrollbar. */}
        <style>{`
          @keyframes ask-saran-pulse {
            0%, 80%, 100% { opacity: 0.25; transform: scale(0.85); }
            40% { opacity: 1; transform: scale(1); }
          }
          @keyframes ask-saran-caret {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0; }
          }
          @keyframes ask-saran-chip-in {
            from { opacity: 0; transform: translateY(2px) scale(0.96); }
            to   { opacity: 1; transform: translateY(0)   scale(1); }
          }

          /* Refined thin scrollbar — subtle by default, more visible on hover. */
          .ask-saran-scroll {
            scrollbar-width: thin;
            scrollbar-color: transparent transparent;
            transition: scrollbar-color 0.2s ease;
          }
          .ask-saran-scroll:hover {
            scrollbar-color: var(--border) transparent;
          }
          .ask-saran-scroll::-webkit-scrollbar {
            width: 8px;
          }
          .ask-saran-scroll::-webkit-scrollbar-track {
            background: transparent;
          }
          .ask-saran-scroll::-webkit-scrollbar-thumb {
            background-color: transparent;
            border-radius: 999px;
            border: 2px solid transparent;
            background-clip: padding-box;
            transition: background-color 0.2s ease;
          }
          .ask-saran-scroll:hover::-webkit-scrollbar-thumb {
            background-color: var(--border);
          }
          .ask-saran-scroll::-webkit-scrollbar-thumb:hover {
            background-color: var(--muted-foreground);
          }
        `}</style>
      </motion.div>
    </>
  );
}
