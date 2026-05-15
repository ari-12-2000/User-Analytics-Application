const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    session_id: { type: String, required: true, index: true },
    type: {
      type: String,
      required: true,
      enum: ["page_view", "click"],
      index: true,
    },
    page_url: { type: String, required: true, index: true },
    timestamp: { type: Number, required: true },
    click_x: { type: Number },
    click_y: { type: Number },
  },
  { collection: "events" }
);

eventSchema.index({ session_id: 1, timestamp: 1 });
eventSchema.index({ page_url: 1, type: 1 });

module.exports = mongoose.model("Event", eventSchema);
