import type { MetadataRoute } from "next";
import { getPublicPosts } from "./lib/public/blog";
import { getPublicProjects } from "./lib/public/projects";

/**
 * Sitemap built to Google's current guidance:
 *
 * - `<priority>` and `<changefreq>` are intentionally omitted — Google
 *   explicitly ignores them. Including them adds noise and dilutes the
 *   signal from the fields that DO matter.
 * - `<lastmod>` is sourced from real row timestamps (`updated_at` for
 *   projects/posts, build time for static routes). Google uses lastmod
 *   "if it's consistently and verifiably accurate" — so we only set it
 *   where we know the value is real.
 * - Image extensions (`images: string[]`) are added per detail page so
 *   Google Images can discover thumbnails alongside the page URL.
 *
 * Reference: https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
 */

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://sameer-khan.vercel.app";

// Strip query strings before emitting an image URL into the sitemap.
// XML requires `&` to be entity-escaped as `&amp;`, but Next 16's
// sitemap builder doesn't escape inside the image extension's
// <image:loc> tag — Unsplash URLs with `?w=…&q=…` would produce
// invalid XML that strict parsers reject. Dropping the query keeps
// the URL valid and the image still resolves (at original size).
function safeImageUrl(url: string | null | undefined): string | undefined {
  if (!url) return undefined;
  const q = url.indexOf("?");
  return q === -1 ? url : url.slice(0, q);
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const buildTime = new Date();
  const [PROJECTS, POSTS] = await Promise.all([
    getPublicProjects(),
    getPublicPosts(),
  ]);

  // Static routes — lastmod = build time, since "the page" changes when
  // we redeploy. Refines naturally on every Vercel deploy.
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE}/`, lastModified: buildTime },
    { url: `${SITE}/about`, lastModified: buildTime },
    { url: `${SITE}/projects`, lastModified: buildTime },
    { url: `${SITE}/blog`, lastModified: buildTime },
    { url: `${SITE}/contact`, lastModified: buildTime },
  ];

  const projectRoutes: MetadataRoute.Sitemap = PROJECTS.map((p) => {
    const img = safeImageUrl(p.thumb);
    return {
      url: `${SITE}/projects/${p.slug}`,
      lastModified: p.updatedAt ? new Date(p.updatedAt) : buildTime,
      images: img ? [img] : undefined,
    };
  });

  const blogRoutes: MetadataRoute.Sitemap = POSTS.map((p) => {
    const img = safeImageUrl(p.thumb);
    return {
      url: `${SITE}/blog/${p.slug}`,
      lastModified: p.updatedAt
        ? new Date(p.updatedAt)
        : new Date(p.isoDate),
      images: img ? [img] : undefined,
    };
  });

  return [...staticRoutes, ...projectRoutes, ...blogRoutes];
}
