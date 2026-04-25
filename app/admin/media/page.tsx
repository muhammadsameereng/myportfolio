import { PageHeader } from "@/app/components/admin/AdminPrimitives";
import MediaLibrary from "@/app/components/admin/MediaLibrary";
import {
  isSupabaseConfigured,
  SupabaseSetupPanel,
} from "@/app/components/admin/SupabaseGuard";

export const dynamic = "force-dynamic";

export default function AdminMediaPage() {
  if (!isSupabaseConfigured()) return <SupabaseSetupPanel />;
  return (
    <>
      <PageHeader
        title="Media"
        description="Every image uploaded across the admin lives here. Click to copy URLs, hover to delete."
      />
      <MediaLibrary />
    </>
  );
}
