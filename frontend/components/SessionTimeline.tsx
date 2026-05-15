"use client";

import type { AnalyticsEvent } from "@/lib/types";
import { formatTimeOnly } from "@/lib/format";

function EventBadge({ type }: { type: AnalyticsEvent["type"] }) {
  const styles =
    type === "click"
      ? "bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-200"
      : "bg-sky-100 text-sky-900 dark:bg-sky-950/60 dark:text-sky-200";
  return (
    <span
      className={`inline-flex shrink-0 rounded px-2 py-0.5 text-xs font-medium uppercase tracking-wide ${styles}`}
    >
      {type}
    </span>
  );
}

export default function SessionTimeline({
  sessionId,
  events,
  loading,
}: {
  sessionId: string | null;
  events: AnalyticsEvent[];
  loading: boolean;
}) {
  if (!sessionId) {
    return (
      <div className="flex flex-1 items-center justify-center p-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
        Select a session to view the user journey.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center p-8 text-sm text-zinc-500">
        Loading events…
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center p-8 text-sm text-zinc-500">
        No events for this session.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1 overflow-y-auto p-4">
      <p className="mb-3 font-mono text-xs text-zinc-500" title={sessionId}>
        {sessionId}
      </p>
      <ol className="relative space-y-0 border-l border-zinc-200 pl-4 dark:border-zinc-700">
        {events.map((ev) => (
          <li key={ev.id} className="relative pb-6 last:pb-0">
            <span className="absolute left-[-21px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-indigo-500 dark:border-zinc-950" />
            <div className="flex flex-wrap items-start gap-2">
              <span className="text-xs tabular-nums text-zinc-500">
                {formatTimeOnly(ev.timestamp)}
              </span>
              <EventBadge type={ev.type} />
            </div>
            <p className="mt-1 break-all text-sm text-zinc-800 dark:text-zinc-200">
              {ev.page_url}
            </p>
            {ev.type === "click" &&
              ev.click_x != null &&
              ev.click_y != null && (
                <p className="mt-0.5 font-mono text-xs text-zinc-500">
                  ({ev.click_x}, {ev.click_y})
                </p>
              )}
          </li>
        ))}
      </ol>
    </div>
  );
}
