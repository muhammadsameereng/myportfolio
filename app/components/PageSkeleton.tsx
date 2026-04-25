/**
 * Shared loading skeleton — pure CSS pulse, no client JS.  Matches
 * the page geometry (container width, section heading + content blocks)
 * so the layout doesn't shift when real content streams in.
 */
export function SkeletonBlock({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-foreground/[0.06] dark:bg-foreground/[0.08] ${className}`}
    />
  );
}

export function PageHeaderSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-[1fr_1fr] sm:items-center sm:gap-10">
      <div>
        <SkeletonBlock className="h-7 w-32" />
        <SkeletonBlock className="mt-3 h-4 w-full max-w-md" />
      </div>
      <SkeletonBlock className="hidden h-px w-full sm:block" />
    </div>
  );
}

export function PageSkeleton({
  variant = "list",
}: {
  variant?: "list" | "grid" | "detail";
}) {
  return (
    <main>
      <section className="relative">
        <div className="mx-auto max-w-5xl px-6 py-16 md:py-20">
          <PageHeaderSkeleton />

          {variant === "grid" && (
            <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-7 md:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i}>
                  <SkeletonBlock className="aspect-[4/3] w-full rounded-2xl" />
                  <SkeletonBlock className="mt-2.5 h-4 w-5/6" />
                  <SkeletonBlock className="mt-2 h-3 w-3/4" />
                </div>
              ))}
            </div>
          )}

          {variant === "list" && (
            <div className="mt-10 divide-y divide-border/60">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="grid grid-cols-1 gap-5 py-7 sm:grid-cols-[1fr_auto] sm:gap-8"
                >
                  <div className="min-w-0">
                    <SkeletonBlock className="h-5 w-3/4" />
                    <SkeletonBlock className="mt-3 h-3.5 w-full" />
                    <SkeletonBlock className="mt-2 h-3.5 w-5/6" />
                    <SkeletonBlock className="mt-3 h-3 w-32" />
                  </div>
                  <SkeletonBlock className="h-[120px] w-full rounded-xl sm:w-[160px]" />
                </div>
              ))}
            </div>
          )}

          {variant === "detail" && (
            <>
              <SkeletonBlock className="mt-8 aspect-[16/9] w-full rounded-2xl" />
              <div className="mt-10 space-y-3">
                <SkeletonBlock className="h-4 w-full" />
                <SkeletonBlock className="h-4 w-[95%]" />
                <SkeletonBlock className="h-4 w-[90%]" />
                <SkeletonBlock className="h-4 w-[80%]" />
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
