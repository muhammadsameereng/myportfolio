import "server-only";
import { revalidatePath, revalidateTag } from "next/cache";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { BlogJobMetadata, BlogJobRow } from "@/app/lib/supabase/types";
import { generateOnce } from "@/app/lib/agent/gemini-once";
import { renderAndUploadTitleCard } from "./title-card";
import {
  getPipelineConfig,
  interpolate,
  loadExamples,
  resolveStage,
  type DepthPreset,
  type PipelineConfig,
} from "./config";

export type StageCtx = {
  job: BlogJobRow;
  apiKey: string;
  supabase: SupabaseClient;
  cfg: PipelineConfig;
  preset: DepthPreset;
};

/* ── Shared helpers ──────────────────────────────────────────────────── */

// Mirrors app/admin/blog/actions.ts slugify so generated slugs match the CMS.
export function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function estimateReadTime(markdown: string): string {
  const words = markdown.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
}

function baseVars(ctx: StageCtx): Record<string, string | number> {
  return {
    topic: ctx.job.topic,
    angle: ctx.job.angle || "(none)",
    depth: ctx.job.depth,
    targetWords: ctx.preset.targetWords,
    researchCalls: ctx.preset.researchCalls,
    styleGuide: ctx.cfg.style.styleGuide,
  };
}

function appendSources(text: string, sources: { uri: string; title?: string }[]): string {
  if (sources.length === 0) return text;
  const list = sources
    .map((s) => `- ${s.title ? `${s.title} — ` : ""}${s.uri}`)
    .join("\n");
  return `${text}\n\n[grounded sources]\n${list}`;
}

/* ── Stage: research (grounded, with ungrounded fallback) ────────────── */
export async function runResearch(ctx: StageCtx): Promise<{ research_notes: string }> {
  const stage = resolveStage(ctx.cfg, "research");
  const prompt = interpolate(stage.prompt, baseVars(ctx));

  try {
    const r = await generateOnce({
      apiKey: ctx.apiKey,
      model: stage.model,
      prompt,
      temperature: stage.temperature,
      maxOutputTokens: stage.maxOutputTokens,
      thinkingBudget: stage.thinkingBudget,
      grounding: stage.grounding,
      safety: stage.safety,
    });
    return { research_notes: appendSources(r.text, r.sources) };
  } catch (err) {
    // Grounding can fail (quota exhausted, transient). Never hard-fail the
    // job on it — retry once WITHOUT grounding and flag the degradation.
    if (!stage.grounding) throw err;
    const r = await generateOnce({
      apiKey: ctx.apiKey,
      model: stage.model,
      prompt,
      temperature: stage.temperature,
      maxOutputTokens: stage.maxOutputTokens,
      thinkingBudget: stage.thinkingBudget,
      grounding: false,
      safety: stage.safety,
    });
    return {
      research_notes: `[grounding unavailable — notes from model knowledge only]\n\n${r.text}`,
    };
  }
}

/* ── Stage: outline ──────────────────────────────────────────────────── */
export async function runOutline(ctx: StageCtx): Promise<{ outline: string }> {
  const stage = resolveStage(ctx.cfg, "outline");
  const prompt = interpolate(stage.prompt, {
    ...baseVars(ctx),
    researchNotes: ctx.job.research_notes ?? "",
  });
  const r = await generateOnce({
    apiKey: ctx.apiKey,
    model: stage.model,
    prompt,
    temperature: stage.temperature,
    maxOutputTokens: stage.maxOutputTokens,
    thinkingBudget: stage.thinkingBudget,
    grounding: stage.grounding,
    safety: stage.safety,
  });
  return { outline: r.text };
}

/* ── Stage: draft ────────────────────────────────────────────────────── */
export async function runDraft(ctx: StageCtx): Promise<{ draft_md: string }> {
  const stage = resolveStage(ctx.cfg, "draft");
  const prompt = interpolate(stage.prompt, {
    ...baseVars(ctx),
    examples: loadExamples(ctx.cfg),
    outline: ctx.job.outline ?? "",
    researchNotes: ctx.job.research_notes ?? "",
  });
  const r = await generateOnce({
    apiKey: ctx.apiKey,
    model: stage.model,
    prompt,
    temperature: stage.temperature,
    maxOutputTokens: stage.maxOutputTokens,
    thinkingBudget: stage.thinkingBudget,
    grounding: stage.grounding,
    safety: stage.safety,
  });
  return { draft_md: r.text };
}

/* ── Stage: metadata (JSON with repair + deterministic fallback) ─────── */
function tryParseMetadata(raw: string): Partial<BlogJobMetadata> | null {
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start === -1 || end === -1 || end < start) return null;
  try {
    return JSON.parse(raw.slice(start, end + 1)) as Partial<BlogJobMetadata>;
  } catch {
    return null;
  }
}

