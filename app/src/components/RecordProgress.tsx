import React from "react";
import { View, StyleSheet, Animated } from "react-native";
import { UI } from "../theme/ui";

export default function RecordProgress({ progress }: { progress: Animated.Value }) {
  const width = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={styles.track}>
      <Animated.View style={[styles.bar, { width }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 10,
    width: "100%",
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.10)",
    overflow: "hidden",
    marginTop: 16,
  },
  bar: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: UI.mint,
  },
});
