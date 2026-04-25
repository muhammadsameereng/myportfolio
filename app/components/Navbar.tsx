"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Menu, Moon, Sun, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
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
      className={`sticky top-0 z-50 w-full transition-all duration-300 ease-out ${
        scrolled ? "px-3 pt-3 pb-3" : "bg-background"
      }`}
    >
      <nav
        className={`mx-auto flex items-center justify-between transition-all duration-300 ease-out ${
          scrolled
            ? "max-w-5xl rounded-full border border-border/40 bg-background/65 px-5 py-3 shadow-[0_8px_24px_-14px_rgba(0,0,0,0.12)] backdrop-blur-xl backdrop-saturate-150"
            : "max-w-5xl px-6 py-5"
        }`}
      >
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-[15px] font-semibold text-foreground"
        >
          <span aria-hidden="true">✦</span>
          <span>saranzafar</span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`relative text-[14px] transition-colors duration-200 ${
                  active
                    ? "text-foreground"
                    : "text-foreground/70 hover:text-foreground"
                }`}
              >
                {link.label}
                {active && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute -bottom-1.5 left-0 right-0 h-px bg-foreground"
                    transition={{ duration: 0.25, ease: "easeOut" }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Right side — theme toggle (always visible) + hamburger (mobile only) */}
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

      {/* Mobile drawer — full-bleed glass card with staggered link reveal */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-drawer"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="px-3 pb-3 md:hidden"
          >
            <div className="overflow-hidden rounded-2xl border border-border/50 bg-background/95 shadow-[0_18px_40px_-20px_rgba(0,0,0,0.18)] backdrop-blur-xl">
              <nav className="flex flex-col p-2">
                {navLinks.map((link, i) => {
                  const active = isActive(link.href);
                  return (
                    <motion.div
                      key={link.label}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.32,
                        delay: 0.04 + i * 0.05,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className={`group flex items-center justify-between rounded-xl px-3 py-3 text-[15px] transition-colors ${
                          active
                            ? "bg-foreground/[0.05] text-foreground font-semibold"
                            : "text-foreground/80 hover:bg-foreground/[0.04] hover:text-foreground"
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          <span
                            aria-hidden
                            className={`h-1.5 w-1.5 rounded-full transition-colors ${
                              active ? "bg-foreground" : "bg-foreground/25 group-hover:bg-foreground/60"
                            }`}
                          />
                          {link.label}
                        </span>
                        <span className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground/70 transition-colors group-hover:text-foreground/70">
                          →
                        </span>
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              {/* Footer strip — quick contact CTA matches design pills elsewhere */}
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.32,
                  delay: 0.04 + navLinks.length * 0.05,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="border-t border-border/40 p-3"
              >
                <Link
                  href="/contact"
                  onClick={() => setMobileOpen(false)}
                  className="flex h-10 w-full items-center justify-center rounded-full bg-foreground text-[13px] font-medium text-background transition-opacity hover:opacity-95"
                >
                  Get in touch
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
