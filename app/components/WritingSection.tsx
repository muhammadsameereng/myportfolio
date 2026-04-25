"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

type Post = {
  date: string;
  readingTime: string;
  title: string;
  excerpt: string;
  href?: string;
};

// TODO: replace with Supabase-backed posts.
const posts: Post[] = [
  {
    date: "Mar 2026",
    readingTime: "6 min",
    title: "Why I stopped reaching for the monolith first",
    excerpt:
      "Queues aren't clever. They're just honest about the parts of your system that were always asynchronous, whether you admitted it or not.",
  },
  {
    date: "Feb 2026",
    readingTime: "4 min",
    title: "Kashmir, the internet, and the long path here",
    excerpt:
      "A short note on building a career from a place where the internet goes down more than it should, and why it shapes the way I think about reliability.",
  },
  {
    date: "Jan 2026",
    readingTime: "8 min",
    title: "NestJS patterns I actually reach for",
    excerpt:
      "Modules, providers, guards — the framework gives you a lot. Here's the subset I keep returning to after twenty production apps.",
  },
];

export default function WritingSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="blog" className="relative px-6 py-24" ref={ref}>
      <div className="pointer-events-none absolute inset-0 mx-auto max-w-5xl">
        <div className="absolute top-0 bottom-0 left-6 w-px bg-border/40 sm:left-8" />
        <div className="absolute top-0 bottom-0 right-6 w-px bg-border/40 sm:right-8" />
      </div>

      <div className="relative z-10 mx-auto max-w-3xl">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3"
        >
          <span className="h-px w-10 bg-foreground" />
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            /writing
          </span>
        </motion.div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8 mb-10"
        >
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Thinking out loud
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
            Notes from the workbench — on systems I&apos;m building, mistakes
            I&apos;ve made, and the small ideas that stuck with me.
          </p>
        </motion.div>

        {/* Post list — hairlines only */}
        <div>
          {posts.map((post, i) => (
            <motion.a
              key={post.title}
              href={post.href || "#"}
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 + 0.1 * i }}
              className="group block border-t border-border/60 py-7 transition-colors duration-200 hover:bg-card/30 sm:grid sm:grid-cols-[160px_1fr] sm:gap-8"
            >
              {/* Meta column */}
              <div className="flex items-center gap-3 font-mono text-[11px] text-muted-foreground">
                <span>{post.date}</span>
                <span className="h-3 w-px bg-border" />
                <span>{post.readingTime}</span>
              </div>

              {/* Content */}
              <div className="mt-3 sm:mt-0">
                <h3 className="text-lg font-semibold tracking-tight text-foreground">
                  {post.title}
                </h3>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
                  {post.excerpt}
                </p>
              </div>
            </motion.a>
          ))}
          <div className="border-t border-border/60" />
        </div>

        {/* View all */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-8"
        >
          <a
            href="/blog"
            className="group inline-flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground"
          >
            <span className="h-px w-8 bg-border transition-all group-hover:w-14 group-hover:bg-foreground" />
            read all
          </a>
        </motion.div>
      </div>
    </section>
  );
}
