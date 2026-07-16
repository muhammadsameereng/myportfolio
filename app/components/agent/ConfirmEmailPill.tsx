"use client";

import { useState } from "react";
import { ArrowUpRight, Check, Loader2, Pencil, X } from "lucide-react";

export type EmailDraft = {
  name: string;
  email: string;
  message: string;
};

type Status =
  | { phase: "idle" }
  | { phase: "sending" }
  | { phase: "sent" }
  | { phase: "error"; message: string; retryAfter?: number };

const isValidEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

function preview(text: string, max = 64) {
  const trimmed = text.replace(/\s+/g, " ").trim();
  return trimmed.length > max ? trimmed.slice(0, max - 1) + "…" : trimmed;
}

export default function ConfirmEmailPill({
  draft: initialDraft,
  onSent,
  onCancel,
}: {
  draft: EmailDraft;
  onSent: () => void;
  onCancel: () => void;
}) {
  const [draft, setDraft] = useState<EmailDraft>(initialDraft);
  const [status, setStatus] = useState<Status>({ phase: "idle" });
  const [editing, setEditing] = useState(false);

  const canSend =
    draft.name.trim().length > 0 &&
    isValidEmail(draft.email.trim()) &&
    draft.message.trim().length > 0 &&
    status.phase !== "sending";

  async function send() {
    if (!canSend) return;
    setStatus({ phase: "sending" });
    try {
      const res = await fetch("/api/chat/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: draft.name.trim(),
          email: draft.email.trim(),
          message: draft.message.trim(),
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        retryAfter?: number;
      };
      if (!res.ok) {
        setStatus({
          phase: "error",
          message: data.error || "Couldn't send. Try again.",
          retryAfter: data.retryAfter,
        });
        return;
      }
      setStatus({ phase: "sent" });
      onSent();
    } catch {
      setStatus({
        phase: "error",
        message: "Network error. Check your connection.",
      });
    }
  }

  if (status.phase === "sent") {
    return (
      <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1.5 text-[12px] font-medium text-emerald-700 dark:text-emerald-400">
        <Check size={13} strokeWidth={2.4} />
        Sent — Sameer replies within 24h.
      </div>
    );
  }

  return (
    <div className="mt-3 rounded-2xl border border-border/60 bg-background/80 p-3 backdrop-blur-sm">
      {/* Header — tiny label + summary line */}
      <div className="mb-2.5 flex items-baseline justify-between gap-3">
        <p className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
          Ready to send
        </p>
        {!editing && (
          <button
            type="button"
            onClick={() => setEditing(true)}
            disabled={status.phase === "sending"}
            className="inline-flex cursor-pointer items-center gap-1 text-[11px] font-medium text-muted-foreground transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Pencil size={10.5} />
            Edit
          </button>
        )}
      </div>

      {!editing ? (
        // Compact summary — three soft lines, no row labels.
        <div className="space-y-1 text-[13px] leading-relaxed">
          <p className="truncate">
            <span className="text-muted-foreground">To </span>
            <span className="font-medium text-foreground">Sameer</span>
            <span className="text-muted-foreground"> · from </span>
            <span className="font-medium text-foreground">{draft.name}</span>
            <span className="text-muted-foreground"> · </span>
            <span className="text-foreground/85">{draft.email}</span>
          </p>
          <p className="line-clamp-3 italic text-foreground/80">
            “{preview(draft.message, 180)}”
          </p>
        </div>
      ) : (
        // Edit mode — three slim inputs that match the contact-form vocabulary.
        <div className="space-y-2.5">
          <Field
            label="Your name"
            value={draft.name}
            onChange={(v) => setDraft({ ...draft, name: v })}
            placeholder="What should I call you?"
          />
          <Field
            label="Email"
            value={draft.email}
            onChange={(v) => setDraft({ ...draft, email: v })}
            placeholder="you@example.com"
            type="email"
          />
          <FieldArea
            label="Message"
            value={draft.message}
            onChange={(v) => setDraft({ ...draft, message: v })}
            placeholder="Anything you want Sameer to know."
          />
        </div>
      )}

      {status.phase === "error" && (
        <p className="mt-2.5 rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1.5 text-[11.5px] text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/40 dark:text-rose-200">
          {status.message}
        </p>
      )}

      <div className="mt-3 flex items-center gap-2">
        <button
          type="button"
          onClick={send}
          disabled={!canSend}
          className="group inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-full bg-foreground pl-4 pr-3.5 text-[12.5px] font-medium text-background transition-all duration-200 hover:scale-[1.02] hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
        >
          {status.phase === "sending" ? (
            <>
              <Loader2 size={12} className="animate-spin" />
              Sending
            </>
          ) : (
            <>
              Send
              <ArrowUpRight
                size={12}
                strokeWidth={2.2}
                className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </>
          )}
        </button>
        {editing && (
          <button
            type="button"
            onClick={() => {
              setDraft(initialDraft);
              setEditing(false);
            }}
            disabled={status.phase === "sending"}
            className="inline-flex h-9 cursor-pointer items-center rounded-full border border-border bg-background px-3.5 text-[12.5px] font-medium text-foreground/80 transition-colors hover:border-foreground/40 hover:bg-card hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
          >
            Done
          </button>
        )}
        <button
          type="button"
          onClick={onCancel}
          disabled={status.phase === "sending"}
          className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-full border border-border bg-background px-3.5 text-[12.5px] font-medium text-foreground/80 transition-colors hover:border-foreground/40 hover:bg-card hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
        >
          <X size={12} />
          Cancel
        </button>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: "text" | "email";
}) {
  return (
    <label className="block">
      <span className="block text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1 h-9 w-full appearance-none rounded-xl border border-border bg-background px-3 font-sans text-[13px] text-foreground outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-muted-foreground/70 hover:border-foreground/30 focus:border-accent/70 focus:shadow-[0_0_0_3px_rgba(14,116,144,0.15)] focus-visible:outline-none"
      />
    </label>
  );
}

function FieldArea({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="block text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className="mt-1 w-full resize-none appearance-none rounded-xl border border-border bg-background px-3 py-2 font-sans text-[13px] leading-relaxed text-foreground outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-muted-foreground/70 hover:border-foreground/30 focus:border-accent/70 focus:shadow-[0_0_0_3px_rgba(14,116,144,0.15)] focus-visible:outline-none"
      />
    </label>
  );
}
