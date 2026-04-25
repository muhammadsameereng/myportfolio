import type { Metadata } from "next";
import ProjectsPageContent from "../components/ProjectsPageContent";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Projects — Saran Zafar",
  description:
    "Selected work across SaaS, web, desktop, mobile, and e-commerce — projects shipped by Saran Zafar.",
};

export default function ProjectsPage() {
  return (
    <main>
      <ProjectsPageContent />
    </main>
  );
}
