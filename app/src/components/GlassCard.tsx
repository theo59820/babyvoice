import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { UI } from "../theme/ui";

export default function GlassCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: UI.glass,
    borderColor: UI.glassBorder,
    borderWidth: 1,
    borderRadius: 22,
    padding: 16,
    marginTop: 18,
  },
  title: { color: UI.sub, fontWeight: "900", marginBottom: 10, letterSpacing: 0.3 },
});
