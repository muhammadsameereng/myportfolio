"use client";

import {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useId,
  useImperativeHandle,
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

/* ── Types ─────────────────────────────────────────────────────────── */

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

/* ── Constants ─────────────────────────────────────────────────────── */

// Combined parser: internal `[ref:projects/slug|Title]` chips + external
// markdown links `[Label](https://…)`. Anything else is plain text.
const PART_RE =
  /\[ref:(projects|blog)\/([a-z0-9][a-z0-9-]*)(?:\|([^\]]+))?\]|\[([^\]\n]+)\]\(((?:https?:\/\/|mailto:)[^\s)]+)\)/gi;

const STARTER_PROMPTS = [
  "What does Sameer build?",
  "Show me a project",
  "How do I hire him?",
  "Email Sameer for me",
];

const WELCOME_TEXT =
  "Hi, I'm Caret — Sameer's assistant. Ask me about his work, writing, or how to reach him.";

const MAX_CHARS = 2000;

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
      const slug = m[2];
      const title = (m[3] || "").trim() || slug;
      parts.push({
        kind: "ref",
        ref: { kind: m[1] as Reference["kind"], slug, title },
      });
    } else if (m[4] && m[5]) {
      parts.push({ kind: "link", label: m[4].trim(), href: m[5].trim() });
    }
    lastIdx = m.index + m[0].length;
  }
  if (lastIdx < text.length) {
    parts.push({ kind: "text", text: text.slice(lastIdx) });
  }
  return parts;
}

/* ── MessageBody — text + chips + caret. Memoized: only re-renders when
      its own text or showCaret changes. ───────────────────────────────── */

