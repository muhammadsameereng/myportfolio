import { notFound } from "next/navigation";
import ProjectEditor from "@/app/components/admin/ProjectEditor";
import {
  isSupabaseConfigured,
  SupabaseSetupPanel,
} from "@/app/components/admin/SupabaseGuard";
import {
  getCategoriesByKind,
  getProjectById,
} from "@/app/lib/admin/data";

export const dynamic = "force-dynamic";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!isSupabaseConfigured()) return <SupabaseSetupPanel />;
  const { id } = await params;
  const [project, categories] = await Promise.all([
    getProjectById(id),
    getCategoriesByKind("project"),
  ]);
  if (!project) notFound();
  return <ProjectEditor initial={project} categories={categories || []} />;
}
