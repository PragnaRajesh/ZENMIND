import React, { useEffect, useState } from 'react';
import { useRounds } from './useRounds';
import { startSession, endSession, addEntry } from '../../utils/progressTracker';

type Item = { text: string; time: string; id: string };

const STORAGE_KEY = 'gratitude_garden_items_v1';

export const GratitudeGarden: React.FC = () => {
  const rounds = useRounds(4);
  useEffect(() => { startSession('GratitudeGarden'); return () => { try { endSession('GratitudeGarden'); } catch {} }; }, []);
  const [input, setInput] = useState('');
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch (e) {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      // ignore
    }
  }, [items]);

  // advance rounds when the user adds 3 items
  useEffect(() => {
    if (items.length >= 3) {
      try { endSession('GratitudeGarden'); } catch {}
      const res = rounds.advance();
      if (!res.done) {
        setTimeout(() => { setItems([]); startSession('GratitudeGarden'); }, 900);
      }
    }
  }, [items.length]);

  const addItem = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    const newItem: Item = { text: trimmed, time: new Date().toISOString(), id: String(Date.now()) };
    setItems((s) => [newItem, ...s].slice(0, 10));
    setInput('');
    // add a small progress entry for gratitude (manual short practice)
    try { addEntry('GratitudeGarden', 5, null); } catch (e) { /* ignore */ }
    // emit a planted event for visuals
    try { window.dispatchEvent(new CustomEvent('gratitude:planted', { detail: newItem })); } catch (e) { /* ignore */ }
  };

  const removeItem = (id: string) => {
    setItems((s) => s.filter((it) => it.id !== id));
  };

  const reset = () => setItems([]);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Gratitude Garden</h2>
        <div className="flex items-center space-x-4">
          <span className="text-purple-600">Items: {items.length}</span>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-gray-600 mb-2">Write things you're grateful for. Plant at least three to grow your garden — focusing on positives boosts mood.</p>
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addItem()}
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            placeholder="I am grateful for..."
          />
          <button
            onClick={addItem}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Add
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {items.length === 0 && <div className="text-gray-500">No items yet — add something small.</div>}
        {items.map((it) => (
          <div key={it.id} className="p-3 bg-purple-50 rounded-lg flex items-center justify-between">
            <div>
              <div className="text-gray-800">{it.text}</div>
              <div className="text-xs text-gray-400">{new Date(it.time).toLocaleString()}</div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => removeItem(it.id)} className="text-sm text-red-600 hover:underline">Remove</button>
            </div>
          </div>
        ))}
      </div>

      {items.length >= 3 && (
        <div className="mt-4 p-4 bg-green-50 border border-green-100 rounded-lg text-green-700">
          Nice! Your Gratitude Garden is growing 🌱 — this practice supports resilience and positive mood.
          <div className="mt-2 flex justify-end gap-2">
            <button onClick={reset} className="px-3 py-1 bg-purple-600 text-white rounded-md">Reset</button>
            <button onClick={() => {
              // export CSV
              const csv = 'text,time\n' + items.map(i => `"${i.text.replace(/"/g,'""')}","${i.time}"`).join('\n');
              const blob = new Blob([csv], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'gratitude.csv';
              a.click();
              URL.revokeObjectURL(url);
            }} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-md">Export CSV</button>
          </div>
        </div>
      )}
    </div>
  );
};
