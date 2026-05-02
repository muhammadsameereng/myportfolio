"use client";

import { Copy, ImageIcon, Trash2, Upload } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { createClient } from "@/app/lib/supabase/client";
import {
  EmptyState,
  GhostButton,
  PrimaryButton,
} from "./AdminPrimitives";
import { useToast } from "./Toast";

type Item = { name: string; url: string; size: number; createdAt: string };

const BUCKET = "media";
const PAGE_SIZE = 10;

export default function MediaLibrary() {
  const supabase = createClient();
  const toast = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const refresh = async () => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase.storage
      .from(BUCKET)
      .list("uploads", {
        limit: 100,
        sortBy: { column: "created_at", order: "desc" },
      });
    const project = await supabase.storage
      .from(BUCKET)
      .list("projects", {
        limit: 100,
        sortBy: { column: "created_at", order: "desc" },
      });
    const blog = await supabase.storage
      .from(BUCKET)
      .list("blog", {
        limit: 100,
        sortBy: { column: "created_at", order: "desc" },
      });
    if (error) toast.push(error.message, "error");

    type FileLike = {
      name: string;
      created_at?: string | null;
      metadata?: { size?: number } | null;
    };
    const all: Item[] = [];
    const collectFrom = (list: FileLike[] | null, folder: string) => {
      (list || []).forEach((f) => {
        const path = `${folder}/${f.name}`;
        const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);
        all.push({
          name: f.name,
          url: pub.publicUrl,
          size: f.metadata?.size || 0,
          createdAt: f.created_at || "",
        });
      });
    };
    collectFrom(data as FileLike[] | null, "uploads");
    collectFrom(project.data as FileLike[] | null, "projects");
    collectFrom(blog.data as FileLike[] | null, "blog");
    all.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
    setItems(all);
    // Reset paging on every refresh so users always start at page 1.
    setVisibleCount(PAGE_SIZE);
    setLoading(false);
  };

  useEffect(() => {
    queueMicrotask(refresh);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const upload = async (files: FileList | null) => {
    if (!files || !supabase) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        if (file.size > 20 * 1024 * 1024) {
          toast.push(`${file.name} is over 20MB — skipped`, "error");
          continue;
        }
        const ext = file.name.split(".").pop() || "png";
        const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
        const { error } = await supabase.storage
          .from(BUCKET)
          .upload(`uploads/${filename}`, file, { cacheControl: "31536000" });
        if (error) toast.push(error.message, "error");
      }
      toast.push("Upload complete", "success");
      await refresh();
    } finally {
      setUploading(false);
    }
  };

  const remove = async (item: Item) => {
    if (!supabase) return;
    if (!confirm(`Delete "${item.name}"?`)) return;
    const folder = ["uploads", "projects", "blog"].find((f) =>
      item.url.includes(`/${f}/`)
    );
    if (!folder) return;
    const { error } = await supabase.storage
      .from(BUCKET)
      .remove([`${folder}/${item.name}`]);
    if (error) toast.push(error.message, "error");
    else {
      toast.push("Deleted", "success");
      await refresh();
    }
  };

  const copy = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast.push("URL copied", "success");
    } catch {
      toast.push("Copy failed", "error");
    }
  };

  const visibleItems = items.slice(0, visibleCount);
  const hasMore = !loading && items.length > visibleCount;
  const remaining = Math.max(items.length - visibleCount, 0);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 md:px-10">
        <p className="text-[12.5px] text-muted-foreground">
          {loading ? (
            <span className="inline-block h-3 w-32 animate-pulse rounded-full bg-foreground/[0.08]" />
          ) : items.length === 0 ? (
            "0 files in storage"
          ) : (
            `Showing ${visibleItems.length} of ${items.length} ${
              items.length === 1 ? "file" : "files"
            }`
          )}
        </p>
        <div className="flex items-center gap-2.5">
          <GhostButton onClick={refresh} disabled={loading}>
            Refresh
          </GhostButton>
          <PrimaryButton
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
          >
            <Upload size={13} />
            {uploading ? "Uploading…" : "Upload"}
          </PrimaryButton>
        </div>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          upload(e.target.files);
          e.target.value = "";
        }}
      />

      <div className="px-6 pb-12 md:px-10">
        {loading ? (
          <MediaSkeleton />
        ) : items.length === 0 ? (
          <EmptyState
            icon={<ImageIcon size={20} strokeWidth={1.6} />}
            title="No media yet"
            description="Upload images here, or directly inside the project / blog editors."
          />
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {visibleItems.map((item, i) => (
                <div
                  key={item.url}
                  className="group overflow-hidden rounded-2xl border border-border bg-card"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted/30">
                    <Image
                      src={item.url}
                      alt={item.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      // First row above the fold gets fetched eagerly so the
                      // grid paints fast on page load. Everything below uses
                      // native lazy loading via next/image's defaults.
                      priority={i < 4}
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    />
                  </div>
                  <div className="flex items-center justify-between gap-2 px-3 py-2.5">
                    <p className="min-w-0 truncate text-[11.5px] text-muted-foreground">
                      {item.name}
                    </p>
                    <div className="flex shrink-0 items-center gap-0.5">
                      <button
                        type="button"
                        onClick={() => copy(item.url)}
                        className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-foreground/[0.06] hover:text-foreground"
                        title="Copy URL"
                      >
                        <Copy size={12} />
                      </button>
                      <button
                        type="button"
                        onClick={() => remove(item)}
                        className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-rose-500/10 hover:text-rose-600"
                        title="Delete"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {hasMore && (
              <div className="mt-8 flex justify-center">
                <button
                  type="button"
                  onClick={() =>
                    setVisibleCount((c) =>
                      Math.min(c + PAGE_SIZE, items.length)
                    )
                  }
                  className="group inline-flex h-10 cursor-pointer items-center gap-2 rounded-full border border-border bg-background px-5 text-[13px] font-medium text-foreground transition-colors duration-200 hover:border-foreground/50 hover:bg-card"
                >
                  Load {Math.min(PAGE_SIZE, remaining)} more
                  <span className="rounded-full bg-foreground/[0.06] px-2 py-0.5 text-[10.5px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
                    {remaining} left
                  </span>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

/* ── Skeleton — matches the real grid so the layout doesn't jump ── */
function MediaSkeleton() {
  return (
    <div
      className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
      aria-hidden
    >
      {Array.from({ length: PAGE_SIZE }).map((_, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-2xl border border-border bg-card"
        >
          <div className="aspect-[4/3] w-full animate-pulse bg-foreground/[0.05]" />
          <div className="flex items-center justify-between gap-2 px-3 py-2.5">
            <span className="h-3 w-2/3 animate-pulse rounded-full bg-foreground/[0.06]" />
            <span className="flex shrink-0 gap-1">
              <span className="h-5 w-5 animate-pulse rounded bg-foreground/[0.06]" />
              <span className="h-5 w-5 animate-pulse rounded bg-foreground/[0.06]" />
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
