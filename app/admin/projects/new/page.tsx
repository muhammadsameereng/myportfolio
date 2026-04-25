import ProjectEditor from "@/app/components/admin/ProjectEditor";
import {
  isSupabaseConfigured,
  SupabaseSetupPanel,
} from "@/app/components/admin/SupabaseGuard";
import { getCategoriesByKind } from "@/app/lib/admin/data";

export const dynamic = "force-dynamic";

export default async function NewProjectPage() {
  if (!isSupabaseConfigured()) return <SupabaseSetupPanel />;
  const categories = (await getCategoriesByKind("project")) || [];
  return <ProjectEditor categories={categories} />;
}
