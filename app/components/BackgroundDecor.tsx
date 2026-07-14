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
            "radial-gradient(circle, #3b82f6 1.25px, transparent 1.25px)",
          backgroundSize: "24px 24px",
          opacity: 0.14,
          maskImage:
            "radial-gradient(ellipse 95% 75% at 50% 0%, black 0%, black 30%, transparent 85%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 95% 75% at 50% 0%, black 0%, black 30%, transparent 85%)",
        }}
      />
      {/* Blue gradient glow at top */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[500px]"
        style={{
          background:
            "radial-gradient(ellipse 75% 120% at 50% 0%, rgba(59,130,246,0.13), rgba(124,58,237,0.06) 55%, transparent 80%)",
        }}
      />
    </>
  );
}
