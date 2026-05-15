"use client";

import { useMemo } from "react";
import type { HeatmapPoint } from "@/lib/types";

const ASPECT = 16 / 9;
const PADDING = 24;

export default function HeatmapCanvas({
  clicks,
  pageUrl,
}: {
  clicks: HeatmapPoint[];
  pageUrl: string;
}) {
  const { maxX, maxY } = useMemo(() => {
    let mx = 1;
    let my = 1;
    for (const c of clicks) {
      if (c.x > mx) mx = c.x;
      if (c.y > my) my = c.y;
    }
    return { maxX: mx, maxY: my };
  }, [clicks]);

  if (!pageUrl) {
    return (
      <div className="flex aspect-video items-center justify-center rounded-xl border border-dashed border-zinc-300 bg-zinc-50 text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900/50">
        Choose a page URL to display click heatmap.
      </div>
    );
  }

  if (clicks.length === 0) {
    return (
      <div className="flex aspect-video flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-zinc-300 bg-zinc-50 text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900/50">
        <p>No clicks recorded for this page.</p>
        <p className="max-w-md truncate px-4 text-xs text-zinc-400" title={pageUrl}>
          {pageUrl}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
        <p
          className="truncate text-zinc-600 dark:text-zinc-400"
          title={pageUrl}
        >
          {pageUrl}
        </p>
        <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium tabular-nums text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
          {clicks.length} click{clicks.length === 1 ? "" : "s"}
        </span>
      </div>

      <div
        className="relative w-full overflow-hidden rounded-xl border border-zinc-200 bg-linear-to-b from-zinc-50 to-zinc-100 dark:border-zinc-800 dark:from-zinc-900 dark:to-zinc-950"
        style={{ aspectRatio: String(ASPECT) }}
      >
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox={`0 0 ${maxX + PADDING} ${maxY + PADDING}`}
          preserveAspectRatio="xMidYMid meet"
        >
          {clicks.map((c, i) => (
            <g key={`${c.x}-${c.y}-${c.timestamp}-${i}`}>
              <circle cx={c.x} cy={c.y} r={14} className="fill-red-500/15" />
              <circle
                cx={c.x}
                cy={c.y}
                r={6}
                className="fill-red-500/70 stroke-red-600/80 stroke-[1.5]"
              >
                <title>{`(${c.x}, ${c.y}) — ${c.session_id.slice(0, 8)}…`}</title>
              </circle>
            </g>
          ))}
        </svg>
        <p className="absolute bottom-3 left-3 text-xs text-zinc-500">
          Each dot = one click (viewport coordinates)
        </p>
      </div>
    </div>
  );
}
