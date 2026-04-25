import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { PROJECTS } from "../lib/projects";
import SectionHead from "./SectionHead";

// Server Component — no "use client", no JS shipped to browser.
// Renders the first 6 projects from the shared catalog with a CTA
// to the full /projects page.
export default function HomeProjects() {
  const featured = PROJECTS.slice(0, 6);

  return (
    <section id="projects" className="relative">
      <div className="mx-auto max-w-5xl px-6 py-16 md:py-20">
        <SectionHead
          title="Projects"
          description="Here's a glimpse into some of my recent projects. Be sure to check back often, as I'm always adding new and exciting work to this list!"
        />

        <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-7 md:grid-cols-3">
          {featured.map((p) => (
            <Link
              key={p.slug}
              href={`/projects/${p.slug}`}
              className="group flex flex-col"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-muted/30">
                <Image
                  src={p.thumb}
                  alt={p.title}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 320px"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />
                <span className="absolute top-2.5 left-2.5 rounded-full bg-background/85 px-2 py-0.5 text-[10.5px] font-medium uppercase tracking-wider text-foreground backdrop-blur-sm">
                  {p.category}
                </span>
              </div>
              <p className="mt-2.5 line-clamp-2 text-[12.5px] leading-snug text-foreground transition-colors group-hover:text-foreground">
                {p.title}
              </p>
            </Link>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            href="/projects"
            className="group inline-flex h-9 items-center gap-1.5 rounded-full bg-foreground pl-4 pr-3.5 text-[12.5px] font-medium text-background transition-all duration-200 hover:scale-[1.02] hover:opacity-95"
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
