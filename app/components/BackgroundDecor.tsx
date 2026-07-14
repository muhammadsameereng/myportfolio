/**
 * Site-wide decorative background — a subtle dot grid and a soft glow
 * that sit at the very top of every public page. The static grid is a
 * pure CSS background-image (no DOM cost). On top of it, a field of
 * "twinkle" dots fade and slightly contract on their own staggered
 * timings, giving the field a subtle alive shimmer.
 *
 * Mounted from `PublicChrome` so admin pages stay visually clean.
 */

const TWINKLE_COUNT = 124;

// Deterministic pseudo-random in [min, max). Same input → same output, so
// SSR and client renders agree (no React hydration mismatch). Uses the
// classic sin-fract trick — good enough scatter for visual decoration.
function pseudo(seed: number, min: number, max: number) {
  const x = Math.sin(seed * 999.31) * 43758.5453;
  return min + (x - Math.floor(x)) * (max - min);
}

const TWINKLE_DOTS = Array.from({ length: TWINKLE_COUNT }, (_, i) => ({
  top: `${pseudo(i + 1, 3, 72).toFixed(2)}%`,
  left: `${pseudo(i + 1001, 3, 96).toFixed(2)}%`,
  duration: +pseudo(i + 2001, 3.2, 5.6).toFixed(2),
  delay: +pseudo(i + 3001, 0, 3.5).toFixed(2),
}));

export default function BackgroundDecor() {
  return (
    <>
      {/* Static dot grid — strongest near the top, fades to nothing by ~85% down. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[640px]"
        style={{
          backgroundImage:
            "radial-gradient(circle, currentColor 1.25px, transparent 1.25px)",
          backgroundSize: "24px 24px",
          color: "currentColor",
          opacity: 0.14,
          maskImage:
            "radial-gradient(ellipse 95% 75% at 50% 0%, black 0%, black 30%, transparent 85%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 95% 75% at 50% 0%, black 0%, black 30%, transparent 85%)",
        }}
      />

      {/* Twinkle layer — individually-animated dots overlaid on the grid.
          Each dot has its own duration + delay; the staggered timings
          make the shimmer look random instead of pulsing in unison.
          At peak brightness they slightly shrink — sharper twinkle feel. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[640px] overflow-hidden"
        style={{
          maskImage:
            "radial-gradient(ellipse 95% 75% at 50% 0%, black 0%, black 30%, transparent 85%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 95% 75% at 50% 0%, black 0%, black 30%, transparent 85%)",
        }}
      >
        {TWINKLE_DOTS.map((d, i) => (
          <span
            key={i}
            className="bg-twinkle-dot absolute h-[2.5px] w-[2.5px] rounded-full bg-black dark:bg-white"
            style={{
              top: d.top,
              left: d.left,
              opacity: 0.18,
              animation: `bg-twinkle ${d.duration}s ease-in-out ${d.delay}s infinite`,
              willChange: "opacity, transform",
            }}
          />
        ))}
      </div>

      {/* Soft top-of-page glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72"
        style={{
          background:
            "radial-gradient(ellipse 60% 100% at 50% 0%, rgb(0 0 0 / 0.05), transparent 70%)",
        }}
      />
    </>
  );
}
