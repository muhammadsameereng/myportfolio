/**
 * Section divider — "the signal line."
 *
 * Shell prompt + static command on the left, then a gradient hairline
 * that starts bold and fades into the quieter border tone as it
 * crosses the page. Page's vertical rails pass through so the spine
 * stays continuous.
 */
export default function SectionDivider({
  command = "cd /work",
  index,
  total = 6,
}: {
  command?: string;
  index?: number;
  total?: number;
}) {
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="relative py-2">
      {/* Rails pass through — the spine continues */}
      <div className="pointer-events-none absolute inset-0 mx-auto max-w-6xl">
        <div className="absolute top-0 bottom-0 left-6 w-px bg-border/40 sm:left-8" />
        <div className="absolute top-0 bottom-0 right-6 w-px bg-border/40 sm:right-8" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 sm:px-8">
        <div className="flex items-center gap-3">
          {/* Prompt + command — tightly joined, reads as one shell line */}
          <span className="shrink-0 font-mono text-sm leading-none">
            <span className="text-foreground">$</span>
            <span className="text-foreground/75"> {command}</span>
          </span>

          {/* Signal line — bold at the source, fading into the rest */}
          <span
            className="h-px flex-1"
            style={{
              background:
                "linear-gradient(to right, var(--foreground) 0%, var(--foreground) 6%, var(--border) 26%, var(--border) 100%)",
            }}
          />

        </div>
      </div>
    </div>
  );
}
