"use client";

import { ArrowLeft, ArrowRight, Eye, ImageIcon, Pencil, Plus, Upload, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { createClient } from "@/app/lib/supabase/client";

const inputCls =
  "h-10 w-full appearance-none rounded-xl border border-border bg-background px-3.5 font-sans text-[14px] text-foreground outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-muted-foreground/70 hover:border-foreground/30 focus:border-blue-400/70 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.12)] focus-visible:outline-none disabled:opacity-60";
const textareaCls =
  "w-full resize-none appearance-none rounded-xl border border-border bg-background px-3.5 py-2.5 font-sans text-[14px] leading-[1.65] text-foreground outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-muted-foreground/70 hover:border-foreground/30 focus:border-blue-400/70 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.12)] focus-visible:outline-none disabled:opacity-60";

export function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label className="flex items-baseline justify-between text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
        <span>
          {label}
          {required && <span className="ml-1 text-rose-500">*</span>}
        </span>
        {hint && (
          <span className="ml-2 text-[10.5px] normal-case tracking-normal text-muted-foreground/80">
            {hint}
          </span>
        )}
      </label>
      {children}
    </div>
  );
}

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${inputCls} ${props.className || ""}`} />;
}

export function Textarea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement>
) {
  return <textarea {...props} className={`${textareaCls} ${props.className || ""}`} />;
}

export function Toggle({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
  description?: string;
}) {
  const id = useId();
  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer items-start justify-between gap-4 rounded-xl border border-border bg-card p-4 transition-colors hover:border-foreground/30"
    >
      <div className="min-w-0">
        <p className="text-[13.5px] font-medium text-foreground">{label}</p>
        {description && (
          <p className="mt-0.5 text-[12px] text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      <span className="flex shrink-0 items-center pt-0.5">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="peer sr-only"
        />
        <span
          aria-hidden
          className={`relative inline-block h-[22px] w-[38px] rounded-full transition-colors duration-200 ${
            checked ? "bg-foreground" : "bg-foreground/20"
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 h-[18px] w-[18px] rounded-full bg-background shadow-md transition-transform duration-200 ${
              checked ? "translate-x-[16px]" : "translate-x-0"
            }`}
          />
        </span>
      </span>
    </label>
  );
}

/* ── Tag input ───────────────────────────────────────────────────────── */
export function TagInput({
  value,
  onChange,
  placeholder = "Type a tag and press Enter",
}: {
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
}) {
  const [draft, setDraft] = useState("");

  const add = (raw: string) => {
    const t = raw.trim();
    if (!t) return;
    if (value.includes(t)) return;
    onChange([...value, t]);
    setDraft("");
  };

  const removeAt = (i: number) => {
    onChange(value.filter((_, idx) => idx !== i));
  };

  return (
    <div className="rounded-xl border border-border bg-background p-2">
      <div className="flex flex-wrap items-center gap-1.5">
        {value.map((tag, i) => (
          <span
            key={tag + i}
            className="inline-flex h-7 items-center gap-1.5 rounded-full bg-foreground/[0.06] pl-2.5 pr-1 text-[12px] text-foreground"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeAt(i)}
              className="flex h-5 w-5 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-foreground/[0.08] hover:text-foreground"
              aria-label={`Remove ${tag}`}
            >
              <X size={11} />
            </button>
          </span>
        ))}
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              add(draft);
            } else if (e.key === "Backspace" && !draft && value.length) {
              removeAt(value.length - 1);
            }
          }}
          onBlur={() => draft && add(draft)}
          placeholder={value.length ? "" : placeholder}
          className="h-7 min-w-[140px] flex-1 bg-transparent px-2 text-[13px] text-foreground placeholder:text-muted-foreground/70 focus:outline-none"
        />
      </div>
    </div>
  );
}

/* ── Image uploader (Supabase Storage `media` bucket) ─────────────────── */
export function ImageUploader({
  value,
  onChange,
  bucket = "media",
  pathPrefix = "uploads",
}: {
  value: string | null;
  onChange: (url: string | null) => void;
  bucket?: string;
  pathPrefix?: string;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = async (file: File) => {
    setError(null);
    const supabase = createClient();
    if (!supabase) {
      setError("Supabase isn't configured yet.");
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setError("Image must be under 20MB.");
      return;
    }
    setBusy(true);
    try {
      const ext = file.name.split(".").pop() || "png";
      const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const path = `${pathPrefix}/${filename}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(path, file, { cacheControl: "31536000", upsert: false });

      if (uploadError) throw uploadError;

      const { data: pub } = supabase.storage.from(bucket).getPublicUrl(path);
      onChange(pub.publicUrl);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-2">
      {value ? (
        <div className="group relative overflow-hidden rounded-xl border border-border bg-muted/30">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt=""
            className="aspect-[16/9] w-full object-cover"
          />
          <div className="absolute right-2 top-2 flex gap-1.5">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={busy}
              className="flex h-8 cursor-pointer items-center gap-1.5 rounded-full bg-background/90 px-3 text-[11.5px] font-medium text-foreground backdrop-blur transition-colors hover:bg-background disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Pencil size={12} />
              Replace
            </button>
            <button
              type="button"
              onClick={() => onChange(null)}
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-background/90 text-foreground backdrop-blur transition-colors hover:bg-background"
              aria-label="Remove image"
            >
              <X size={13} />
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={busy}
          className="group flex aspect-[16/9] w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-background/40 transition-all duration-200 hover:border-blue-400/60 hover:bg-blue-50/40 disabled:cursor-not-allowed disabled:opacity-60 dark:hover:bg-blue-950/20"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground/[0.06] text-foreground/70 transition-colors group-hover:bg-blue-500/15 group-hover:text-blue-600">
            {busy ? (
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-foreground/20 border-t-foreground" />
            ) : (
              <Upload size={16} strokeWidth={1.8} />
            )}
          </span>
          <p className="text-[13px] font-medium text-foreground">
            {busy ? "Uploading…" : "Click to upload"}
          </p>
          <p className="text-[11px] text-muted-foreground">
            PNG, JPG, WebP up to 20MB
          </p>
        </button>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/avif"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) upload(f);
          e.target.value = "";
        }}
      />

      {error && (
        <p className="text-[12px] text-rose-600 dark:text-rose-300">{error}</p>
      )}
    </div>
  );
}

