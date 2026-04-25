"use client";

import { motion, useInView } from "framer-motion";
import { Mail } from "lucide-react";
import { useRef } from "react";

function GithubIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function LinkedInIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function InstagramIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

const socials = [
  { icon: GithubIcon, href: "https://github.com/saranzafar", label: "GitHub" },
  {
    icon: LinkedInIcon,
    href: "https://linkedin.com/in/saranzafar",
    label: "LinkedIn",
  },
  {
    icon: InstagramIcon,
    href: "https://instagram.com/saran.devvv/",
    label: "Instagram",
  },
  { icon: Mail, href: "mailto:saran.development@gmail.com", label: "Email" },
];

export default function Footer() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const year = new Date().getFullYear();

  return (
    <footer
      ref={ref}
      className="relative mt-20 border-t border-border/60 pt-16 pb-10"
    >
      {/* Rails pass through — the spine continues down to the last pixel */}
      <div className="pointer-events-none absolute inset-0 mx-auto max-w-6xl">
        <div className="absolute top-0 bottom-0 left-6 w-px bg-border/40 sm:left-8" />
        <div className="absolute top-0 bottom-0 right-6 w-px bg-border/40 sm:right-8" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 sm:px-8">
        {/* Top — say hi label + tagline / contact */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="grid gap-12 md:grid-cols-[1.4fr_1fr] md:items-start md:gap-16"
        >
          {/* Left: closing line, ties to the About blame’s HEAD row */}
          <div>
            <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              <span className="h-px w-8 bg-foreground" />
              <span>say hi</span>
            </div>
            <p className="mt-6 text-[24px] font-semibold leading-tight tracking-tight text-foreground sm:text-[28px] lg:text-[32px]">
              Still here.
              <br />
              <span className="text-muted">Still typing.</span>
              <br />
              Still open to good work.
            </p>
          </div>

          {/* Right: email + socials */}
          <div className="flex flex-col items-start gap-6 md:items-end">
            <a
              href="mailto:saran.development@gmail.com"
              className="group inline-flex items-center gap-3 text-[15px] text-foreground transition-colors"
            >
              <span className="border-b border-border transition-colors duration-200 group-hover:border-foreground">
                saran.development@gmail.com
              </span>
              <span className="transition-transform duration-200 group-hover:translate-x-1">
                →
              </span>
            </a>

            <div className="flex items-center gap-5 text-muted-foreground">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="transition-colors duration-200 hover:text-foreground"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Bottom — copyright row with a live availability indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-border/60 pt-6 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground"
        >
          <span>
            © {year} <span className="text-foreground/80">Saran Zafar</span>
          </span>
          <span className="hidden sm:inline">
            kotli, ajk · 33.5183°n 73.9022°e
          </span>
          <span className="flex items-center gap-2">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-foreground/50" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-foreground" />
            </span>
            <span>available for work</span>
          </span>
        </motion.div>
      </div>
    </footer>
  );
}
