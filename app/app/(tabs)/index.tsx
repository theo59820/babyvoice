import "../../src/i18n";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  Animated,
} from "react-native";
import { useTranslation } from "react-i18next";
import { LinearGradient } from "expo-linear-gradient";
import { Audio } from "expo-av";
import * as Haptics from "expo-haptics";

import { analyzeAudioAsync } from "../../src/services/api";
import {
  requestAudioPermissionsAsync,
  startRecordingAsync,
  stopRecordingAsync,
} from "../../src/services/recorder";

import ModernRecordButton from "../../src/components/ModernRecordButton";
import GlassCard from "../../src/components/GlassCard";
import RecordProgress from "../../src/components/RecordProgress";
import { UI } from "../../src/theme/ui";

import {
  addToHistory,
  clearHistory,
  loadHistory,
  HistoryItem,
} from "../../src/services/history";

const RECORD_MS = 3000;

export default function HomeScreen() {
  const { t } = useTranslation();

  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [status, setStatus] = useState<"idle" | "recording" | "analyzing">("idle");
  const [result, setResult] = useState<any>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const progress = useRef(new Animated.Value(0)).current;
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    (async () => {
      const h = await loadHistory();
      setHistory(h);
    })();
  }, []);

  const buttonLabel = useMemo(() => {
    if (status === "recording") return t("recording");
    if (status === "analyzing") return t("analyzing");
    return t("tapToRecord");
  }, [status, t]);

  function startProgress() {
    progress.setValue(0);
    Animated.timing(progress, {
      toValue: 1,
      duration: RECORD_MS,
      useNativeDriver: false,
    }).start();
  }

  function resetProgress() {
    progress.stopAnimation();
    progress.setValue(0);
  }

  async function runAnalysisFromUri(uri: string) {
    setStatus("analyzing");

    const json = await analyzeAudioAsync(uri);
    setResult(json.result);

    const next = await addToHistory({
      createdAt: Date.now(),
      label: json.result.label,
      confidence: Number(json.result.confidence),
      tips: Array.isArray(json.result.tips) ? json.result.tips : [],
    });

    setHistory(next);
    setStatus("idle");
  }

  async function stopRecordingNow(recToStop: Audio.Recording) {
    try {
      resetProgress();
      const uri = await stopRecordingAsync(recToStop);

      setRecording(null);

      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      await runAnalysisFromUri(uri || "");
    } catch (e: any) {
      setStatus("idle");
      resetProgress();
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Erreur", e?.message ?? "Erreur inconnue");
    }
  }

  async function onMainPress() {
    try {
      setResult(null);

      // START
      if (status === "idle") {
        await requestAudioPermissionsAsync();
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        const rec = await startRecordingAsync();
        setRecording(rec);
        setStatus("recording");
        startProgress();

        timeoutRef.current = setTimeout(() => {
          // auto stop après 3 sec
          stopRecordingNow(rec);
        }, RECORD_MS);

        return;
      }

      // STOP EARLY
      if (status === "recording" && recording) {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        await stopRecordingNow(recording);
      }
    } catch (e: any) {
      setStatus("idle");
      resetProgress();
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Erreur", e?.message ?? "Erreur inconnue");
    }
  }

  async function onClearHistory() {
    await clearHistory();
    setHistory([]);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }

  return (
    <LinearGradient colors={[UI.bg1, UI.bg2]} style={styles.container}>
      <Text style={styles.brand}>BabyVoice</Text>
      <Text style={styles.subtitle}>👶 {t("tapToRecord")}</Text>

      <ModernRecordButton
        onPress={onMainPress}
        disabled={status === "analyzing"}
        isRecording={status === "recording"}
        label={buttonLabel}
      />

      {status === "recording" && <RecordProgress progress={progress} />}

      {status === "analyzing" && (
        <ActivityIndicator style={{ marginTop: 14 }} />
      )}

      {result && (
        <GlassCard title={t("resultTitle")}>
          <Text style={styles.big}>{t(`labels.${result.label}`)}</Text>
          <Text style={styles.small}>
            {t("confidence")}: {result.confidence}%
          </Text>

          {!!result.tips?.length && (
            <View style={{ marginTop: 12 }}>
              <Text style={styles.tipsTitle}>{t("tips")}</Text>
              {result.tips.map((tipKey: string, idx: number) => (
                <Text key={idx} style={styles.tip}>
                  • {t(`tipsMap.${tipKey}`)}
                </Text>
              ))}
            </View>
          )}
        </GlassCard>
      )}

      {/* HISTORIQUE */}
      <View style={styles.historyHeader}>
        <Text style={styles.historyTitle}>Historique</Text>

        <Pressable onPress={onClearHistory} style={styles.clearBtn}>
          <Text style={styles.clearBtnText}>Effacer</Text>
        </Pressable>
      </View>

      <FlatList
        data={history}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 30 }}
        renderItem={({ item }) => {
          const d = new Date(item.createdAt);
          const hh = String(d.getHours()).padStart(2, "0");
          const mm = String(d.getMinutes()).padStart(2, "0");

          return (
            <View style={styles.historyItem}>
              <Text style={styles.historyLabel}>
                {t(`labels.${item.label}`)}
              </Text>
              <Text style={styles.historyMeta}>
                {hh}:{mm} • {item.confidence}%
              </Text>
            </View>
          );
        }}
        ListEmptyComponent={
          <Text style={{ color: UI.sub, marginTop: 8 }}>
            Aucun historique pour le moment.
          </Text>
        }
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 18, paddingTop: 66 },

  // ⚠️ RN supporte max 900, donc pas 1000
  brand: { color: UI.text, fontSize: 34, fontWeight: "900", letterSpacing: 0.3 },
  subtitle: { color: UI.sub, marginTop: 8, fontWeight: "700" },

  big: { color: UI.text, fontSize: 28, fontWeight: "900" },
  small: { color: UI.sub, marginTop: 6, fontWeight: "700" },
  tipsTitle: { color: UI.text, fontWeight: "900", marginBottom: 6, marginTop: 4 },
  tip: { color: UI.sub, lineHeight: 20, marginTop: 4 },

  historyHeader: {
    marginTop: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  historyTitle: { color: UI.text, fontWeight: "900", fontSize: 16 },

  clearBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.10)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  clearBtnText: { color: UI.sub, fontWeight: "800" },

  historyItem: {
    marginTop: 10,
    padding: 14,
    borderRadius: 18,
    backgroundColor: UI.glass,
    borderWidth: 1,
    borderColor: UI.glassBorder,
  },
  historyLabel: { color: UI.text, fontWeight: "900", fontSize: 16 },
  historyMeta: { color: UI.sub, marginTop: 4, fontWeight: "700" },
});
