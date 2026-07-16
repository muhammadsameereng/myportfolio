import type { Metadata } from "next";
import BlogPageContent from "../components/BlogPageContent";
import { JsonLd, breadcrumbLd } from "../components/JsonLd";
import {
  getPublicBlogCategories,
  getPublicPosts,
} from "../lib/public/blog";

export const revalidate = 3600;

const description =
  "Writing by Muhammad Sameer on backend systems, offline-first architecture, multi-tenant SaaS, NestJS, and React Native — notes from the workbench in Azad Kashmir.";

export const metadata: Metadata = {
  title: "Blog — Muhammad Sameer",
  description,
  keywords: [
    "Muhammad Sameer blog",
    "software engineering blog",
    "backend development",
    "offline-first architecture",
    "NestJS",
    "React Native",
    "Next.js",
  ],
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Blog — Muhammad Sameer",
    description,
    url: "/blog",
    type: "website",
  },
};

export default async function BlogPage() {
  const [posts, categories] = await Promise.all([
    getPublicPosts(),
    getPublicBlogCategories(),
  ]);

  return (
    <main>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
        ])}
      />
      <BlogPageContent posts={posts} categories={categories} />
    </main>
  );
}
