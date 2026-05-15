"use client";

import type { SessionSummary } from "@/lib/types";
import { formatTimestamp, truncateId } from "@/lib/format";

export default function SessionsTable({
  sessions,
  selectedId,
  onSelect,
}: {
  sessions: SessionSummary[];
  selectedId: string | null;
  onSelect: (sessionId: string) => void;
}) {
  if (sessions.length === 0) {
    return (
      <p className="px-4 py-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
        No sessions yet. Generate events from the tracker demo page.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-zinc-200 text-xs uppercase tracking-wide text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
            <th className="px-4 py-3 font-medium">Session</th>
            <th className="px-4 py-3 font-medium">Events</th>
            <th className="hidden px-4 py-3 font-medium sm:table-cell">First</th>
            <th className="hidden px-4 py-3 font-medium md:table-cell">Last</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((s) => {
            const selected = s.session_id === selectedId;
            return (
              <tr
                key={s.session_id}
                onClick={() => onSelect(s.session_id)}
                className={`cursor-pointer border-b border-zinc-100 transition-colors last:border-0 dark:border-zinc-800/80 ${
                  selected
                    ? "bg-indigo-50/80 dark:bg-indigo-950/30"
                    : "hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
                }`}
              >
                <td className="px-4 py-3 font-mono text-xs" title={s.session_id}>
                  {truncateId(s.session_id)}
                </td>
                <td className="px-4 py-3 font-medium tabular-nums">{s.event_count}</td>
                <td className="hidden px-4 py-3 text-zinc-600 dark:text-zinc-400 sm:table-cell">
                  {formatTimestamp(s.first_timestamp)}
                </td>
                <td className="hidden px-4 py-3 text-zinc-600 dark:text-zinc-400 md:table-cell">
                  {formatTimestamp(s.last_timestamp)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
