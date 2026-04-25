"use client";

import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import ThemeToggle from "./ThemeToggle";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Work", href: "#projects" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Blog", href: "#blog" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;

    const handleScroll = () => {
      // Active-section spy
      const sections = navLinks.map((link) =>
        link.href.startsWith("#") ? document.querySelector(link.href) : null
      );
      const probe = window.scrollY + 120;
      let foundActive = false;
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && (section as HTMLElement).offsetTop <= probe) {
          setActiveSection(navLinks[i].href);
          foundActive = true;
          break;
        }
      }
      if (!foundActive) setActiveSection("");

      // Show/hide on scroll direction
      const y = window.scrollY;
      const delta = y - lastY;
      setScrolled(y > 8);
      if (mobileOpen) {
        setHidden(false);
      } else if (y < 80) {
        setHidden(false);
      } else if (delta > 6) {
        setHidden(true); // scrolling down — hide
      } else if (delta < -6) {
        setHidden(false); // scrolling up — show
      }
      lastY = y;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [mobileOpen]);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{
        y: hidden ? -80 : 0,
        opacity: 1,
      }}
      transition={{
        y: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
        opacity: { duration: 0.6, ease: "easeOut" },
      }}
      className={`fixed top-0 left-0 right-0 z-50 border-b backdrop-blur-md transition-[border-color,background-color,padding] duration-300 ease-out ${
        scrolled
          ? "border-border/80 bg-background/75 shadow-[0_8px_24px_-16px_rgba(0,0,0,0.35)]"
          : "border-transparent bg-background/30"
      }`}
    >
      <nav
        className={`mx-auto flex max-w-6xl items-center justify-between px-6 transition-[padding] duration-300 ease-out sm:px-8 ${
          scrolled ? "py-3" : "py-4"
        }`}
      >
        {/* Logo */}
        <a
          href="#"
          className="font-mono text-base font-semibold tracking-tight text-foreground"
        >
          SaranZafar<span className="text-muted-foreground">.</span>
        </a>

        {/* Desktop nav */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="group relative py-1 font-mono text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
            >
              {link.label}
              {/* Active underline */}
              <motion.span
                className="absolute -bottom-[13px] left-0 right-0 h-px bg-foreground"
                initial={false}
                animate={{
                  scaleX: activeSection === link.href ? 1 : 0,
                  opacity: activeSection === link.href ? 1 : 0,
                }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                style={{ transformOrigin: "left" }}
              />
            </a>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-1">
          <ThemeToggle />

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-8 w-8 cursor-pointer items-center justify-center text-muted-foreground transition-colors hover:text-foreground md:hidden"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </nav>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="border-t border-border/30 bg-background/60 backdrop-blur-md md:hidden"
        >
          <div className="mx-auto flex max-w-6xl flex-col px-6 sm:px-8">
            {navLinks.map((link, i) => (
              <div key={link.label}>
                {i > 0 && <div className="h-px w-full bg-border/15" />}
                <a
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block py-3 font-mono text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </a>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}
