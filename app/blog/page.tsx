import type { Metadata } from "next";
import BlogPageContent from "../components/BlogPageContent";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Blog — Saran Zafar",
  description:
    "Notes from the workbench — short writing on backend systems, frontend patterns, and the path from Kashmir.",
};

export default function BlogPage() {
  return (
    <main>
      <BlogPageContent />
    </main>
  );
}
