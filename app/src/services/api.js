const API_BASE_URL = "http://192.168.1.188:4000"; // <-- mets l'IP de ton PC

export async function analyzeAudioAsync(uri) {
  const formData = new FormData();

  formData.append("audio", {
    uri,
    name: "cry.m4a",
    type: "audio/m4a",
  });

  const res = await fetch(`${API_BASE_URL}/analyze`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`API error (${res.status}): ${txt}`);
  }

  return res.json();
}
