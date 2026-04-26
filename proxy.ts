import { type NextRequest } from "next/server";
import { updateSession } from "./app/lib/supabase/middleware";

export async function proxy(req: NextRequest) {
  return updateSession(req);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     *   • _next/static (static assets)
     *   • _next/image (image optimisation)
     *   • favicon, public files
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
