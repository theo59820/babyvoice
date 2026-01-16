import { Audio } from "expo-av";

export async function requestAudioPermissionsAsync() {
  const { status } = await Audio.requestPermissionsAsync();
  if (status !== "granted") throw new Error("Microphone permission not granted");
}

export async function startRecordingAsync() {
  await Audio.setAudioModeAsync({
    allowsRecordingIOS: true,
    playsInSilentModeIOS: true,
  });

  const recording = new Audio.Recording();
  await recording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
  await recording.startAsync();
  return recording;
}

export async function stopRecordingAsync(recording: Audio.Recording) {
  await recording.stopAndUnloadAsync();
  return recording.getURI();
}
