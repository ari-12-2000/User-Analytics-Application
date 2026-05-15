const Event = require("../models/Event");
const validateIngestBody = require("../lib/utils");

/** Ingest a single event (matches tracker.js POST body). */
async function ingestEvent(req, res) {
  const err = validateIngestBody(req.body);
  if (err) return res.status(400).json({ error: err });
  console.log(req.body);
  const doc = {
    session_id: req.body.session_id.trim(),
    type: req.body.type,
    page_url: req.body.page_url.trim(),
    timestamp: req.body.timestamp,
  };
  if (req.body.type === "click") {
    doc.click_x = req.body.click_x;
    doc.click_y = req.body.click_y;
  }

  try {
    const created = await Event.create(doc);
    return res.status(201).json({
      id: String(created._id),
      session_id: created.session_id,
      type: created.type,
      page_url: created.page_url,
      timestamp: created.timestamp,
      click_x: created.click_x,
      click_y: created.click_y,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Failed to store event" });
  }
}

/** Sessions with total event counts (and simple time bounds for the dashboard). */
async function listSessions(_req, res) {
  try {
    const rows = await Event.aggregate([
      {
        $group: {
          _id: "$session_id",
          event_count: { $sum: 1 },
          first_timestamp: { $min: "$timestamp" },
          last_timestamp: { $max: "$timestamp" },
        },
      },
      { $sort: { last_timestamp: -1 } },
      {
        $project: {
          _id: 0,
          session_id: "$_id",
          event_count: 1,
          first_timestamp: 1,
          last_timestamp: 1,
        },
      },
    ]);
    return res.json({ sessions: rows });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Failed to list sessions" });
  }
}

/** Ordered events for one session (user journey). */
async function getSessionEvents(req, res) {
  const sessionId = req.params.sessionId;
  if (!sessionId) return res.status(400).json({ error: "Missing session id" });

  try {
    const events = await Event.find({ session_id: sessionId })
      .sort({ timestamp: 1, _id: 1 })
      .lean()
      .exec();

    const mapped = events.map((e) => ({
      id: String(e._id),
      session_id: e.session_id,
      type: e.type,
      page_url: e.page_url,
      timestamp: e.timestamp,
      click_x: e.click_x,
      click_y: e.click_y,
    }));
    return res.json({ session_id: sessionId, events: mapped });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Failed to load session events" });
  }
}

/** Click coordinates for heatmap; requires exact page_url match (encode in query string). */
async function getHeatmap(req, res) {
  const pageUrl = typeof req.query.page_url === "string" ? req.query.page_url.trim() : "";
  if (!pageUrl) return res.status(400).json({ error: "Query page_url is required" });

  try {
    const clicks = await Event.find({ page_url: pageUrl, type: "click" })
      .sort({ timestamp: 1 })
      .select({ click_x: 1, click_y: 1, timestamp: 1, session_id: 1 })
      .lean()
      .exec();

    const points = clicks.map((c) => ({
      x: c.click_x,
      y: c.click_y,
      timestamp: c.timestamp,
      session_id: c.session_id,
    }));
    return res.json({ page_url: pageUrl, clicks: points });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Failed to load heatmap data" });
  }
}

/** Distinct page URLs that have at least one click (helps heatmap page picker). */
async function listPagesWithClicks(_req, res) {
  try {
    const urls = await Event.distinct("page_url", { type: "click" });
    urls.sort();
    return res.json({ page_urls: urls });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Failed to list pages" });
  }
}

module.exports = {
  ingestEvent,
  listSessions,
  getSessionEvents,
  getHeatmap,
  listPagesWithClicks,
};
