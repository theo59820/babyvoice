const express = require("express");
const multer = require("multer");
const { classifyCry } = require("../services/cryClassifier");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("audio"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No audio file provided (field name: audio)" });
    }

    // Buffer audio raw
    const audioBuffer = req.file.buffer;

    // MVP: classification "demo" (prêt pour remplacer par un vrai modèle)
    const result = await classifyCry(audioBuffer);

    return res.json({
      ok: true,
      result
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false, error: "Internal server error" });
  }
});

module.exports = router;
