import React, { useEffect, useMemo, useState } from 'react';
import { useRounds } from './useRounds';
import { startSession, endSession } from '../../utils/progressTracker';

const shuffle = (arr: number[]) => {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const makeSamples = (count = 5) => {
  const base = Array.from({ length: 9 }, (_, i) => i + 1);
  const samples: number[][] = [];
  for (let i = 0; i < count; i++) {
    samples.push(shuffle(base));
  }
  return samples;
};

export const ConnectDots: React.FC = () => {
  const n = 3;
  const samples = useMemo(() => makeSamples(5), []);
  const [sampleIndex, setSampleIndex] = useState(0);

  const gridValues = useMemo(() => {
    const arr = samples[sampleIndex];
    // build 3x3 grid row-major
    const grid: number[][] = [];
    for (let r = 0; r < n; r++) {
      grid.push(arr.slice(r * n, r * n + n));
    }
    return grid;
  }, [samples, sampleIndex]);

  const rounds = useRounds(5);
  useEffect(() => { startSession('ConnectDots'); return () => { try { endSession('ConnectDots'); } catch {} }; }, []);
  const total = n * n;
  const [next, setNext] = useState(1);
  const [found, setFound] = useState<number[]>([]);
  const [wrong, setWrong] = useState<number | null>(null);

  useEffect(() => {
    if (next > total) {
      try { endSession('ConnectDots'); } catch {}
      const res = rounds.advance();
      if (!res.done) {
        setTimeout(() => {
          setSampleIndex((i) => (i + 1) % samples.length);
          reset();
          try { startSession('ConnectDots'); } catch {}
        }, 900);
      }
    }
  }, [next]);

  const handleClick = (r: number, c: number) => {
    const val = gridValues[r][c];
    if (val === next) {
      setFound((f) => [...f, val]);
      setNext((t) => t + 1);
      setWrong(null);
    } else {
      setWrong(val);
      setTimeout(() => setWrong(null), 500);
    }
  };

  const reset = () => {
    setNext(1);
    setFound([]);
    setWrong(null);
  };

  const changeSample = (idx: number) => {
    setSampleIndex(idx);
    reset();
  };

  const regenerate = () => {
    const s = makeSamples(5);
    // replace samples by mutating local copy via setting sampleIndex reset
    // but samples is from useMemo; to regenerate, just set sampleIndex to 0 and replace via window.location.reload? simpler: change sampleIndex to random among 5
    // Instead, implement regenerate by updating a key forcing useMemo to re-run: use state
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Connect the 3×3 Grid</h2>
        <div className="flex items-center gap-3">
          <select value={sampleIndex} onChange={(e) => changeSample(Number(e.target.value))} className="p-2 border rounded-md">
            {samples.map((s, i) => (
              <option key={i} value={i}>Sample {i + 1}</option>
            ))}
          </select>
          <span className="text-purple-600">Next: {next}/{total}</span>
          <button onClick={reset} className="px-3 py-1 bg-purple-600 text-white rounded-md">Reset</button>
        </div>
      </div>

      <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${n}, minmax(0,1fr))`, maxWidth: 240, margin: '0 auto' }}>
        {gridValues.map((row, r) => row.map((val, c) => {
          const isFound = found.includes(val);
          return (
            <button key={`${r}-${c}`} onClick={() => handleClick(r, c)} className={`p-6 border rounded-sm text-lg ${isFound ? 'bg-purple-600 text-white' : (wrong === val ? 'bg-red-200' : 'bg-purple-50 text-purple-700')}`}>
              {val}
            </button>
          );
        }))}
      </div>

      {next > total && (
        <div className="mt-4 p-3 bg-green-50 border border-green-100 rounded-md text-green-800">Completed 🎉</div>
      )}

      <div className="mt-4 text-gray-600 text-sm">Tap tiles 1���9 in order. Choose different samples or Reset to try again.</div>
    </div>
  );
};