/* ── Multi-image uploader (gallery) ──────────────────────────────────── */
export function MultiImageUploader({
  value,
  onChange,
  bucket = "media",
  pathPrefix = "uploads",
  maxFileMB = 20,
}: {
  value: string[];
  onChange: (urls: string[]) => void;
  bucket?: string;
  pathPrefix?: string;
  maxFileMB?: number;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadFiles = async (files: FileList | File[]) => {
    setError(null);
    const supabase = createClient();
    if (!supabase) {
      setError("Supabase isn't configured yet.");
      return;
    }
    const list = Array.from(files);
    for (const f of list) {
      if (f.size > maxFileMB * 1024 * 1024) {
        setError(`Each image must be under ${maxFileMB}MB.`);
        return;
      }
    }
    setBusy(true);
    try {
      const next = [...value];
      for (const file of list) {
        const ext = file.name.split(".").pop() || "png";
        const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
        const path = `${pathPrefix}/${filename}`;
        const { error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(path, file, { cacheControl: "31536000", upsert: false });
        if (uploadError) throw uploadError;
        const { data: pub } = supabase.storage.from(bucket).getPublicUrl(path);
        next.push(pub.publicUrl);
      }
      onChange(next);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  };

  const remove = (idx: number) => {
    const next = value.filter((_, i) => i !== idx);
    onChange(next);
  };

  const move = (idx: number, dir: -1 | 1) => {
    const j = idx + dir;
    if (j < 0 || j >= value.length) return;
    const next = [...value];
    [next[idx], next[j]] = [next[j], next[idx]];
    onChange(next);
  };

  return (
    <div className="space-y-3">
      {value.length > 0 && (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {value.map((url, i) => (
            <li
              key={url + i}
              className="group relative overflow-hidden rounded-xl border border-border bg-muted/30"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt=""
                className="aspect-[4/3] w-full object-cover"
              />
              <div className="absolute inset-x-2 top-2 flex items-center justify-between gap-1.5 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                <span className="rounded-full bg-background/85 px-2 py-0.5 text-[10.5px] font-medium text-foreground backdrop-blur">
                  #{i + 1}
                </span>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => move(i, -1)}
                    disabled={i === 0}
                    aria-label="Move left"
                    className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-background/85 text-foreground backdrop-blur transition-colors hover:bg-background disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ArrowLeft size={12} />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(i, 1)}
                    disabled={i === value.length - 1}
                    aria-label="Move right"
                    className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-background/85 text-foreground backdrop-blur transition-colors hover:bg-background disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ArrowRight size={12} />
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(i)}
                    aria-label="Remove image"
                    className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-background/85 text-rose-600 backdrop-blur transition-colors hover:bg-background"
                  >
                    <X size={12} />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        disabled={busy}
        className="group flex h-24 w-full cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-border bg-background/40 transition-all duration-200 hover:border-blue-400/60 hover:bg-blue-50/40 disabled:cursor-not-allowed disabled:opacity-60 dark:hover:bg-blue-950/20"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-foreground/[0.06] text-foreground/70 transition-colors group-hover:bg-blue-500/15 group-hover:text-blue-600">
          {busy ? (
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-foreground/20 border-t-foreground" />
          ) : (
            <Plus size={16} strokeWidth={1.8} />
          )}
        </span>
        <p className="text-[12.5px] font-medium text-foreground">
          {busy ? "Uploading…" : value.length === 0 ? "Add gallery images" : "Add more images"}
        </p>
        <p className="text-[11px] text-muted-foreground">
          You can select multiple files — PNG, JPG, WebP up to {maxFileMB}MB each
        </p>
      </button>

      <input
        ref={fileRef}
        type="file"
        multiple
        accept="image/png,image/jpeg,image/webp,image/avif"
        className="hidden"
        onChange={(e) => {
          const fs = e.target.files;
          if (fs && fs.length > 0) uploadFiles(fs);
          e.target.value = "";
        }}
      />

      {error && (
        <p className="text-[12px] text-rose-600 dark:text-rose-300">{error}</p>
      )}
    </div>
  );
}

/* ── Markdown editor with split-pane preview ─────────────────────────── */
export function MarkdownEditor({
  value,
  onChange,
  rows = 12,
}: {
  value: string;
  onChange: (next: string) => void;
  rows?: number;
}) {
  const [mode, setMode] = useState<"write" | "preview" | "split">("write");

  // Auto split on wide screens — deferred to next microtask so we don't
  // trigger setState synchronously during the effect body.
  useEffect(() => {
    const isWide = window.matchMedia("(min-width: 900px)").matches;
    queueMicrotask(() => setMode(isWide ? "split" : "write"));
  }, []);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1">
        {(["write", "split", "preview"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={`inline-flex h-7 cursor-pointer items-center gap-1.5 rounded-full px-3 text-[11px] font-medium uppercase tracking-[0.14em] transition-colors ${
              mode === m
                ? "bg-foreground text-background"
                : "border border-border bg-background text-muted-foreground hover:border-foreground/40 hover:text-foreground"
            }`}
          >
            {m === "write" && <Pencil size={11} />}
            {m === "split" && <ImageIcon size={11} />}
            {m === "preview" && <Eye size={11} />}
            {m}
          </button>
        ))}
      </div>

      <div
        className={`grid gap-3 ${
          mode === "split" ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"
        }`}
      >
        {(mode === "write" || mode === "split") && (
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={rows}
            placeholder="Write your content in markdown — # headings, **bold**, [links](url), lists, code blocks all work."
            spellCheck
          />
        )}
        {(mode === "preview" || mode === "split") && (
          <div
            className="prose-admin overflow-y-auto rounded-xl border border-border bg-background/40 px-4 py-3 text-[14px] leading-[1.7] text-foreground/85"
            style={{ minHeight: `${rows * 1.65}rem` }}
          >
            {value.trim() ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{value}</ReactMarkdown>
            ) : (
              <p className="text-muted-foreground/70">
                Nothing to preview yet — start writing on the left.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Category select ─────────────────────────────────────────────────── */
export function CategorySelect({
  value,
  onChange,
  categories,
  onCreateNew,
}: {
  value: string | null;
  onChange: (id: string | null) => void;
  categories: { id: string; name: string; color: string | null }[];
  onCreateNew?: () => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <select
        value={value || ""}
        onChange={(e) => onChange(e.target.value || null)}
        className={inputCls}
      >
        <option value="">— Uncategorised —</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
      {onCreateNew && (
        <button
          type="button"
          onClick={onCreateNew}
          className="flex h-10 shrink-0 cursor-pointer items-center gap-1.5 rounded-xl border border-border bg-background px-3 text-[12.5px] font-medium text-foreground transition-colors hover:border-foreground/40 hover:bg-card"
          title="Create new category"
        >
          <Plus size={13} />
          New
        </button>
      )}
    </div>
  );
}
