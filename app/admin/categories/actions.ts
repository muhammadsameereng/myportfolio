"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { createClient } from "@/app/lib/supabase/server";

const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");

export async function saveCategory(input: {
  id?: string;
  name: string;
  slug?: string;
  color?: string | null;
  kind: "project" | "blog";
}) {
  const supabase = await createClient();
  if (!supabase) return { error: "Supabase not configured." };

  const payload = {
    name: input.name.trim(),
    slug: slugify(input.slug || input.name),
    color: input.color?.trim() || null,
    kind: input.kind,
  };

  if (input.id) {
    const { error } = await supabase
      .from("categories")
      .update(payload)
      .eq("id", input.id);
    if (error) return { error: error.message };
  } else {
    const { error } = await supabase
      .from("categories")
      .insert({ ...payload, created_at: new Date().toISOString() });
    if (error) return { error: error.message };
  }

  revalidateTag("categories", "max");
  revalidatePath("/admin/categories", "page");
  revalidatePath("/admin/projects", "page");
  revalidatePath("/admin/blog", "page");
  return { ok: true };
}

export async function deleteCategory(id: string) {
  const supabase = await createClient();
  if (!supabase) return { error: "Supabase not configured." };
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidateTag("categories", "max");
  revalidatePath("/admin/categories", "page");
  return { ok: true };
}
