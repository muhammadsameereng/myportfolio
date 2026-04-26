import "server-only";
import { cache } from "react";
import { createClient } from "../supabase/server";
import { createStaticClient } from "../supabase/static";
import type { BlogPostRow } from "../supabase/types";
import { POSTS as STATIC_POSTS, type BlogPost } from "../blogs";

/**
 * Public blog data layer — mirrors `app/lib/public/projects.ts`.
 *
 * - Single source of truth for non-admin reads (homepage Writings,
 *   /blog, /blog/[slug], sitemap, OG images).
 * - Has TWO entry paths: runtime (cookie-aware) for page renders, and
 *   static (cookie-less) for `generateStaticParams` / build-time use.
 * - Wrapped in React `cache()` for per-render dedup; cross-request
 *   freshness comes from page `revalidate = 3600` and admin actions
 *   calling `revalidatePath("/", "page")` + `revalidatePath("/blog",
 *   "page")` on save / delete.
 */

const FALLBACK_THUMB =
  "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1600&q=80&auto=format&fit=crop";

function estimateReadTime(text: string): string {
  const words = (text || "").trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 220));
  return `${minutes} min`;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function rowToPost(row: BlogPostRow): BlogPost {
  const md = (row.body || "").trim();
  const paras = (md || row.excerpt || "")
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);
  const iso = row.date || row.published_at || row.created_at;

  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    body: paras.length ? paras : [row.excerpt],
    markdown: md || undefined,
    date: formatDate(iso),
    isoDate: iso,
    readTime: row.read_time || estimateReadTime(md || row.excerpt),
    thumb: row.thumb_url || FALLBACK_THUMB,
    tags: row.tags || [],
    featured: row.featured,
  };
}

async function fetchPublishedRows(
  useStatic: boolean
): Promise<BlogPostRow[] | null> {
  const supabase = useStatic ? createStaticClient() : await createClient();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*, category:categories(*)")
    .eq("status", "published")
    .order("featured", { ascending: false })
    .order("date", { ascending: false, nullsFirst: false })
    .order("published_at", { ascending: false, nullsFirst: false });
  if (error) {
    console.error("[public/blog] fetch failed:", error.message);
    return null;
  }
  return (data as BlogPostRow[]) || [];
}

const fetchRuntime = cache(() => fetchPublishedRows(false));
const fetchStatic = cache(() => fetchPublishedRows(true));

async function getPosts(useStatic: boolean): Promise<BlogPost[]> {
  const rows = useStatic ? await fetchStatic() : await fetchRuntime();
  if (!rows || rows.length === 0) return STATIC_POSTS;
  return rows.map(rowToPost);
}

/* ── Public API (runtime — reads cookies) ───────────────────────── */

export const getPublicPosts = cache(async (): Promise<BlogPost[]> =>
  getPosts(false)
);

export const getFeaturedPosts = cache(
  async (limit = 3): Promise<BlogPost[]> => {
    const all = await getPosts(false);
    const flagged = all.filter((p) => p.featured === true);
    if (flagged.length > 0) return flagged.slice(0, limit);
    return all.slice(0, limit);
  }
);

export const getPublicPostBySlug = cache(
  async (slug: string): Promise<BlogPost | null> => {
    const all = await getPosts(false);
    return all.find((p) => p.slug === slug) || null;
  }
);

export const getRelatedPublicPosts = cache(
  async (slug: string, limit = 3): Promise<BlogPost[]> => {
    const all = await getPosts(false);
    const current = all.find((p) => p.slug === slug);
    if (!current) return all.slice(0, limit);
    const sameTag = all.filter(
      (p) =>
        p.slug !== slug &&
        p.tags.some((t) => current.tags.includes(t))
    );
    const others = all.filter(
      (p) =>
        p.slug !== slug &&
        !p.tags.some((t) => current.tags.includes(t))
    );
    return [...sameTag, ...others].slice(0, limit);
  }
);

/* ── Static API (no cookies — safe in generateStaticParams, sitemap) ── */

export const getStaticPostSlugs = cache(async (): Promise<string[]> => {
  const all = await getPosts(true);
  return all.map((p) => p.slug);
});
