import type {
  HeatmapResponse,
  PagesWithClicksResponse,
  SessionEventsResponse,
  SessionsResponse,
} from "./types";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
  "http://localhost:3001";

async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, { cache: "no-store" });
  if (!res.ok) {
    let message = res.statusText;
    try {
      const body = await res.json();
      if (body && typeof body.error === "string") message = body.error;
    } catch {
      /* ignore */
    }
    throw new Error(message || `Request failed (${res.status})`);
  }
  return res.json() as Promise<T>;
}

export function getSessions(): Promise<SessionsResponse> {
  return fetchJson<SessionsResponse>("/api/sessions");
}

export function getSessionEvents(
  sessionId: string,
): Promise<SessionEventsResponse> {
  return fetchJson<SessionEventsResponse>(
    `/api/sessions/${encodeURIComponent(sessionId)}/events`,
  );
}

export function getPagesWithClicks(): Promise<PagesWithClicksResponse> {
  return fetchJson<PagesWithClicksResponse>("/api/pages-with-clicks");
}

export function getHeatmap(pageUrl: string): Promise<HeatmapResponse> {
  return fetchJson<HeatmapResponse>(
    `/api/heatmap?page_url=${encodeURIComponent(pageUrl)}`,
  );
}
