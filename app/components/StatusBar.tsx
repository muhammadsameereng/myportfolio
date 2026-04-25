"use client";

import { useEffect, useState } from "react";

/**
 * StatusBar — the window chrome.
 *
 * A fixed, hairline-thick strip at the bottom of the viewport that makes
 * the whole site feel like a window of an editor/terminal. Left side
 * carries system identity (branch + host + local time in Kotli); right
 * side tracks the active section as the user scrolls. Intentionally
 * quiet — it's the frame, not the picture.
 */

const SECTIONS: { id: string; label: string }[] = [
  { id: "hero", label: "~/" },
  { id: "about", label: "~/about" },
  { id: "skills", label: "~/skills" },
  { id: "projects", label: "~/work" },
  { id: "testimonials", label: "~/testimonials" },
  { id: "blog", label: "~/blog" },
];

function formatKotliTime(d: Date): string {
  try {
    return new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Asia/Karachi",
    }).format(d);
  } catch {
    return "--:--";
  }
}

export default function StatusBar() {
  const [time, setTime] = useState<string>("");
  const [active, setActive] = useState<string>("~/");

  useEffect(() => {
    const tick = () => setTime(formatKotliTime(new Date()));
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const update = () => {
      const probe = window.innerHeight * 0.35;
      let current = SECTIONS[0].label;
      for (const s of SECTIONS) {
        const el = document.getElementById(s.id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= probe) current = s.label;
      }
      setActive(current);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-30 border-t border-border/60 bg-background/85 backdrop-blur-sm"
    >
      <div className="mx-auto flex h-6 max-w-6xl items-center justify-between px-6 font-mono text-[10px] uppercase leading-none tracking-[0.22em] text-muted-foreground sm:px-8">
        {/* Left: system identity */}
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-foreground/80">
            <span aria-hidden>⎇</span>
            <span>main</span>
          </span>
          <span className="h-2.5 w-px bg-border" />
          <span className="hidden sm:inline">saranzafar.com</span>
          <span className="hidden sm:inline h-2.5 w-px bg-border" />
          <span className="flex items-center gap-1.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-foreground/60 opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-foreground" />
            </span>
            <span>kotli {time}</span>
          </span>
        </div>

        {/* Right: active section */}
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline">utf-8</span>
          <span className="hidden sm:inline h-2.5 w-px bg-border" />
          <span className="text-foreground/80">{active}</span>
        </div>
      </div>
    </div>
  );
}
