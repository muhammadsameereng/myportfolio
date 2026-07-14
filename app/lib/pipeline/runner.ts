import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { BlogJobRow, BlogJobStage } from "@/app/lib/supabase/types";
import { PipelineConfigError } from "./config";
import {
  loadPipeline,
  runDraft,
  runImage,
  runMetadata,
  runOutline,
  runResearch,
  runSave,
  type StageCtx,
} from "./stages";

/**
 * The pipeline state machine. Advances a `blog_jobs` row one stage at a
 * time, persisting each stage's output BEFORE moving on (so an interrupted
 * job resumes from exactly where it stopped). An optimistic DB lock prevents
 * two concurrent invocations from processing the same job.
 */

const NEXT: Record<Exclude<BlogJobStage, "complete">, BlogJobStage> = {
  research: "outline",
  outline: "draft",
  draft: "metadata",
  metadata: "image",
  image: "save",
  save: "complete",
};

const STAGE_FNS: Record<
  Exclude<BlogJobStage, "complete" | "save">,
  (ctx: StageCtx) => Promise<Partial<BlogJobRow>>
> = {
  research: runResearch,
  outline: runOutline,
  draft: runDraft,
  metadata: runMetadata,
  image: runImage,
};

const STALE_LOCK_MS = 90_000; // a lock older than this is reclaimable
const TIME_BUDGET_MS = 45_000; // stay well under the route's maxDuration (60s)

const nowIso = () => new Date().toISOString();

export type ProcessResult = {
  ok: boolean;
  status: BlogJobRow["status"] | "paused" | "skipped" | "notfound";
  stage?: BlogJobStage;
  error?: string;
};

export async function processJob(
  supabase: SupabaseClient,
  apiKey: string,
  jobId: string
): Promise<ProcessResult> {
  const { data: cur } = await supabase
    .from("blog_jobs")
    .select("*")
    .eq("id", jobId)
    .maybeSingle<BlogJobRow>();

  if (!cur) return { ok: false, status: "notfound" };
  if (cur.status === "done") return { ok: true, status: "done", stage: cur.stage };
  if (cur.status === "error") return { ok: true, status: "skipped", stage: cur.stage };

  // Fresh lock held by another worker → leave it alone.
  if (
    cur.status === "processing" &&
    cur.locked_at &&
    Date.now() - new Date(cur.locked_at).getTime() < STALE_LOCK_MS
  ) {
    return { ok: true, status: "skipped", stage: cur.stage };
  }

  // Optimistic claim (compare-and-set on status + locked_at as read).
  let claim = supabase
    .from("blog_jobs")
    .update({
      status: "processing",
      locked_at: nowIso(),
      attempts: cur.attempts + 1,
      error: null,
    })
    .eq("id", jobId)
    .eq("status", cur.status);
  claim = cur.locked_at === null ? claim.is("locked_at", null) : claim.eq("locked_at", cur.locked_at);

  const { data: claimedRows } = await claim.select("*");
  const claimed = (claimedRows as BlogJobRow[] | null)?.[0];
  if (!claimed) return { ok: true, status: "skipped", stage: cur.stage }; // lost the race

  let job = claimed;

  // Load + validate config AFTER claim so config errors surface on the job.
  let cfg, presetFor;
  try {
    ({ cfg, presetFor } = loadPipeline());
  } catch (e) {
    const msg = e instanceof PipelineConfigError ? e.message : `config error: ${String(e)}`;
    await supabase
      .from("blog_jobs")
      .update({ status: "error", error: msg, locked_at: null })
      .eq("id", jobId);
    return { ok: false, status: "error", error: msg };
  }

  const start = Date.now();

  while (job.stage !== "complete") {
    // Out of time this invocation → release to 'pending' so the next kick
    // resumes from the current (already-persisted) stage.
    if (Date.now() - start > TIME_BUDGET_MS) {
      await supabase
        .from("blog_jobs")
        .update({ status: "pending", locked_at: null })
        .eq("id", jobId);
      return { ok: true, status: "paused", stage: job.stage };
    }

    const ctx: StageCtx = { job, apiKey, supabase, cfg, preset: presetFor(job.depth) };

    let output: Partial<BlogJobRow>;
    try {
      output =
        job.stage === "save"
          ? await runSave(ctx)
          : await STAGE_FNS[job.stage](ctx);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      await supabase
        .from("blog_jobs")
        .update({ status: "error", error: msg, locked_at: null })
        .eq("id", jobId);
      return { ok: false, status: "error", stage: job.stage, error: msg };
    }

    const next = NEXT[job.stage as Exclude<BlogJobStage, "complete">];
    // Persist this stage's output + advance + refresh the lock atomically.
    const { error: persistErr } = await supabase
      .from("blog_jobs")
      .update({ ...output, stage: next, locked_at: nowIso() })
      .eq("id", jobId);
    if (persistErr) {
      await supabase
        .from("blog_jobs")
        .update({ status: "error", error: `persist failed: ${persistErr.message}`, locked_at: null })
        .eq("id", jobId);
      return { ok: false, status: "error", stage: job.stage, error: persistErr.message };
    }

    job = { ...job, ...output, stage: next } as BlogJobRow;
  }

  await supabase
    .from("blog_jobs")
    .update({ status: "done", locked_at: null })
    .eq("id", jobId);

  return { ok: true, status: "done", stage: "complete" };
}
