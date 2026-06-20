"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Loader2, RotateCw, Sparkles } from "lucide-react";
import { Field, TextInput, Textarea } from "./FormFields";
import { PrimaryButton } from "./AdminPrimitives";
import { useToast } from "./Toast";
import {
  createBlogJob,
  getRecentJobs,
  resumeJob,
  type BlogJobSummary,
} from "@/app/admin/blog/generate/actions";

const DEPTHS = [
  { value: "short", label: "Short", hint: "~700w" },
  { value: "standard", label: "Standard", hint: "~1300w" },
  { value: "deep", label: "Deep", hint: "~2200w" },
] as const;

const PIPELINE: BlogJobSummary["stage"][] = [
  "research",
  "outline",
  "draft",
  "metadata",
  "image",
  "save",
];

const STAGE_LABEL: Record<BlogJobSummary["stage"], string> = {
  research: "Researching",
  outline: "Outlining",
  draft: "Writing",
  metadata: "Titling",
  image: "Cover image",
  save: "Saving",
  complete: "Done",
};

function StatusPill({ status }: { status: BlogJobSummary["status"] }) {
  const map: Record<BlogJobSummary["status"], string> = {
    pending: "bg-foreground/[0.06] text-foreground/70",
    processing: "bg-blue-500/12 text-blue-700 dark:text-blue-300",
    done: "bg-emerald-500/12 text-emerald-700 dark:text-emerald-300",
    error: "bg-rose-500/12 text-rose-700 dark:text-rose-300",
  };
  return (
    <span
      className={`inline-flex h-6 items-center gap-1.5 rounded-full px-2.5 text-[10.5px] font-medium uppercase tracking-[0.12em] ${map[status]}`}
    >
      {status === "processing" && <Loader2 size={11} className="animate-spin" />}
      {status}
    </span>
  );
}

