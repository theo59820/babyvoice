import React, { useEffect, useRef } from "react";
import { Pressable, Text, StyleSheet, Animated, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { UI } from "../theme/ui";

type Props = {
  onPress: () => void;
  label: string;
  disabled?: boolean;
  isRecording?: boolean;
};

export default function ModernRecordButton({ onPress, label, disabled, isRecording }: Props) {
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!isRecording) {
      pulse.stopAnimation();
      pulse.setValue(0);
      return;
    }

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 650, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 650, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [isRecording, pulse]);

  const haloScale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.12] });
  const haloOpacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.25, 0.45] });

  return (
    <View style={styles.wrap}>
      {/* Halo */}
      <Animated.View style={[styles.halo, { transform: [{ scale: haloScale }], opacity: haloOpacity }]} />

      <Pressable onPress={onPress} disabled={disabled} style={({ pressed }) => [pressed && !disabled && { transform: [{ scale: 0.99 }] }]}>
        <LinearGradient
          colors={isRecording ? [UI.pink, UI.lilac] : [UI.lilac, UI.mint]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.btn, disabled && { opacity: 0.55 }]}
        >
          <View style={styles.iconCircle}>
            <Ionicons name={isRecording ? "mic" : "mic-outline"} size={22} color={UI.text} />
          </View>
          <Text style={styles.text}>{label}</Text>
        </LinearGradient>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: "center", marginTop: 26 },
  halo: {
    position: "absolute",
    width: 260,
    height: 260,
    borderRadius: 48,
    backgroundColor: "rgba(141,123,255,0.22)",
    transform: [{ rotate: "8deg" }],
  },
  btn: {
    width: 300,
    height: 86,
    borderRadius: 28,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    shadowOpacity: 0.25,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
  },
  iconCircle: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },
  text: { color: UI.text, fontSize: 18, fontWeight: "900" },
});
