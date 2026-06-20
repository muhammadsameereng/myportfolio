import "server-only";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import yaml from "js-yaml";

/**
 * Loads + validates `blog-pipeline.yml` (repo root) — the single source of
 * truth for the AI blog pipeline. Models, prompts, temperatures, token
 * limits, grounding flags, depth presets and image styling all live there,
 * so they can be swapped with zero code changes.
 *
 * Config errors are LOUD: a malformed/missing file throws `PipelineConfigError`
 * with the exact offending path. They must never be swallowed — a silently
 * wrong prompt would produce a silently wrong post.
 */

export class PipelineConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PipelineConfigError";
  }
}

export type Safety =
  | "BLOCK_NONE"
  | "BLOCK_ONLY_HIGH"
  | "BLOCK_MEDIUM_AND_ABOVE"
  | "BLOCK_LOW_AND_ABOVE";

export type StageName =
  | "research"
  | "outline"
  | "draft"
  | "metadata"
  | "image";

export type ResolvedStage = {
  model: string;
  temperature: number;
  maxOutputTokens: number;
  thinkingBudget: number;
  safety: Safety;
  grounding: boolean;
  prompt: string;
};

export type DepthPreset = { targetWords: number; researchCalls: number };

export type ImageConfig = {
  gradient: string;
  brandMark: string;
  background: string;
  color: string;
  mutedColor: string;
  fontSizes: { brand: number; meta: number; title: number; footer: number };
  titleMaxWidth: number;
  footer: { left: string; right: string };
  bucket: string;
  pathPrefix: string;
  size: { width: number; height: number };
};

type StageConfig = {
  model?: string;
  temperature?: number;
  maxOutputTokens?: number;
  thinkingBudget?: number;
  safety?: Safety;
  grounding?: boolean;
  prompt?: string;
  enabled?: boolean;
};

export type PipelineConfig = {
  version: number;
  defaults: {
    model: string;
    temperature: number;
    maxOutputTokens: number;
    thinkingBudget: number;
    safety: Safety;
  };
  depthPresets: Record<string, DepthPreset>;
  style: { examples: string[]; exampleMaxChars: number; styleGuide: string };
  stages: Record<string, StageConfig>;
  image: ImageConfig;
};

const CONFIG_FILENAME = "blog-pipeline.yml";

/* ── Tiny assertion helpers — every failure names its exact path ──────── */
function req(cond: unknown, path: string, expected: string): asserts cond {
  if (!cond) throw new PipelineConfigError(`${path} ${expected}`);
}
function isStr(v: unknown): v is string {
  return typeof v === "string" && v.length > 0;
}
function isNum(v: unknown): v is number {
  return typeof v === "number" && Number.isFinite(v);
}

function assertConfig(raw: unknown): asserts raw is PipelineConfig {
  req(raw && typeof raw === "object", "blog-pipeline.yml", "must be a YAML mapping");
  const c = raw as Record<string, unknown>;

  const d = c.defaults as Record<string, unknown> | undefined;
  req(d && typeof d === "object", "defaults", "is required");
  req(isStr(d!.model), "defaults.model", "must be a non-empty string");
  req(isNum(d!.temperature), "defaults.temperature", "must be a number");
  req(isNum(d!.maxOutputTokens), "defaults.maxOutputTokens", "must be a number");
  req(isNum(d!.thinkingBudget), "defaults.thinkingBudget", "must be a number");
  req(isStr(d!.safety), "defaults.safety", "must be a string");

  const presets = c.depthPresets as Record<string, unknown> | undefined;
  req(presets && typeof presets === "object", "depthPresets", "is required");
  for (const key of ["short", "standard", "deep"]) {
    const p = presets![key] as Record<string, unknown> | undefined;
    req(p && typeof p === "object", `depthPresets.${key}`, "is required");
    req(isNum(p!.targetWords), `depthPresets.${key}.targetWords`, "must be a number");
    req(isNum(p!.researchCalls), `depthPresets.${key}.researchCalls`, "must be a number");
  }

  const style = c.style as Record<string, unknown> | undefined;
  req(style && typeof style === "object", "style", "is required");
  req(Array.isArray(style!.examples), "style.examples", "must be an array of file paths");
  req(isNum(style!.exampleMaxChars), "style.exampleMaxChars", "must be a number");
  req(isStr(style!.styleGuide), "style.styleGuide", "must be a non-empty string");

  const stages = c.stages as Record<string, unknown> | undefined;
  req(stages && typeof stages === "object", "stages", "is required");
  for (const name of ["research", "outline", "draft", "metadata"] as const) {
    const s = stages![name] as Record<string, unknown> | undefined;
    req(s && typeof s === "object", `stages.${name}`, "is required");
    req(isStr(s!.prompt), `stages.${name}.prompt`, "must be a non-empty string");
  }

  const img = c.image as Record<string, unknown> | undefined;
  req(img && typeof img === "object", "image", "is required");
  req(isStr(img!.gradient), "image.gradient", "must be a string");
  const size = img!.size as Record<string, unknown> | undefined;
  req(size && isNum(size.width) && isNum(size.height), "image.size", "must have numeric width/height");
  req(isStr(img!.bucket), "image.bucket", "must be a string");
}

