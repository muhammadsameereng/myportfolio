import { NextResponse } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createClient } from "@/app/lib/supabase/server";
import { isAdminEmail } from "@/app/lib/admin/auth";
import { safeNextPath } from "@/app/lib/admin/url";

/**
 * Token-hash confirm — used by the custom magic-link email template,
 * which renders TWO links (production + local) both pointing here with
 * the same `{{ .TokenHash }}`. The first one used wins; the other becomes
 * invalid. This avoids the legacy `/auth/v1/verify?redirect_to=...`
 * round-trip and keeps the redirect target on this origin.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const origin = url.origin;
  const tokenHash = url.searchParams.get("token_hash");
  const type = (url.searchParams.get("type") || "email") as EmailOtpType;
  const next = safeNextPath(url.searchParams.get("next"));

  if (!tokenHash) {
    return NextResponse.redirect(
      `${origin}/admin/login?error=auth_callback_failed`
    );
  }

  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.redirect(
      `${origin}/admin/login?error=auth_callback_failed`
    );
  }

  const { data, error } = await supabase.auth.verifyOtp({
    token_hash: tokenHash,
    type,
  });
  if (error || !data?.session) {
    return NextResponse.redirect(
      `${origin}/admin/login?error=auth_callback_failed`
    );
  }

  if (!isAdminEmail(data.session.user.email)) {
    await supabase.auth.signOut();
    return NextResponse.redirect(
      `${origin}/admin/login?error=not_authorised`
    );
  }

  return NextResponse.redirect(`${origin}${next}`);
}
