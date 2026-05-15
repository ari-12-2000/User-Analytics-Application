function validateIngestBody(body) {
    if (!body || typeof body !== "object") return "Invalid JSON body";
    const { session_id, type, page_url, timestamp } = body;
    if (typeof session_id !== "string" || !session_id.trim()) return "session_id is required";
    if (type !== "page_view" && type !== "click") return "type must be page_view or click";
    if (typeof page_url !== "string" || !page_url.trim()) return "page_url is required";
    if (typeof timestamp !== "number" || !Number.isFinite(timestamp)) return "timestamp must be a number";
    if (type === "click") {
      if (typeof body.click_x !== "number" || !Number.isFinite(body.click_x)) return "click_x required for click";
      if (typeof body.click_y !== "number" || !Number.isFinite(body.click_y)) return "click_y required for click";
    }
    return null;
  }

  module.exports= validateIngestBody