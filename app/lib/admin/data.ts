import { cache } from "react";
import { createClient } from "../supabase/server";
import type {
  BlogPostRow,
  CategoryRow,
  ProjectRow,
  Status,
} from "../supabase/types";

type GroupCounts = {
  total: number;
  published: number;
  drafts: number;
  featured: number;
};

type CountsResult = {
  projects: GroupCounts;
  blog: GroupCounts;
  categories: number;
};

export const getCounts = cache(async (): Promise<CountsResult | null> => {
  const supabase = await createClient();
  if (!supabase) return null;

  // 9 head-only count queries in parallel — each returns just a count, no rows.
  // Cheaper than fetching all rows and counting client-side.
  const head = { count: "exact" as const, head: true };
  const [
    pTotal, pPub, pDraft, pFeat,
    bTotal, bPub, bDraft, bFeat,
    cTotal,
  ] = await Promise.all([
    supabase.from("projects").select("id", head),
    supabase.from("projects").select("id", head).eq("status", "published"),
    supabase.from("projects").select("id", head).eq("status", "draft"),
    supabase.from("projects").select("id", head).eq("featured", true),
    supabase.from("blog_posts").select("id", head),
    supabase.from("blog_posts").select("id", head).eq("status", "published"),
    supabase.from("blog_posts").select("id", head).eq("status", "draft"),
    supabase.from("blog_posts").select("id", head).eq("featured", true),
    supabase.from("categories").select("id", head),
  ]);

  return {
    projects: {
      total: pTotal.count || 0,
      published: pPub.count || 0,
      drafts: pDraft.count || 0,
      featured: pFeat.count || 0,
    },
    blog: {
      total: bTotal.count || 0,
      published: bPub.count || 0,
      drafts: bDraft.count || 0,
      featured: bFeat.count || 0,
    },
    categories: cTotal.count || 0,
  };
});

export type DashboardRecent = {
  id: string;
  title: string;
  slug: string;
  status: Status;
  featured: boolean;
  updated_at: string;
};

export const getDashboardRecents = cache(
  async (): Promise<{
    projects: DashboardRecent[];
    blog: DashboardRecent[];
  } | null> => {
    const supabase = await createClient();
    if (!supabase) return null;
    const cols = "id,title,slug,status,featured,updated_at";
    const [proj, blog] = await Promise.all([
      supabase
        .from("projects")
        .select(cols)
        .order("updated_at", { ascending: false })
        .limit(5),
      supabase
        .from("blog_posts")
        .select(cols)
        .order("updated_at", { ascending: false })
        .limit(5),
    ]);
    return {
      projects: (proj.data as DashboardRecent[]) || [],
      blog: (blog.data as DashboardRecent[]) || [],
    };
  }
);

export const getAllProjectsForAdmin = cache(
  async (): Promise<ProjectRow[] | null> => {
    const supabase = await createClient();
    if (!supabase) return null;
    const { data } = await supabase
      .from("projects")
      .select("*, category:categories(*)")
      .order("updated_at", { ascending: false });
    return (data as ProjectRow[]) || [];
  }
);

export const getProjectById = cache(
  async (id: string): Promise<ProjectRow | null> => {
    const supabase = await createClient();
    if (!supabase) return null;
    const { data } = await supabase
      .from("projects")
      .select("*, category:categories(*)")
      .eq("id", id)
      .maybeSingle();
    return (data as ProjectRow) || null;
  }
);

export const getAllBlogForAdmin = cache(
  async (): Promise<BlogPostRow[] | null> => {
    const supabase = await createClient();
    if (!supabase) return null;
    const { data } = await supabase
      .from("blog_posts")
      .select("*, category:categories(*)")
      .order("updated_at", { ascending: false });
    return (data as BlogPostRow[]) || [];
  }
);

export const getBlogPostById = cache(
  async (id: string): Promise<BlogPostRow | null> => {
    const supabase = await createClient();
    if (!supabase) return null;
    const { data } = await supabase
      .from("blog_posts")
      .select("*, category:categories(*)")
      .eq("id", id)
      .maybeSingle();
    return (data as BlogPostRow) || null;
  }
);

export const getCategories = cache(
  async (): Promise<CategoryRow[] | null> => {
    const supabase = await createClient();
    if (!supabase) return null;
    const { data } = await supabase
      .from("categories")
      .select("*")
      .order("name", { ascending: true });
    return (data as CategoryRow[]) || [];
  }
);

export const getCategoriesByKind = cache(
  async (kind: "project" | "blog"): Promise<CategoryRow[] | null> => {
    const supabase = await createClient();
    if (!supabase) return null;
    const { data } = await supabase
      .from("categories")
      .select("*")
      .eq("kind", kind)
      .order("name", { ascending: true });
    return (data as CategoryRow[]) || [];
  }
);
