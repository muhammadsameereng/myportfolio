/**
 * Site-wide decorative background — a subtle dot grid and a soft glow
 * that sit at the very top of every public page. Both are pure CSS,
 * no images, no JS, no runtime cost. Faded via `mask-image` so they
 * never compete with the navbar or the page content below.
 *
 * Mounted from `PublicChrome` so admin pages stay visually clean.
 */
export default function BackgroundDecor() {
  return (
    <>
      {/* Dot grid — strongest near the top, fades to nothing by ~85% down. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[640px]"
        style={{
          backgroundImage:
            "radial-gradient(circle, currentColor 1.25px, transparent 1.25px)",
          backgroundSize: "24px 24px",
          color: "currentColor",
          opacity: 0.18,
          maskImage:
            "radial-gradient(ellipse 95% 75% at 50% 0%, black 0%, black 30%, transparent 85%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 95% 75% at 50% 0%, black 0%, black 30%, transparent 85%)",
        }}
      />
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
