import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import colors from "../theme/colors";
import { useTranslation } from "react-i18next";

const LANGS = [
  { code: "fr", label: "Français" },
  { code: "en", label: "English" },
  { code: "es", label: "Español" }
];

export default function LanguagePicker() {
  const { t, i18n } = useTranslation();

  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>{t("chooseLanguage")}</Text>
      <View style={styles.row}>
        {LANGS.map((l) => {
          const active = i18n.language === l.code;
          return (
            <Pressable
              key={l.code}
              onPress={() => i18n.changeLanguage(l.code)}
              style={[styles.pill, active && styles.active]}
            >
              <Text style={styles.pillText}>{l.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: "100%", marginTop: 10 },
  title: { color: colors.muted, fontWeight: "700", marginBottom: 8 },
  row: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  pill: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: colors.card
  },
  active: { borderWidth: 1, borderColor: colors.accent },
  pillText: { color: colors.text, fontWeight: "700" }
});
