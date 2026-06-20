"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight, ChevronLeft, ChevronRight, X } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { type Project } from "../lib/projects";

// See BlogDetailContent — dynamic-imported so react-markdown lives in
// a route-specific async chunk, not the global vendor chunk.
const ProjectMarkdown = dynamic(() => import("./ProjectMarkdown"));

function GithubIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 12 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] as const },
});

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <motion.h2
      {...fadeUp(0)}
      className="mt-16 text-[22px] font-bold tracking-tight text-foreground sm:text-[24px]"
    >
      {children}
    </motion.h2>
  );
}

function Para({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.p
      {...fadeUp(delay)}
      className="text-[15.5px] leading-[1.75] text-foreground/85"
    >
      {children}
    </motion.p>
  );
}

/* ── Lightbox ─────────────────────────────────────────────────────────
   Minimal accessible image viewer:
   - Esc / backdrop click → close
   - ← / → keys + on-screen buttons → navigate
   - Counter shown bottom-center
*/
function Lightbox({
  images,
  index,
  alt,
  onClose,
  onPrev,
  onNext,
}: {
  images: string[];
  index: number;
  alt: string;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const [loaded, setLoaded] = useState(false);

  // Reset spinner whenever the active image changes.
  useEffect(() => {
    setLoaded(false);
  }, [index]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") onPrev();
      else if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose, onPrev, onNext]);

  const src = images[index];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={`${alt} — image ${index + 1} of ${images.length}`}
      onClick={onClose}
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        aria-label="Close"
        className="absolute top-4 right-4 z-[101] flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/20"
      >
        <X size={18} />
      </button>

      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
            aria-label="Previous image"
            className="absolute left-3 top-1/2 z-[101] flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/20 sm:left-6"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            aria-label="Next image"
            className="absolute right-3 top-1/2 z-[101] flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/20 sm:right-6"
          >
            <ChevronRight size={22} />
          </button>
        </>
      )}

      <motion.div
        key={src}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.2 }}
        className="relative mx-4 flex max-h-[90vh] max-w-[95vw] items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {!loaded && (
          <span className="absolute inline-block h-10 w-10 animate-spin rounded-full border-2 border-white/30 border-t-white" />
        )}
        <Image
          src={src}
          alt={`${alt} — ${index + 1}`}
          width={3000}
          height={2000}
          sizes="95vw"
          quality={85}
          loading="eager"
          fetchPriority="high"
          onLoad={() => setLoaded(true)}
          className={`h-auto max-h-[90vh] w-auto max-w-[95vw] rounded-xl object-contain shadow-2xl transition-opacity duration-200 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
        />
      </motion.div>

      {images.length > 1 && (
        <div className="absolute bottom-5 left-1/2 z-[101] -translate-x-1/2 rounded-full bg-white/10 px-3 py-1 text-[12px] font-medium text-white backdrop-blur">
          {index + 1} / {images.length}
        </div>
      )}
    </motion.div>
  );
}

export default function ProjectDetailContent({
  project,
  related,
}: {
  project: Project;
  related: Project[];
}) {
  const gallery = project.gallery && project.gallery.length > 0 ? project.gallery : null;
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  const close = useCallback(() => setActiveIdx(null), []);
  const prev = useCallback(() => {
    if (!gallery) return;
    setActiveIdx((i) =>
      i === null ? null : (i - 1 + gallery.length) % gallery.length
    );
  }, [gallery]);
  const next = useCallback(() => {
    if (!gallery) return;
    setActiveIdx((i) => (i === null ? null : (i + 1) % gallery.length));
  }, [gallery]);

  return (
    <article className="relative">
      <div className="mx-auto max-w-3xl px-6 py-10 md:py-14">
        {/* Back link */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <Link
            href="/projects"
            className="group inline-flex items-center gap-2 text-[12.5px] font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft
              size={14}
              className="transition-transform duration-200 group-hover:-translate-x-0.5"
            />
            Back to projects
          </Link>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05, ease: "easeOut" }}
          className="mt-6 text-[34px] font-bold leading-[1.05] tracking-tight text-foreground sm:text-[40px]"
        >
          {project.title}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          className="mt-3 text-[14px] leading-relaxed text-muted-foreground"
        >
          {project.description}
        </motion.p>

        {/* Meta row + CTAs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-6 flex flex-wrap items-center justify-between gap-4"
        >
          <div className="flex flex-wrap items-center gap-3 text-[11.5px] uppercase tracking-[0.18em] text-muted-foreground">
            <span className="rounded-full bg-foreground px-2.5 py-1 text-background">
              {project.category}
            </span>
            <span>{project.year}</span>
            <span className="h-3 w-px bg-border" />
            <span>{project.role}</span>
          </div>

          {(project.liveUrl || project.repoUrl) && (
            <div className="flex flex-wrap items-center gap-2.5">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-full bg-foreground px-4 text-[12.5px] font-medium text-background transition-all duration-200 hover:scale-[1.02] hover:opacity-95"
                >
                  View Live
                  <ArrowUpRight
                    size={13}
                    className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </a>
              )}
              {project.repoUrl && (
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-full border border-border bg-background px-4 text-[12.5px] font-medium text-foreground transition-colors duration-200 hover:border-foreground/50 hover:bg-card"
                >
                  <GithubIcon size={13} />
                  Code
                </a>
              )}
            </div>
          )}
        </motion.div>

        {/* Hero thumbnail */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.2, ease: "easeOut" }}
          className="mt-8 overflow-hidden rounded-2xl border border-border bg-muted/30"
        >
          <Image
            src={project.thumb}
            alt={project.title}
            width={1600}
            height={900}
            preload
            sizes="(max-width: 768px) 100vw, 768px"
            className="aspect-[16/9] w-full object-cover"
          />
        </motion.div>

        {/* ── Tags ── */}
        {project.tags && project.tags.length > 0 && (
          <motion.div
            {...fadeUp(0.05)}
            className="mt-6 flex flex-wrap gap-2"
            aria-label="Project tags"
          >
            {project.tags.map((t) => (
              <span
                key={t}
                className="inline-flex items-center rounded-full border border-border bg-card px-3 py-1 text-[11.5px] font-medium text-foreground/80"
              >
                {t}
              </span>
            ))}
          </motion.div>
        )}

        {/* ── Markdown body (DB-sourced long_description) ── */}
        {project.body && (
          <motion.div {...fadeUp(0.05)} className="mt-12">
            <ProjectMarkdown source={project.body} />
          </motion.div>
        )}

        {/* ── Gallery (optional) ── */}
        {gallery && (
          <>
            <SectionTitle>Gallery</SectionTitle>
            <motion.div
              {...fadeUp(0.05)}
              className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2"
            >
              {gallery.map((src, i) => (
                <button
                  key={src + i}
                  type="button"
                  onClick={() => setActiveIdx(i)}
                  aria-label={`Open image ${i + 1} of ${gallery.length}`}
                  className="group relative aspect-[4/3] cursor-zoom-in overflow-hidden rounded-2xl border border-border bg-muted/30"
                >
                  <Image
                    src={src}
                    alt={`${project.title} — gallery image ${i + 1}`}
                    fill
                    loading="lazy"
                    quality={60}
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                  />
                </button>
              ))}
            </motion.div>
          </>
        )}

        {/* ── Tech Stack ── */}
        {project.techStack && project.techStack.length > 0 && (
          <>
            <SectionTitle>Technology Stack</SectionTitle>
            <motion.div {...fadeUp(0.05)} className="mt-5 flex flex-wrap gap-2">
              {project.techStack.map((s) => (
                <span
                  key={s.name}
                  className="inline-flex h-9 items-center rounded-xl border border-border bg-card px-3 text-[12.5px] font-medium text-foreground/85"
                >
                  {s.name}
                </span>
              ))}
            </motion.div>
          </>
        )}

        {/* ── Project Overview ── */}
        {project.overview && project.overview.length > 0 && (
          <>
            <SectionTitle>Project Overview</SectionTitle>
            <div className="mt-5 space-y-4">
              {project.overview.map((p, i) => (
                <Para key={i} delay={0.04 * i}>
                  {p}
                </Para>
              ))}
            </div>
          </>
        )}

        {/* ── Objectives ── */}
        {project.objectives && project.objectives.length > 0 && (
          <>
            <SectionTitle>Objectives</SectionTitle>
            <motion.p
              {...fadeUp(0.05)}
              className="mt-3 text-[15.5px] leading-[1.75] text-foreground/85"
            >
              The primary goals of the LMS rebuild were:
            </motion.p>
            <motion.ul
              {...fadeUp(0.1)}
              className="mt-4 space-y-2.5 text-[15px] leading-[1.7] text-foreground/85"
            >
              {project.objectives.map((o, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-[10px] inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/70" />
                  <span>{o}</span>
                </li>
              ))}
            </motion.ul>
          </>
        )}

        {/* ── Domain and Industry Context ── */}
        {project.domain && project.domain.length > 0 && (
          <>
            <SectionTitle>Domain and Industry Context</SectionTitle>
            <div className="mt-5 space-y-4">
              {project.domain.map((p, i) => (
                <Para key={i} delay={0.04 * i}>
                  {p}
                </Para>
              ))}
            </div>
          </>
        )}

        {/* ── Features ── */}
        {project.features && project.features.length > 0 && (
          <>
            <SectionTitle>Features</SectionTitle>
            <div className="mt-6 space-y-14">
              {project.features.map((f, fi) => (
                <div key={f.title}>
                  <motion.h3
                    {...fadeUp(0)}
                    className="text-[17px] font-semibold tracking-tight text-foreground"
                  >
                    {f.title}
                  </motion.h3>
                  <motion.p
                    {...fadeUp(0.05)}
                    className="mt-3 text-[15px] leading-[1.7] text-foreground/85"
                  >
                    {f.description}
                  </motion.p>
                  {f.images.length > 0 && (
                    <div className="mt-6 space-y-4">
                      {f.images.map((src, i) => (
                        <motion.div
                          key={i}
                          {...fadeUp(0.06 * i)}
                          className="overflow-hidden rounded-2xl border border-border bg-muted/30"
                        >
                          <Image
                            src={src}
                            alt={`${f.title} screenshot ${i + 1}`}
                            width={1600}
                            height={900}
                            loading="lazy"
                            sizes="(max-width: 768px) 100vw, 768px"
                            className="aspect-[16/9] w-full object-cover"
                          />
                        </motion.div>
                      ))}
                    </div>
                  )}
                  {fi < project.features!.length - 1 && (
                    <div className="mt-14 h-px w-full bg-border/60" />
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── Outcome ── */}
        {project.outcome && project.outcome.length > 0 && (
          <>
            <SectionTitle>Outcome</SectionTitle>
            <div className="mt-5 space-y-4">
              {project.outcome.map((p, i) => (
                <Para key={i} delay={0.04 * i}>
                  {p}
                </Para>
              ))}
            </div>
          </>
        )}

        {/* ── Conclusion ── */}
        {project.conclusion && project.conclusion.length > 0 && (
          <>
            <SectionTitle>Conclusion</SectionTitle>
            <div className="mt-5 space-y-4">
              {project.conclusion.map((p, i) => (
                <Para key={i} delay={0.04 * i}>
                  {p}
                </Para>
              ))}
            </div>
          </>
        )}

        {/* ── Fallback long description (used when richer sections aren't set) ── */}
        {!project.body && !project.overview && project.longDescription && project.longDescription.length > 0 && (
          <>
            <SectionTitle>About this project</SectionTitle>
            <div className="mt-5 space-y-4">
              {project.longDescription.map((p, i) => (
                <Para key={i} delay={0.04 * i}>
                  {p}
                </Para>
              ))}
            </div>
          </>
        )}

        {/* ── More projects ── */}
        {related.length > 0 && (
          <motion.section
            {...fadeUp(0)}
            className="mt-20 border-t border-border pt-10"
          >
            <div className="flex items-baseline justify-between">
              <h2 className="text-[18px] font-semibold tracking-tight text-foreground">
                More projects
              </h2>
              <Link
                href="/projects"
                className="group inline-flex items-center gap-1.5 text-[12.5px] font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                See all
                <ArrowUpRight
                  size={13}
                  className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
              {related.map((p) => (
                <motion.div key={p.slug} whileHover={{ y: -3 }}>
                  <Link href={`/projects/${p.slug}`} className="group flex flex-col">
                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-muted/30">
                      <Image
                        src={p.thumb}
                        alt={p.title}
                        fill
                        loading="lazy"
                        sizes="(max-width: 640px) 100vw, 250px"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                      />
                      <span className="absolute top-2.5 left-2.5 rounded-full bg-background/85 px-2 py-0.5 text-[10.5px] font-medium uppercase tracking-wider text-foreground backdrop-blur-sm">
                        {p.category}
                      </span>
                    </div>
                    <p className="mt-2.5 line-clamp-2 text-[12.5px] leading-snug text-foreground">
                      {p.title}
                    </p>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}
      </div>

      <AnimatePresence>
        {gallery && activeIdx !== null && (
          <Lightbox
            images={gallery}
            index={activeIdx}
            alt={project.title}
            onClose={close}
            onPrev={prev}
            onNext={next}
          />
        )}
      </AnimatePresence>
    </article>
  );
}
