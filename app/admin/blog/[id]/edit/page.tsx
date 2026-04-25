import { notFound } from "next/navigation";
import BlogEditor from "@/app/components/admin/BlogEditor";
import {
  isSupabaseConfigured,
  SupabaseSetupPanel,
} from "@/app/components/admin/SupabaseGuard";
import {
  getBlogPostById,
  getCategoriesByKind,
} from "@/app/lib/admin/data";

export const dynamic = "force-dynamic";

export default async function EditBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!isSupabaseConfigured()) return <SupabaseSetupPanel />;
  const { id } = await params;
  const [post, categories] = await Promise.all([
    getBlogPostById(id),
    getCategoriesByKind("blog"),
  ]);
  if (!post) notFound();
  return <BlogEditor initial={post} categories={categories || []} />;
}
