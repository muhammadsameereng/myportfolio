import { NextResponse } from "next/server";
import { createClient } from "@/app/lib/supabase/server";

/**
 * Magic-link callback.  Supabase redirects here with `?code=...` after the
 * visitor clicks the link in their email.  We exchange the code for a
 * session, then send them back to the page they were trying to reach.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") || "/admin";

  if (code) {
    const supabase = await createClient();
    if (supabase) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  return NextResponse.redirect(
    `${origin}/admin/login?error=auth_callback_failed`
  );
}
