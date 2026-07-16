"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { type BlogPost } from "../lib/blogs";
import ShareRow from "./ShareRow";

// Code-split the markdown renderer into its own async chunk so
// react-markdown + the unified/remark dep tree (which carries ~14 KiB
// of legacy polyfills baked into its compiled output) don't get
// hoisted into the shared vendor chunk every route downloads.
const BlogMarkdown = dynamic(() => import("./BlogMarkdown"));

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 12 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] as const },
});

export default function BlogDetailContent({
  post,
  related,
}: {
  post: BlogPost;
  related: BlogPost[];
}) {

  return (
    <article className="relative">
      <div className="mx-auto max-w-3xl px-6 py-10 md:py-14">
        {/* Back link */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <Link
            href="/blog"
            className="group inline-flex items-center gap-2 text-[12.5px] font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft
              size={14}
              className="transition-transform duration-200 group-hover:-translate-x-0.5"
            />
            Back to blog
          </Link>
        </motion.div>

        {/* Date + read time */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="mt-7 flex flex-wrap items-center gap-3 text-[11.5px] uppercase tracking-[0.18em] text-muted-foreground"
        >
          <time dateTime={post.isoDate}>{post.date}</time>
          <span className="h-3 w-px bg-border" />
          <span>{post.readTime}</span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          className="mt-3 text-[34px] font-bold leading-[1.1] tracking-tight text-foreground sm:text-[42px]"
        >
          {post.title}
        </motion.h1>

        {/* Lede */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
          className="mt-5 text-[16px] leading-relaxed text-muted-foreground"
        >
          {post.excerpt}
        </motion.p>

        {/* Hero thumbnail */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.2, ease: "easeOut" }}
          className="mt-10 overflow-hidden rounded-2xl border border-border bg-muted/30"
        >
          <Image
            src={post.thumb}
            alt={`${post.title} — article by Muhammad Sameer`}
            width={1600}
            height={900}
            priority
            sizes="(max-width: 768px) 100vw, 768px"
            className="aspect-[16/9] w-full object-cover"
          />
        </motion.div>

        {/* Body — markdown when DB-sourced, paragraph list otherwise */}
        {post.markdown ? (
          <motion.div {...fadeUp(0.05)} className="mt-12">
            <BlogMarkdown source={post.markdown} />
          </motion.div>
        ) : (
          <div className="mt-12 space-y-5">
            {post.body.map((para, i) => (
              <motion.p
                key={i}
                {...fadeUp(0.04 * i)}
                className="text-[16px] leading-[1.8] text-foreground/85"
              >
                {para}
              </motion.p>
            ))}
          </div>
        )}

        {/* Share */}
        <motion.div {...fadeUp(0.05)}>
          <ShareRow title={post.title} excerpt={post.excerpt} />
        </motion.div>

        {/* Tags */}
        {post.tags.length > 0 && (
          <motion.div {...fadeUp(0.05)} className="mt-12 flex flex-wrap gap-1.5">
            {post.tags.map((t) => (
              <span
                key={t}
                className="inline-flex h-7 items-center rounded-full border border-border bg-background px-2.5 text-[11.5px] font-medium text-foreground/85"
              >
                #{t}
              </span>
            ))}
          </motion.div>
        )}

        {/* More posts */}
        {related.length > 0 && (
          <motion.section
            {...fadeUp(0)}
            className="mt-20 border-t border-border pt-10"
          >
            <div className="flex items-baseline justify-between">
              <h2 className="text-[18px] font-semibold tracking-tight text-foreground">
                More posts
              </h2>
              <Link
                href="/blog"
                className="group inline-flex items-center gap-1.5 text-[12.5px] font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                See all
                <ArrowUpRight
                  size={13}
                  className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
              {related.map((p) => (
                <motion.div key={p.slug} whileHover={{ y: -3 }}>
                  <Link href={`/blog/${p.slug}`} className="group flex flex-col">
                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-muted/30">
                      <Image
                        src={p.thumb}
                        alt={p.title}
                        fill
                        loading="lazy"
                        sizes="(max-width: 640px) 100vw, 250px"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                      />
                    </div>
                    <p className="mt-2.5 line-clamp-2 text-[13px] font-medium leading-snug text-foreground">
                      {p.title}
                    </p>
                    <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                      {p.date}
                    </p>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </article>
  );
}
