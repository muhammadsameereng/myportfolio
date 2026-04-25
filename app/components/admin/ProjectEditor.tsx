"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { deleteProject, saveProject } from "@/app/admin/projects/actions";
import type { CategoryRow, ProjectRow } from "@/app/lib/supabase/types";
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

export default function ProjectEditor({
  initial,
  categories,
}: {
  initial?: ProjectRow;
  categories: CategoryRow[];
}) {
  const router = useRouter();
  const toast = useToast();
  const [pending, startTransition] = useTransition();
  const [deleting, startDelete] = useTransition();

  const [title, setTitle] = useState(initial?.title || "");
  const [slug, setSlug] = useState(initial?.slug || "");
  const [slugTouched, setSlugTouched] = useState(!!initial?.slug);
  const [description, setDescription] = useState(initial?.description || "");
  const [longDescription, setLongDescription] = useState(
    initial?.long_description || ""
  );
  const [categoryId, setCategoryId] = useState<string | null>(
    initial?.category_id || null
  );
  const [tags, setTags] = useState<string[]>(initial?.tags || []);
  const [thumbUrl, setThumbUrl] = useState<string | null>(initial?.thumb_url || null);
  const [year, setYear] = useState<string>(
    initial?.year ? String(initial.year) : new Date().getFullYear().toString()
  );
  const [role, setRole] = useState(initial?.role || "");
  const [liveUrl, setLiveUrl] = useState(initial?.live_url || "");
  const [repoUrl, setRepoUrl] = useState(initial?.repo_url || "");
  const [featured, setFeatured] = useState(initial?.featured || false);

  const submit = (status: "draft" | "published") => {
    if (!title.trim()) {
      toast.push("Title is required", "error");
      return;
    }
    startTransition(async () => {
      const res = await saveProject({
        id: initial?.id,
        slug: slug || slugify(title),
        title,
        description,
        long_description: longDescription || null,
        category_id: categoryId,
        tags,
        thumb_url: thumbUrl,
        year: year ? parseInt(year, 10) : null,
        role: role || null,
        live_url: liveUrl || null,
        repo_url: repoUrl || null,
        featured,
        status,
      });
      if (res.error) {
        toast.push(res.error, "error");
        return;
      }
      toast.push(
        status === "published" ? "Project published" : "Saved as draft",
        "success"
      );
      if (!initial?.id && res.id) {
        router.push(`/admin/projects/${res.id}/edit`);
      } else {
        router.refresh();
      }
    });
  };

  const remove = () => {
    if (!initial?.id) return;
    if (
      !confirm(
        `Delete "${title || "this project"}"? This cannot be undone, and the public page will 404.`
      )
    )
      return;
    startDelete(async () => {
      const res = await deleteProject(initial.id);
      if (res?.error) toast.push(res.error, "error");
    });
  };

  return (
    <>
      <PageHeader
        title={initial ? "Edit project" : "New project"}
        description={
          initial
            ? "Make changes and save — published changes go live instantly."
            : "Fill in the details and choose to save as draft or publish immediately."
        }
        back={{ label: "Back to projects", href: "/admin/projects" }}
        actions={
          <>
            <GhostButton
              onClick={() => submit("draft")}
              disabled={pending || deleting}
            >
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
          {/* ── Main column ─────────────────────────────── */}
          <div className="space-y-6">
            <Field label="Title" required>
              <TextInput
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (!slugTouched) setSlug(slugify(e.target.value));
                }}
                placeholder="Multi-Tenant Learning Management System"
              />
            </Field>

            <Field
              label="Slug"
              hint="Auto-generated from title — edit if needed"
            >
              <TextInput
                value={slug}
                onChange={(e) => {
                  setSlug(slugify(e.target.value));
                  setSlugTouched(true);
                }}
                placeholder="multi-tenant-lms"
              />
            </Field>

            <Field
              label="Short description"
              hint="One line — used on cards"
              required
            >
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                placeholder="A SaaS LMS that lets each institute brand, configure, and run their own classrooms — without forking the codebase."
              />
            </Field>

            <Field label="Hero image">
              <ImageUploader value={thumbUrl} onChange={setThumbUrl} pathPrefix="projects" />
            </Field>

            <Field
              label="Long description"
              hint="Markdown supported — use the Preview tab to check"
            >
              <MarkdownEditor value={longDescription} onChange={setLongDescription} />
            </Field>
          </div>

          {/* ── Sidebar ─────────────────────────────────── */}
          <aside className="space-y-6">
            <Field label="Category">
              <CategorySelect
                value={categoryId}
                onChange={setCategoryId}
                categories={categories}
              />
            </Field>

            <Field label="Tags" hint="Press enter or comma to add">
              <TagInput value={tags} onChange={setTags} />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Year">
                <TextInput
                  value={year}
                  onChange={(e) =>
                    setYear(e.target.value.replace(/[^0-9]/g, "").slice(0, 4))
                  }
                  inputMode="numeric"
                  placeholder="2026"
                />
              </Field>
              <Field label="Role">
                <TextInput
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="Lead engineer"
                />
              </Field>
            </div>

            <Field label="Live URL">
              <TextInput
                value={liveUrl}
                onChange={(e) => setLiveUrl(e.target.value)}
                type="url"
                placeholder="https://"
              />
            </Field>

            <Field label="Repository URL">
              <TextInput
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                type="url"
                placeholder="https://github.com/..."
              />
            </Field>

            <Toggle
              checked={featured}
              onChange={setFeatured}
              label="Feature this project"
              description="Featured projects can be queried separately on the public site."
            />

            {initial && (
              <div className="border-t border-border pt-6">
                <p className="mb-3 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  Danger zone
                </p>
                <DangerButton onClick={remove} disabled={deleting || pending}>
                  {deleting ? "Deleting…" : "Delete project"}
                </DangerButton>
              </div>
            )}
          </aside>
        </div>
      </form>
    </>
  );
}
