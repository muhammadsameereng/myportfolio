import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isAdminEmail } from "../admin/auth";
import { safeNextPath } from "../admin/redirect";

/**
 * Refreshes the auth session on every request and gates /admin behind:
 *  1) Supabase has a valid session
 *  2) The session's email is on the admin allow-list
 *
 * Anything that fails either check gets bounced to /admin/login.
 */
export async function updateSession(req: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const pathname = req.nextUrl.pathname;
  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginRoute = pathname === "/admin/login";

  // If Supabase isn't configured, allow the login page to render so the
  // visitor sees a "configure first" message rather than an infinite redirect.
  if (!url || !key) {
    return NextResponse.next();
  }

  let response = NextResponse.next({ request: req });
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return req.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => req.cookies.set(name, value));
        response = NextResponse.next({ request: req });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (isAdminRoute && !isLoginRoute) {
    if (!user) {
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = "/admin/login";
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (!isAdminEmail(user.email)) {
      // Authenticated but not on the allow-list — sign them out + bounce.
      await supabase.auth.signOut();
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = "/admin/login";
      loginUrl.searchParams.set("error", "not_authorised");
      return NextResponse.redirect(loginUrl);
    }
  }

  // Already signed in and visiting /admin/login? Send them to the dashboard.
  if (isLoginRoute && user && isAdminEmail(user.email)) {
    const next = safeNextPath(req.nextUrl.searchParams.get("next"));
    const dashboardUrl = req.nextUrl.clone();
    dashboardUrl.pathname = next;
    dashboardUrl.search = "";
    return NextResponse.redirect(dashboardUrl);
  }

  return response;
}
