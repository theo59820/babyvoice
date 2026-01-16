// BabyVoice - Cry Classifier (MVP version)
// Cette version renvoie des "clés" de conseils pour que l'app puisse traduire
// selon la langue choisie (FR / EN / etc.)

function pickWeighted(items) {
  const total = items.reduce((s, it) => s + it.w, 0);
  let r = Math.random() * total;

  for (const it of items) {
    r -= it.w;
    if (r <= 0) return it.value;
  }

  return items[items.length - 1].value;
}

async function classifyCry(audioBuffer) {
  // Pour l'instant, on ne traite pas vraiment l'audio
  // On simule une classification réaliste pour le MVP

  const label = pickWeighted([
    { value: "HUNGRY", w: 28 },
    { value: "SLEEPY", w: 22 },
    { value: "DISCOMFORT", w: 18 },
    { value: "DIAPER", w: 14 },
    { value: "PAIN", w: 10 },
    { value: "ATTENTION", w: 8 }
  ]);

  // Confiance simulée (70% → 95%)
  const confidence = Math.round((70 + Math.random() * 25) * 10) / 10;

  // IMPORTANT :
  // On renvoie des CLÉS, pas du texte
  // L'app traduira ces clés en français / anglais
  const tips = {
    HUNGRY: ["TIP_FEED", "TIP_CHECK_LAST_MEAL", "TIP_SUCKING_SIGNS"],
    SLEEPY: ["TIP_DIM_LIGHT", "TIP_SLEEP_ROUTINE", "TIP_SLEEP_SIGNS"],
    DISCOMFORT: ["TIP_CHECK_TEMP", "TIP_CHECK_CLOTHES", "TIP_GAS_MASSAGE"],
    DIAPER: ["TIP_CHECK_DIAPER", "TIP_CREAM_IF_IRRITATION"],
    PAIN: ["TIP_CHECK_TIGHT", "TIP_MONITOR_FEVER"],
    ATTENTION: ["TIP_HOLD_SKIN", "TIP_SOOTH_TALK", "TIP_PACIFIER"]
  };

  return {
    label,
    confidence,
    tips: tips[label] || []
  };
}

module.exports = { classifyCry };
