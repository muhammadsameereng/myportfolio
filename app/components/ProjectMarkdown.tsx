"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// See note in BlogMarkdown.tsx — isolated so `next/dynamic` can split
// react-markdown + remark/unified out of the shared vendor chunk that
// every route would otherwise download.
export default function ProjectMarkdown({ source }: { source: string }) {
  return (
    <div className="space-y-5 text-[15.5px] leading-[1.75] text-foreground/85">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h2 className="mt-12 text-[22px] font-semibold tracking-tight text-foreground sm:text-[24px]">
              {children}
            </h2>
          ),
          h2: ({ children }) => (
            <h2 className="mt-12 text-[22px] font-semibold tracking-tight text-foreground sm:text-[24px]">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="mt-8 text-[17px] font-medium tracking-tight text-foreground">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="mt-6 text-[15px] font-medium text-foreground">
              {children}
            </h4>
          ),
          strong: ({ children }) => (
            <strong className="font-medium text-foreground">{children}</strong>
          ),
          p: ({ children }) => (
            <p className="text-[15.5px] leading-[1.75] text-foreground/85">
              {children}
            </p>
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
            <li className="text-[15.5px] leading-[1.75] text-foreground/85">
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
                <code className={`${className} text-[13px]`}>{children}</code>
              );
            }
            return (
              <code className="rounded-md border border-border bg-card px-1.5 py-0.5 font-mono text-[13.5px] text-foreground">
                {children}
              </code>
            );
          },
          pre: ({ children }) => (
            <pre className="overflow-x-auto rounded-2xl border border-border bg-card p-4 font-mono text-[13px] leading-[1.6] text-foreground/90">
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
              <table className="w-full text-left text-[14px]">{children}</table>
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