const MessageBody = memo(function MessageBody({
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
});

/* ── MessageRow — one bubble (+ optional confirm-email pill). Memoized
      so messages whose props haven't changed skip re-render entirely
      during streaming. The streaming bot message keeps re-rendering;
      every other row is bypassed. ──────────────────────────────────── */

const MessageRow = memo(function MessageRow({
  message,
  isStreaming,
  onEmailResolved,
}: {
  message: Message;
  isStreaming: boolean;
  onEmailResolved: (id: string) => void;
}) {
  const handleResolved = useCallback(
    () => onEmailResolved(message.id),
    [message.id, onEmailResolved]
  );

  return (
    <li
      className={`ask-saran-msg animate-[ask-saran-msg-in_320ms_cubic-bezier(0.22,1,0.36,1)_both] ${
        message.role === "user" ? "flex justify-end" : "flex"
      }`}
    >
      <div
        className={
          message.role === "user"
            ? "max-w-[82%] rounded-2xl rounded-br-md bg-foreground px-4 py-3 text-background shadow-[0_4px_12px_-6px_rgba(0,0,0,0.18)]"
            : "max-w-[88%] rounded-2xl rounded-bl-md border border-border/60 bg-card/80 px-4 py-3 shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
        }
      >
        {message.role === "user" ? (
          <p className="whitespace-pre-wrap break-words text-[14px] leading-relaxed">
            {message.text}
          </p>
        ) : (
          <MessageBody text={message.text} showCaret={isStreaming} />
        )}
        {message.pendingEmail && !message.emailHandled && (
          <ConfirmEmailPill
            draft={message.pendingEmail}
            onSent={handleResolved}
            onCancel={handleResolved}
          />
        )}
      </div>
    </li>
  );
});

/* ── ThinkingLine — shown between user message and first streamed token */

const ThinkingLine = memo(function ThinkingLine({
  reduceMotion,
}: {
  reduceMotion: boolean;
}) {
  return (
    <motion.li
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="flex items-center gap-2 pl-1 text-[12px] text-muted-foreground"
    >
      <span className="flex items-center gap-1.5">
        <span aria-hidden className="flex items-center gap-0.5">
          {[0, 180, 360].map((delay) => (
            <span
              key={delay}
              className="h-1 w-1 rounded-full bg-foreground/40"
              style={
                reduceMotion
                  ? undefined
                  : {
                      animation: "ask-saran-pulse 1.2s ease-in-out infinite",
                      animationDelay: `${delay}ms`,
                    }
              }
            />
          ))}
        </span>
        Thinking…
      </span>
    </motion.li>
  );
});

/* ── StarterPrompts — cold-open chips (memoized) ───────────────────── */

const StarterPrompts = memo(function StarterPrompts({
  reduceMotion,
  onPick,
}: {
  reduceMotion: boolean;
  onPick: (text: string) => void;
}) {
  return (
    <motion.li
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      className="overflow-hidden"
    >
      <div className="flex flex-wrap gap-1.5">
        {STARTER_PROMPTS.map((p, idx) => (
          <motion.button
            key={p}
            type="button"
            onClick={() => onPick(p)}
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.32,
              delay: 0.05 + idx * 0.07,
              ease: [0.22, 1, 0.36, 1],
            }}
            whileHover={reduceMotion ? undefined : { y: -1 }}
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
  );
});

/* ── Composer — owns its OWN input state internally so typing in the
      textarea does NOT re-render the parent ChatPanel (and therefore
      doesn't re-render the message list). Single biggest perf win. ──── */

export type ComposerHandle = {
  focus: () => void;
  clear: () => void;
};

type ComposerProps = {
  disabled: boolean;
  onSend: (text: string) => void;
  onEmailShortcut: () => void;
};

const Composer = memo(
  forwardRef<ComposerHandle, ComposerProps>(function Composer(
    { disabled, onSend, onEmailShortcut },
    ref
  ) {
    const [input, setInput] = useState("");
    const inputRef = useRef<HTMLTextAreaElement>(null);

    useImperativeHandle(
      ref,
      () => ({
        focus: () => inputRef.current?.focus(),
        clear: () => setInput(""),
      }),
      []
    );

    const submit = () => {
      const text = input.trim();
      if (!text || disabled) return;
      onSend(text);
      setInput("");
    };

    const charCountVisible = input.length >= 1700;

    return (
      <div className="border-t border-border/40 px-3 pt-3 pb-2.5">
        <div className="group relative rounded-2xl border border-border bg-background transition-[border-color,box-shadow] duration-200 hover:border-foreground/30 focus-within:border-accent/70 focus-within:shadow-[0_0_0_3px_rgba(14,116,144,0.15)]">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                submit();
              }
            }}
            rows={1}
            placeholder="Ask about Sameer's work…"
            maxLength={MAX_CHARS}
            disabled={disabled}
            aria-label="Message Caret"
            className="block max-h-[140px] min-h-[44px] w-full resize-none appearance-none rounded-2xl bg-transparent px-4 py-3 pr-12 font-sans text-[14px] leading-relaxed text-foreground outline-none placeholder:text-muted-foreground/70 focus-visible:outline-none disabled:opacity-60"
          />
          <button
            type="button"
            onClick={submit}
            disabled={disabled || !input.trim()}
            aria-label="Send message"
            className="absolute bottom-2 right-2 inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-foreground text-background transition-all duration-200 hover:scale-[1.06] hover:opacity-95 disabled:cursor-not-allowed disabled:bg-foreground/20 disabled:text-background/60 disabled:hover:scale-100"
          >
            {disabled ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <ArrowUp size={14} strokeWidth={2.2} />
            )}
          </button>
        </div>
        <div className="mt-2 flex min-h-[14px] items-center justify-between gap-2 px-1 text-[10.5px] text-muted-foreground/80">
          <button
            type="button"
            onClick={onEmailShortcut}
            disabled={disabled}
            className="inline-flex cursor-pointer items-center gap-1.5 text-muted-foreground/80 transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Mail size={11} strokeWidth={2} />
            Email Sameer
          </button>
          {charCountVisible && (
            <span className="tabular-nums">
              {input.length} / {MAX_CHARS}
            </span>
          )}
        </div>
      </div>
    );
  })
);

/* ── ChatPanel — orchestrator. Holds messages + streaming state. The
      Composer is isolated so input typing doesn't ripple through here. */

