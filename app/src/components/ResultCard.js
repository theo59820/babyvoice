import React from "react";
import { View, Text, StyleSheet } from "react-native";
import colors from "../theme/colors";
import { useTranslation } from "react-i18next";

const LABEL_MAP = {
  HUNGRY: { fr: "Faim", en: "Hungry", es: "Hambre" },
  SLEEPY: { fr: "Sommeil", en: "Sleepy", es: "Sueño" },
  DISCOMFORT: { fr: "Inconfort", en: "Discomfort", es: "Incomodidad" },
  DIAPER: { fr: "Couche", en: "Diaper", es: "Pañal" },
  PAIN: { fr: "Douleur", en: "Pain", es: "Dolor" },
  ATTENTION: { fr: "Attention", en: "Attention", es: "Atención" }
};

export default function ResultCard({ result }) {
  const { t, i18n } = useTranslation();
  if (!result) return null;

  const lang = i18n.language || "en";
  const label = (LABEL_MAP[result.label] && LABEL_MAP[result.label][lang]) || result.label;

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{t("resultTitle")}</Text>
      <Text style={styles.big}>{label}</Text>
      <Text style={styles.small}>
        {t("confidence")}: {result.confidence}%
      </Text>

      {Array.isArray(result.tips) && result.tips.length > 0 && (
        <View style={{ marginTop: 12 }}>
          <Text style={styles.subtitle}>{t("tips")}</Text>
          {result.tips.map((tip, idx) => (
            <Text key={idx} style={styles.tip}>• {tip}</Text>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 16,
    marginTop: 18
  },
  title: { color: colors.muted, fontWeight: "700", marginBottom: 6 },
  big: { color: colors.text, fontSize: 26, fontWeight: "800" },
  small: { color: colors.muted, marginTop: 6 },
  subtitle: { color: colors.text, fontWeight: "800", marginBottom: 6 },
  tip: { color: colors.muted, lineHeight: 20 }
});
