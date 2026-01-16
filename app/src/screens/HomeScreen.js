import React, { useMemo, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { useTranslation } from "react-i18next";

import colors from "../theme/colors";
import BigRecordButton from "../components/BigRecordButton";
import ResultCard from "../components/ResultCard";
import { analyzeAudioAsync } from "../services/api";
import {
  requestAudioPermissionsAsync,
  startRecordingAsync,
  stopRecordingAsync
} from "../services/recorder";

export default function HomeScreen() {
  const { t } = useTranslation();

  const [recording, setRecording] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | recording | analyzing
  const [result, setResult] = useState(null);

  const buttonLabel = useMemo(() => {
    if (status === "recording") return t("recording");
    if (status === "analyzing") return t("analyzing");
    return t("tapToRecord");
  }, [status, t]);

  const disabled = status === "analyzing";

  async function onMainPress() {
    try {
      setResult(null);

      if (status === "idle") {
        await requestAudioPermissionsAsync();
        const rec = await startRecordingAsync();
        setRecording(rec);
        setStatus("recording");

        // Enregistre 3 secondes par défaut (MVP)
        setTimeout(async () => {
          try {
            if (rec) {
              const uri = await stopRecordingAsync(rec);
              setRecording(null);
              setStatus("analyzing");

              const json = await analyzeAudioAsync(uri);
              setResult(json.result);
              setStatus("idle");
            }
          } catch (e) {
            setStatus("idle");
            Alert.alert("Erreur", e.message);
          }
        }, 3000);

        return;
      }

      if (status === "recording" && recording) {
        // Si l’utilisateur retape pendant l’enregistrement -> stop immédiat
        const uri = await stopRecordingAsync(recording);
        setRecording(null);
        setStatus("analyzing");
        const json = await analyzeAudioAsync(uri);
        setResult(json.result);
        setStatus("idle");
      }
    } catch (e) {
      setStatus("idle");
      Alert.alert("Erreur", e.message);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.h1}>{t("appName")}</Text>

      <View style={{ marginTop: 28, alignItems: "center" }}>
        <BigRecordButton onPress={onMainPress} disabled={disabled} label={buttonLabel} />
        {status === "analyzing" && (
          <View style={{ marginTop: 14 }}>
            <ActivityIndicator />
          </View>
        )}
      </View>

      <ResultCard result={result} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, padding: 18, paddingTop: 60 },
  h1: { color: colors.text, fontSize: 28, fontWeight: "900" }
});
