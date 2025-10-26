import React, { useEffect, useMemo, useState } from 'react';
import { useRounds } from './useRounds';
import { startSession, endSession } from '../../utils/progressTracker';

type Grid = number[][]; // 0 empty, 1 filled

const patterns: { name: string; grid: Grid }[] = [
  {
    name: 'Heart',
    grid: [
      [0,1,0,1,0],
      [1,1,1,1,1],
      [1,0,1,0,1],
      [0,1,1,1,0],
      [0,0,1,0,0]
    ]
  },
  {
    name: 'Plus',
    grid:[
      [0,0,1,0,0],
      [0,0,1,0,0],
      [1,1,1,1,1],
      [0,0,1,0,0],
      [0,0,1,0,0]
    ]
  },
  {
    name: 'T',
    grid:[
      [1,1,1,1,1],
      [0,0,1,0,0],
      [0,0,1,0,0],
      [0,0,1,0,0],
      [0,0,1,0,0]
    ]
  },
  {
    name: 'Smiley',
    grid:[
      [0,1,0,1,0],
      [0,1,0,1,0],
      [0,0,0,0,0],
      [1,0,0,0,1],
      [0,1,1,1,0]
    ]
  },
  {
    name: 'Diamond',
    grid:[
      [0,0,1,0,0],
      [0,1,1,1,0],
      [1,1,1,1,1],
      [0,1,1,1,0],
      [0,0,1,0,0]
    ]
  }
];

const computeRowClues = (g: Grid) => g.map(row => {
  const res:number[] = [];
  let count = 0;
  for (const v of row) {
    if (v===1) count++; else { if (count>0) res.push(count); count=0; }
  }
  if (count>0) res.push(count);
  return res.length? res : [0];
});

const computeColClues = (g: Grid) => {
  const cols = g[0].map((_,c)=> g.map(r=> r[c]));
  return computeRowClues(cols as Grid);
}

export const MiniNonogram: React.FC = () => {
  const rounds = useRounds(Math.min(5, patterns.length));
  const [index, setIndex] = useState(0);
  const { grid: solution } = patterns[index];
  const [user, setUser] = useState<number[][]>(() => Array.from({length:5},()=>Array(5).fill(0)));
  const [message, setMessage] = useState<string>('');

  const rowClues = useMemo(()=> computeRowClues(solution), [solution]);
  const colClues = useMemo(()=> computeColClues(solution), [solution]);

  const toggle = (r:number,c:number) => {
    setUser(prev => {
      const next = prev.map(row=> row.slice());
      next[r][c] = next[r][c] ? 0 : 1;
      return next;
    });
  };

  const reset = () => setUser(Array.from({length:5},()=>Array(5).fill(0)));

  const check = () => {
    const match = user.every((row,r)=> row.every((v,c)=> v===solution[r][c]));
    if (match) {
      if ('speechSynthesis' in window){
        window.speechSynthesis.speak(new SpeechSynthesisUtterance('Nice! You completed the nonogram.'));
      }
      try { endSession('MiniNonogram'); } catch {}
      const res = rounds.advance();
      if (!res.done) {
        // move to next pattern
        setTimeout(() => {
          setIndex((i) => (i + 1) % patterns.length);
          reset();
          try { startSession('MiniNonogram'); } catch {}
        }, 800);
      } else {
        setMessage('Well done! All patterns complete.');
      }
    } else {
      setMessage('Not quite yet — keep going.');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Mini Nonogram (5×5)</h2>
        <div className="flex items-center gap-2">
          <select value={index} onChange={(e)=>{ setIndex(Number(e.target.value)); reset(); }} className="p-2 border rounded-md">
            {patterns.map((p,i)=> <option key={p.name} value={i}>{p.name}</option>)}
          </select>
          <button onClick={reset} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-md">Reset</button>
          <button onClick={check} className="px-3 py-1 bg-purple-600 text-white rounded-md">Check</button>
        </div>
      </div>
      {message && <div className="mb-4 p-3 bg-green-50 text-green-800 rounded">{message}</div>}

      <div className="grid grid-cols-6 gap-2 items-start">
        <div className="flex flex-col space-y-2">
          {rowClues.map((clues,r)=> (
            <div key={r} className="text-sm text-gray-600">{clues.join(' ')}</div>
          ))}
        </div>

        <div className="col-span-5">
          <div className="grid grid-cols-5 gap-1">
            {user.map((row,r)=> row.map((v,c)=> (
              <button key={`${r}-${c}`} onClick={()=> toggle(r,c)} className={`w-10 h-10 border ${v? 'bg-purple-600':''} ${solution[r][c] && v ? 'animate-pulse':''}`}>
                {''}
              </button>
            )))}
          </div>

          <div className="flex justify-between mt-2">
            <div className="flex gap-2">
              {colClues.map((clues,c)=> (
                <div key={c} className="text-sm text-gray-600">{clues.join('\n')}</div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 text-gray-600 text-sm">Use the row/column clues to fill squares. Toggle cells to match the pattern.</div>
    </div>
  );
};
