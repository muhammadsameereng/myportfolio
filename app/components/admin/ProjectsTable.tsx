"use client";

import { ExternalLink, FolderKanban, Pencil } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { toggleProjectFeatured } from "@/app/admin/projects/actions";
import {
  EmptyState,
  FeaturedStar,
  PrimaryButton,
  StatusBadge,
} from "./AdminPrimitives";
import { useToast } from "./Toast";
import type { ProjectRow } from "@/app/lib/supabase/types";

export default function ProjectsTable({ rows }: { rows: ProjectRow[] }) {
  const [items, setItems] = useState(rows);
  const [, startTransition] = useTransition();
  const toast = useToast();

  const onToggleFeatured = (id: string, current: boolean) => {
    // Optimistic
    setItems((prev) =>
      prev.map((p) => (p.id === id ? { ...p, featured: !current } : p))
    );
    startTransition(async () => {
      const res = await toggleProjectFeatured(id, !current);
      if (res?.error) {
        // Roll back
        setItems((prev) =>
          prev.map((p) => (p.id === id ? { ...p, featured: current } : p))
        );
        toast.push(`Couldn't update featured: ${res.error}`, "error");
      } else {
        toast.push(
          !current ? "Featured on public site" : "Removed from featured",
          "success"
        );
      }
    });
  };

  if (items.length === 0) {
    return (
      <EmptyState
        icon={<FolderKanban size={20} strokeWidth={1.6} />}
        title="No projects yet"
        description="Add your first case study to start filling the public Projects page."
        action={{ label: "New project", href: "/admin/projects/new" }}
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      {/* Desktop header */}
      <div className="hidden grid-cols-[64px_1fr_120px_120px_60px_120px] items-center gap-4 border-b border-border bg-foreground/[0.02] px-4 py-3 text-[10.5px] font-medium uppercase tracking-[0.18em] text-muted-foreground md:grid">
        <span>Image</span>
        <span>Project</span>
        <span>Category</span>
        <span>Status</span>
        <span className="text-center">Featured</span>
        <span className="text-right">Actions</span>
      </div>

      <ul className="divide-y divide-border">
        {items.map((p) => (
          <li
            key={p.id}
            className="grid grid-cols-1 gap-3 px-4 py-4 md:grid-cols-[64px_1fr_120px_120px_60px_120px] md:items-center md:gap-4"
          >
            {/* Thumb */}
            <div className="flex md:block">
              <div className="h-12 w-12 overflow-hidden rounded-lg bg-muted/40 md:h-12 md:w-16">
                {p.thumb_url ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={p.thumb_url}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-muted-foreground/50">
                    <FolderKanban size={14} />
                  </div>
                )}
              </div>
            </div>

            {/* Title + slug */}
            <div className="min-w-0">
              <Link
                href={`/admin/projects/${p.id}/edit`}
                className="text-[13.5px] font-semibold text-foreground transition-colors hover:underline"
              >
                {p.title || "Untitled"}
              </Link>
              <p className="mt-0.5 truncate text-[11.5px] text-muted-foreground">
                /{p.slug || "no-slug"}
              </p>
            </div>

            {/* Category */}
            <div>
              {p.category ? (
                <span className="inline-flex h-6 items-center rounded-full bg-foreground/[0.05] px-2.5 text-[11px] font-medium text-foreground">
                  {p.category.name}
                </span>
              ) : (
                <span className="text-[11.5px] text-muted-foreground">—</span>
              )}
            </div>

            {/* Status */}
            <div>
              <StatusBadge status={p.status} />
            </div>

            {/* Featured */}
            <div className="flex justify-center">
              <FeaturedStar
                featured={p.featured}
                onToggle={() => onToggleFeatured(p.id, p.featured)}
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-1.5">
              {p.status === "published" && p.slug && (
                <Link
                  href={`/projects/${p.slug}`}
                  target="_blank"
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-foreground/[0.06] hover:text-foreground"
                  title="View on public site"
                >
                  <ExternalLink size={13} strokeWidth={1.8} />
                </Link>
              )}
              <Link
                href={`/admin/projects/${p.id}/edit`}
                className="inline-flex h-8 cursor-pointer items-center gap-1 rounded-lg border border-border bg-background px-2.5 text-[11.5px] font-medium text-foreground transition-colors hover:border-foreground/40 hover:bg-card"
              >
                <Pencil size={11} />
                Edit
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ProjectsListHeader({ count }: { count: number }) {
  return (
    <div className="flex items-center justify-between">
      <p className="text-[12.5px] text-muted-foreground">
        {count} {count === 1 ? "project" : "projects"} total
      </p>
      <PrimaryButton href="/admin/projects/new">
        <span>+</span> New project
      </PrimaryButton>
    </div>
  );
}
