import type { Metadata } from "next";
import ProjectsPageContent from "../components/ProjectsPageContent";
import {
  getPublicProjectCategories,
  getPublicProjects,
} from "../lib/public/projects";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Projects — Saran Zafar",
  description:
    "Selected work across SaaS, web, desktop, mobile, and e-commerce — projects shipped by Saran Zafar.",
};

export default async function ProjectsPage() {
  const [projects, categories] = await Promise.all([
    getPublicProjects(),
    getPublicProjectCategories(),
  ]);

  return (
    <main>
      <ProjectsPageContent projects={projects} categories={categories} />
    </main>
  );
}
