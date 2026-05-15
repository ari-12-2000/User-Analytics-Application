export type EventType = "page_view" | "click";

export interface SessionSummary {
  session_id: string;
  event_count: number;
  first_timestamp: string;
  last_timestamp: string;
}

export interface AnalyticsEvent {
  id: string;
  session_id: string;
  type: EventType;
  page_url: string;
  timestamp: string;
  click_x?: number;
  click_y?: number;
}

export interface HeatmapPoint {
  x: number;
  y: number;
  timestamp: string;
  session_id: string;
}

export interface SessionsResponse {
  sessions: SessionSummary[];
}

export interface SessionEventsResponse {
  session_id: string;
  events: AnalyticsEvent[];
}

export interface HeatmapResponse {
  page_url: string;
  clicks: HeatmapPoint[];
}

export interface PagesWithClicksResponse {
  page_urls: string[];
}
