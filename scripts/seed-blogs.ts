/**
 * Wipes `blog_posts` and seeds 10 new long-form posts.
 *
 *   npx tsx scripts/seed-blogs.ts
 *
 * Auth: SUPABASE_SERVICE_ROLE_KEY from .env.local (RLS bypassed).
 * Bodies live in scripts/blogs/*.md so they don't fight JS template-literal
 * delimiters. Cover images: Unsplash (whitelisted in next.config.ts).
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";

/* ─── env ─────────────────────────────────────────────────────────── */
function loadEnv() {
  const candidates = [".env.local", ".env"];
  let text = "";
  for (const c of candidates) {
    try {
      text = readFileSync(resolve(process.cwd(), c), "utf8");
      break;
    } catch {
      /* try next */
    }
  }
  if (!text) {
    console.error("[seed-blogs] no .env.local or .env found");
    process.exit(1);
  }
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq < 0) continue;
    const key = line.slice(0, eq).trim();
    let val = line.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = val;
  }
}
loadEnv();

const URL_ = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!URL_ || !SERVICE_KEY) {
  console.error("[seed-blogs] Missing Supabase env vars");
  process.exit(1);
}
const sb = createClient(URL_, SERVICE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

/* ─── categories (idempotent) ─────────────────────────────────────── */
const CATEGORIES: { name: string; slug: string; color: string }[] = [
  { name: "Career", slug: "career", color: "#22c55e" },
  { name: "Engineering", slug: "engineering", color: "#3b82f6" },
  { name: "AI", slug: "ai", color: "#a855f7" },
  { name: "Productivity", slug: "productivity", color: "#f59e0b" },
];

/* ─── posts ───────────────────────────────────────────────────────── */
type PostMeta = {
  bodyFile: string;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  read_time: string;
  thumb_url: string;
  tags: string[];
  category_slug: string;
  featured?: boolean;
};

const POSTS: PostMeta[] = [
  {
    bodyFile: "01-developer-portfolio-that-gets-you-hired-2026.md",
    slug: "developer-portfolio-that-gets-you-hired-2026",
    title: "Build a Developer Portfolio That Gets You Hired in 2026",
    excerpt:
      "What hiring managers actually look for in a portfolio in 2026 — and the five sections that move the needle from 'nice site' to interview invite.",
    date: "2026-04-28",
    read_time: "6 min",
    thumb_url:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1600&q=80",
    tags: ["portfolio", "career", "hiring", "frontend"],
    category_slug: "career",
    featured: true,
  },
  {
    bodyFile: "02-technical-case-studies-recruiters-actually-read.md",
    slug: "technical-case-studies-recruiters-actually-read",
    title: "How to Write Technical Case Studies Recruiters Actually Read",
    excerpt:
      "A repeatable structure for case studies that survive a 90-second skim — and the section recruiters always jump to first.",
    date: "2026-04-22",
    read_time: "7 min",
    thumb_url:
      "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1600&q=80",
    tags: ["writing", "career", "portfolio", "case-study"],
    category_slug: "career",
  },
  {
    bodyFile: "03-nextjs-supabase-starter-stack-2026.md",
    slug: "nextjs-supabase-starter-stack-2026",
    title: "From Zero to First Deploy: A Next.js + Supabase Starter Stack",
    excerpt:
      "The minimum-viable production stack I reach for in 2026 — Next.js 16, Supabase, Tailwind, Vercel — and exactly what I skip until later.",
    date: "2026-04-15",
    read_time: "8 min",
    thumb_url:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1600&q=80",
    tags: ["nextjs", "supabase", "stack", "tutorial"],
    category_slug: "engineering",
    featured: true,
  },
  {
    bodyFile: "04-clarity-over-cleverness-2026-developer-mindset.md",
    slug: "clarity-over-cleverness-2026-developer-mindset",
    title: "Clarity Over Cleverness: The 2026 Developer Mindset",
    excerpt:
      "Why the most-shared developer essays of 2026 stopped admiring complexity and started admiring boring code that obviously works.",
    date: "2026-04-08",
    read_time: "5 min",
    thumb_url:
      "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=1600&q=80",
    tags: ["mindset", "engineering", "career", "essays"],
    category_slug: "engineering",
  },
  {
    bodyFile: "05-developer-productivity-stack-2026.md",
    slug: "developer-productivity-stack-2026",
    title: "The Developer Productivity Stack I Actually Use Every Day",
    excerpt:
      "Not a 47-tool listicle — the eight tools that survived a year of trial-and-error and now run my workday end-to-end.",
    date: "2026-04-01",
    read_time: "7 min",
    thumb_url:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1600&q=80",
    tags: ["productivity", "tools", "workflow", "ai"],
    category_slug: "productivity",
  },
  {
    bodyFile: "06-burnout-ai-anxiety-staying-employable.md",
    slug: "burnout-ai-anxiety-staying-employable",
    title: "Burnout, AI Anxiety, and Staying Employable as a Developer",
    excerpt:
      "Honest notes on the fear quietly running through every 2026 developer Slack — and what's actually worked for me.",
    date: "2026-03-25",
    read_time: "7 min",
    thumb_url:
      "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=1600&q=80",
    tags: ["career", "wellbeing", "ai", "burnout"],
    category_slug: "career",
  },
  {
    bodyFile: "07-claude-opus-4-7-adaptive-thinking-models.md",
    slug: "claude-opus-4-7-adaptive-thinking-models",
    title: "Claude Opus 4.7 and the Rise of Adaptive Thinking Models",
    excerpt:
      "Why merging 'reasoning' back into the main model is a bigger UX shift than the benchmark headlines suggest — and what it means for builders.",
    date: "2026-04-30",
    read_time: "6 min",
    thumb_url:
      "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1600&q=80",
    tags: ["ai", "claude", "anthropic", "llm"],
    category_slug: "ai",
    featured: true,
  },
  {
    bodyFile: "08-ai-coding-agents-rewriting-pull-request-workflow.md",
    slug: "ai-coding-agents-rewriting-pull-request-workflow",
    title: "AI Coding Agents Are Rewriting the Pull-Request Workflow",
    excerpt:
      "When agents open PRs overnight, the bottleneck moves from typing to reviewing — and the role of a senior engineer quietly changes.",
    date: "2026-04-19",
    read_time: "6 min",
    thumb_url:
      "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1600&q=80",
    tags: ["ai", "agents", "github", "workflow"],
    category_slug: "ai",
  },
  {
    bodyFile: "09-webassembly-wasi-1-container-replacement.md",
    slug: "webassembly-wasi-1-container-replacement",
    title: "WebAssembly + WASI 1.0: The Quiet Container Replacement",
    excerpt:
      "WASI 1.0 lands in 2026 and the implications are bigger than the announcement made them sound — sub-second cold-starts, real sandboxing, and a path past Docker.",
    date: "2026-04-12",
    read_time: "6 min",
    thumb_url:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=80",
    tags: ["webassembly", "wasi", "infrastructure", "rust"],
    category_slug: "engineering",
  },
  {
    bodyFile: "11-openclaw-architecture-dissected.md",
    slug: "openclaw-architecture-dissected",
    title: "OpenClaw, Dissected: One Daemon, Many Mouths, and a Folder of Markdown",
    excerpt:
      "Why OpenClaw hit 347k GitHub stars in five months — a layer-by-layer walkthrough of the architecture, the markdown-as-memory trick, and the recursion that makes it feel magical.",
    date: "2026-05-02",
    read_time: "12 min",
    thumb_url:
      "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1600&q=80",
    tags: ["openclaw", "ai", "agents", "architecture", "self-hosted"],
    category_slug: "ai",
    featured: true,
  },
  {
    bodyFile: "10-rust-native-ai-agent-frameworks-2026.md",
    slug: "rust-native-ai-agent-frameworks-2026",
    title: "Rust-Native AI Agent Frameworks: Rig, AutoAgents, and Beyond",
    excerpt:
      "Why Python's grip on the AI stack is loosening for production agent workloads — and the Rust ecosystem that emerged in early 2026.",
    date: "2026-04-05",
    read_time: "7 min",
    thumb_url:
      "https://images.unsplash.com/photo-1550439062-609e1531270e?auto=format&fit=crop&w=1600&q=80",
    tags: ["rust", "ai", "agents", "performance"],
    category_slug: "ai",
  },
];

/* ─── helpers ─────────────────────────────────────────────────────── */
function loadBody(file: string): string {
  return readFileSync(resolve(process.cwd(), "scripts/blogs", file), "utf8").trim();
}

async function ensureCategories(): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  for (const c of CATEGORIES) {
    const { data: existing } = await sb
      .from("categories")
      .select("id")
      .eq("slug", c.slug)
      .eq("kind", "blog")
      .maybeSingle();

    if (existing?.id) {
      map.set(c.slug, existing.id);
      continue;
    }

    const { data, error } = await sb
      .from("categories")
      .insert({ name: c.name, slug: c.slug, color: c.color, kind: "blog" })
      .select("id")
      .single();

    if (error || !data) throw error || new Error(`category insert failed: ${c.slug}`);
    map.set(c.slug, data.id);
  }
  return map;
}

