import type { Metadata } from "next";
import ProjectsPageContent from "../components/ProjectsPageContent";
import { JsonLd, breadcrumbLd } from "../components/JsonLd";
import {
  getPublicProjectCategories,
  getPublicProjects,
} from "../lib/public/projects";

export const revalidate = 3600;

const description =
  "Selected work by Muhammad Sameer across multi-tenant SaaS, social commerce, and delivery/e-commerce — built with Next.js, NestJS, React Native, and Flutter.";

export const metadata: Metadata = {
  title: "Projects — Muhammad Sameer",
  description,
  keywords: [
    "Muhammad Sameer projects",
    "software engineer portfolio",
    "Next.js NestJS projects",
    "React Native Flutter apps",
    "multi-tenant SaaS",
    "case studies",
  ],
  alternates: { canonical: "/projects" },
  openGraph: {
    title: "Projects — Muhammad Sameer",
    description,
    url: "/projects",
    type: "website",
  },
};

export default async function ProjectsPage() {
  const [projects, categories] = await Promise.all([
    getPublicProjects(),
    getPublicProjectCategories(),
  ]);

  return (
    <main>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Projects", path: "/projects" },
        ])}
      />
      <ProjectsPageContent projects={projects} categories={categories} />
    </main>
  );
}
