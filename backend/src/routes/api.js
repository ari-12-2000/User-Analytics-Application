const express = require("express");
const eventsController = require("../controllers/eventsController");

const router = express.Router();

router.post("/events", eventsController.ingestEvent);
router.get("/sessions", eventsController.listSessions);
router.get("/sessions/:sessionId/events", eventsController.getSessionEvents);
router.get("/heatmap", eventsController.getHeatmap);
router.get("/pages-with-clicks", eventsController.listPagesWithClicks);

module.exports = router;
