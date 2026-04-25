"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Wire to your real telemetry sink later (Sentry, Logtail, etc).
    if (process.env.NODE_ENV === "development") {
      console.error("App-level error:", error);
    }
  }, [error]);

  return (
    <main>
      <section className="relative">
        <div className="mx-auto max-w-3xl px-6 py-20 text-center">
          <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
            Something broke
          </p>
          <h1 className="mt-3 text-[28px] font-bold tracking-tight text-foreground sm:text-[34px]">
            That didn&apos;t work as expected.
          </h1>
          <p className="mx-auto mt-3 max-w-md text-[14.5px] leading-relaxed text-muted-foreground">
            An unexpected error popped up while rendering this page. Try again
            — it usually clears up.
          </p>
          {error.digest && (
            <p className="mt-3 text-[11px] text-muted-foreground/70">
              Reference: <code>{error.digest}</code>
            </p>
          )}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={reset}
              className="inline-flex h-10 cursor-pointer items-center rounded-full bg-foreground px-5 text-[13px] font-medium text-background transition-all duration-200 hover:scale-[1.02] hover:opacity-95"
            >
              Try again
            </button>
            <Link
              href="/"
              className="inline-flex h-10 cursor-pointer items-center rounded-full border border-border bg-background px-5 text-[13px] font-medium text-foreground transition-colors duration-200 hover:border-foreground/50 hover:bg-card"
            >
              Back home
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
