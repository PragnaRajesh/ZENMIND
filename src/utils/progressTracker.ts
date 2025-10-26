type Entry = {
  id: string;
  game: string;
  minutes: number;
  timestamp: number;
  mood?: number | null;
};

const STORAGE_KEY = 'mindmate_progress_entries_v1';
const sessions: Record<string, number> = {};

const readEntries = (): Entry[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Entry[];
  } catch (e) {
    return [];
  }
};

const writeEntries = (entries: Entry[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch (e) {
    // ignore
  }
};

const makeId = () => `${Date.now()}-${Math.random().toString(36).slice(2,9)}`;

export const startSession = (game: string) => {
  sessions[game] = Date.now();
  window.dispatchEvent(new CustomEvent('progress:sessionStarted', { detail: { game, startedAt: sessions[game] } }));
};

export const endSession = (game: string) => {
  const now = Date.now();
  const start = sessions[game] ?? (now - 60_000);
  delete sessions[game];
  const minutes = Math.max(1, Math.round((now - start) / 60000));
  const entry: Entry = { id: makeId(), game, minutes, timestamp: now, mood: null };
  const entries = readEntries();
  entries.push(entry);
  writeEntries(entries);
  window.dispatchEvent(new CustomEvent('progress:entry', { detail: entry }));

  return entry;
};

export const addEntry = (game: string, minutes: number, mood?: number | null) => {
  const now = Date.now();
  const entry: Entry = { id: makeId(), game, minutes, timestamp: now, mood: typeof mood === 'number' ? Math.round(mood) : null };
  const entries = readEntries();
  entries.push(entry);
  writeEntries(entries);
  window.dispatchEvent(new CustomEvent('progress:entry', { detail: entry }));
  return entry;
};

export const recordMood = (id: string, mood: number) => {
  const entries = readEntries();
  const idx = entries.findIndex((e) => e.id === id);
  if (idx === -1) return;
  entries[idx].mood = mood;
  writeEntries(entries);
  window.dispatchEvent(new CustomEvent('progress:entryUpdated', { detail: entries[idx] }));
};

export const getEntries = (sinceDays = 7) => {
  const entries = readEntries();
  const cutoff = Date.now() - sinceDays * 24 * 60 * 60 * 1000;
  return entries.filter((e) => e.timestamp >= cutoff);
};

export const clearEntries = () => {
  writeEntries([]);
  window.dispatchEvent(new CustomEvent('progress:cleared'));
};

export default {
  startSession,
  endSession,
  addEntry,
  recordMood,
  getEntries,
  clearEntries,
};
