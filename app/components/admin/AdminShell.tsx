"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ExternalLink,
  FileText,
  FolderKanban,
  ImageIcon,
  LayoutDashboard,
  LogOut,
  Menu as MenuIcon,
  Moon,
  Sun,
  Tags,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { signOut } from "@/app/admin/actions";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/blog", label: "Blog", icon: FileText },
  { href: "/admin/categories", label: "Categories", icon: Tags },
  { href: "/admin/media", label: "Media", icon: ImageIcon },
];

function isActive(pathname: string, href: string, exact?: boolean) {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(href + "/");
}

export default function AdminShell({
  userEmail,
  children,
}: {
  userEmail: string | null;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const isDarkNow = document.documentElement.classList.contains("dark");
    queueMicrotask(() => setIsDark(isDarkNow));
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

  // The login page renders flush — no shell.
  if (pathname === "/admin/login" || !userEmail) {
    return <>{children}</>;
  }

  const initials = userEmail
    .split("@")[0]
    .split(/[._-]/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="grid min-h-screen grid-cols-1 md:grid-cols-[260px_1fr]">
        {/* ── Sidebar ─────────────────────────────────────────────── */}
        <aside
          className={`border-r border-border bg-card md:sticky md:top-0 md:h-screen md:overflow-y-auto ${
            mobileOpen ? "block" : "hidden"
          } md:block`}
        >
          <div className="flex h-full flex-col">
            {/* Brand */}
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <Link
                href="/admin"
                className="flex items-center gap-2 text-[14px] font-semibold text-foreground"
              >
                <span aria-hidden="true">✦</span>
                <span>saranzafar</span>
                <span className="ml-1 rounded-full bg-foreground px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-[0.18em] text-background">
                  Admin
                </span>
              </Link>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="md:hidden"
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-3 py-4">
              <ul className="space-y-1">
                {NAV.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(pathname, item.href, item.exact);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] transition-colors ${
                          active
                            ? "bg-foreground/[0.06] text-foreground font-medium"
                            : "text-foreground/70 hover:bg-foreground/[0.04] hover:text-foreground"
                        }`}
                      >
                        {active && (
                          <motion.span
                            layoutId="admin-nav-active"
                            className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r-full bg-foreground"
                            transition={{ duration: 0.25, ease: "easeOut" }}
                          />
                        )}
                        <Icon
                          size={15}
                          strokeWidth={1.8}
                          className={
                            active
                              ? "text-foreground"
                              : "text-foreground/60 group-hover:text-foreground"
                          }
                        />
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>

            </nav>

            {/* User pill + sign out */}
            <div className="border-t border-border p-3">
              <div className="flex items-center gap-3 rounded-xl border border-border bg-background p-2.5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-foreground text-[11px] font-semibold text-background">
                  {initials || "·"}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    Signed in
                  </p>
                  <p className="truncate text-[12px] font-medium text-foreground">
                    {userEmail}
                  </p>
                </div>
                <form action={signOut}>
                  <button
                    type="submit"
                    className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-foreground/[0.06] hover:text-foreground"
                    aria-label="Sign out"
                    title="Sign out"
                  >
                    <LogOut size={14} strokeWidth={1.8} />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </aside>

        {/* ── Main column ─────────────────────────────────────────── */}
        <div className="flex min-w-0 flex-col">
          {/* Sticky utility bar — visit-site + theme toggle, plus
              hamburger on mobile. Always reachable from anywhere. */}
          <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-border bg-background/85 px-4 py-3 backdrop-blur md:px-8">
            {/* Mobile-only brand */}
            <Link
              href="/admin"
              className="flex items-center gap-2 text-[14px] font-semibold text-foreground md:hidden"
            >
              <span aria-hidden>✦</span>
              <span>saranzafar</span>
            </Link>

            {/* Desktop spacer pushes utility cluster to the right */}
            <div className="hidden md:block" />

            <div className="flex items-center gap-2">
              {/* Visit public site — opens in new tab */}
              <Link
                href="/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-9 items-center gap-1.5 rounded-full border border-border bg-card/60 px-3.5 text-[12.5px] font-medium text-foreground transition-colors hover:border-foreground/40 hover:bg-card"
                title="Open public site in a new tab"
              >
                <ExternalLink size={13} strokeWidth={1.8} />
                <span className="hidden sm:inline">Visit site</span>
              </Link>

              {/* Theme toggle */}
              <motion.button
                type="button"
                onClick={toggleTheme}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.92, rotate: -8 }}
                transition={{ type: "spring", stiffness: 320, damping: 20 }}
                className="relative inline-flex h-9 w-9 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-border bg-card/60 text-foreground transition-colors duration-200 hover:bg-card"
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
                      <Moon size={14} strokeWidth={1.8} />
                    ) : (
                      <Sun size={14} strokeWidth={1.8} />
                    )}
                  </motion.span>
                </AnimatePresence>
              </motion.button>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-border bg-card/60 text-foreground md:hidden"
              >
                <MenuIcon size={15} strokeWidth={1.8} />
              </button>
            </div>
          </header>

          <main className="min-w-0 flex-1">{children}</main>
        </div>
      </div>
    </div>
  );
}
