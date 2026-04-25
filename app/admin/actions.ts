"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/app/lib/supabase/server";
import { isAdminEmail } from "@/app/lib/admin/auth";

type AuthState = { error?: string; ok?: boolean };

/**
 * Sends a magic-link email if the address is on the allow-list.
 * For non-admin emails we silently report success (to avoid leaking
 * which addresses are admin) — but the link is never actually sent.
 */
export async function signInWithMagicLink(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const next = String(formData.get("next") || "/admin");

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Please enter a valid email address." };
  }

  if (!isAdminEmail(email)) {
    return {
      error: "This email isn't authorised for admin access.",
    };
  }

  const supabase = await createClient();
  if (!supabase) {
    return {
      error:
        "Supabase isn't configured yet. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local and restart.",
    };
  }

  const h = await headers();
  const origin =
    h.get("origin") ||
    `https://${h.get("host")}` ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://saranzafar.com";

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${origin}/api/admin/auth/callback?next=${encodeURIComponent(next)}`,
    },
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
