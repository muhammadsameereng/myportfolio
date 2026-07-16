import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogDetailContent from "../../components/BlogDetailContent";
import { JsonLd, articleSchema, breadcrumbSchema } from "../../components/JsonLd";
import {
  getPublicPostBySlug,
  getRelatedPublicPosts,
  getStaticPostSlugs,
} from "../../lib/public/blog";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://sameer-khan.vercel.app";

type Params = Promise<{ slug: string }>;

// ISR — regenerated hourly. dynamicParams=true so posts added in the
// admin after build still render (revalidatePath busts on save).
export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  // Cookie-less path — required outside an HTTP request scope.
  const slugs = await getStaticPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublicPostBySlug(slug);
  if (!post) return { title: "Post not found — Muhammad Sameer" };
  return {
    title: `${post.title} — Muhammad Sameer`,
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
  const [post, related] = await Promise.all([
    getPublicPostBySlug(slug),
    getRelatedPublicPosts(slug, 3),
  ]);
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
      <BlogDetailContent post={post} related={related} />
    </main>
  );
}
