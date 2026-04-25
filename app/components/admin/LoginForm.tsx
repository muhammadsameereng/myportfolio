"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Check, Mail } from "lucide-react";
import Link from "next/link";
import { useActionState } from "react";
import { signInWithMagicLink } from "@/app/admin/actions";

const ERROR_MAP: Record<string, string> = {
  not_authorised: "That email isn't authorised for admin access.",
  auth_callback_failed:
    "We couldn't complete sign-in. The link may have expired — try requesting a new one.",
};

export default function LoginForm({
  next,
  initialError,
}: {
  next?: string;
  initialError?: string;
}) {
  const [state, formAction, pending] = useActionState(signInWithMagicLink, {});
  const error = state.error || (initialError ? ERROR_MAP[initialError] : null);

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Soft gradient backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 [background:radial-gradient(60rem_30rem_at_50%_-10%,rgba(59,130,246,0.10),transparent_60%)]"
      />

      <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-6">
        {/* Brand */}
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-[14px] font-semibold text-foreground"
        >
          <span aria-hidden>✦</span>
          <span>saranzafar</span>
          <span className="ml-1 rounded-full bg-foreground px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-[0.18em] text-background">
            Admin
          </span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="w-full rounded-2xl border border-border bg-card p-7 sm:p-8"
        >
          {state.ok ? (
            <SentSuccess />
          ) : (
            <>
              <h1 className="text-[22px] font-bold tracking-tight text-foreground">
                Sign in to admin
              </h1>
              <p className="mt-2 text-[13.5px] leading-relaxed text-muted-foreground">
                Enter your email — we&apos;ll send a one-tap sign-in link.
                No passwords, ever.
              </p>

              <form action={formAction} className="mt-6 space-y-4">
                <input type="hidden" name="next" value={next || "/admin"} />

                <div>
                  <label
                    htmlFor="email"
                    className="block text-[11px] uppercase tracking-[0.18em] text-muted-foreground"
                  >
                    Email
                  </label>
                  <div className="mt-2 flex items-center gap-2 rounded-xl border border-border bg-background px-3 transition-all duration-200 focus-within:border-blue-400/70 focus-within:shadow-[0_0_0_3px_rgba(59,130,246,0.12)]">
                    <Mail
                      size={14}
                      strokeWidth={1.8}
                      className="shrink-0 text-muted-foreground"
                    />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      autoFocus
                      placeholder="you@example.com"
                      disabled={pending}
                      className="h-10 w-full appearance-none bg-transparent font-sans text-[14px] text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus-visible:outline-none disabled:opacity-60"
                    />
                  </div>
                </div>

                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-[12.5px] text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/40 dark:text-rose-200"
                  >
                    {error}
                  </motion.p>
                )}

                <button
                  type="submit"
                  disabled={pending}
                  className="group inline-flex h-11 w-full cursor-pointer items-center justify-center gap-1.5 rounded-full bg-foreground px-5 text-[13.5px] font-medium text-background transition-all duration-200 hover:scale-[1.01] hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
                >
                  {pending ? (
                    <>
                      <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-background/40 border-t-background" />
                      Sending link…
                    </>
                  ) : (
                    <>
                      Send magic link
                      <ArrowUpRight
                        size={14}
                        className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </>
                  )}
                </button>
              </form>

              <p className="mt-5 text-[11.5px] leading-relaxed text-muted-foreground">
                Not an admin? You&apos;re probably looking for the{" "}
                <Link
                  href="/contact"
                  className="text-foreground underline-offset-4 hover:underline"
                >
                  contact page
                </Link>
                .
              </p>
            </>
          )}
        </motion.div>
      </div>
    </main>
  );
}

function SentSuccess() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="text-center"
    >
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-500">
        <Check size={20} strokeWidth={2.4} />
      </div>
      <h1 className="mt-5 text-[20px] font-bold tracking-tight text-foreground">
        Check your inbox
      </h1>
      <p className="mt-2 text-[13.5px] leading-relaxed text-muted-foreground">
        We&apos;ve sent a sign-in link. Click it from the same browser to land
        directly in the admin.
      </p>
      <p className="mt-3 text-[11.5px] text-muted-foreground/80">
        Link expires in an hour. Spam folder if it&apos;s slow to arrive.
      </p>
    </motion.div>
  );
}
