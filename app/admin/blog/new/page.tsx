import BlogEditor from "@/app/components/admin/BlogEditor";
import {
  isSupabaseConfigured,
  SupabaseSetupPanel,
} from "@/app/components/admin/SupabaseGuard";
import { getCategoriesByKind } from "@/app/lib/admin/data";

export const dynamic = "force-dynamic";

export default async function NewBlogPostPage() {
  if (!isSupabaseConfigured()) return <SupabaseSetupPanel />;
  const categories = (await getCategoriesByKind("blog")) || [];
  return <BlogEditor categories={categories} />;
}
