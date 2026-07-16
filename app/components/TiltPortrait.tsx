"use client";

import Image from "next/image";
import { useRef } from "react";

/**
 * 3D portrait — tilts toward the cursor on mouse move (perspective +
 * rotateX/rotateY), gently floats when idle, and catches a soft glare that
 * follows the pointer. Efficient by construction:
 *  - transform / opacity only (GPU-composited), pointer updates rAF-throttled
 *  - tilt only for a real mouse (touch just gets the idle float)
 *  - fully disabled under prefers-reduced-motion (see globals.css)
 */
export default function TiltPortrait({
  src,
  alt,
  className = "",
  priority = false,
  sizes = "(max-width: 768px) 320px, 420px",
  overlay,
  badge,
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
  overlay?: React.ReactNode;
  badge?: React.ReactNode;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef(0);

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return; // tilt with a real cursor only
    const el = cardRef.current;
    if (!el || rafRef.current) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = 0;
      el.style.setProperty("--rx", `${(0.5 - py) * 14}deg`);
      el.style.setProperty("--ry", `${(px - 0.5) * 14}deg`);
      el.style.setProperty("--gx", `${px * 100}%`);
      el.style.setProperty("--gy", `${py * 100}%`);
      el.style.setProperty("--go", "1");
    });
  };

  const onLeave = () => {
    const el = cardRef.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
    el.style.setProperty("--go", "0");
  };

  return (
    <div
      className={`tilt-perspective ${className}`}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      <div className="tilt-float relative">
        {/* Glow (behind, floats but doesn't tilt) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-5 rounded-[2.25rem] opacity-70 blur-2xl"
          style={{
            background:
              "radial-gradient(60% 55% at 30% 20%, rgba(14,116,144,0.38), transparent 70%), radial-gradient(55% 55% at 82% 88%, rgba(217,138,61,0.32), transparent 70%)",
          }}
        />

        {/* Tilting frame */}
        <div
          ref={cardRef}
          className="tilt-card relative aspect-[4/5] overflow-hidden rounded-[1.75rem] border border-border bg-card shadow-[0_30px_70px_-30px_rgba(0,0,0,0.4)]"
        >
          <Image
            src={src}
            alt={alt}
            fill
            priority={priority}
            fetchPriority={priority ? "high" : undefined}
            sizes={sizes}
            className="select-none object-cover object-top"
          />
          {/* Bottom fade so the frame reads as one object */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/30 to-transparent"
          />
          {/* Cursor glare */}
          <div aria-hidden="true" className="tilt-glare pointer-events-none absolute inset-0" />
          {overlay}
        </div>

        {badge}
      </div>
    </div>
  );
}
