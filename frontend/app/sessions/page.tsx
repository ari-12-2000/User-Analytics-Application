"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getSessionEvents, getSessions } from "@/lib/api";
import type { AnalyticsEvent, SessionSummary } from "@/lib/types";
import SessionsTable from "@/components/SessionsTable";
import SessionTimeline from "@/components/SessionTimeline";
import LoadingState from "@/components/LoadingState";
import ErrorBanner from "@/components/ErrorBanner";

export default function SessionsPage() {
  const [sessions, setSessions] = useState<SessionSummary[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const [listLoading, setListLoading] = useState(true);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [listError, setListError] = useState<string | null>(null);
  const [eventsError, setEventsError] = useState<string | null>(null);
  const eventsRequestId = useRef(0);

  // Standalone event loader — can be called independently of selectedId changing
  const loadEvents = useCallback(async (id: string) => {
    const requestId = eventsRequestId.current + 1;
    eventsRequestId.current = requestId;
    setEventsLoading(true);
    setEventsError(null);
    try {
      const data = await getSessionEvents(id);
      if (eventsRequestId.current !== requestId) return;
      setEvents(data.events);
    } catch (e) {
      if (eventsRequestId.current !== requestId) return;
      setEventsError(e instanceof Error ? e.message : "Failed to load events");
      setEvents([]);
    } finally {
      if (eventsRequestId.current === requestId) {
        setEventsLoading(false);
      }
    }
  }, []);

  // Refresh sessions list AND re-fetch events for the currently selected session
  const loadSessions = useCallback(async () => {
    setListLoading(true);
    setListError(null);
    try {
      const data = await getSessions();
      setSessions(data.sessions);
    } catch (e) {
      setListError(e instanceof Error ? e.message : "Failed to load sessions");
    } finally {
      setListLoading(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    // Run both in parallel; events fetch only if a session is selected
    await Promise.all([
      loadSessions(),
      selectedId ? loadEvents(selectedId) : Promise.resolve(),
    ]);
  }, [loadSessions, loadEvents, selectedId]);

  // Initial load
  useEffect(() => {
    void Promise.resolve().then(loadSessions);
  }, [loadSessions]);

  // Fetch events whenever the selected session changes
  useEffect(() => {
    void Promise.resolve().then(() => {
      if (!selectedId) {
        eventsRequestId.current += 1;
        setEvents([]);
        setEventsError(null);
        setEventsLoading(false);
        return;
      }
      return loadEvents(selectedId);
    });
  }, [selectedId, loadEvents]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
            Sessions
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Browse sessions and inspect each user journey.
          </p>
        </div>
        <button
          type="button"
          onClick={refresh}
          disabled={listLoading || eventsLoading}
          className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
        >
          Refresh
        </button>
      </div>

      {listError && (
        <ErrorBanner message={listError} onRetry={loadSessions} />
      )}

      <div className="grid min-h-[480px] gap-4 lg:grid-cols-2">
        <section className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <header className="border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
            <h2 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              All sessions
            </h2>
          </header>
          {listLoading ? (
            <LoadingState message="Loading sessions…" />
          ) : (
            <SessionsTable
              sessions={sessions}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
          )}
        </section>

        <section className="flex min-h-[320px] flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950 lg:min-h-0">
          <header className="border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
            <h2 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              User journey
            </h2>
          </header>
          {eventsError && (
            <div className="p-4">
              <ErrorBanner message={eventsError} />
            </div>
          )}
          <SessionTimeline
            sessionId={selectedId}
            events={events}
            loading={eventsLoading}
          />
        </section>
      </div>
    </div>
  );
}
