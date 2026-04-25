"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { deleteBlogPost, saveBlogPost } from "@/app/admin/blog/actions";
import type { BlogPostRow, CategoryRow } from "@/app/lib/supabase/types";
import {
  DangerButton,
  GhostButton,
  PageHeader,
  PrimaryButton,
} from "./AdminPrimitives";
import {
  CategorySelect,
  Field,
  ImageUploader,
  MarkdownEditor,
  TagInput,
  TextInput,
  Textarea,
  Toggle,
} from "./FormFields";
import { useToast } from "./Toast";

const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const today = () => new Date().toISOString().slice(0, 10);

export default function BlogEditor({
  initial,
  categories,
}: {
  initial?: BlogPostRow;
  categories: CategoryRow[];
}) {
  const router = useRouter();
  const toast = useToast();
  const [pending, startTransition] = useTransition();
  const [deleting, startDelete] = useTransition();

  const [title, setTitle] = useState(initial?.title || "");
  const [slug, setSlug] = useState(initial?.slug || "");
  const [slugTouched, setSlugTouched] = useState(!!initial?.slug);
  const [excerpt, setExcerpt] = useState(initial?.excerpt || "");
  const [body, setBody] = useState(initial?.body || "");
  const [date, setDate] = useState(initial?.date || today());
  const [readTime, setReadTime] = useState(initial?.read_time || "");
  const [thumbUrl, setThumbUrl] = useState<string | null>(initial?.thumb_url || null);
  const [tags, setTags] = useState<string[]>(initial?.tags || []);
  const [categoryId, setCategoryId] = useState<string | null>(
    initial?.category_id || null
  );
  const [featured, setFeatured] = useState(initial?.featured || false);

  const submit = (status: "draft" | "published") => {
    if (!title.trim()) {
      toast.push("Title is required", "error");
      return;
    }
    startTransition(async () => {
      const res = await saveBlogPost({
        id: initial?.id,
        slug: slug || slugify(title),
        title,
        excerpt,
        body: body || null,
        date,
        read_time: readTime || null,
        thumb_url: thumbUrl,
        tags,
        category_id: categoryId,
        featured,
        status,
      });
      if (res.error) {
        toast.push(res.error, "error");
        return;
      }
      toast.push(
        status === "published" ? "Post published" : "Saved as draft",
        "success"
      );
      if (!initial?.id && res.id) {
        router.push(`/admin/blog/${res.id}/edit`);
      } else {
        router.refresh();
      }
    });
  };

  const remove = () => {
    if (!initial?.id) return;
    if (
      !confirm(
        `Delete "${title || "this post"}"? This cannot be undone, and the public page will 404.`
      )
    )
      return;
    startDelete(async () => {
      const res = await deleteBlogPost(initial.id);
      if (res?.error) toast.push(res.error, "error");
    });
  };

  return (
    <>
      <PageHeader
        title={initial ? "Edit blog post" : "New blog post"}
        description={
          initial
            ? "Make changes and save — published changes go live instantly."
            : "Write your post and choose to save as draft or publish immediately."
        }
        back={{ label: "Back to blog", href: "/admin/blog" }}
        actions={
          <>
            <GhostButton onClick={() => submit("draft")} disabled={pending || deleting}>
              {pending ? "Saving…" : "Save draft"}
            </GhostButton>
            <PrimaryButton
              onClick={() => submit("published")}
              disabled={pending || deleting}
            >
              {pending ? "Publishing…" : "Publish"}
            </PrimaryButton>
          </>
        }
      />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit("published");
        }}
        className="mx-auto max-w-6xl px-6 py-8 md:px-10 md:py-10"
      >
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="space-y-6">
            <Field label="Title" required>
              <TextInput
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (!slugTouched) setSlug(slugify(e.target.value));
                }}
                placeholder="Why I Stopped Reaching for the Monolith First"
              />
            </Field>

            <Field label="Slug" hint="Auto-generated from title">
              <TextInput
                value={slug}
                onChange={(e) => {
                  setSlug(slugify(e.target.value));
                  setSlugTouched(true);
                }}
                placeholder="why-i-stopped-reaching-for-the-monolith-first"
              />
            </Field>

            <Field label="Excerpt" hint="The hook visible on cards" required>
              <Textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows={3}
                placeholder="A short paragraph that pulls a reader in."
              />
            </Field>

            <Field label="Cover image">
              <ImageUploader value={thumbUrl} onChange={setThumbUrl} pathPrefix="blog" />
            </Field>

            <Field label="Body" hint="Markdown — full preview available">
              <MarkdownEditor value={body} onChange={setBody} rows={16} />
            </Field>
          </div>

          <aside className="space-y-6">
            <Field label="Category">
              <CategorySelect
                value={categoryId}
                onChange={setCategoryId}
                categories={categories}
              />
            </Field>

            <Field label="Tags" hint="Press enter or comma">
              <TagInput value={tags} onChange={setTags} />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Date">
                <TextInput
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </Field>
              <Field label="Read time">
                <TextInput
                  value={readTime}
                  onChange={(e) => setReadTime(e.target.value)}
                  placeholder="6 min"
                />
              </Field>
            </div>

            <Toggle
              checked={featured}
              onChange={setFeatured}
              label="Feature this post"
              description="Featured posts can be queried separately on the public site."
            />

            {initial && (
              <div className="border-t border-border pt-6">
                <p className="mb-3 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  Danger zone
                </p>
                <DangerButton onClick={remove} disabled={deleting || pending}>
                  {deleting ? "Deleting…" : "Delete post"}
                </DangerButton>
              </div>
            )}
          </aside>
        </div>
      </form>
    </>
  );
}
