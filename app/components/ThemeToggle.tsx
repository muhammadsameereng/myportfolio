"use client";

import { motion, useSpring, useTransform } from "framer-motion";
import { useTheme } from "./ThemeProvider";

/*
 * Morphing sun/moon toggle — single SVG, no icon swap.
 *
 * Uses an SVG <mask> to carve the crescent from the circle.
 * The mask circle animates its position to reveal/hide the bite.
 * Rays scale in/out with staggered spring physics.
 * The whole SVG rotates for a celestial feel.
 */

const rays = [
  { x1: 12, y1: 1, x2: 12, y2: 3 },
  { x1: 19.07, y1: 4.93, x2: 17.66, y2: 6.34 },
  { x1: 23, y1: 12, x2: 21, y2: 12 },
  { x1: 19.07, y1: 19.07, x2: 17.66, y2: 17.66 },
  { x1: 12, y1: 23, x2: 12, y2: 21 },
  { x1: 4.93, y1: 19.07, x2: 6.34, y2: 17.66 },
  { x1: 1, y1: 12, x2: 3, y2: 12 },
  { x1: 4.93, y1: 4.93, x2: 6.34, y2: 6.34 },
];

const spring = {
  type: "spring" as const,
  stiffness: 350,
  damping: 22,
};

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggle}
      className="relative flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-foreground/70 transition-colors hover:text-foreground"
      aria-label="Toggle theme"
    >
      <motion.svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        animate={{ rotate: isDark ? 40 : 0 }}
        transition={spring}
        style={{ overflow: "visible" }}
      >
        <defs>
          {/* Mask: white = visible, black = hidden */}
          <mask id="moon-mask">
            <rect x="0" y="0" width="24" height="24" fill="white" />
            <motion.circle
              fill="black"
              animate={{
                cx: isDark ? 28 : 18,
                cy: isDark ? 2 : 6,
                r: isDark ? 0 : 8,
              }}
              transition={spring}
            />
          </mask>
        </defs>

        {/* Sun/moon body — masked to create crescent */}
        <motion.circle
          cx="12"
          cy="12"
          fill="currentColor"
          stroke="none"
          mask="url(#moon-mask)"
          animate={{ r: isDark ? 5 : 9 }}
          transition={spring}
        />

        {/* Rays — stagger in for sun, stagger out for moon */}
        <g strokeWidth="2">
          {rays.map((ray, i) => {
            const midX = (ray.x1 + ray.x2) / 2;
            const midY = (ray.y1 + ray.y2) / 2;
            return (
              <motion.line
                key={i}
                x1={ray.x1}
                y1={ray.y1}
                x2={ray.x2}
                y2={ray.y2}
                animate={{
                  opacity: isDark ? 1 : 0,
                  scale: isDark ? 1 : 0,
                }}
                transition={{
                  ...spring,
                  delay: isDark ? 0.04 * i : 0.025 * (7 - i),
                }}
                style={{
                  transformOrigin: `${midX}px ${midY}px`,
                }}
              />
            );
          })}
        </g>
      </motion.svg>
    </button>
  );
}