function normalizeMetadata(
  partial: Partial<BlogJobMetadata> | null,
  ctx: StageCtx
): BlogJobMetadata {
  const draft = ctx.job.draft_md ?? "";
  const title =
    (typeof partial?.title === "string" && partial.title.trim()) ||
    ctx.job.topic.slice(0, 70);
  const excerpt =
    (typeof partial?.excerpt === "string" && partial.excerpt.trim()) ||
    draft.replace(/[#>*`_\-\n]+/g, " ").replace(/\s+/g, " ").trim().slice(0, 155);
  const slug = slugify(
    (typeof partial?.slug === "string" && partial.slug) || title
  );
  const tags = Array.isArray(partial?.tags)
    ? partial!.tags
        .filter((t): t is string => typeof t === "string")
        .map((t) => t.toLowerCase().trim())
        .filter(Boolean)
        .slice(0, 6)
    : [];
  const read_time =
    (typeof partial?.read_time === "string" && partial.read_time.trim()) ||
    estimateReadTime(draft);
  return { title, excerpt, slug, tags, read_time };
}

export async function runMetadata(ctx: StageCtx): Promise<{ metadata_json: BlogJobMetadata }> {
  const stage = resolveStage(ctx.cfg, "metadata");
  const prompt = interpolate(stage.prompt, {
    draftMarkdown: ctx.job.draft_md ?? "",
  });

  const r = await generateOnce({
    apiKey: ctx.apiKey,
    model: stage.model,
    prompt,
    temperature: stage.temperature,
    maxOutputTokens: stage.maxOutputTokens,
    thinkingBudget: stage.thinkingBudget,
    grounding: false,
    safety: stage.safety,
  });

  let parsed = tryParseMetadata(r.text);

  // Repair pass: ask the model to return ONLY valid JSON for its prior output.
  if (!parsed) {
    try {
      const repair = await generateOnce({
        apiKey: ctx.apiKey,
        model: stage.model,
        prompt: `Convert the following into STRICT valid JSON with keys title, excerpt, slug, tags (array), read_time. Output ONLY the JSON object, no code fence, no prose:\n\n${r.text}`,
        temperature: 0,
        maxOutputTokens: stage.maxOutputTokens,
        thinkingBudget: 0,
        grounding: false,
        safety: stage.safety,
      });
      parsed = tryParseMetadata(repair.text);
    } catch {
      // fall through to deterministic fallback
    }
  }

  // Always produces a valid object — deterministic fallback guarantees the
  // job completes even if the model never returns parseable JSON.
  return { metadata_json: normalizeMetadata(parsed, ctx) };
}

/* ── Stage: image (branded title card; never blocks the draft) ───────── */
export async function runImage(ctx: StageCtx): Promise<{ thumb_url: string | null }> {
  const imageStage = ctx.cfg.stages.image;
  if (imageStage && imageStage.enabled === false) return { thumb_url: null };

  const meta = ctx.job.metadata_json;
  if (!meta) return { thumb_url: null };

  try {
    const url = await renderAndUploadTitleCard(ctx.supabase, ctx.cfg.image, {
      title: meta.title,
      date: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      readTime: meta.read_time,
    });
    return { thumb_url: url };
  } catch (err) {
    console.warn(
      `[blog-pipeline] image stage failed (continuing without cover): ${
        err instanceof Error ? err.message : String(err)
      }`
    );
    return { thumb_url: null };
  }
}

/* ── Stage: save (idempotent insert/update of the draft post) ────────── */
export async function runSave(ctx: StageCtx): Promise<{ post_id: string }> {
  const meta = ctx.job.metadata_json;
  if (!meta) throw new Error("save stage reached with no metadata");

  const today = new Date().toISOString().slice(0, 10);
  const row = {
    slug: slugify(meta.slug || meta.title),
    title: meta.title,
    excerpt: meta.excerpt,
    body: ctx.job.draft_md,
    date: today,
    read_time: meta.read_time,
    thumb_url: ctx.job.thumb_url,
    tags: meta.tags,
    category_id: null as string | null,
    featured: false,
    status: "draft" as const,
    published_at: null as string | null,
  };

  let postId = ctx.job.post_id;

  if (postId) {
    // Resume after save already created the post → UPDATE, never duplicate.
    const { error } = await ctx.supabase
      .from("blog_posts")
      .update(row)
      .eq("id", postId);
    if (error) throw new Error(`save (update) failed: ${error.message}`);
  } else {
    let attempt = 0;
    let slug = row.slug;
    // Retry once on slug-uniqueness collision with a short suffix.
    while (true) {
      const { data, error } = await ctx.supabase
        .from("blog_posts")
        .insert({ ...row, slug })
        .select("id")
        .single();
      if (!error) {
        postId = data.id as string;
        break;
      }
      const dup = error.code === "23505" || /duplicate|unique/i.test(error.message);
      if (dup && attempt === 0) {
        slug = `${row.slug}-${Math.random().toString(36).slice(2, 6)}`;
        attempt++;
        continue;
      }
      throw new Error(`save (insert) failed: ${error.message}`);
    }
  }

  // Same revalidation set as app/admin/blog/actions.ts saveBlogPost.
  revalidateTag("blog", "max");
  revalidatePath("/admin/blog", "page");
  revalidatePath("/blog", "page");
  revalidatePath("/", "page");
  revalidatePath(`/blog/${row.slug}`, "page");

  return { post_id: postId! };
}

/** Re-reads config each call so dev edits hot-apply (it's cheap + cached in prod). */
export function loadPipeline(): {
  cfg: PipelineConfig;
  presetFor: (depth: string) => DepthPreset;
} {
  const cfg = getPipelineConfig();
  const presetFor = (depth: string): DepthPreset =>
    cfg.depthPresets[depth] ?? cfg.depthPresets.standard;
  return { cfg, presetFor };
}
