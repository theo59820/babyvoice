const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({ ok: true, service: "babyvoice-api", time: Date.now() });
});

module.exports = router;
