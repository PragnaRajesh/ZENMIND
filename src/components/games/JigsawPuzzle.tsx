import React, { useEffect, useMemo, useState } from 'react';
import { useRounds } from './useRounds';
import { startSession, endSession } from '../../utils/progressTracker';

const puzzles = [
  {
    id: 'sunset',
    name: 'Sun & Hills',
    svg: `<svg xmlns='http://www.w3.org/2000/svg' width='600' height='600' viewBox='0 0 600 600'>
      <rect width='100%' height='100%' fill='#FEF3C7'/>
      <circle cx='300' cy='200' r='80' fill='#FB923C'/>
      <ellipse cx='300' cy='420' rx='320' ry='120' fill='#86EFAC' />
      <ellipse cx='220' cy='380' rx='180' ry='80' fill='#34D399' />
      <ellipse cx='420' cy='380' rx='180' ry='80' fill='#34D399' />
    </svg>`
  },
  {
    id: 'flower',
    name: 'Flower',
    svg: `<svg xmlns='http://www.w3.org/2000/svg' width='600' height='600' viewBox='0 0 600 600'>
      <rect width='100%' height='100%' fill='#EFF6FF'/>
      <g transform='translate(300,300)'>
        <circle r='40' fill='#F59E0B' />
        <g fill='#FCA5A5'>
          <ellipse rx='30' ry='70' transform='rotate(0)' />
          <ellipse rx='30' ry='70' transform='rotate(45)' />
          <ellipse rx='30' ry='70' transform='rotate(90)' />
          <ellipse rx='30' ry='70' transform='rotate(135)' />
          <ellipse rx='30' ry='70' transform='rotate(180)' />
          <ellipse rx='30' ry='70' transform='rotate(225)' />
          <ellipse rx='30' ry='70' transform='rotate(270)' />
          <ellipse rx='30' ry='70' transform='rotate(315)' />
        </g>
      </g>
      <rect x='240' y='360' width='20' height='120' fill='#4ADE80' transform='rotate(-10 250 360)' />
      <rect x='340' y='360' width='20' height='120' fill='#4ADE80' transform='rotate(10 350 360)' />
    </svg>`
  },
  {
    id: 'mountain',
    name: 'Mountains',
    svg: `<svg xmlns='http://www.w3.org/2000/svg' width='600' height='600' viewBox='0 0 600 600'>
      <rect width='100%' height='100%' fill='#EFF6FF'/>
      <polygon points='0,420 150,180 300,420' fill='#60A5FA' />
      <polygon points='200,420 350,140 500,420' fill='#3B82F6' />
      <rect x='0' y='420' width='600' height='180' fill='#BBF7D0' />
      <circle cx='480' cy='160' r='30' fill='#FDE68A' />
    </svg>`
  },
  {
    id: 'tree',
    name: 'Tree',
    svg: `<svg xmlns='http://www.w3.org/2000/svg' width='600' height='600' viewBox='0 0 600 600'>
      <rect width='100%' height='100%' fill='#FEF3C7'/>
      <rect x='280' y='340' width='40' height='140' fill='#8B5E3C' />
      <circle cx='300' cy='260' r='90' fill='#34D399' />
      <circle cx='240' cy='300' r='50' fill='#34D399' />
      <circle cx='360' cy='300' r='50' fill='#34D399' />
    </svg>`
  },
  {
    id: 'waves',
    name: 'Waves',
    svg: `<svg xmlns='http://www.w3.org/2000/svg' width='600' height='600' viewBox='0 0 600 600'>
      <rect width='100%' height='100%' fill='#EFF6FF'/>
      <path d='M0 380 Q150 300 300 380 T600 380 V600 H0 Z' fill='#60A5FA' />
      <path d='M0 420 Q150 340 300 420 T600 420 V600 H0 Z' fill='#93C5FD' opacity='0.9' />
    </svg>`
  }
];

