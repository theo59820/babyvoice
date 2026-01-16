import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "babyvoice_history_v1";
const MAX_ITEMS = 30;

export type HistoryItem = {
  id: string;
  createdAt: number;
  label: string;
  confidence: number;
  tips: string[];
};

export async function loadHistory(): Promise<HistoryItem[]> {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function addToHistory(item: Omit<HistoryItem, "id">) {
  const history = await loadHistory();
  const newItem: HistoryItem = {
    id: `${Date.now()}_${Math.random().toString(16).slice(2)}`,
    ...item,
  };

  const next = [newItem, ...history].slice(0, MAX_ITEMS);
  await AsyncStorage.setItem(KEY, JSON.stringify(next));
  return next;
}

export async function clearHistory() {
  await AsyncStorage.removeItem(KEY);
}
