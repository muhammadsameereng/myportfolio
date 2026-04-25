"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

type Post = {
  date: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  href?: string;
};

// TODO: replace with real posts once Supabase is wired.
const posts: Post[] = [
  {
    date: "2026 · 03 · 12",
    category: "distributed systems",
    title: "Why I stopped reaching for the monolith first.",
    excerpt:
      "Queues aren't clever. They're just honest about the parts of your system that were always asynchronous — whether you admitted it or not.",
    readTime: "6 min",
  },
  {
    date: "2026 · 02 · 04",
    category: "personal",
    title: "Kashmir, the internet, and the long path here.",
    excerpt:
      "A short note on building a career from a place where the internet goes down more than it should, and why it shapes the way I think about reliability.",
    readTime: "4 min",
  },
  {
    date: "2026 · 01 · 18",
    category: "nestjs",
    title: "The NestJS patterns I actually reach for.",
    excerpt:
      "Modules, providers, guards — the framework gives you a lot. Here's the subset I keep returning to after twenty production apps.",
    readTime: "8 min",
  },
];

export default function BlogsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="blog" className="relative pt-12 pb-24" ref={ref}>
      {/* Structural vertical rails */}
      <div className="pointer-events-none absolute inset-0 mx-auto max-w-6xl">
        <div className="absolute top-0 bottom-0 left-6 w-px bg-border/40 sm:left-8" />
        <div className="absolute top-0 bottom-0 right-6 w-px bg-border/40 sm:right-8" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6 sm:px-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="mb-3 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground"
        >
          <span className="h-px w-6 bg-border" />
          <span>posts/</span>
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-12 text-[32px] font-semibold leading-[1.1] tracking-tight text-foreground sm:text-[40px] lg:text-[44px]"
        >
          Blog<span className="text-muted">.</span>
        </motion.h2>

        {/* Three cards in a shared-hairline row — same language as Projects */}
        <div className="grid border-t border-border/60 sm:grid-cols-3">
          {posts.map((post, i) => (
            <motion.a
              key={post.title}
              href={post.href || "#"}
              initial={{ opacity: 0, y: 14 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 + 0.1 * i }}
              className={`group relative flex min-h-[300px] flex-col px-6 pt-11 pb-10 ${
                i > 0
                  ? "border-t border-border/60 sm:border-t-0 sm:border-l sm:border-border/60"
                  : ""
              }`}
            >
              {/* Dashed hover border */}
              <span className="pointer-events-none absolute inset-0 border border-dashed border-foreground/50 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

              {/* Foreground entry tick */}
              <span className="absolute -top-px left-6 h-[3px] w-8 bg-foreground" />

              {/* Meta — date · category */}
              <div className="flex flex-wrap items-center font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                <span>{post.date}</span>
                <span className="mx-2.5 h-3 w-px bg-border" />
                <span className="text-foreground/75">{post.category}</span>
              </div>

              {/* Title */}
              <h3 className="mt-5 text-[19px] font-semibold leading-[1.3] tracking-tight text-foreground sm:text-[20px]">
                {post.title}
              </h3>

              {/* Excerpt */}
              <p className="mt-4 text-[14.5px] leading-[1.7] text-muted">
                {post.excerpt}
              </p>

              <div className="flex-1" />

              {/* Footer — reading time + read link */}
              <div className="mt-6 flex items-center justify-between border-t border-border/60 pt-4 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                <span className="flex items-center gap-2">
                  <span className="h-px w-5 bg-border transition-all duration-300 group-hover:w-8 group-hover:bg-foreground" />
                  <span>{post.readTime}</span>
                </span>
                <span className="flex items-center gap-2 transition-colors duration-200 group-hover:text-foreground">
                  read
                  <span className="transition-transform duration-200 group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </div>
            </motion.a>
          ))}
        </div>

        {/* Archive link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="mt-10"
        >
          <a
            href="/blog"
            className="group inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground"
          >
            <span className="h-px w-8 bg-border transition-all duration-300 group-hover:w-14 group-hover:bg-foreground" />
            read all posts
          </a>
        </motion.div>
      </div>
    </section>
  );
}