export const JigsawPuzzle: React.FC = () => {
  const rows = 3;
  const cols = 3;
  const total = rows * cols;

  const rounds = useRounds(Math.min(5, puzzles.length));
  useEffect(() => { startSession('JigsawPuzzle'); return () => { try { endSession('JigsawPuzzle'); } catch {} }; }, []);
  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const puzzle = puzzles[puzzleIndex];

  const pieces = useMemo(() => Array.from({ length: total }).map((_, i) => i), [total]);

  const [slots, setSlots] = useState<number[]>(() => {
    const ids = pieces.slice();
    for (let i = ids.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [ids[i], ids[j]] = [ids[j], ids[i]];
    }
    return ids;
  });

  const [rotations, setRotations] = useState<number[]>(() => pieces.map(() => (Math.random() > 0.7 ? 90 * Math.floor(Math.random() * 4) : 0)));

  const changePuzzle = (idx: number) => {
    setPuzzleIndex(idx);
    // reset slots and rotations
    const ids = pieces.slice();
    for (let i = ids.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [ids[i], ids[j]] = [ids[j], ids[i]];
    }
    setSlots(ids);
    setRotations(pieces.map(() => (Math.random() > 0.7 ? 90 * Math.floor(Math.random() * 4) : 0)));
  };

  const onDragStart = (e: React.DragEvent, pieceId: number) => {
    e.dataTransfer.setData('text/plain', String(pieceId));
  };
  const onDrop = (e: React.DragEvent, slotIndex: number) => {
    const data = e.dataTransfer.getData('text/plain');
    if (!data) return;
    const pieceId = Number(data);
    setSlots((s) => {
      const newSlots = [...s];
      const fromIndex = newSlots.findIndex((id) => id === pieceId);
      if (fromIndex === -1) return newSlots;
      [newSlots[fromIndex], newSlots[slotIndex]] = [newSlots[slotIndex], newSlots[fromIndex]];
      return newSlots;
    });
  };
  const onDragOver = (e: React.DragEvent) => e.preventDefault();

  const rotatePiece = (pieceId: number) => {
    setRotations((r) => {
      const next = [...r];
      next[pieceId] = (next[pieceId] + 90) % 360;
      return next;
    });
  };

  const reset = () => {
    const ids = pieces.slice();
    for (let i = ids.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [ids[i], ids[j]] = [ids[j], ids[i]];
    }
    setSlots(ids);
    setRotations(pieces.map(() => (Math.random() > 0.7 ? 90 * Math.floor(Math.random() * 4) : 0)));
  };

  const isComplete = slots.every((id, idx) => id === idx) && rotations.every((rot) => rot % 360 === 0);

  // advance rounds when puzzle completed
  useEffect(() => {
    if (isComplete) {
      try { endSession('JigsawPuzzle'); } catch {}
      const res = rounds.advance();
      if (!res.done) {
        setTimeout(() => {
          const next = (puzzleIndex + 1) % puzzles.length;
          changePuzzle(next);
          try { startSession('JigsawPuzzle'); } catch {}
        }, 900);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isComplete]);

  const bg = `data:image/svg+xml;utf8,${encodeURIComponent(puzzle.svg)}`;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Jigsaw Puzzle</h2>
        <div className="flex items-center gap-3">
          <select value={puzzleIndex} onChange={(e) => changePuzzle(Number(e.target.value))} className="p-2 border rounded-md">
            {puzzles.map((p, i) => <option key={p.id} value={i}>{p.name}</option>)}
          </select>
          <button onClick={reset} className="px-3 py-1 bg-purple-600 text-white rounded-md">Shuffle</button>
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 8, maxWidth: 420, margin: '0 auto' }}>
        {slots.map((pieceId, slotIdx) => {
          const row = Math.floor(pieceId / cols);
          const col = pieceId % cols;
          const bgPosX = (col / (cols - 1)) * 100;
          const bgPosY = (row / (rows - 1)) * 100;
          return (
            <div key={slotIdx} onDrop={(e) => onDrop(e, slotIdx)} onDragOver={onDragOver} className={`h-36 rounded-md overflow-hidden border-2 ${pieceId === slotIdx ? 'border-green-200' : 'border-gray-200'}`}>
              <div draggable onDragStart={(e) => onDragStart(e, pieceId)} onDoubleClick={() => rotatePiece(pieceId)} style={{ width: '100%', height: '100%', backgroundImage: `url(${bg})`, backgroundSize: `${cols * 100}% ${rows * 100}%`, backgroundPosition: `${bgPosX}% ${bgPosY}%`, transform: `rotate(${rotations[pieceId]}deg)`, transition: 'transform 0.2s' }} />
            </div>
          );
        })}
      </div>

      {isComplete && (
        <div className="mt-4 p-3 bg-green-50 border border-green-100 rounded-md text-green-800">Nice! Puzzle complete 🎉</div>
      )}

      <div className="mt-4 text-gray-600 text-sm">Drag pieces to assemble the image. Double-click a piece to rotate it. Use different images from the dropdown.</div>
    </div>
  );
};
