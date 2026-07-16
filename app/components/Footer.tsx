"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { SOCIALS } from "./socials";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Experience", href: "/experience" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="relative"
    >
      {/* Gradient top border */}
      <div
        aria-hidden="true"
        className="h-px w-full"
        style={{ background: "linear-gradient(to right, transparent, #0e7490 30%, #d98a3d 70%, transparent)" }}
      />

      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-6 py-6 sm:flex-row">
        {/* Left — logo + copyright */}
        <div className="flex flex-wrap items-center gap-3 text-[12.5px] text-muted-foreground">
          <span className="flex items-center gap-1.5 font-semibold">
            <span aria-hidden="true" className="text-accent">✦</span>
            <span
              style={{ background: "linear-gradient(135deg, #0e7490, #d98a3d)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}
            >
              msameer
            </span>
          </span>
          {/* `new Date()` is a moving value evaluated on BOTH the server (UTC,
              baked into SSR HTML) and again on the client at hydration. Across a
              year boundary in a visitor's timezone the two can differ, which is a
              classic React hydration mismatch (#418). suppressHydrationWarning is
              React's documented fix for unavoidably time-dependent text — the
              server-rendered year is kept and never patched. */}
          <span suppressHydrationWarning>
            © {new Date().getFullYear()} Muhammad Sameer. All rights reserved.
          </span>
        </div>

        {/* Right — socials */}
        <div className="flex items-center gap-4">
          {SOCIALS.map(({ label, href, icon: Icon }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
              aria-label={label}
              className="text-muted-foreground transition-colors duration-200 hover:text-accent"
            >
              <Icon size={16} />
            </a>
          ))}
        </div>
      </div>

      {/* Bottom strip — quick nav + tagline */}
      <div className="border-t border-border/40">
        <div className="mx-auto max-w-5xl px-6 py-5">
          <nav className="mb-3 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-[12.5px] text-muted-foreground transition-colors hover:text-accent"
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <p className="text-center text-[12px] text-muted-foreground">
            Made with{" "}
            <span aria-label="love" role="img" className="text-rose-500">
              ❤️
            </span>{" "}
            in Azad Kashmir, Pakistan
          </p>
        </div>
      </div>
    </motion.footer>
  );
}
