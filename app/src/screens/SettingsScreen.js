import React from "react";
import { View, Text, StyleSheet } from "react-native";
import colors from "../theme/colors";
import { useTranslation } from "react-i18next";
import LanguagePicker from "../components/LanguagePicker";

export default function SettingsScreen() {
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <Text style={styles.h1}>{t("settings")}</Text>
      <LanguagePicker />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, padding: 18, paddingTop: 60 },
  h1: { color: colors.text, fontSize: 24, fontWeight: "900" }
});
