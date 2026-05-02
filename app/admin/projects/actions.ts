"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/app/lib/supabase/server";

type ProjectInput = {
  id?: string;
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

function clean(input: ProjectInput): ProjectInput {
  return {
    ...input,
    slug: slugify(input.slug || input.title),
    title: input.title.trim(),
    description: input.description.trim(),
    long_description: input.long_description?.trim() || null,
    role: input.role?.trim() || null,
    live_url: input.live_url?.trim() || null,
    repo_url: input.repo_url?.trim() || null,
    tags: input.tags.map((t) => t.trim()).filter(Boolean),
    gallery_urls: (input.gallery_urls || [])
      .map((u) => u.trim())
      .filter(Boolean),
  };
}

export async function saveProject(input: ProjectInput) {
  const supabase = await createClient();
  if (!supabase) return { error: "Supabase not configured." };

  const payload = clean(input);
  const now = new Date().toISOString();
  const isPublishing =
    payload.status === "published" && (!payload.id || true);

  if (payload.id) {
    const { error } = await supabase
      .from("projects")
      .update({
        ...payload,
        updated_at: now,
        published_at: isPublishing ? now : null,
      })
      .eq("id", payload.id);
    if (error) return { error: error.message };
  } else {
    const { error, data } = await supabase
      .from("projects")
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

  revalidateTag("projects", "max");
  revalidatePath("/admin/projects", "page");
  revalidatePath("/projects", "page");
  revalidatePath("/", "page");
  if (payload.slug) revalidatePath(`/projects/${payload.slug}`, "page");

  return { ok: true, id: payload.id };
}

export async function deleteProject(id: string) {
  const supabase = await createClient();
  if (!supabase) return { error: "Supabase not configured." };
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidateTag("projects", "max");
  revalidatePath("/admin/projects", "page");
  revalidatePath("/projects", "page");
  revalidatePath("/", "page");
  redirect("/admin/projects");
}

export async function toggleProjectFeatured(id: string, featured: boolean) {
  const supabase = await createClient();
  if (!supabase) return { error: "Supabase not configured." };
  const { error } = await supabase
    .from("projects")
    .update({ featured, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) return { error: error.message };
  revalidateTag("projects", "max");
  revalidatePath("/admin/projects", "page");
  revalidatePath("/", "page");
  return { ok: true };
}
