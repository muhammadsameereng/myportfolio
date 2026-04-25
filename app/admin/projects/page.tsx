import { Plus } from "lucide-react";
import {
  PageHeader,
  PrimaryButton,
} from "@/app/components/admin/AdminPrimitives";
import ProjectsTable from "@/app/components/admin/ProjectsTable";
import {
  isSupabaseConfigured,
  SupabaseSetupPanel,
} from "@/app/components/admin/SupabaseGuard";
import { getAllProjectsForAdmin } from "@/app/lib/admin/data";

export const dynamic = "force-dynamic";

export default async function AdminProjectsList() {
  if (!isSupabaseConfigured()) return <SupabaseSetupPanel />;
  const rows = (await getAllProjectsForAdmin()) || [];

  return (
    <>
      <PageHeader
        title="Projects"
        description="Create, edit, feature, and unpublish projects. Changes go live the moment you save."
        actions={
          <PrimaryButton href="/admin/projects/new">
            <Plus size={13} />
            New project
          </PrimaryButton>
        }
      />

      <div className="mx-auto max-w-6xl px-6 py-8 md:px-10 md:py-10">
        <p className="mb-4 text-[12.5px] text-muted-foreground">
          {rows.length} {rows.length === 1 ? "project" : "projects"} total
        </p>
        <ProjectsTable rows={rows} />
      </div>
    </>
  );
}
