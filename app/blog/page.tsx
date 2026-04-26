import type { Metadata } from "next";
import BlogPageContent from "../components/BlogPageContent";
import { getPublicPosts } from "../lib/public/blog";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Blog — Saran Zafar",
  description:
    "Notes from the workbench — short writing on backend systems, frontend patterns, and the path from Kashmir.",
};

export default async function BlogPage() {
  const posts = await getPublicPosts();

  return (
    <main>
      <BlogPageContent posts={posts} />
    </main>
  );
}
