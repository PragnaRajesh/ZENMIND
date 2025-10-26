import React, { useEffect, useState, useRef } from 'react';
import { useRounds } from './useRounds';
import { startSession, endSession } from '../../utils/progressTracker';

const differences = [
  { id: 'a', cx: 100, cy: 60, r: 18 },
  { id: 'b', cx: 220, cy: 110, r: 18 },
  { id: 'c', cx: 320, cy: 70, r: 16 },
  { id: 'd', cx: 260, cy: 40, r: 12 },
];

export const SpotDifference: React.FC = () => {
  const rounds = useRounds(4);
  useEffect(() => { startSession('SpotDifference'); return () => { try { endSession('SpotDifference'); } catch {} }; }, []);
  const [found, setFound] = useState<string[]>([]);
  const [hintAvailableAt, setHintAvailableAt] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(90);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    timerRef.current = window.setInterval(() => setTimeLeft((t) => Math.max(0, t - 1)), 1000);
    return () => { if (timerRef.current) window.clearInterval(timerRef.current); };
  }, []);

  useEffect(() => {
    if (found.length === differences.length) {
      try { endSession('SpotDifference'); } catch {}
      const res = rounds.advance();
      if (!res.done) {
        setTimeout(() => {
          setFound([]);
          setTimeLeft(90);
          try { startSession('SpotDifference'); } catch {}
        }, 900);
      }
    }
  }, [found.length]);

  const handleClickOnSecond = (e: React.MouseEvent) => {
    if (timeLeft === 0) return;
    const rect = (e.target as Element).getBoundingClientRect();
    const x = (e as any).clientX - rect.left;
    const y = (e as any).clientY - rect.top;
    for (const d of differences) {
      const dx = x - d.cx;
      const dy = y - d.cy;
      if (dx * dx + dy * dy <= d.r * d.r) {
        if (!found.includes(d.id)) setFound((s) => [...s, d.id]);
        return;
      }
    }
  };

  const giveHint = () => {
    const now = Date.now();
    if (now < hintAvailableAt) return;
    const next = differences.find((d) => !found.includes(d.id));
    if (!next) return;
    setFound((s) => [...s, next.id]);
    setHintAvailableAt(now + 15000);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Spot the Difference</h2>
        <div className="flex items-center gap-2">
          <span className="text-purple-600">Found: {found.length}/{differences.length}</span>
          <span className="text-gray-600">Time: {timeLeft}s</span>
          <button onClick={giveHint} disabled={Date.now() < hintAvailableAt} className="px-3 py-1 bg-purple-600 text-white rounded-md">Hint</button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 items-start">
        {/* First image: base */}
        <div className="border rounded-md overflow-hidden">
          <svg viewBox="0 0 400 220" className="w-full h-auto bg-purple-50">
            <rect x={0} y={0} width={400} height={220} fill="#F3F4F6" />
            <g>
              <rect x={20} y={20} width={120} height={80} rx={8} fill="#FDE68A" />
              <circle cx={100} cy={60} r={28} fill="#93C5FD" />
              <rect x={200} y={30} width={160} height={120} rx={12} fill="#D1FAE5" />
              <text x={60} y={170} fontSize={18} fill="#6B21A8">Scene A</text>
            </g>
          </svg>
        </div>

        {/* Second image: has extra chaotic elements to find */}
        <div className="border rounded-md overflow-hidden">
          <svg viewBox="0 0 400 220" className="w-full h-auto bg-purple-50" onClick={handleClickOnSecond}>
            <rect x={0} y={0} width={400} height={220} fill="#F3F4F6" />

            {/* base shapes */}
            <rect x={20} y={20} width={120} height={80} rx={8} fill="#FDE68A" />
            <circle cx={100} cy={60} r={28} fill="#93C5FD" />
            <rect x={200} y={30} width={160} height={120} rx={12} fill="#D1FAE5" />
            <text x={60} y={170} fontSize={18} fill="#6B21A8">Scene B</text>

            {/* differences (only in B) */}
            <g>
              <circle cx={100} cy={60} r={20} fill="#7C3AED" />
              <rect x={200} y={30} width={120} height={120} rx={12} fill="#C7F9E5" />
              <circle cx={320} cy={70} r={10} fill="#FCA5A5" />
              <path d="M250 160 q20 -30 40 0" stroke="#F59E0B" strokeWidth={6} fill="none" strokeLinecap="round" />
            </g>

            {/* found overlays */}
            {found.map((id) => {
              const d = differences.find((dd) => dd.id === id)!;
              return <circle key={id} cx={d.cx} cy={d.cy} r={d.r + 6} fill="rgba(34,197,94,0.18)" stroke="#16A34A" />;
            })}
          </svg>
        </div>
      </div>

      {found.length === differences.length && (
        <div className="mt-4 p-3 bg-green-50 border border-green-100 rounded-md text-green-800">All differences found — nice work 🎉</div>
      )}

      <div className="mt-3 text-gray-600 text-sm">Click the right image to mark items that are present there but not in the left image. Use hints if you get stuck.</div>
    </div>
  );
};
