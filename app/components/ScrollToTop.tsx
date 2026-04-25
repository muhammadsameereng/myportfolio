"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * The thread.
 *
 * The vertical line mirrors the page's rails — the button is a piece of
 * the spine. As the visitor scrolls, the line fills from the top: the
 * thread they've pulled through the story. A blinking cursor sits at the
 * fill boundary — "you are here". The label `cd ~` is the shell way to
 * return home, tying the control to Saran's terminal identity.
 */
export default function ScrollToTop() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const update = () => {
      const h = document.documentElement;
      const total = h.scrollHeight - h.clientHeight;
      const pct = total > 0 ? h.scrollTop / total : 0;
      setProgress(Math.min(1, Math.max(0, pct)));
      setVisible(h.scrollTop > window.innerHeight * 0.5);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const handleReturn = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const LINE_HEIGHT = 80; // px

  return (
    <motion.button
      onClick={handleReturn}
      aria-label="Return to top"
      initial={false}
      animate={{
        opacity: visible ? 1 : 0,
        y: visible ? 0 : 8,
      }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      style={{ pointerEvents: visible ? "auto" : "none" }}
      className="group fixed right-6 bottom-12 z-40 flex cursor-pointer flex-col items-center gap-3 sm:right-8"
    >
      {/* The thread */}
      <div
        className="relative w-px bg-border transition-colors duration-200 group-hover:bg-border"
        style={{ height: LINE_HEIGHT }}
      >
        {/* Filled portion — the distance traveled */}
        <div
          className="absolute top-0 left-0 w-full bg-foreground transition-[height] duration-150 ease-out"
          style={{ height: `${progress * 100}%` }}
        />

        {/* The cursor — "you are here", blinking like the hero terminal */}
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-1/2 h-[5px] w-[5px] -translate-x-1/2 bg-foreground"
          style={{ top: `calc(${progress * 100}% - 2.5px)` }}
        />

        {/* Tiny horizontal tick at top — the "start" marker */}
        <span className="absolute -top-px -left-1 h-px w-2 bg-foreground/40" />

        {/* Tiny horizontal tick at bottom — the "end" marker */}
        <span className="absolute -bottom-px -left-1 h-px w-2 bg-border" />
      </div>

      {/* Label: `cd ~` — terminal for 'return home' */}
      <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground transition-colors duration-200 group-hover:text-foreground">
        cd ~
      </span>
    </motion.button>
  );
}