export default function GenerateBlogClient({
  initialJobs,
}: {
  initialJobs: BlogJobSummary[];
}) {
  const toast = useToast();
  const [topic, setTopic] = useState("");
  const [angle, setAngle] = useState("");
  const [depth, setDepth] = useState<string>("standard");
  const [submitting, setSubmitting] = useState(false);
  const [jobs, setJobs] = useState<BlogJobSummary[]>(initialJobs);

  // Fire the background processor. The route holds an optimistic lock, so
  // duplicate kicks (from polling) are harmless no-ops.
  const kick = useCallback((id: string) => {
    fetch(`/api/blog-jobs/${id}/process`, { method: "POST" }).catch(() => {});
  }, []);

  const refresh = useCallback(async () => {
    const next = await getRecentJobs();
    setJobs(next);
    // Re-kick anything that's pending (newly created, or budget-paused).
    next.filter((j) => j.status === "pending").forEach((j) => kick(j.id));
  }, [kick]);

  // `refresh` is stable (memoised over the stable `kick`), so this effect
  // sets up the poll once and tears it down on unmount.
  useEffect(() => {
    const t = setInterval(refresh, 4000);
    return () => clearInterval(t);
  }, [refresh]);

  async function submit() {
    const t = topic.trim();
    if (!t) {
      toast.push("Enter a topic first.", "error");
      return;
    }
    setSubmitting(true);
    const res = await createBlogJob({ topic: t, angle, depth });
    setSubmitting(false);
    if (!res.ok) {
      toast.push(res.error, "error");
      return;
    }
    toast.push("Generation started — it'll appear below.", "success");
    setTopic("");
    setAngle("");
    kick(res.id);
    refresh();
  }

  async function resume(id: string) {
    const res = await resumeJob(id);
    if (!res.ok) {
      toast.push(res.error || "Could not resume.", "error");
      return;
    }
    toast.push("Resumed.", "info");
    kick(id);
    refresh();
  }

  return (
    <div className="space-y-8">
      {/* ── Form ── */}
      <div className="rounded-2xl border border-border bg-card p-6 sm:p-7">
        <div className="space-y-5">
          <Field label="Topic" required hint="What should the post be about?">
            <TextInput
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Why WebAssembly is replacing containers at the edge"
              onKeyDown={(e) => {
                if (e.key === "Enter") submit();
              }}
            />
          </Field>

          <Field label="Angle / notes" hint="optional">
            <Textarea
              value={angle}
              onChange={(e) => setAngle(e.target.value)}
              rows={2}
              placeholder="Optional steer: audience, opinion to take, things to include…"
            />
          </Field>

          <Field label="Depth">
            <div className="flex flex-wrap gap-2">
              {DEPTHS.map((d) => (
                <button
                  key={d.value}
                  type="button"
                  onClick={() => setDepth(d.value)}
                  className={`inline-flex h-9 items-center gap-1.5 rounded-full border px-3.5 text-[12.5px] font-medium transition-colors ${
                    depth === d.value
                      ? "border-foreground bg-foreground text-background"
                      : "border-border bg-background text-foreground hover:border-foreground/40 hover:bg-card"
                  }`}
                >
                  {d.label}
                  <span
                    className={
                      depth === d.value
                        ? "text-background/70"
                        : "text-muted-foreground"
                    }
                  >
                    {d.hint}
                  </span>
                </button>
              ))}
            </div>
          </Field>

          <div className="pt-1">
            <PrimaryButton onClick={submit} disabled={submitting}>
              {submitting ? (
                <Loader2 size={13} className="animate-spin" />
              ) : (
                <Sparkles size={13} />
              )}
              Generate draft
            </PrimaryButton>
          </div>
        </div>
      </div>

      {/* ── Jobs ── */}
      <div>
        <h2 className="mb-3 text-[13px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          Recent jobs
        </h2>
        {jobs.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border bg-card/40 px-6 py-10 text-center text-[13px] text-muted-foreground">
            No generation jobs yet. Enter a topic above to start one.
          </p>
        ) : (
          <ul className="space-y-3">
            {jobs.map((job) => {
              const stepIdx = PIPELINE.indexOf(job.stage);
              const pct =
                job.status === "done"
                  ? 100
                  : Math.round((Math.max(0, stepIdx) / PIPELINE.length) * 100);
              return (
                <li
                  key={job.id}
                  className="rounded-2xl border border-border bg-card p-4 sm:p-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-[14px] font-semibold text-foreground">
                        {job.topic}
                      </p>
                      <p className="mt-0.5 text-[11.5px] uppercase tracking-[0.14em] text-muted-foreground">
                        {job.depth} ·{" "}
                        {job.status === "done"
                          ? "Draft ready"
                          : job.status === "error"
                            ? "Failed"
                            : STAGE_LABEL[job.stage]}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusPill status={job.status} />
                    </div>
                  </div>

                  {/* progress bar */}
                  {job.status !== "error" && (
                    <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-foreground/[0.07]">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          job.status === "done" ? "bg-emerald-500" : "bg-blue-500"
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  )}

                  {job.error && (
                    <p className="mt-3 rounded-lg bg-rose-500/10 px-3 py-2 text-[12px] leading-relaxed text-rose-700 dark:text-rose-300">
                      {job.error}
                    </p>
                  )}

                  <div className="mt-3 flex flex-wrap items-center gap-2.5">
                    {job.status === "done" && job.post_id && (
                      <Link
                        href={`/admin/blog/${job.post_id}/edit`}
                        className="group inline-flex h-8 items-center gap-1.5 rounded-full bg-foreground px-3.5 text-[12px] font-medium text-background transition-all hover:scale-[1.02] hover:opacity-95"
                      >
                        Open draft
                        <ArrowUpRight
                          size={12}
                          className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        />
                      </Link>
                    )}
                    {job.status === "error" && (
                      <button
                        type="button"
                        onClick={() => resume(job.id)}
                        className="inline-flex h-8 items-center gap-1.5 rounded-full border border-border bg-background px-3.5 text-[12px] font-medium text-foreground transition-colors hover:border-foreground/40 hover:bg-card"
                      >
                        <RotateCw size={12} />
                        Resume
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
