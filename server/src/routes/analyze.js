const express = require("express");
const multer = require("multer");

const router = express.Router();

// Multer en mémoire (parfait pour Render)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max
  },
});

// ✅ Test route (pratique pour vérifier que /analyze existe)
router.get("/", (req, res) => {
  res.json({ ok: true, route: "analyze" });
});

// Helpers (MVP)
function pickLabelFromRandom() {
  const labels = ["hungry", "sleepy", "diaper", "pain", "comfort", "cold"];
  return labels[Math.floor(Math.random() * labels.length)];
}

function tipsFor(label) {
  switch (label) {
    case "hungry":
      return ["feed_check", "burp", "calm_voice"];
    case "sleepy":
      return ["dim_lights", "rocking", "white_noise"];
    case "diaper":
      return ["check_diaper", "clean_gently", "rash_cream"];
    case "pain":
      return ["check_temperature", "check_gas", "consult_if_persistent"];
    case "cold":
      return ["check_room_temp", "add_layer", "warm_hands_feet"];
    default:
      return ["skin_to_skin", "pacifier", "swaddle"];
  }
}

// ✅ POST /analyze : reçoit un fichier audio et renvoie une “analyse” MVP
router.post("/", upload.single("audio"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        ok: false,
        error: "Missing audio file. Expected field name: 'audio'.",
      });
    }

    // req.file contient:
    // - buffer (bytes)
    // - mimetype
    // - originalname
    // - size
    // etc.
    const { mimetype, size, originalname } = req.file;

    // Ici ton MVP (random + logique simple)
    // Plus tard: tu remplaces par ton vrai modèle ML
    const label = pickLabelFromRandom();
    const confidence = Math.floor(70 + Math.random() * 25); // 70-95
    const tips = tipsFor(label);

    return res.json({
      ok: true,
      meta: {
        filename: originalname,
        mimetype,
        size,
      },
      result: {
        label,
        confidence,
        tips,
      },
    });
  } catch (err) {
    console.error("ANALYZE ERROR:", err);
    return res.status(500).json({
      ok: false,
      error: "Internal server error",
    });
  }
});

module.exports = router;
