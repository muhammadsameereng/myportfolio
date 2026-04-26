import type { MetadataRoute } from "next";
import { POSTS } from "./lib/blogs";
import { getPublicProjects } from "./lib/public/projects";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://saranzafar.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const PROJECTS = await getPublicProjects();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE}/projects`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.7 },
  ];

  const projectRoutes: MetadataRoute.Sitemap = PROJECTS.map((p) => ({
    url: `${SITE}/projects/${p.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const blogRoutes: MetadataRoute.Sitemap = POSTS.map((p) => ({
    url: `${SITE}/blog/${p.slug}`,
    lastModified: new Date(p.isoDate),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...projectRoutes, ...blogRoutes];
}
