import { PageHeader } from "@/app/components/admin/AdminPrimitives";
import {
  isSupabaseConfigured,
  SupabaseSetupPanel,
} from "@/app/components/admin/SupabaseGuard";
import GenerateBlogClient from "@/app/components/admin/GenerateBlogClient";
import { getRecentJobs } from "./actions";

export const dynamic = "force-dynamic";

export default async function GenerateBlogPage() {
  if (!isSupabaseConfigured()) return <SupabaseSetupPanel />;
  const jobs = await getRecentJobs();

  return (
    <>
      <PageHeader
        title="Generate with AI"
        description="Enter a topic — the pipeline researches it, writes a draft in your voice, renders a cover, and saves it as a draft for review. Configure every stage in blog-pipeline.yml."
        back={{ label: "Back to blog", href: "/admin/blog" }}
      />

      <div className="mx-auto max-w-3xl px-6 py-8 md:px-10 md:py-10">
        <GenerateBlogClient initialJobs={jobs} />
      </div>
    </>
  );
}
