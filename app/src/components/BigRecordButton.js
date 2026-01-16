import React from "react";
import { Pressable, Text, StyleSheet } from "react-native";
import colors from "../theme/colors";

export default function BigRecordButton({ onPress, disabled, label }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.btn,
        disabled && styles.disabled,
        pressed && !disabled && { transform: [{ scale: 0.98 }] }
      ]}
    >
      <Text style={styles.text}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 }
  },
  disabled: { opacity: 0.6 },
  text: { color: colors.text, fontSize: 18, fontWeight: "700", textAlign: "center" }
});
