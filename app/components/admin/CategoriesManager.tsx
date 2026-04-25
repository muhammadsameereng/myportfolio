"use client";

import { motion } from "framer-motion";
import { Plus, Tags, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { deleteCategory, saveCategory } from "@/app/admin/categories/actions";
import type { CategoryRow } from "@/app/lib/supabase/types";
import {
  EmptyState,
  GhostButton,
  PrimaryButton,
} from "./AdminPrimitives";
import { Field, TextInput } from "./FormFields";
import { useToast } from "./Toast";

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-");

export default function CategoriesManager({
  initial,
}: {
  initial: CategoryRow[];
}) {
  const router = useRouter();
  const toast = useToast();
  const [pending, startTransition] = useTransition();
  const [editing, setEditing] = useState<CategoryRow | null>(null);
  const [adding, setAdding] = useState<"project" | "blog" | null>(null);

  const projects = initial.filter((c) => c.kind === "project");
  const blogs = initial.filter((c) => c.kind === "blog");

  const onSave = (input: {
    id?: string;
    name: string;
    slug?: string;
    color: string | null;
    kind: "project" | "blog";
  }) => {
    if (!input.name.trim()) {
      toast.push("Name is required", "error");
      return;
    }
    startTransition(async () => {
      const res = await saveCategory(input);
      if (res?.error) toast.push(res.error, "error");
      else {
        toast.push(input.id ? "Category updated" : "Category created", "success");
        setEditing(null);
        setAdding(null);
        router.refresh();
      }
    });
  };

  const onDelete = (id: string, name: string) => {
    if (
      !confirm(
        `Delete category "${name}"? Items currently in this category will become uncategorised.`
      )
    )
      return;
    startTransition(async () => {
      const res = await deleteCategory(id);
      if (res?.error) toast.push(res.error, "error");
      else {
        toast.push("Category deleted", "success");
        router.refresh();
      }
    });
  };

  return (
    <div className="space-y-10">
      <CategoryGroup
        title="Project categories"
        kind="project"
        items={projects}
        onAdd={() => setAdding("project")}
        onEdit={setEditing}
        onDelete={onDelete}
      />
      <CategoryGroup
        title="Blog categories"
        kind="blog"
        items={blogs}
        onAdd={() => setAdding("blog")}
        onEdit={setEditing}
        onDelete={onDelete}
      />

      {(editing || adding) && (
        <CategoryDialog
          initial={editing}
          kind={editing?.kind || adding!}
          pending={pending}
          onSave={onSave}
          onCancel={() => {
            setEditing(null);
            setAdding(null);
          }}
        />
      )}
    </div>
  );
}

function CategoryGroup({
  title,
  kind,
  items,
  onAdd,
  onEdit,
  onDelete,
}: {
  title: string;
  kind: "project" | "blog";
  items: CategoryRow[];
  onAdd: () => void;
  onEdit: (c: CategoryRow) => void;
  onDelete: (id: string, name: string) => void;
}) {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-[16px] font-semibold tracking-tight text-foreground">
            {title}
          </h2>
          <p className="mt-1 text-[12px] text-muted-foreground">
            Used to organise {kind === "project" ? "projects" : "blog posts"} in
            the admin and on the public site.
          </p>
        </div>
        <PrimaryButton onClick={onAdd}>
          <Plus size={13} />
          New
        </PrimaryButton>
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon={<Tags size={20} strokeWidth={1.6} />}
          title={`No ${kind} categories yet`}
          description="Create one to start grouping your content."
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <ul className="divide-y divide-border">
            {items.map((c) => (
              <li
                key={c.id}
                className="flex items-center gap-3 px-4 py-3.5"
              >
                <span
                  aria-hidden="true"
                  className="h-3 w-3 shrink-0 rounded-full"
                  style={{
                    backgroundColor: c.color || "var(--foreground)",
                    opacity: c.color ? 1 : 0.3,
                  }}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-[13.5px] font-medium text-foreground">
                    {c.name}
                  </p>
                  <p className="mt-0.5 text-[11.5px] text-muted-foreground">
                    /{c.slug}
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onEdit(c)}
                    className="inline-flex h-8 cursor-pointer items-center rounded-lg border border-border bg-background px-3 text-[11.5px] font-medium text-foreground transition-colors hover:border-foreground/40 hover:bg-card"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(c.id, c.name)}
                    className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-rose-500/10 hover:text-rose-600"
                    title="Delete"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

function CategoryDialog({
  initial,
  kind,
  pending,
  onSave,
  onCancel,
}: {
  initial: CategoryRow | null;
  kind: "project" | "blog";
  pending: boolean;
  onSave: (i: {
    id?: string;
    name: string;
    slug?: string;
    color: string | null;
    kind: "project" | "blog";
  }) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(initial?.name || "");
  const [slug, setSlug] = useState(initial?.slug || "");
  const [slugTouched, setSlugTouched] = useState(!!initial?.slug);
  const [color, setColor] = useState(initial?.color || "");

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/30 p-4 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 12, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl"
      >
        <h3 className="text-[16px] font-semibold tracking-tight text-foreground">
          {initial ? "Edit category" : "New category"}
        </h3>
        <p className="mt-1 text-[12.5px] text-muted-foreground">
          {kind === "project" ? "Project category" : "Blog category"}
        </p>

        <div className="mt-5 space-y-4">
          <Field label="Name" required>
            <TextInput
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (!slugTouched) setSlug(slugify(e.target.value));
              }}
              placeholder="SaaS"
              autoFocus
            />
          </Field>

          <Field label="Slug" hint="URL-safe — auto from name">
            <TextInput
              value={slug}
              onChange={(e) => {
                setSlug(slugify(e.target.value));
                setSlugTouched(true);
              }}
              placeholder="saas"
            />
          </Field>

          <Field label="Colour" hint="Optional hex — used for chip styling">
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={color || "#6b6b6b"}
                onChange={(e) => setColor(e.target.value)}
                className="h-10 w-12 cursor-pointer rounded-xl border border-border bg-background"
              />
              <TextInput
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="#6b6b6b"
              />
            </div>
          </Field>
        </div>

        <div className="mt-6 flex items-center justify-end gap-2.5">
          <GhostButton onClick={onCancel} disabled={pending}>
            Cancel
          </GhostButton>
          <PrimaryButton
            onClick={() =>
              onSave({
                id: initial?.id,
                name,
                slug,
                color: color || null,
                kind,
              })
            }
            disabled={pending}
          >
            {pending ? "Saving…" : "Save"}
          </PrimaryButton>
        </div>
      </motion.div>
    </div>
  );
}
