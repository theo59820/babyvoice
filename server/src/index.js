const express = require("express");
const cors = require("cors");

const analyzeRoute = require("./routes/analyze");
const healthRoute = require("./routes/health");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.json({ ok: true, name: "BabyVoice API" }));

app.use("/health", healthRoute);
app.use("/analyze", analyzeRoute);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`BabyVoice API running on :${PORT}`));
