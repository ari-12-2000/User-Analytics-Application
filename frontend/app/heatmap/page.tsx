"use client";

import { useCallback, useEffect, useState } from "react";
import { getHeatmap, getPagesWithClicks } from "@/lib/api";
import type { HeatmapPoint } from "@/lib/types";
import PageUrlSelect from "@/components/PageUrlSelect";
import HeatmapCanvas from "@/components/HeatmapCanvas";
import LoadingState from "@/components/LoadingState";
import ErrorBanner from "@/components/ErrorBanner";

export default function HeatmapPage() {
  const [pageUrls, setPageUrls] = useState<string[]>([]);
  const [selectedUrl, setSelectedUrl] = useState("");
  const [clicks, setClicks] = useState<HeatmapPoint[]>([]);
  const [pagesLoading, setPagesLoading] = useState(true);
  const [heatmapLoading, setHeatmapLoading] = useState(false);
  const [pagesError, setPagesError] = useState<string | null>(null);
  const [heatmapError, setHeatmapError] = useState<string | null>(null);

  const loadPages = useCallback(async () => {
    setPagesLoading(true);
    setPagesError(null);
    try {
      const data = await getPagesWithClicks();
      setPageUrls(data.page_urls);
      if (data.page_urls.length > 0) {
        setSelectedUrl((prev) => prev || data.page_urls[0]);
      }
    } catch (e) {
      setPagesError(e instanceof Error ? e.message : "Failed to load pages");
    } finally {
      setPagesLoading(false);
    }
  }, []);

  const loadHeatmap = useCallback(async () => {
    if (!selectedUrl.trim()) {
      setClicks([]);
      return;
    }
    setHeatmapLoading(true);
    setHeatmapError(null);
    try {
      const data = await getHeatmap(selectedUrl.trim());
      setClicks(data.clicks);
    } catch (e) {
      setHeatmapError(
        e instanceof Error ? e.message : "Failed to load heatmap",
      );
      setClicks([]);
    } finally {
      setHeatmapLoading(false);
    }
  }, [selectedUrl]);

  const refresh = useCallback(async () => {
    await Promise.all([loadPages(), loadHeatmap()]);
  }, [loadPages, loadHeatmap]);

  useEffect(() => {
    loadPages();
  }, [loadPages]);

  useEffect(() => {
    loadHeatmap();
  }, [loadHeatmap]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
            Heatmap
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Visualize click positions for a tracked page URL.
          </p>
        </div>
        <button
          type="button"
          onClick={refresh}
          disabled={pagesLoading || heatmapLoading}
          className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
        >
          Refresh
        </button>
      </div>

      {pagesError && (
        <ErrorBanner message={pagesError} onRetry={loadPages} />
      )}

      <section className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
        {pagesLoading ? (
          <LoadingState message="Loading pages…" />
        ) : (
          <PageUrlSelect
            pageUrls={pageUrls}
            value={selectedUrl}
            onChange={setSelectedUrl}
            disabled={heatmapLoading}
          />
        )}
      </section>

      {heatmapError && <ErrorBanner message={heatmapError} />}

      <section className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
        {heatmapLoading ? (
          <LoadingState message="Loading clicks…" />
        ) : (
          <HeatmapCanvas clicks={clicks} pageUrl={selectedUrl} />
        )}
      </section>
    </div>
  );
}