async function wipeBlogPosts() {
  const { error } = await sb.from("blog_posts").delete().not("id", "is", null);
  if (error) throw error;
}

async function insertPosts(catMap: Map<string, string>) {
  const rows = POSTS.map((p) => ({
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    body: loadBody(p.bodyFile),
    date: p.date,
    read_time: p.read_time,
    thumb_url: p.thumb_url,
    tags: Array.from(new Set([...p.tags, "saranzafar"])),
    category_id: catMap.get(p.category_slug) ?? null,
    featured: p.featured ?? false,
    status: "published" as const,
    published_at: new Date(`${p.date}T12:00:00Z`).toISOString(),
  }));

  const { error } = await sb.from("blog_posts").insert(rows);
  if (error) throw error;
}

/* ─── run ─────────────────────────────────────────────────────────── */
(async () => {
  console.log("[seed-blogs] ensuring blog categories…");
  const catMap = await ensureCategories();
  console.log(`[seed-blogs] categories ready: ${[...catMap.keys()].join(", ")}`);

  console.log("[seed-blogs] wiping existing blog_posts…");
  await wipeBlogPosts();

  console.log(`[seed-blogs] inserting ${POSTS.length} posts…`);
  await insertPosts(catMap);

  console.log("[seed-blogs] done ✓");
})().catch((e) => {
  console.error("[seed-blogs] failed:", e);
  process.exit(1);
});
