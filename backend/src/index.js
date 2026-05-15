require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const apiRoutes = require("./routes/api");

const PORT = Number(process.env.PORT) || 3001;
const MONGODB_URI = process.env.MONGODB_URI;

const app = express();
app.use(cors({ origin: true }));
app.use(express.json({ limit: "32kb" }));
app.use("/api", apiRoutes);

// app.get("/health", (_req, res) => {
//   res.json({ ok: true });
// });

async function main() {
  if (!MONGODB_URI) {
    console.error("Missing MONGODB_URI in environment (.env)");
    process.exit(1);
  }
  await mongoose.connect(MONGODB_URI);
  console.log("Database connected");
  app.listen(PORT, () => {
    console.log(`API listening on http://localhost:${PORT}`);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
