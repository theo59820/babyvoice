import "../../src/i18n";
import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useTranslation } from "react-i18next";

export default function ExploreLanguage() {
  const { t, i18n } = useTranslation();

  const langs = [
    { code: "fr", label: "Français" },
    { code: "en", label: "English" },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.h1}>{t("chooseLanguage")}</Text>

      {langs.map((l) => {
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
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0B1020", padding: 18, paddingTop: 60 },
  h1: { color: "#fff", fontSize: 22, fontWeight: "900", marginBottom: 18 },
  pill: { backgroundColor: "#141B34", padding: 14, borderRadius: 14, marginBottom: 12 },
  active: { borderWidth: 1, borderColor: "#7C5CFF" },
  pillText: { color: "#fff", fontWeight: "800" },
});