export default function ChatPanel({
  onClose,
  returnFocusRef,
}: {
  onClose: () => void;
  returnFocusRef?: React.RefObject<HTMLElement | null>;
}) {
  const reduceMotion = useReducedMotion() ?? false;
  const dialogTitleId = useId();

  const [messages, setMessages] = useState<Message[]>(() => [welcomeMessage()]);
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const composerRef = useRef<ComposerHandle>(null);
  const scrollRafRef = useRef<number | null>(null);

  const hasUserSent = messages.some((m) => m.role === "user");
  const lastMessage = messages[messages.length - 1];
  const showThinkingLine = streaming && lastMessage?.role === "user";
  const streamingMessageId =
    streaming && lastMessage?.role === "model" ? lastMessage.id : null;

  /* ── Lifecycle ──────────────────────────────────────────────── */

  useEffect(() => {
    composerRef.current?.focus();
    return () => abortRef.current?.abort();
  }, []);

  // Focus restore — capture target inside the effect for lint-clean cleanup.
  useEffect(() => {
    const restoreTarget = returnFocusRef?.current ?? null;
    return () => {
      setTimeout(() => restoreTarget?.focus(), 0);
    };
  }, [returnFocusRef]);

  // Esc + Tab focus trap
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

  // RAF-throttled auto-scroll. Many tokens may arrive in one frame; we
  // coalesce them into a single scrollTop write per animation frame.
  useEffect(() => {
    if (scrollRafRef.current !== null) return;
    scrollRafRef.current = requestAnimationFrame(() => {
      scrollRafRef.current = null;
      const el = scrollRef.current;
      if (el) el.scrollTop = el.scrollHeight;
    });
  }, [messages, streaming]);

  useEffect(
    () => () => {
      if (scrollRafRef.current !== null) {
        cancelAnimationFrame(scrollRafRef.current);
      }
    },
    []
  );

  /* ── Send ───────────────────────────────────────────────────── */

  const handleEmailResolved = useCallback((msgId: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === msgId ? { ...m, emailHandled: true } : m))
    );
  }, []);

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || streaming) return;

      const userMsg: Message = { id: newId(), role: "user", text: trimmed };
      let snapshot: Message[] = [];
      setMessages((prev) => {
        snapshot = [...prev, userMsg];
        return snapshot;
      });
      setStreaming(true);
      setError(null);

      const ctrl = new AbortController();
      abortRef.current = ctrl;

      const history = snapshot.map((m) => ({ role: m.role, text: m.text }));
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
            } else if (event === "tool" && payload.name === "sendEmailToSaran") {
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
            } else if (event === "error" && typeof payload.message === "string") {
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
    [streaming]
  );

  const handleEmailShortcut = useCallback(
    () => send("I'd like to email Sameer."),
    [send]
  );

  const handleNewChat = useCallback(() => {
    abortRef.current?.abort();
    setMessages([welcomeMessage()]);
    setError(null);
    setStreaming(false);
    composerRef.current?.clear();
    composerRef.current?.focus();
  }, []);

  /* ── Render ─────────────────────────────────────────────────── */

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
        style={{ contain: "layout paint" }}
        className="fixed z-50 flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-background/95 text-foreground shadow-[0_24px_60px_-20px_rgba(0,0,0,0.28)] backdrop-blur-xl backdrop-saturate-150
                   inset-x-3 bottom-3 max-h-[80vh]
                   sm:left-8 sm:right-auto sm:bottom-24 sm:inset-x-auto sm:w-[420px] sm:max-h-[620px]"
      >
        {/* ── Header ──────────────────────────────────────────── */}
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
            {messages.map((m) => (
              <MessageRow
                key={m.id}
                message={m}
                isStreaming={!reduceMotion && m.id === streamingMessageId}
                onEmailResolved={handleEmailResolved}
              />
            ))}

            <AnimatePresence>
              {showThinkingLine && (
                <ThinkingLine key="thinking" reduceMotion={reduceMotion} />
              )}
            </AnimatePresence>

            <AnimatePresence>
              {!hasUserSent && !streaming && (
                <StarterPrompts
                  key="starters"
                  reduceMotion={reduceMotion}
                  onPick={send}
                />
              )}
            </AnimatePresence>
          </ul>

          {error && (
            <div className="mt-3 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-[12.5px] text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/40 dark:text-rose-200">
              {error}
            </div>
          )}
        </div>

        {/* ── Composer (isolated state) ────────────────────────── */}
        <Composer
          ref={composerRef}
          disabled={streaming}
          onSend={send}
          onEmailShortcut={handleEmailShortcut}
        />
      </motion.div>
    </>
  );
}
