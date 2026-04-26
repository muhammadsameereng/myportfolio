import "server-only";
import { cache } from "react";
import { createClient } from "../supabase/server";
import { createStaticClient } from "../supabase/static";
import type { ProjectRow } from "../supabase/types";
import { PROJECTS as STATIC_PROJECTS, type Project } from "../projects";

/**
 * Public project data layer.
 *
 * - Single source of truth for non-admin reads.
 * - Has TWO entry paths so it's safe to call from both runtime page
 *   renders (where `cookies()` works) and from contexts where it
 *   doesn't — `generateStaticParams`, sitemap, etc. The build-time
 *   path uses a cookie-less SSR client; both rely on RLS so they see
 *   the same set of published rows.
 * - Wrapped in React `cache()` so multiple components in one render
 *   share a single fetch. Cross-request freshness comes from page
 *   `revalidate = 3600` and admin actions calling `revalidatePath`.
 */

function rowToProject(row: ProjectRow): Project {
  const md = (row.long_description || "").trim();
  const longParas = (md || row.description || "")
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  return {
    slug: row.slug,
    title: row.title,
    description: row.description,
    longDescription: longParas.length ? longParas : [row.description],
    body: md || undefined,
    featured: row.featured,
    category: (row.category?.name as Project["category"]) || "Web",
    tags: row.tags || [],
    thumb:
      row.thumb_url ||
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1600&q=80&auto=format&fit=crop",
    year: row.year || new Date(row.created_at).getFullYear(),
    role: row.role || "",
    liveUrl: row.live_url || undefined,
    repoUrl: row.repo_url || undefined,
  };
}

async function fetchPublishedRows(
  useStatic: boolean
): Promise<ProjectRow[] | null> {
  const supabase = useStatic ? createStaticClient() : await createClient();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("projects")
    .select("*, category:categories(*)")
    .eq("status", "published")
    .order("featured", { ascending: false })
    .order("year", { ascending: false, nullsFirst: false })
    .order("published_at", { ascending: false, nullsFirst: false });
  if (error) {
    // Surface the cause once per render so RLS/auth misconfig doesn't
    // silently fall back to the static catalog.
    console.error("[public/projects] fetch failed:", error.message);
    return null;
  }
  return (data as ProjectRow[]) || [];
}

const fetchRuntime = cache(() => fetchPublishedRows(false));
const fetchStatic = cache(() => fetchPublishedRows(true));

async function getProjects(useStatic: boolean): Promise<Project[]> {
  const rows = useStatic ? await fetchStatic() : await fetchRuntime();
  if (!rows || rows.length === 0) return STATIC_PROJECTS;
  return rows.map(rowToProject);
}

/* ── Public API (runtime — reads cookies) ───────────────────────── */

export const getPublicProjects = cache(async (): Promise<Project[]> =>
  getProjects(false)
);

export const getFeaturedProjects = cache(
  async (limit = 6): Promise<Project[]> => {
    const all = await getProjects(false);
    const flagged = all.filter((p) => p.featured === true);
    if (flagged.length > 0) return flagged.slice(0, limit);
    // Static fallback (no `featured` flags) — show top N so dev isn't blank.
    return all.slice(0, limit);
  }
);

export const getPublicProjectBySlug = cache(
  async (slug: string): Promise<Project | null> => {
    const all = await getProjects(false);
    return all.find((p) => p.slug === slug) || null;
  }
);

export const getRelatedPublicProjects = cache(
  async (slug: string, limit = 3): Promise<Project[]> => {
    const all = await getProjects(false);
    const current = all.find((p) => p.slug === slug);
    if (!current) return all.slice(0, limit);
    const sameCat = all.filter(
      (p) => p.slug !== slug && p.category === current.category
    );
    const others = all.filter(
      (p) => p.slug !== slug && p.category !== current.category
    );
    return [...sameCat, ...others].slice(0, limit);
  }
);

export const getPublicProjectCategories = cache(
  async (): Promise<string[]> => {
    const all = await getProjects(false);
    const set = new Set<string>();
    all.forEach((p) => set.add(p.category));
    return Array.from(set).sort();
  }
);

/* ── Static API (no cookies — safe in generateStaticParams, sitemap) ── */

export const getStaticProjectSlugs = cache(async (): Promise<string[]> => {
  const all = await getProjects(true);
  return all.map((p) => p.slug);
});
