"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { Project } from "../lib/projects";
import SectionHead from "./SectionHead";

const PAGE_SIZE = 9;

export default function ProjectsPageContent({
  projects,
  categories,
}: {
  projects: Project[];
  categories: string[];
}) {
  const allCategories = useMemo(() => ["All", ...categories], [categories]);
  const [active, setActive] = useState<string>("All");
  const [showAll, setShowAll] = useState(false);

  const filtered = useMemo(
    () =>
      active === "All"
        ? projects
        : projects.filter((p) => p.category === active),
    [active, projects]
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
          title="Projects"
          description="A selection of work across SaaS, web, desktop, mobile, and e-commerce. Filter by category or browse the lot."
        />

        {/* Category pills */}
        <div className="mt-8 flex flex-wrap items-center gap-2">
          {allCategories.map((c) => {
            const isActive = active === c;
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
                {c !== "All" && (
                  <span
                    className={`ml-1.5 text-[10.5px] tabular-nums ${
                      isActive ? "text-background/65" : "text-muted-foreground"
                    }`}
                  >
                    {projects.filter((p) => p.category === c).length}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Grid */}
        <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-7 md:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {visible.map((p, i) => (
              <motion.div
                key={p.slug}
                layout
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4, delay: 0.04 * i }}
                whileHover={{ y: -3 }}
              >
                <Link href={`/projects/${p.slug}`} className="group flex flex-col">
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border bg-muted/30 transition-all duration-300 group-hover:border-accent/45 group-hover:shadow-[0_18px_44px_-18px_rgb(var(--bg-teal)/0.5)]">
                    <Image
                      src={p.thumb}
                      alt={`${p.title} — ${p.category} project by Muhammad Sameer`}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 320px"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                    />
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                      style={{
                        background:
                          "linear-gradient(to top, rgb(var(--bg-teal) / 0.28), transparent 55%)",
                      }}
                    />
                    <span className="absolute top-2.5 left-2.5 rounded-full border border-border/60 bg-background/85 px-2 py-0.5 text-[10.5px] font-medium uppercase tracking-wider text-foreground backdrop-blur-sm">
                      {p.category}
                    </span>
                  </div>
                  <p className="mt-2.5 line-clamp-2 text-[12.5px] leading-snug text-foreground transition-colors group-hover:text-accent">
                    {p.title}
                  </p>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filtered.length === 0 && (
          <p className="mt-12 text-center text-[13.5px] text-muted-foreground">
            Nothing here yet in <span className="font-semibold text-foreground">{active}</span>.
          </p>
        )}

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
              You&apos;ve reached the end — {filtered.length} projects shown.
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