let _cached: PipelineConfig | null = null;

/** Returns the validated config. Cached in production; re-read in dev so
 *  edits to the yml hot-apply without a restart. */
export function getPipelineConfig(): PipelineConfig {
  if (_cached && process.env.NODE_ENV === "production") return _cached;

  let text: string;
  try {
    text = readFileSync(join(process.cwd(), CONFIG_FILENAME), "utf8");
  } catch {
    throw new PipelineConfigError(
      `${CONFIG_FILENAME} not found at repo root — if this is a deploy, confirm it's bundled via next.config.ts outputFileTracingIncludes.`
    );
  }

  let parsed: unknown;
  try {
    parsed = yaml.load(text);
  } catch (e) {
    throw new PipelineConfigError(
      `${CONFIG_FILENAME} is not valid YAML: ${e instanceof Error ? e.message : String(e)}`
    );
  }

  assertConfig(parsed);
  _cached = parsed;
  return parsed;
}

/** Merges a stage's overrides over `defaults` into a flat, ready-to-use stage. */
export function resolveStage(cfg: PipelineConfig, name: StageName): ResolvedStage {
  const s = cfg.stages[name] ?? {};
  return {
    model: s.model ?? cfg.defaults.model,
    temperature: s.temperature ?? cfg.defaults.temperature,
    maxOutputTokens: s.maxOutputTokens ?? cfg.defaults.maxOutputTokens,
    thinkingBudget: s.thinkingBudget ?? cfg.defaults.thinkingBudget,
    safety: s.safety ?? cfg.defaults.safety,
    grounding: s.grounding ?? false,
    prompt: s.prompt ?? "",
  };
}

/** Fills `{{placeholders}}`. An unresolved placeholder is a hard error —
 *  never leave a literal `{{x}}` in a prompt sent to the model. */
export function interpolate(
  template: string,
  vars: Record<string, string | number>
): string {
  const out = template.replace(/\{\{\s*(\w+)\s*\}\}/g, (_m, key: string) => {
    if (!(key in vars)) {
      throw new PipelineConfigError(`unresolved prompt placeholder {{${key}}}`);
    }
    return String(vars[key]);
  });
  return out;
}

/** Reads + truncates the style example posts. A missing example file is a
 *  soft failure (warn + skip) — degraded style, not a broken pipeline. */
export function loadExamples(cfg: PipelineConfig): string {
  const parts: string[] = [];
  for (const rel of cfg.style.examples) {
    try {
      const raw = readFileSync(join(process.cwd(), rel), "utf8");
      parts.push(raw.slice(0, cfg.style.exampleMaxChars));
    } catch {
      console.warn(`[blog-pipeline] style example not found, skipping: ${rel}`);
    }
  }
  return parts.join("\n\n---\n\n");
}
