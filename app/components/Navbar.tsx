"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Menu, Moon, Sun, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { SOCIALS } from "./socials";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Experience", href: "/experience" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // Defer to next microtask so we don't trigger a synchronous cascading
    // render — the <html> dark class is already set by the inline theme
    // bootstrap script in layout.tsx, so paint is unaffected.
    const isDarkNow = document.documentElement.classList.contains("dark");
    queueMicrotask(() => setIsDark(isDarkNow));
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while the mobile sidebar is open.
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const toggleTheme = () => {
    const html = document.documentElement;
    if (html.classList.contains("dark")) {
      html.classList.remove("dark");
      html.style.colorScheme = "light";
      try {
        localStorage.setItem("theme", "light");
      } catch {}
      setIsDark(false);
    } else {
      html.classList.add("dark");
      html.style.colorScheme = "dark";
      try {
        localStorage.setItem("theme", "dark");
      } catch {}
      setIsDark(true);
    }
  };

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <motion.header
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sticky top-0 z-50 w-full px-3 pt-3 pb-1"
    >
      <nav
        className={`mx-auto flex max-w-5xl items-center justify-between gap-3 rounded-full border bg-background/70 px-2.5 py-2 backdrop-blur-xl backdrop-saturate-150 transition-[box-shadow,background-color,border-color] duration-300 ease-out ${
          scrolled
            ? "border-border/60 bg-background/85 shadow-[0_12px_32px_-16px_rgba(0,0,0,0.28)]"
            : "border-border/40 shadow-[0_6px_20px_-16px_rgba(0,0,0,0.15)]"
        }`}
      >
        {/* Logo */}
        <Link
          href="/"
          className="group flex items-center gap-2 pl-2 pr-1 font-display text-[15px] font-semibold tracking-tight text-foreground"
        >
          <span
            aria-hidden="true"
            className="text-[17px] leading-none text-accent transition-transform duration-300 group-hover:rotate-90"
          >
            ✦
          </span>
          <span>msameer</span>
        </Link>

        {/* Desktop nav — segmented pill with a sliding active indicator */}
        <div className="hidden items-center gap-0.5 rounded-full border border-border/50 bg-card/40 p-1 md:flex">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`relative rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors duration-200 ${
                  active
                    ? "text-foreground"
                    : "text-foreground/60 hover:text-foreground"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 rounded-full border border-border/60 bg-background shadow-sm"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative z-10">{link.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Right side — theme toggle + desktop CTA + mobile hamburger */}
        <div className="flex items-center gap-2">
          <motion.button
            onClick={toggleTheme}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.92, rotate: -8 }}
            transition={{ type: "spring", stiffness: 320, damping: 20 }}
            className="relative inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-border bg-card/60 text-foreground transition-colors duration-200 hover:bg-card"
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={isDark ? "moon" : "sun"}
                initial={{ y: 14, opacity: 0, rotate: -90 }}
                animate={{ y: 0, opacity: 1, rotate: 0 }}
                exit={{ y: -14, opacity: 0, rotate: 90 }}
                transition={{ duration: 0.28, ease: "easeOut" }}
                className="absolute inset-0 flex items-center justify-center"
              >
                {isDark ? (
                  <Moon size={15} strokeWidth={1.8} />
                ) : (
                  <Sun size={15} strokeWidth={1.8} />
                )}
              </motion.span>
            </AnimatePresence>
          </motion.button>

          <Link
            href="/contact"
            className="hidden h-9 items-center rounded-full bg-foreground px-4 text-[13px] font-medium text-background transition-all duration-200 hover:scale-[1.03] hover:opacity-90 md:inline-flex"
          >
            Let&apos;s talk
          </Link>

          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="relative inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-border bg-card/60 text-foreground transition-colors duration-200 hover:bg-card md:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={mobileOpen ? "x" : "menu"}
                initial={{ rotate: -45, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 45, opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="absolute inset-0 flex items-center justify-center"
              >
                {mobileOpen ? <X size={16} strokeWidth={1.8} /> : <Menu size={16} strokeWidth={1.8} />}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>
      </nav>

      {/* Mobile navigation — slide-in sidebar with backdrop */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.button
              key="backdrop"
              aria-label="Close menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
            />

            {/* Sidebar panel */}
            <motion.aside
              key="sidebar"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 380, damping: 40 }}
              className="fixed right-0 top-0 z-50 flex h-full w-[82%] max-w-xs flex-col border-l border-border bg-background/95 shadow-[0_18px_50px_-12px_rgba(0,0,0,0.35)] backdrop-blur-xl backdrop-saturate-150 md:hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border/60 px-5 py-4">
                <Link
                  href="/"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 font-display text-[15px] font-semibold tracking-tight text-foreground"
                >
                  <span aria-hidden="true" className="text-[17px] leading-none text-accent">
                    ✦
                  </span>
                  msameer
                </Link>
                <button
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card/60 text-foreground transition-colors hover:bg-card"
                >
                  <X size={16} strokeWidth={1.8} />
                </button>
              </div>

              {/* Links — staggered slide-in */}
              <motion.nav
                className="flex flex-1 flex-col gap-1 overflow-y-auto p-4"
                initial="hidden"
                animate="show"
                variants={{
                  show: {
                    transition: { staggerChildren: 0.055, delayChildren: 0.12 },
                  },
                }}
              >
                {navLinks.map((link) => {
                  const active = isActive(link.href);
                  return (
                    <motion.div
                      key={link.label}
                      variants={{
                        hidden: { opacity: 0, x: 26 },
                        show: { opacity: 1, x: 0 },
                      }}
                      transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        aria-current={active ? "page" : undefined}
                        className={`group flex items-center justify-between rounded-xl px-3.5 py-3 text-[15px] transition-colors ${
                          active
                            ? "bg-accent/10 font-semibold text-accent"
                            : "text-foreground/80 hover:bg-foreground/[0.04] hover:text-foreground"
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          <span
                            aria-hidden
                            className={`h-1.5 w-1.5 rounded-full transition-colors ${
                              active ? "bg-accent" : "bg-foreground/25 group-hover:bg-foreground/60"
                            }`}
                          />
                          {link.label}
                        </span>
                        <ArrowUpRight
                          size={14}
                          className="text-muted-foreground/60 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground/70"
                        />
                      </Link>
                    </motion.div>
                  );
                })}
              </motion.nav>

              {/* Socials + CTA */}
              <motion.div
                className="space-y-4 border-t border-border/60 p-4"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: 0.12 + navLinks.length * 0.055,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <div className="flex items-center gap-4">
                  {SOCIALS.map(({ label, href, icon: Icon }) => (
                    <a
                      key={label}
                      href={href}
                      target={href.startsWith("http") ? "_blank" : undefined}
                      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                      aria-label={label}
                      className="text-muted-foreground transition-colors hover:text-accent"
                    >
                      <Icon size={17} />
                    </a>
                  ))}
                </div>
                <Link
                  href="/contact"
                  onClick={() => setMobileOpen(false)}
                  className="flex h-10 w-full items-center justify-center rounded-full text-[13px] font-medium text-white transition-opacity hover:opacity-90"
                  style={{ background: "linear-gradient(135deg, #0e7490, #d98a3d)" }}
                >
                  Get in touch
                </Link>
              </motion.div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
