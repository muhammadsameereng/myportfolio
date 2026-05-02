"use client";

import { Check, Link as LinkIcon, Mail, Share2 } from "lucide-react";
import { useEffect, useState } from "react";

/**
 * Social share row for blog posts.
 *
 * - Builds links from the live `window.location.href` so the URL is always right.
 * - Uses the platform's official share endpoint (no JS SDK = zero tracking, zero cost).
 * - On mobile devices that support `navigator.share`, clicking the wrapper "Share" button
 *   opens the native share sheet (matches the Medium / Substack pattern).
 * - "Copy link" gives the standard 2-second confirm flash.
 *
 * Endpoint references:
 *   X / Twitter   https://twitter.com/intent/tweet?text=…&url=…
 *   LinkedIn      https://www.linkedin.com/sharing/share-offsite/?url=…
 *   Facebook      https://www.facebook.com/sharer/sharer.php?u=…
 *   Reddit        https://www.reddit.com/submit?url=…&title=…
 *   WhatsApp      https://wa.me/?text=…
 *   Telegram      https://t.me/share/url?url=…&text=…
 *   Email         mailto:?subject=…&body=…
 */
export default function ShareRow({
  title,
  excerpt,
}: {
  title: string;
  excerpt: string;
}) {
  const [url, setUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);

  useEffect(() => {
    setUrl(window.location.href);
    setCanNativeShare(typeof navigator !== "undefined" && "share" in navigator);
  }, []);

  const enc = encodeURIComponent;
  const shareText = `${title} — ${excerpt}`.slice(0, 240);

  const targets: { name: string; href: string; bg: string; svg: React.ReactNode }[] = [
    {
      name: "X",
      bg: "hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black",
      href: `https://twitter.com/intent/tweet?text=${enc(title)}&url=${enc(url)}`,
      svg: (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M18.244 2H21.5l-7.5 8.567L23 22h-6.844l-5.36-7.01L4.6 22H1.34l8.04-9.18L1 2h7.02l4.846 6.4L18.244 2Zm-1.2 18h1.86L7.06 4H5.08l11.964 16Z" />
        </svg>
      ),
    },
    {
      name: "LinkedIn",
      bg: "hover:bg-[#0A66C2] hover:text-white",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`,
      svg: (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.95v5.66H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.72v20.55C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0Z" />
        </svg>
      ),
    },
    {
      name: "Facebook",
      bg: "hover:bg-[#1877F2] hover:text-white",
      href: `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`,
      svg: (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.4 0 12.07c0 6.02 4.39 11.01 10.13 11.93v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.69.24 2.69.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.26h3.33l-.53 3.49h-2.8V24C19.6 23.08 24 18.09 24 12.07Z" />
        </svg>
      ),
    },
    {
      name: "Reddit",
      bg: "hover:bg-[#FF4500] hover:text-white",
      href: `https://www.reddit.com/submit?url=${enc(url)}&title=${enc(title)}`,
      svg: (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 0a12 12 0 1 0 0 24 12 12 0 0 0 0-24Zm6.67 11.4c.04.22.06.45.06.68 0 3.5-4.05 6.34-9.05 6.34S.63 15.58.63 12.08c0-.23.02-.46.06-.68a2.13 2.13 0 1 1 2.96-2.96 11 11 0 0 1 5.6-1.42l1.06-4.97a.36.36 0 0 1 .43-.27l3.46.74a1.51 1.51 0 1 1-.18.94l-3.1-.66-.95 4.45a11 11 0 0 1 5.55 1.43 2.13 2.13 0 1 1 1.15 2.72ZM7.32 12.7a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm9.36 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm-1.18 2.27a.36.36 0 0 1 .03.5c-.86.87-2.5 1.36-3.65 1.36-1.15 0-2.79-.49-3.65-1.36a.36.36 0 1 1 .51-.5c.65.66 2.07 1.05 3.14 1.05 1.07 0 2.49-.39 3.14-1.05a.36.36 0 0 1 .48-.06Z" />
        </svg>
      ),
    },
    {
      name: "WhatsApp",
      bg: "hover:bg-[#25D366] hover:text-white",
      href: `https://wa.me/?text=${enc(`${shareText} ${url}`)}`,
      svg: (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M19.05 4.91A9.82 9.82 0 0 0 12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.91-7.01ZM12.05 20.15h-.01a8.21 8.21 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.21 8.21 0 0 1-1.27-4.39c0-4.54 3.7-8.24 8.24-8.24 2.2 0 4.27.86 5.83 2.42a8.18 8.18 0 0 1 2.42 5.83c0 4.54-3.7 8.24-8.23 8.24Zm4.52-6.16c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.13-.17.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.14-.25-.02-.39.11-.51.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.42-.14 0-.31-.02-.48-.02-.17 0-.43.06-.66.31-.23.25-.86.85-.86 2.06 0 1.21.88 2.39 1 2.55.12.17 1.74 2.66 4.22 3.73.59.25 1.05.4 1.4.51.59.19 1.13.16 1.55.1.47-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.11-.22-.17-.47-.29Z" />
        </svg>
      ),
    },
    {
      name: "Telegram",
      bg: "hover:bg-[#229ED9] hover:text-white",
      href: `https://t.me/share/url?url=${enc(url)}&text=${enc(title)}`,
      svg: (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 0a12 12 0 1 0 0 24 12 12 0 0 0 0-24Zm5.56 8.16-1.86 8.78c-.14.62-.51.77-1.03.48l-2.85-2.1-1.38 1.32c-.15.15-.28.28-.57.28l.2-2.9 5.27-4.76c.23-.2-.05-.32-.36-.12l-6.51 4.1-2.8-.88c-.61-.19-.62-.61.13-.9l10.93-4.21c.51-.19.95.12.79.91Z" />
        </svg>
      ),
    },
    {
      name: "Email",
      bg: "hover:bg-foreground hover:text-background",
      href: `mailto:?subject=${enc(title)}&body=${enc(`${excerpt}\n\n${url}`)}`,
      svg: <Mail size={16} strokeWidth={1.8} />,
    },
  ];

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked — silently no-op */
    }
  };

  const nativeShare = async () => {
    try {
      await navigator.share({ title, text: excerpt, url });
    } catch {
      /* user cancelled */
    }
  };

  return (
    <section
      aria-label="Share this post"
      className="mt-14 rounded-2xl border border-border bg-card/50 px-5 py-5 sm:px-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
        <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Share this post
        </p>

        <div className="flex flex-wrap items-center gap-1.5">
          {targets.map((t) => (
            <a
              key={t.name}
              href={t.href}
              target={t.name === "Email" ? "_self" : "_blank"}
              rel="noopener noreferrer"
              aria-label={`Share on ${t.name}`}
              className={`flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-border bg-background text-foreground/80 transition-all duration-200 hover:scale-[1.06] hover:border-transparent ${t.bg}`}
            >
              <span className="block h-4 w-4">{t.svg}</span>
            </a>
          ))}

          <button
            type="button"
            onClick={copy}
            aria-label={copied ? "Link copied" : "Copy link"}
            className={`flex h-9 cursor-pointer items-center gap-1.5 rounded-full border px-3 text-[12px] font-medium transition-all duration-200 ${
              copied
                ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : "border-border bg-background text-foreground/80 hover:border-foreground hover:text-foreground"
            }`}
          >
            {copied ? <Check size={14} strokeWidth={2.4} /> : <LinkIcon size={14} strokeWidth={1.8} />}
            {copied ? "Copied" : "Copy link"}
          </button>

          {canNativeShare && (
            <button
              type="button"
              onClick={nativeShare}
              aria-label="Open device share sheet"
              className="flex h-9 cursor-pointer items-center gap-1.5 rounded-full border border-border bg-foreground px-3 text-[12px] font-medium text-background transition-all duration-200 hover:scale-[1.03] sm:hidden"
            >
              <Share2 size={14} strokeWidth={1.8} />
              Share
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
