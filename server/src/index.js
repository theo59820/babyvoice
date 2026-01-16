// BabyVoice/server/src/index.js

const express = require("express");
const cors = require("cors");

const analyzeRoute = require("./routes/analyze");
const healthRoute = require("./routes/health");

const app = express();

app.use(cors());
app.use(express.json());

// Route test simple
app.get("/", (req, res) => res.json({ ok: true, name: "BabyVoice API" }));

// Healthcheck (pro)
app.use("/health", healthRoute);

// Analyse audio
app.use("/analyze", analyzeRoute);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`BabyVoice API running on :${PORT}`));
