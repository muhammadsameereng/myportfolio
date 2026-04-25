import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogDetailContent from "../../components/BlogDetailContent";
import { JsonLd, articleSchema, breadcrumbSchema } from "../../components/JsonLd";
import { POSTS, getPostBySlug } from "../../lib/blogs";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://saranzafar.com";

type Params = Promise<{ slug: string }>;

// ISR — pre-rendered at build, regenerated hourly when CMS-backed.
export const revalidate = 3600;
// Block dynamic params not in PROJECTS — return 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Post not found — Saran Zafar" };
  return {
    title: `${post.title} — Saran Zafar`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [{ url: post.thumb }],
      type: "article",
      publishedTime: post.isoDate,
      tags: post.tags,
    },
  };
}

export default async function BlogDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <main>
      <JsonLd data={articleSchema(post)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: SITE },
          { name: "Blog", url: `${SITE}/blog` },
          { name: post.title, url: `${SITE}/blog/${post.slug}` },
        ])}
      />
      <BlogDetailContent post={post} />
    </main>
  );
}
