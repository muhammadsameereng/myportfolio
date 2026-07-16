import { Database } from "lucide-react";

/**
 * Renders a clear "configure Supabase first" panel if the env vars are
 * missing. Each admin page calls this and bails before doing anything
 * data-bound, so the admin UI is always navigable.
 */
export function isSupabaseConfigured() {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export function SupabaseSetupPanel() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16 md:px-10 md:py-20">
      <div className="rounded-2xl border border-amber-300 bg-amber-50/60 p-7 dark:border-amber-900/40 dark:bg-amber-950/30">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 text-amber-700 dark:text-amber-300">
            <Database size={18} strokeWidth={1.8} />
          </span>
          <div>
            <h2 className="text-[16px] font-semibold tracking-tight text-foreground">
              Connect Supabase to start using the admin
            </h2>
            <p className="mt-2 text-[13.5px] leading-relaxed text-muted-foreground">
              The admin UI is built and ready — it just needs your Supabase
              project to talk to. Add these to{" "}
              <code className="rounded-md border border-border bg-card px-1 text-[12px]">
                .env.local
              </code>{" "}
              and restart{" "}
              <code className="rounded-md border border-border bg-card px-1 text-[12px]">
                npm run dev
              </code>
              :
            </p>
            <pre className="mt-4 overflow-x-auto rounded-xl border border-border bg-background p-4 text-[12px] leading-[1.7] text-foreground/85">
{`NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIs...
ADMIN_EMAILS=msameerdevelops@gmail.com`}
            </pre>
            <p className="mt-4 text-[12.5px] leading-relaxed text-muted-foreground">
              Then run the SQL schema (provided in{" "}
              <code className="rounded-md border border-border bg-card px-1 text-[12px]">
                supabase/schema.sql
              </code>
              ) in your Supabase project → SQL editor to create the tables and
              row-level security policies.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
