"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { BlogPost } from "../lib/blogs";
import SectionHead from "./SectionHead";

export default function WritingsSection({ posts }: { posts: BlogPost[] }) {
  if (posts.length === 0) return null;
  const featured = posts;

  return (
    <section id="writings" className="relative">
      <div className="mx-auto max-w-5xl px-6 py-16 md:py-20">
        <SectionHead
          title="Blog"
          description="Along with coding I also like to write about life and technology. Here are some of my recent posts."
        />

        <div className="mt-10 divide-y divide-border/60">
          {featured.map((p, i) => (
            <motion.div
              key={p.slug}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: 0.05 * i }}
            >
              <Link
                href={`/blog/${p.slug}`}
                className="group grid grid-cols-1 gap-5 py-7 sm:grid-cols-[1fr_auto] sm:gap-8"
              >
                <div className="min-w-0">
                  <h3 className="text-[16px] font-semibold leading-snug tracking-tight text-foreground transition-colors group-hover:text-accent">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-[12.5px] leading-relaxed text-muted-foreground">
                    {p.excerpt}
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-[11px] text-muted-foreground/85">
                    <span>{p.date}</span>
                    <span className="h-2.5 w-px bg-border" />
                    <span>{p.readTime} read</span>
                  </div>
                </div>
                <div className="relative h-[120px] w-full overflow-hidden rounded-xl border border-border bg-muted/30 transition-all duration-300 group-hover:border-accent/45 group-hover:shadow-[0_16px_38px_-18px_rgb(var(--bg-teal)/0.5)] sm:h-[120px] sm:w-[160px]">
                  <Image
                    src={p.thumb}
                    alt={`${p.title} — article by Muhammad Sameer`}
                    fill
                    loading="lazy"
                    sizes="(max-width: 640px) 100vw, 160px"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                  />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-10 flex justify-center"
        >
          <Link
            href="/blog"
            className="group inline-flex h-9 items-center gap-1.5 rounded-full bg-foreground pl-4 pr-3.5 text-[12.5px] font-medium text-background transition-all duration-200 hover:scale-[1.02] hover:opacity-95"
          >
            View All Blogs
            <ArrowRight
              size={13}
              strokeWidth={2}
              className="transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
