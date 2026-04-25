import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProjectDetailContent from "../../components/ProjectDetailContent";
import { JsonLd, breadcrumbSchema, projectSchema } from "../../components/JsonLd";
import { PROJECTS, getProjectBySlug } from "../../lib/projects";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://saranzafar.com";

type Params = Promise<{ slug: string }>;

// ISR — pre-rendered at build, regenerated hourly when CMS-backed.
export const revalidate = 3600;
// Block unknown slugs — return 404 instead of generating on demand.
export const dynamicParams = false;

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return { title: "Project not found — Saran Zafar" };
  return {
    title: `${project.title} — Saran Zafar`,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      images: [{ url: project.thumb }],
    },
  };
}

export default async function ProjectDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  return (
    <main>
      <JsonLd data={projectSchema(project)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: SITE },
          { name: "Projects", url: `${SITE}/projects` },
          { name: project.title, url: `${SITE}/projects/${project.slug}` },
        ])}
      />
      <ProjectDetailContent project={project} />
    </main>
  );
}
