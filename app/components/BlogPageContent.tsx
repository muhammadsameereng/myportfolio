"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { BlogPost } from "../lib/blogs";
import SectionHead from "./SectionHead";

const PAGE_SIZE = 9;

export default function BlogPageContent({
  posts,
  categories,
}: {
  posts: BlogPost[];
  categories: string[];
}) {
  const allCategories = useMemo(() => ["All", ...categories], [categories]);
  const [active, setActive] = useState<string>("All");
  const [showAll, setShowAll] = useState(false);

  const filtered = useMemo(
    () =>
      active === "All"
        ? posts
        : posts.filter((p) => p.category === active),
    [active, posts]
  );

  const visible = showAll ? filtered : filtered.slice(0, PAGE_SIZE);
  const hasMore = !showAll && filtered.length > PAGE_SIZE;

  const onPickCategory = (c: string) => {
    setActive(c);
    setShowAll(false);
  };

  return (
    <section className="relative">
      <div className="mx-auto max-w-5xl px-6 py-16 md:py-20">
        <SectionHead
          title="Blog"
          description="Notes from the workbench — short writing on backend systems, frontend patterns, the path from Kashmir, and the quiet parts of building software."
        />

        {/* Category pills — only render when there's more than one option */}
        {categories.length > 1 && (
          <div className="mt-8 flex flex-wrap items-center gap-2">
            {allCategories.map((c) => {
              const isActive = active === c;
              const count =
                c === "All"
                  ? posts.length
                  : posts.filter((p) => p.category === c).length;
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => onPickCategory(c)}
                  className={`relative inline-flex h-8 cursor-pointer items-center rounded-full px-4 text-[12.5px] font-medium transition-colors duration-200 ${
                    isActive
                      ? "bg-foreground text-background"
                      : "border border-border bg-background text-foreground/75 hover:border-foreground/40 hover:text-foreground"
                  }`}
                >
                  {c}
                  <span
                    className={`ml-1.5 text-[10.5px] tabular-nums ${
                      isActive ? "text-background/65" : "text-muted-foreground"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* List */}
        <div className="mt-10 divide-y divide-border/60">
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((p, i) => (
              <motion.div
                key={p.slug}
                layout
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4, delay: 0.04 * i }}
              >
                <Link
                  href={`/blog/${p.slug}`}
                  className="group grid grid-cols-1 gap-5 py-7 sm:grid-cols-[1fr_auto] sm:gap-8"
                >
                  <div className="min-w-0">
                    <h3 className="text-[18px] font-semibold leading-snug tracking-tight text-foreground transition-colors group-hover:underline">
                      {p.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-[13.5px] leading-relaxed text-muted-foreground">
                      {p.excerpt}
                    </p>
                    <div className="mt-3 flex items-center gap-3 text-[11.5px] uppercase tracking-[0.18em] text-muted-foreground">
                      <time dateTime={p.isoDate}>{p.date}</time>
                      <span className="h-3 w-px bg-border" />
                      <span>{p.readTime}</span>
                      {p.tags[0] && (
                        <>
                          <span className="h-3 w-px bg-border" />
                          <span className="text-foreground/75">{p.tags[0]}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="relative h-[120px] w-full overflow-hidden rounded-xl bg-muted/30 sm:h-[120px] sm:w-[160px]">
                    <Image
                      src={p.thumb}
                      alt=""
                      fill
                      loading="lazy"
                      sizes="(max-width: 640px) 100vw, 160px"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                    />
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Load more */}
        <div className="mt-10 flex items-center justify-center">
          {hasMore ? (
            <motion.button
              type="button"
              onClick={() => setShowAll(true)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex h-10 cursor-pointer items-center rounded-full bg-foreground px-5 text-[13px] font-medium text-background transition-opacity hover:opacity-95"
            >
              Load more
              <span className="ml-2 text-[11px] text-background/70">
                +{filtered.length - PAGE_SIZE}
              </span>
            </motion.button>
          ) : filtered.length > PAGE_SIZE ? (
            <p className="text-[12px] text-muted-foreground">
              You&apos;ve reached the end — {filtered.length} posts shown.
            </p>
          ) : null}
        </div>

        {filtered.length === 0 && (
          <p className="mt-12 text-center text-[13.5px] text-muted-foreground">
            Nothing here yet in{" "}
            <span className="font-semibold text-foreground">{active}</span>.
          </p>
        )}
      </div>
    </section>
  );
}
