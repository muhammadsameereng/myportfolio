/**
 * Imports projects from `docs/projects_rows.csv` (a dump from the
 * previous portfolio site) into Supabase, skipping any whose slug
 * already exists in the `projects` table.
 *
 * - Categories from the CSV's `category` column are auto-upserted
 *   into `public.categories` with kind='project'.
 * - `technologies` JSON array maps to `tags`.
 * - `content` (markdown) maps to `long_description`.
 * - `published=true` → status='published', else 'draft'.
 * - Featured stays as the CSV says (false for most rows here).
 *
 * Usage:
 *   npx tsx scripts/seed-csv-projects.ts
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";

/* ── Load .env.local ──────────────────────────────────────────── */
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

const URL_ = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const sb = createClient(URL_, SERVICE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

/* ── Tiny RFC-4180 CSV parser (multi-line quoted fields supported) ── */
function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  let i = 0;
  const n = text.length;
  while (i < n) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i += 2;
          continue;
        }
        inQuotes = false;
        i++;
        continue;
      }
      field += ch;
      i++;
      continue;
    }
    if (ch === '"') {
      inQuotes = true;
      i++;
      continue;
    }
    if (ch === ",") {
      row.push(field);
      field = "";
      i++;
      continue;
    }
    if (ch === "\n" || ch === "\r") {
      row.push(field);
      field = "";
      rows.push(row);
      row = [];
      // swallow CRLF as one separator
      if (ch === "\r" && text[i + 1] === "\n") i += 2;
      else i++;
      continue;
    }
    field += ch;
    i++;
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => r.some((c) => c.length > 0));
}

/* ── Helpers ──────────────────────────────────────────────────── */
const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");

const CATEGORY_COLORS: Record<string, string> = {
  WordPress: "#21759b",
  SaaS: "#6366f1",
  Web: "#10b981",
  Desktop: "#0ea5e9",
  Mobile: "#f59e0b",
  "E-Commerce": "#ec4899",
};

const parseJsonArray = (s: string): string[] => {
  try {
    const v = JSON.parse(s);
    return Array.isArray(v) ? v.map(String) : [];
  } catch {
    return [];
  }
};

const parseBool = (s: string): boolean =>
  s.trim().toLowerCase() === "true";

/* ── Main ─────────────────────────────────────────────────────── */
async function main() {
  const csvPath = resolve(process.cwd(), "docs/projects_rows.csv");
  const text = readFileSync(csvPath, "utf8");
  const rows = parseCSV(text);
  if (rows.length < 2) {
    console.error("[csv] no data rows found");
    process.exit(1);
  }
  const header = rows[0];
  const idx = (name: string) => header.indexOf(name);
  const data = rows.slice(1);
  console.log(`[csv] parsed ${data.length} project rows from CSV`);

  /* Existing slugs → skip set */
  const { data: existing, error: exErr } = await sb
    .from("projects")
    .select("slug");
  if (exErr) throw exErr;
  const existingSlugs = new Set(
    (existing || []).map((r: { slug: string }) => r.slug)
  );
  console.log(`[csv] db currently has ${existingSlugs.size} projects`);

  /* Existing project categories → reuse if name matches */
  const { data: cats, error: catErr } = await sb
    .from("categories")
    .select("id, name, kind")
    .eq("kind", "project");
  if (catErr) throw catErr;
  const catByName = new Map<string, string>();
  (cats || []).forEach((c: { id: string; name: string }) =>
    catByName.set(c.name, c.id)
  );

  /* Decide which CSV rows to insert + which new categories to add */
  type Row = {
    slug: string;
    title: string;
    description: string;
    long_description: string;
    category_name: string;
    tags: string[];
    thumb_url: string | null;
    live_url: string | null;
    repo_url: string | null;
    featured: boolean;
    status: "draft" | "published";
    published_at: string;
    created_at: string;
    updated_at: string;
  };

  const toInsert: Row[] = [];
  const skipped: string[] = [];
  const newCatNames = new Set<string>();

  for (const r of data) {
    const slugRaw = (r[idx("slug")] || "").trim();
    const title = (r[idx("title")] || "").trim();
    if (!title) continue;
    const slug = slugRaw || slugify(title);
    if (existingSlugs.has(slug)) {
      skipped.push(slug);
      continue;
    }
    const categoryName = (r[idx("category")] || "").trim() || "Web";
    if (!catByName.has(categoryName)) newCatNames.add(categoryName);

    const createdAt = (r[idx("created_at")] || "").trim() || new Date().toISOString();
    const updatedAt = (r[idx("updated_at")] || "").trim() || createdAt;
    const status = parseBool(r[idx("published")] || "false")
      ? ("published" as const)
      : ("draft" as const);

    toInsert.push({
      slug,
      title,
      description: (r[idx("description")] || "").trim(),
      long_description: (r[idx("content")] || "").trim(),
      category_name: categoryName,
      tags: parseJsonArray(r[idx("technologies")] || "[]"),
      thumb_url: (r[idx("featured_image")] || "").trim() || null,
      live_url: (r[idx("demo_url")] || "").trim() || null,
      repo_url: (r[idx("repo_url")] || "").trim() || null,
      featured: parseBool(r[idx("featured")] || "false"),
      status,
      published_at: status === "published" ? createdAt : "",
      created_at: createdAt,
      updated_at: updatedAt,
    });
  }

  console.log(
    `[csv] ${toInsert.length} to insert · ${skipped.length} skipped (already in db)`
  );
  if (skipped.length) console.log("       skipped:", skipped.join(", "));

  /* Add any new categories first */
  if (newCatNames.size > 0) {
    const newCatRows = Array.from(newCatNames).map((name) => ({
      name,
      slug: slugify(name),
      color: CATEGORY_COLORS[name] || null,
      kind: "project" as const,
    }));
    console.log(`[csv] inserting ${newCatRows.length} new categories…`);
    const { data: inserted, error } = await sb
      .from("categories")
      .insert(newCatRows)
      .select("id, name");
    if (error) throw error;
    (inserted || []).forEach((c: { id: string; name: string }) =>
      catByName.set(c.name, c.id)
    );
  }

  if (toInsert.length === 0) {
    console.log("[csv] ✓ nothing new to insert");
    return;
  }

  /* Build payload with resolved category_id */
  const payload = toInsert.map((r) => ({
    slug: r.slug,
    title: r.title,
    description: r.description,
    long_description: r.long_description || null,
    category_id: catByName.get(r.category_name) || null,
    tags: r.tags,
    thumb_url: r.thumb_url,
    year: new Date(r.created_at).getFullYear() || null,
    role: null,
    live_url: r.live_url,
    repo_url: r.repo_url,
    featured: r.featured,
    status: r.status,
    published_at: r.published_at || null,
    created_at: r.created_at,
    updated_at: r.updated_at,
  }));

  console.log(`[csv] inserting ${payload.length} projects…`);
  const { error: insertErr } = await sb.from("projects").insert(payload);
  if (insertErr) throw insertErr;

  /* Final count */
  const { count } = await sb
    .from("projects")
    .select("id", { count: "exact", head: true });
  console.log(`\n[csv] ✓ done. projects table now has ${count} rows.`);
}

main().catch((e) => {
  console.error("[csv] FAILED:", e);
  process.exit(1);
});
