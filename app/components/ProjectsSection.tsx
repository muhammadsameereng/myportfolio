"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

type Project = {
  category: string;
  title: string;
  description: string;
  tags: string[];
  thumbnail: string;
  href?: string;
};

// TODO: replace with real project data once Supabase is wired.
const projects: Project[] = [
  {
    category: "saas",
    title: "A quiet SaaS for loud industries.",
    description:
      "Rebuilt the tenancy model from the database up — onboarding a new team is now a three-field form.",
    tags: ["NestJS", "PostgreSQL", "RabbitMQ"],
    thumbnail:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&q=80&auto=format&fit=crop",
  },
  {
    category: "realtime",
    title: "A sync engine that doesn't lose writes.",
    description:
      "An event log between mobile and web that treats every connection as temporary and every write as a small, durable promise.",
    tags: ["NestJS", "React Native", "Redis"],
    thumbnail:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=900&q=80&auto=format&fit=crop",
  },
  {
    category: "healthcare",
    title: "Software for a clinic, not a textbook.",
    description:
      "A desktop tool that works in silence, keeps working when the fibre goes out, and syncs when it comes back.",
    tags: ["Electron", "TypeScript", "SQLite"],
    thumbnail:
      "https://images.unsplash.com/photo-1584982751601-97dcc096659c?w=900&q=80&auto=format&fit=crop",
  },
];

export default function ProjectsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="projects" className="relative pt-12 pb-24" ref={ref}>
      {/* Structural vertical rails */}
      <div className="pointer-events-none absolute inset-0 mx-auto max-w-6xl">
        <div className="absolute top-0 bottom-0 left-6 w-px bg-border/40 sm:left-8" />
        <div className="absolute top-0 bottom-0 right-6 w-px bg-border/40 sm:right-8" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6 sm:px-8">
        {/* Heading + whispered line */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="mb-3 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground"
        >
          <span className="h-px w-6 bg-border" />
          <span>work/</span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mb-12"
        >
          <h2 className="text-[32px] font-semibold leading-[1.1] tracking-tight text-foreground sm:text-[40px] lg:text-[44px]">
            Projects<span className="text-muted">.</span>
          </h2>
        </motion.div>

        {/* Projects — 3 columns, separated by hairlines */}
        <div className="grid border-t border-border/60 sm:grid-cols-3">
          {projects.map((p, i) => (
            <motion.a
              key={p.title}
              href={p.href || "#"}
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 + 0.12 * i }}
              className={`group relative flex flex-col ${
                i > 0
                  ? "border-t border-border/60 sm:border-t-0 sm:border-l sm:border-border/60"
                  : ""
              }`}
            >
              {/* Dashed border — reveals on hover (primary hover signal) */}
              <span className="pointer-events-none absolute inset-0 border border-dashed border-foreground/50 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

              {/* Foreground tick at top — the "entry marker" */}
              <span className="absolute -top-px left-5 z-10 h-[3px] w-8 bg-foreground" />

              {/* Image — clean, no overlays, gentle zoom on hover */}
              <div className="relative aspect-[16/9] w-full overflow-hidden border-b border-border/60 bg-card">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.thumbnail}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-[700ms] ease-out group-hover:scale-[1.04]"
                />
              </div>

              {/* Body — classic editorial hierarchy */}
              <div className="flex flex-1 flex-col px-5 pt-5 pb-5">
                {/* Category — same hairline+mono pattern as the rest of the page */}
                <div className="flex items-center gap-3">
                  <span className="h-px w-5 bg-border" />
                  <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
                    {p.category}
                    <span className="text-muted-foreground/70">/</span>
                  </span>
                </div>

                {/* Title */}
                <h3 className="mt-3 text-[19px] font-semibold leading-[1.3] tracking-tight text-foreground sm:text-[20px]">
                  {p.title}
                </h3>

                {/* Description — clamped to 2 lines so cards stay honest */}
                <p className="mt-3 line-clamp-2 text-[14px] leading-[1.65] text-muted">
                  {p.description}
                </p>

                {/* Tags + arrow — one footer row with hairline separator */}
                <div className="mt-5 flex items-center gap-3 border-t border-border/60 pt-4">
                  <div className="flex flex-wrap items-center">
                    {p.tags.map((t, j) => (
                      <span key={t} className="flex items-center">
                        {j > 0 && (
                          <span className="mx-2 h-3 w-px bg-border" />
                        )}
                        <span className="font-mono text-[11px] text-muted-foreground">
                          {t}
                        </span>
                      </span>
                    ))}
                  </div>
                  <span className="ml-auto font-mono text-[14px] text-muted-foreground transition-colors group-hover:text-foreground">
                    <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">
                      →
                    </span>
                  </span>
                </div>
              </div>
            </motion.a>
          ))}
        </div>

        {/* Archive link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 1.0 }}
          className="border-t border-border/60 pt-8"
        >
          <a
            href="/projects"
            className="group inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground"
          >
            <span className="h-px w-8 bg-border transition-all group-hover:w-14 group-hover:bg-foreground" />
            see all work
          </a>
        </motion.div>
      </div>
    </section>
  );
}
