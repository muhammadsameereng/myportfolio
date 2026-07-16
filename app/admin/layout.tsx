import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AdminShell from "@/app/components/admin/AdminShell";
import { ToastProvider } from "@/app/components/admin/Toast";
import { isAdminEmail } from "@/app/lib/admin/auth";
import { createClient } from "@/app/lib/supabase/server";

export const metadata: Metadata = {
  title: "Admin · Muhammad Sameer",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Login page renders without the shell (its own minimal layout).
  // We detect the route via headers in route.tsx instead — for layout
  // purposes, we always run the auth check and bypass shell when
  // there's no signed-in user (the login page handles its own UI).
  const supabase = await createClient();
  let userEmail: string | null = null;

  if (supabase) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    userEmail = user?.email ?? null;
  }

  // If signed in but not on the allow-list, force sign-out + bounce.
  if (userEmail && !isAdminEmail(userEmail)) {
    if (supabase) await supabase.auth.signOut();
    redirect("/admin/login?error=not_authorised");
  }

  return (
    <ToastProvider>
      <AdminShell userEmail={userEmail}>{children}</AdminShell>
    </ToastProvider>
  );
}
