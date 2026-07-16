"use client";

import { useEffect, useRef } from "react";

/**
 * Site-wide layered mountain parallax.
 *
 * Five SVG ridge silhouettes anchored to the bottom of a fixed viewport
 * layer. On scroll each ridge translates upward at its own rate (near
 * ridges move more than far ones) → real depth. Atmospheric perspective is
 * baked into the alphas: far ridges are faint, near ridges stronger, so
 * text over the scene stays readable. A warm amber "alpenglow" behind the
 * peaks echoes the sunset photos.
 *
 * Only `transform` animates (GPU-composited, one rAF per scroll frame) and
 * the whole effect is disabled under prefers-reduced-motion.
 */

type Layer = {
  d: string;
  caps?: string; // optional snow / highlight path
  alpha: number;
  height: string;
  factor: number; // px moved up per px scrolled
  max: number; // clamp so ridges never lift past their bottom buffer (160px)
  scale: number; // how much this ridge grows across a full scroll (depth)
};

const LAYERS: Layer[] = [
  {
    // Far — hazy, low amplitude
    d: "M0 200 L96 188 L192 196 L288 172 L384 190 L480 168 L576 186 L672 160 L768 184 L864 166 L960 188 L1056 170 L1152 192 L1248 174 L1344 190 L1440 178 L1440 320 L0 320 Z",
    alpha: 0.1,
    height: "50vh",
    factor: 0.02,
    max: 55,
    scale: 0.04,
  },
  {
    // Mid
    d: "M0 230 L120 176 L240 214 L360 150 L480 200 L600 140 L720 196 L840 152 L960 206 L1080 158 L1200 210 L1320 168 L1440 196 L1440 320 L0 320 Z",
    alpha: 0.16,
    height: "56vh",
    factor: 0.05,
    max: 110,
    scale: 0.08,
  },
  {
    // Near — the big peaks, with snow caps
    d: "M0 280 L140 190 L260 250 L400 128 L520 236 L680 150 L820 230 L960 140 L1120 244 L1280 180 L1440 240 L1440 320 L0 320 Z",
    caps:
      "M366 152 L400 128 L436 156 L400 146 Z M926 164 L960 140 L996 168 L960 156 Z M646 172 L680 150 L716 176 L680 164 Z",
    alpha: 0.24,
    height: "64vh",
    factor: 0.085,
    max: 150,
    scale: 0.12,
  },
  {
    // Foreground hills
    d: "M0 300 L110 262 L240 292 L380 244 L520 296 L680 258 L820 296 L960 262 L1120 298 L1280 270 L1440 292 L1440 320 L0 320 Z",
    alpha: 0.34,
    height: "52vh",
    factor: 0.12,
    max: 158,
    scale: 0.16,
  },
];

// Scroll distance (px) over which the grow-on-scroll effect reaches its max.
const SCALE_REF = 1300;

// Deterministic pseudo-random in [min, max) — SSR and client agree, so no
// hydration mismatch. Classic sin-fract scatter.
function pseudo(seed: number, min: number, max: number) {
  const x = Math.sin(seed * 999.31) * 43758.5453;
  return min + (x - Math.floor(x)) * (max - min);
}

// Night-sky stars, scattered across the upper sky (above the ridges).
const STARS = Array.from({ length: 54 }, (_, i) => ({
  top: +pseudo(i + 1, 1, 58).toFixed(2),
  left: +pseudo(i + 700, 1, 99).toFixed(2),
  size: +pseudo(i + 1300, 1.1, 2.8).toFixed(2),
  delay: +pseudo(i + 1900, 0, 2.4).toFixed(2),
  tw: +pseudo(i + 2500, 3, 6).toFixed(2),
  warm: pseudo(i + 3100, 0, 1) > 0.74, // a few warm amber stars
}));

const SHOOTING = [
  { top: "10%", left: "5%", w: 120, dur: 9, delay: 3 },
  { top: "19%", left: "45%", w: 92, dur: 13, delay: 7.5 },
];

export default function MountainParallax() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const root = rootRef.current;
    if (!root) return;
    const layers = Array.from(
      root.querySelectorAll<SVGSVGElement>("[data-factor]")
    );
    let raf = 0;
    const apply = () => {
      raf = 0;
      const y = window.scrollY;
      const p = Math.min(y / SCALE_REF, 1); // 0 → 1 scroll progress
      for (const l of layers) {
        const f = parseFloat(l.dataset.factor || "0");
        const m = parseFloat(l.dataset.max || "0");
        const s = parseFloat(l.dataset.scale || "0");
        const shift = Math.min(y * f, m);
        const scale = 1 + p * s;
        // Scale grows from the base (transform-origin bottom), then the
        // whole ridge lifts — so peaks visibly enlarge on scroll with no
        // gap opening at the bottom.
        l.style.transform = `translate3d(0, ${-shift}px, 0) scale(${scale})`;
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(apply);
    };
    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* Night-sky stars — dark mode only. Each splashes in, then twinkles;
          two shooting stars streak occasionally. */}
      <div className="hidden dark:block">
        {STARS.map((s, i) => (
          <span
            key={i}
            className="star"
            style={{
              top: `${s.top}%`,
              left: `${s.left}%`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              background: s.warm
                ? "rgb(var(--bg-amber))"
                : "rgb(255 255 255 / 0.95)",
              boxShadow: `0 0 ${(s.size * 2).toFixed(1)}px ${
                s.warm
                  ? "rgb(var(--bg-amber) / 0.7)"
                  : "rgb(255 255 255 / 0.55)"
              }`,
              animation: `star-splash 0.8s cubic-bezier(0.22,1,0.36,1) ${s.delay}s both, star-twinkle ${s.tw}s ease-in-out ${(s.delay + 0.9).toFixed(2)}s infinite`,
            }}
          />
        ))}
        {SHOOTING.map((s, i) => (
          <span
            key={`sh-${i}`}
            className="shooting-star"
            style={{
              top: s.top,
              left: s.left,
              width: `${s.w}px`,
              height: "2px",
              background:
                "linear-gradient(90deg, transparent, rgb(255 255 255 / 0.9))",
              animation: `shooting-star ${s.dur}s ease-in ${s.delay}s infinite`,
            }}
          />
        ))}
      </div>

      {/* Amber alpenglow behind the peaks (sunset tie-in) */}
      <div
        className="absolute left-[38%] top-[26%] h-[42vh] w-[42vh] -translate-x-1/2 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgb(var(--bg-amber) / 0.18), transparent 70%)",
        }}
      />

      {LAYERS.map((l, i) => (
        <svg
          key={i}
          data-factor={l.factor}
          data-max={l.max}
          data-scale={l.scale}
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          className="absolute inset-x-0 bottom-[-160px] w-full will-change-transform"
          style={{ height: l.height, transformOrigin: "bottom center" }}
        >
          <path d={l.d} style={{ fill: `rgb(var(--bg-teal) / ${l.alpha})` }} />
          {l.caps && (
            <path d={l.caps} style={{ fill: "rgb(255 255 255 / 0.1)" }} />
          )}
        </svg>
      ))}
    </div>
  );
}
