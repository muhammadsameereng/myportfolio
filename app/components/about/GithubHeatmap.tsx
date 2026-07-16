"use client";

import { useEffect, useMemo, useState } from "react";

type Day = { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 };
type ApiResp = {
  total: Record<string, number>;
  contributions: Day[];
};

const CELL = 12;
const GAP = 3;
const RADIUS = 3;
const ROWS = 7;

// Contribution intensity → teal alpha (atmospheric, matches the site accent).
const LEVEL_ALPHA = [0.08, 0.3, 0.52, 0.74, 1] as const;
const levelFill = (level: number) =>
  `rgb(var(--bg-teal) / ${LEVEL_ALPHA[level] ?? LEVEL_ALPHA[0]})`;

export default function GithubHeatmap({ user }: { user: string }) {
  const [data, setData] = useState<Day[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`https://github-contributions-api.jogruber.de/v4/${user}?y=last`)
      .then((r) => {
        if (!r.ok) throw new Error(`status ${r.status}`);
        return r.json() as Promise<ApiResp>;
      })
      .then((d) => {
        if (!cancelled) setData(d.contributions);
      })
      .catch((e) => {
        if (!cancelled) setError(e?.message || "Failed to load");
      });
    return () => {
      cancelled = true;
    };
  }, [user]);

  // Group days into weeks (columns), Sunday-aligned, just like GitHub.
  const weeks = useMemo<(Day | null)[][]>(() => {
    if (!data || data.length === 0) return [];
    const start = new Date(data[0].date);
    const startDow = start.getDay(); // 0 = Sun
    const padded: (Day | null)[] = [...Array(startDow).fill(null), ...data];
    const cols: (Day | null)[][] = [];
    for (let i = 0; i < padded.length; i += ROWS) {
      cols.push(padded.slice(i, i + ROWS));
    }
    return cols;
  }, [data]);

  const total = useMemo(
    () => (data ? data.reduce((s, d) => s + d.count, 0) : 0),
    [data]
  );

  if (error) {
    return (
      <p className="text-[12px] text-muted-foreground">
        Couldn&apos;t load contributions right now.
      </p>
    );
  }

  if (!data) {
    // Skeleton — matches the rendered footprint so layout doesn't jump.
    return (
      <div className="h-[120px] w-full min-w-[640px] animate-pulse rounded-md bg-foreground/[0.04]" />
    );
  }

  const width = weeks.length * (CELL + GAP) - GAP;
  const height = ROWS * (CELL + GAP) - GAP;

  return (
    <div className="min-w-[640px]">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="block h-auto w-full"
        role="img"
        aria-label={`GitHub contributions for ${user}, last year`}
      >
        {weeks.map((week, x) => (
          <g key={x} transform={`translate(${x * (CELL + GAP)}, 0)`}>
            {week.map((day, y) => {
              if (!day) return null;
              return (
                <rect
                  key={y}
                  x={0}
                  y={y * (CELL + GAP)}
                  width={CELL}
                  height={CELL}
                  rx={RADIUS}
                  ry={RADIUS}
                  style={{ fill: levelFill(day.level) }}
                >
                  <title>
                    {day.date}: {day.count} contribution
                    {day.count === 1 ? "" : "s"}
                  </title>
                </rect>
              );
            })}
          </g>
        ))}
      </svg>

      {/* Total + legend */}
      <div className="mt-3 flex items-center justify-between">
        <p className="text-[12px] text-muted-foreground">
          <span className="font-semibold text-foreground tabular-nums">
            {total.toLocaleString()}
          </span>{" "}
          contributions in the last year
        </p>
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground/80">
          <span>Less</span>
          <div className="flex items-center gap-[3px]">
            {LEVEL_ALPHA.map((_, i) => (
              <span
                key={i}
                className="h-[11px] w-[11px] rounded-[3px]"
                style={{ background: levelFill(i) }}
              />
            ))}
          </div>
          <span>More</span>
        </div>
      </div>
    </div>
  );
}
