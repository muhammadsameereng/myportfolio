/**
 * Admin allow-list — single source of truth for who can sign in to /admin.
 * Anyone whose email is not on this list gets:
 *   1) Blocked at the magic-link request step (no email sent).
 *   2) Blocked again at the middleware before any admin page renders.
 *   3) Blocked a third time by Supabase RLS on every write.
 */
export function getAdminEmails(): string[] {
  return (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  return getAdminEmails().includes(email.trim().toLowerCase());
}
