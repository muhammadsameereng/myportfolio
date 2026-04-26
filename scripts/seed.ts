/**
 * One-shot seed script — wipes and repopulates `categories`,
 * `projects`, and `blog_posts` from the local static catalogs at
 * `app/lib/projects.ts` and `app/lib/blogs.ts`.
 *
 * Auth: uses the SUPABASE_SERVICE_ROLE_KEY from `.env.local`. RLS is
 * bypassed by the service role, so deletes and inserts work directly.
 *
 * Usage:
 *   npx tsx scripts/seed.ts
 *
 * The script is idempotent in the destructive sense: every run starts
 * from an empty `projects` + `blog_posts` table. Re-running gives you
 * exactly the same set of rows (plus fresh `created_at` timestamps).
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";
import { POSTS } from "../app/lib/blogs";
import { PROJECTS, type Category } from "../app/lib/projects";

/* ─── 1. Load .env.local without adding a dotenv dep ──────────────── */
function loadEnv() {
  const path = resolve(process.cwd(), ".env.local");
  const text = readFileSync(path, "utf8");
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
  console.error(
    "[seed] Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY"
  );
  process.exit(1);
}

const sb = createClient(URL_, SERVICE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

/* ─── 2. Helpers ──────────────────────────────────────────────────── */
const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");

// Stable colours for category chips.
const CATEGORY_COLORS: Record<string, string> = {
  SaaS: "#6366f1",
  Web: "#10b981",
  Desktop: "#0ea5e9",
  Mobile: "#f59e0b",
  "E-Commerce": "#ec4899",
  Engineering: "#475569",
  Personal: "#a855f7",
};

const FEATURED_PROJECTS = 6;
const FEATURED_POSTS = 3;

/* ─── 3. Main ─────────────────────────────────────────────────────── */
async function main() {
  console.log("[seed] target:", URL_);

  // Wipe — order matters: posts/projects reference categories.
  console.log("[seed] wiping blog_posts…");
  {
    const { error } = await sb
      .from("blog_posts")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000");
    if (error) throw error;
  }
  console.log("[seed] wiping projects…");
  {
    const { error } = await sb
      .from("projects")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000");
    if (error) throw error;
  }
  console.log("[seed] wiping categories…");
  {
    const { error } = await sb
      .from("categories")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000");
    if (error) throw error;
  }

  /* Categories — projects */
  const projectCatNames = Array.from(
    new Set(PROJECTS.map((p) => p.category as Category))
  );
  // Blog: derive light-touch categorisation from tags. Posts whose tags
  // include "Personal" or "Kashmir" → "Personal", otherwise "Engineering".
  const blogCatNames = ["Engineering", "Personal"] as const;

  const catRows = [
    ...projectCatNames.map((name) => ({
      name,
      slug: slugify(name),
      color: CATEGORY_COLORS[name] || null,
      kind: "project" as const,
    })),
    ...blogCatNames.map((name) => ({
      name,
      slug: slugify(name),
      color: CATEGORY_COLORS[name] || null,
      kind: "blog" as const,
    })),
  ];

  console.log(`[seed] inserting ${catRows.length} categories…`);
  const { data: insertedCats, error: catErr } = await sb
    .from("categories")
    .insert(catRows)
    .select("id, name, kind");
  if (catErr) throw catErr;
  if (!insertedCats) throw new Error("[seed] category insert returned no rows");

  const catId = (kind: "project" | "blog", name: string): string | null => {
    const row = insertedCats.find((c) => c.kind === kind && c.name === name);
    return row?.id || null;
  };

  /* Projects */
  const now = new Date().toISOString();
  const projectRows = PROJECTS.map((p, i) => ({
    slug: p.slug,
    title: p.title,
    description: p.description,
    long_description: p.longDescription.join("\n\n"),
    category_id: catId("project", p.category),
    tags: p.tags,
    thumb_url: p.thumb,
    year: p.year,
    role: p.role,
    live_url: p.liveUrl ?? null,
    repo_url: p.repoUrl ?? null,
    featured: i < FEATURED_PROJECTS,
    status: "published" as const,
    published_at: now,
    created_at: now,
    updated_at: now,
  }));

  console.log(`[seed] inserting ${projectRows.length} projects…`);
  const { error: projErr } = await sb.from("projects").insert(projectRows);
  if (projErr) throw projErr;

  /* Blog posts */
  const postRows = POSTS.map((p, i) => {
    const isPersonal = p.tags.some((t) =>
      ["Personal", "Kashmir"].includes(t)
    );
    return {
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      body: p.body.join("\n\n"),
      date: p.isoDate,
      read_time: p.readTime,
      thumb_url: p.thumb,
      tags: p.tags,
      category_id: catId("blog", isPersonal ? "Personal" : "Engineering"),
      featured: i < FEATURED_POSTS,
      status: "published" as const,
      published_at: now,
      created_at: now,
      updated_at: now,
    };
  });

  console.log(`[seed] inserting ${postRows.length} blog posts…`);
  const { error: postErr } = await sb.from("blog_posts").insert(postRows);
  if (postErr) throw postErr;

  /* Final counts */
  const head = { count: "exact" as const, head: true };
  const [{ count: c1 }, { count: c2 }, { count: c3 }] = await Promise.all([
    sb.from("categories").select("id", head),
    sb.from("projects").select("id", head),
    sb.from("blog_posts").select("id", head),
  ]);

  console.log("\n[seed] ✓ done");
  console.log(`  categories:  ${c1}`);
  console.log(`  projects:    ${c2}  (${FEATURED_PROJECTS} featured)`);
  console.log(`  blog_posts:  ${c3}  (${FEATURED_POSTS} featured)`);
}

main().catch((e) => {
  console.error("[seed] FAILED:", e);
  process.exit(1);
});
