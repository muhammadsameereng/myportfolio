"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/app/lib/supabase/server";

type BlogInput = {
  id?: string;
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
  status: "draft" | "published";
};

const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");

function clean(input: BlogInput): BlogInput {
  return {
    ...input,
    slug: slugify(input.slug || input.title),
    title: input.title.trim(),
    excerpt: input.excerpt.trim(),
    body: input.body?.trim() || null,
    read_time: input.read_time?.trim() || null,
    tags: input.tags.map((t) => t.trim()).filter(Boolean),
  };
}

export async function saveBlogPost(input: BlogInput) {
  const supabase = await createClient();
  if (!supabase) return { error: "Supabase not configured." };

  const payload = clean(input);
  const now = new Date().toISOString();

  if (payload.id) {
    const { error } = await supabase
      .from("blog_posts")
      .update({
        ...payload,
        updated_at: now,
        published_at: payload.status === "published" ? now : null,
      })
      .eq("id", payload.id);
    if (error) return { error: error.message };
  } else {
    const { error, data } = await supabase
      .from("blog_posts")
      .insert({
        ...payload,
        created_at: now,
        updated_at: now,
        published_at: payload.status === "published" ? now : null,
      })
      .select("id")
      .single();
    if (error) return { error: error.message };
    payload.id = data.id;
  }

  revalidateTag("blog", "max");
  revalidatePath("/admin/blog", "page");
  revalidatePath("/blog", "page");
  revalidatePath("/", "page");
  if (payload.slug) revalidatePath(`/blog/${payload.slug}`, "page");

  return { ok: true, id: payload.id };
}

export async function deleteBlogPost(id: string) {
  const supabase = await createClient();
  if (!supabase) return { error: "Supabase not configured." };
  const { error } = await supabase.from("blog_posts").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidateTag("blog", "max");
  revalidatePath("/admin/blog", "page");
  revalidatePath("/blog", "page");
  revalidatePath("/", "page");
  redirect("/admin/blog");
}

export async function toggleBlogFeatured(id: string, featured: boolean) {
  const supabase = await createClient();
  if (!supabase) return { error: "Supabase not configured." };
  const { error } = await supabase
    .from("blog_posts")
    .update({ featured, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) return { error: error.message };
  revalidateTag("blog", "max");
  revalidatePath("/admin/blog", "page");
  revalidatePath("/", "page");
  return { ok: true };
}
