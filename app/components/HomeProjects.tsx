import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getFeaturedProjects } from "../lib/public/projects";
import SectionHead from "./SectionHead";

// Server Component — fetches 6 featured projects from the public data
// layer (Supabase, with static fallback). Zero JS shipped to browser.
export default async function HomeProjects() {
  const featured = await getFeaturedProjects(6);

  if (featured.length === 0) return null;

  return (
    <section id="projects" className="relative">
      <div className="mx-auto max-w-5xl px-6 py-16 md:py-20">
        <SectionHead
          title="Projects"
          description="Here's a glimpse into some of my recent projects. Be sure to check back often, as I'm always adding new and exciting work to this list!"
        />

        <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-7 md:grid-cols-3">
          {featured.map((p, i) => (
            <Link
              key={p.slug}
              href={`/projects/${p.slug}`}
              // Small screens (≤md): show only the first 3 cards.
              // Larger screens: show all 6. CSS-only — no extra JS,
              // no separate fetch, layout-shift safe.
              className={`group flex flex-col ${
                i >= 3 ? "hidden md:flex" : ""
              }`}
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border bg-muted/30 transition-all duration-300 group-hover:border-accent/45 group-hover:shadow-[0_18px_44px_-18px_rgb(var(--bg-teal)/0.5)]">
                <Image
                  src={p.thumb}
                  alt={`${p.title} — ${p.category} project by Muhammad Sameer`}
                  fill
                  quality={60}
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 256px"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                />
                {/* Palette overlay — fades in on hover for depth + cohesion. */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    background:
                      "linear-gradient(to top, rgb(var(--bg-teal) / 0.28), transparent 55%)",
                  }}
                />
                <span className="absolute top-2.5 left-2.5 rounded-full border border-border/60 bg-background/85 px-2 py-0.5 text-[10.5px] font-medium uppercase tracking-wider text-foreground backdrop-blur-sm">
                  {p.category}
                </span>
              </div>
              <p className="mt-2.5 line-clamp-2 text-[12.5px] leading-snug text-foreground transition-colors group-hover:text-accent">
                {p.title}
              </p>
            </Link>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            href="/projects"
            className="group inline-flex h-9 items-center gap-1.5 rounded-full pl-4 pr-3.5 text-[12.5px] font-medium text-white transition-all duration-200 hover:scale-[1.02] hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #0e7490, #d98a3d)" }}
          >
            View All Projects
            <ArrowRight
              size={13}
              strokeWidth={2}
              className="transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
