/**
 * Database types — kept manual + minimal for now. When the schema settles,
 * regenerate with `npx supabase gen types typescript`.
 */

export type Status = "draft" | "published";
export type CategoryKind = "project" | "blog";

export type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  color: string | null;
  kind: CategoryKind;
  created_at: string;
};

export type ProjectRow = {
  id: string;
  slug: string;
  title: string;
  description: string;
  long_description: string | null;
  category_id: string | null;
  tags: string[];
  thumb_url: string | null;
  gallery_urls: string[];
  year: number | null;
  role: string | null;
  live_url: string | null;
  repo_url: string | null;
  featured: boolean;
  status: Status;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  // populated when joined with categories
  category?: CategoryRow | null;
};

export type BlogPostRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string | null;
  date: string;
  read_time: string | null;
  thumb_url: string | null;
  tags: string[];
  category_id: string | null;
  featured: boolean;
  status: Status;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  category?: CategoryRow | null;
};
