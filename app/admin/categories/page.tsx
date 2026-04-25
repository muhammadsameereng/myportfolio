import { PageHeader } from "@/app/components/admin/AdminPrimitives";
import CategoriesManager from "@/app/components/admin/CategoriesManager";
import {
  isSupabaseConfigured,
  SupabaseSetupPanel,
} from "@/app/components/admin/SupabaseGuard";
import { getCategories } from "@/app/lib/admin/data";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  if (!isSupabaseConfigured()) return <SupabaseSetupPanel />;
  const categories = (await getCategories()) || [];
  return (
    <>
      <PageHeader
        title="Categories"
        description="Used to group projects and blog posts. Each kind has its own list."
      />
      <div className="mx-auto max-w-4xl px-6 py-8 md:px-10 md:py-10">
        <CategoriesManager initial={categories} />
      </div>
    </>
  );
}
