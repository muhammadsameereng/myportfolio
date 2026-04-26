"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { type BlogPost } from "../lib/blogs";

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
            alt={post.title}
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

/**
 * Renders the post's markdown body with typography tuned for the blog
 * detail page: 16px paragraphs at line-height 1.8, headings sized one
 * notch lighter than `font-bold` to match the calmer reading rhythm.
 */
function BlogMarkdown({ source }: { source: string }) {
  return (
    <div className="space-y-5 text-[16px] leading-[1.8] text-foreground/85">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h2 className="mt-12 text-[24px] font-semibold tracking-tight text-foreground sm:text-[26px]">
              {children}
            </h2>
          ),
          h2: ({ children }) => (
            <h2 className="mt-12 text-[22px] font-semibold tracking-tight text-foreground sm:text-[24px]">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="mt-8 text-[18px] font-medium tracking-tight text-foreground">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="mt-6 text-[16px] font-medium text-foreground">
              {children}
            </h4>
          ),
          p: ({ children }) => (
            <p className="text-[16px] leading-[1.8] text-foreground/85">
              {children}
            </p>
          ),
          strong: ({ children }) => (
            <strong className="font-medium text-foreground">{children}</strong>
          ),
          a: ({ children, href }) => (
            <a
              href={href}
              target={href?.startsWith("http") ? "_blank" : undefined}
              rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
              className="font-medium text-foreground underline decoration-foreground/30 underline-offset-4 transition-colors hover:decoration-foreground"
            >
              {children}
            </a>
          ),
          ul: ({ children }) => (
            <ul className="ml-5 list-disc space-y-2 marker:text-muted-foreground">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="ml-5 list-decimal space-y-2 marker:text-muted-foreground">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-[16px] leading-[1.8] text-foreground/85">
              {children}
            </li>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-foreground/30 pl-4 italic text-foreground/75">
              {children}
            </blockquote>
          ),
          code: ({ children, className }) => {
            const isBlock = className?.includes("language-");
            if (isBlock) {
              return (
                <code className={`${className} text-[13.5px]`}>{children}</code>
              );
            }
            return (
              <code className="rounded-md border border-border bg-card px-1.5 py-0.5 font-mono text-[14px] text-foreground">
                {children}
              </code>
            );
          },
          pre: ({ children }) => (
            <pre className="overflow-x-auto rounded-2xl border border-border bg-card p-4 font-mono text-[13.5px] leading-[1.6] text-foreground/90">
              {children}
            </pre>
          ),
          hr: () => <hr className="my-8 border-border" />,
          img: ({ src, alt }) =>
            typeof src === "string" ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={src}
                alt={alt || ""}
                className="my-6 w-full rounded-2xl border border-border"
                loading="lazy"
              />
            ) : null,
          table: ({ children }) => (
            <div className="my-4 overflow-x-auto rounded-2xl border border-border">
              <table className="w-full text-left text-[14.5px]">{children}</table>
            </div>
          ),
          th: ({ children }) => (
            <th className="bg-card px-3 py-2 text-[12.5px] font-semibold uppercase tracking-[0.12em] text-foreground/75">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border-t border-border px-3 py-2 text-foreground/85">
              {children}
            </td>
          ),
        }}
      >
        {source}
      </ReactMarkdown>
    </div>
  );
}
