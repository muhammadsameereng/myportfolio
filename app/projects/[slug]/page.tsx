import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProjectDetailContent from "../../components/ProjectDetailContent";
import { JsonLd, breadcrumbSchema, projectSchema } from "../../components/JsonLd";
import {
  getPublicProjectBySlug,
  getRelatedPublicProjects,
  getStaticProjectSlugs,
} from "../../lib/public/projects";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://saranzafar.com";

type Params = Promise<{ slug: string }>;

// ISR — regenerated hourly. dynamicParams=true so projects added in
// the admin after build still render (revalidateTag busts on save).
export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  // Cookie-less path — `generateStaticParams` runs without an HTTP request
  // scope, so the cookie-based server client can't be used here.
  const slugs = await getStaticProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getPublicProjectBySlug(slug);
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
  const [project, related] = await Promise.all([
    getPublicProjectBySlug(slug),
    getRelatedPublicProjects(slug, 3),
  ]);
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
      <ProjectDetailContent project={project} related={related} />
    </main>
  );
}
