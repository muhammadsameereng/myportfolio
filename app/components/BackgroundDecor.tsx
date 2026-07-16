/**
 * Site-wide decorative background — the layered mountain parallax (with a
 * dark-mode starfield baked in) plus a soft top-of-page glow.
 *
 * Mounted from `PublicChrome` so admin pages stay visually clean.
 */

import MountainParallax from "./MountainParallax";

export default function BackgroundDecor() {
  return (
    <>
      {/* Layered mountain parallax — site-wide, scroll-reactive, with a
          splashing starfield in dark mode. */}
      <MountainParallax />

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
