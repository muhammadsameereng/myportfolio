"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/app/lib/supabase/server";
import { isAdminEmail } from "@/app/lib/admin/auth";
import { getSiteOrigin, safeNextPath } from "@/app/lib/admin/url";

type AuthState = { error?: string; ok?: boolean };

/**
 * Sends a magic-link email if the address is on the allow-list.
 * For non-admin emails we surface a generic error rather than silently
 * succeeding — the allow-list is small and the email is private, so
 * leaking "not authorised" is acceptable and avoids confusing UX.
 */
export async function signInWithMagicLink(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const next = safeNextPath(String(formData.get("next") || ""));

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Please enter a valid email address." };
  }

  if (!isAdminEmail(email)) {
    return { error: "This email isn't authorised for admin access." };
  }

  const supabase = await createClient();
  if (!supabase) {
    return {
      error:
        "Supabase isn't configured yet. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local and restart.",
    };
  }

  const origin = await getSiteOrigin();
  const redirectTo = `${origin}/api/admin/auth/callback?next=${encodeURIComponent(next)}`;

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: redirectTo },
  });

  if (error) {
    return { error: error.message };
  }

  return { ok: true };
}

export async function signOut() {
  const supabase = await createClient();
  if (supabase) await supabase.auth.signOut();
  redirect("/admin/login");
}
