import { Plus, Sparkles } from "lucide-react";
import {
  GhostButton,
  PageHeader,
  PrimaryButton,
} from "@/app/components/admin/AdminPrimitives";
import BlogTable from "@/app/components/admin/BlogTable";
import {
  isSupabaseConfigured,
  SupabaseSetupPanel,
} from "@/app/components/admin/SupabaseGuard";
import { getAllBlogForAdmin } from "@/app/lib/admin/data";

export const dynamic = "force-dynamic";

export default async function AdminBlogList() {
  if (!isSupabaseConfigured()) return <SupabaseSetupPanel />;
  const rows = (await getAllBlogForAdmin()) || [];

  return (
    <>
      <PageHeader
        title="Blog"
        description="Write, edit, feature, and unpublish blog posts."
        actions={
          <>
            <GhostButton href="/admin/blog/generate">
              <Sparkles size={13} />
              Generate with AI
            </GhostButton>
            <PrimaryButton href="/admin/blog/new">
              <Plus size={13} />
              New post
            </PrimaryButton>
          </>
        }
      />

      <div className="mx-auto max-w-6xl px-6 py-8 md:px-10 md:py-10">
        <p className="mb-4 text-[12.5px] text-muted-foreground">
          {rows.length} {rows.length === 1 ? "post" : "posts"} total
        </p>
        <BlogTable rows={rows} />
      </div>
    </>
  );
}
