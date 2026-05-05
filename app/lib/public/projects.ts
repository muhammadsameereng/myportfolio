import "server-only";
import { unstable_cache } from "next/cache";
import { cache } from "react";
import { createStaticClient } from "../supabase/static";
import type { ProjectRow } from "../supabase/types";
import { type Project } from "../projects";

const CACHE_TAG = "projects";
const CACHE_TTL_SECONDS = 3600;

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
    gallery: row.gallery_urls && row.gallery_urls.length > 0 ? row.gallery_urls : undefined,
    year: row.year || new Date(row.created_at).getFullYear(),
    role: row.role || "",
    liveUrl: row.live_url || undefined,
    repoUrl: row.repo_url || undefined,
    updatedAt: row.updated_at,
  };
}

// Two-tier caching:
// - `unstable_cache` is global + tag-invalidatable. Admin actions call
//   `revalidateTag("projects", "max")` to bust this whenever a project
//   is saved/deleted/featured-toggled. TTL is the safety net for the
//   case where a tag bust ever drops on the floor.
// - React `cache()` (below) provides per-render dedup so a single page
//   render hits the unstable_cache layer at most once even if many
//   components ask for projects.
//
// `createStaticClient()` is cookie-less, so it's legal inside
// `unstable_cache` (which forbids `cookies()` calls).
const fetchPublishedRowsCached = unstable_cache(
  async (): Promise<ProjectRow[] | null> => {
    const supabase = createStaticClient();
    if (!supabase) return null;
    const { data, error } = await supabase
      .from("projects")
      .select("*, category:categories(*)")
      .eq("status", "published")
      .order("featured", { ascending: false })
      .order("year", { ascending: false, nullsFirst: false })
      .order("published_at", { ascending: false, nullsFirst: false });
    if (error) {
      return null;
    }
    return (data as ProjectRow[]) || [];
  },
  ["public:projects:rows"],
  { tags: [CACHE_TAG], revalidate: CACHE_TTL_SECONDS }
);

const fetchRows = cache(fetchPublishedRowsCached);

async function getProjects(): Promise<Project[]> {
  const rows = await fetchRows();
  if (!rows) return [];
  return rows.map(rowToProject);
}

/* ── Public API ─────────────────────────────────────────────────── */

export const getPublicProjects = cache(getProjects);

export const getFeaturedProjects = cache(
  async (limit = 6): Promise<Project[]> => {
    const all = await getProjects();
    const flagged = all.filter((p) => p.featured === true);
    return flagged.slice(0, limit);
  }
);

export const getPublicProjectBySlug = cache(
  async (slug: string): Promise<Project | null> => {
    const all = await getProjects();
    return all.find((p) => p.slug === slug) || null;
  }
);

export const getRelatedPublicProjects = cache(
  async (slug: string, limit = 3): Promise<Project[]> => {
    const all = await getProjects();
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
    const all = await getProjects();
    const set = new Set<string>();
    all.forEach((p) => set.add(p.category));
    return Array.from(set).sort();
  }
);

/* ── Slug list — same data, narrower payload for `generateStaticParams` ── */

export const getStaticProjectSlugs = cache(async (): Promise<string[]> => {
  const all = await getProjects();
  return all.map((p) => p.slug);
});
