import React, { useEffect, useState } from 'react';

type Grid = number[][]; // 4x4

const baseSolution: Grid = [
  [1,2,3,4],
  [3,4,1,2],
  [2,1,4,3],
  [4,3,2,1]
];

const deepCopy = (g: Grid) => g.map(r => r.slice());

const shuffleArray = <T,>(a: T[]) => {
  const arr = a.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const permuteNumbers = (grid: Grid) => {
  const map = shuffleArray([1,2,3,4]);
  return grid.map(row => row.map(v => map[v-1]));
};

const shuffleBands = (grid: Grid) => {
  // swap rows within bands and swap bands
  const g = deepCopy(grid);
  // shuffle rows within each band (bands size 2)
  for (let band = 0; band < 2; band++){
    const start = band*2;
    if (Math.random() > 0.5) [g[start], g[start+1]] = [g[start+1], g[start]];
  }
  // swap band order
  if (Math.random() > 0.5) {
    [g[0], g[1], g[2], g[3]] = [g[2], g[3], g[0], g[1]];
  }
  // similarly for columns: transpose, do same, transpose back
  const t = transpose(g);
  for (let band = 0; band < 2; band++){
    const start = band*2;
    if (Math.random() > 0.5) [t[start], t[start+1]] = [t[start+1], t[start]];
  }
  if (Math.random() > 0.5) {
    [t[0], t[1], t[2], t[3]] = [t[2], t[3], t[0], t[1]];
  }
  return transpose(t);
};

const transpose = (g: Grid) => g[0].map((_,c) => g.map(r => r[c]));

// Backtracking solver counting solutions up to limit
const countSolutions = (puzzle: Grid, limit = 2) => {
  const grid = deepCopy(puzzle);
  let count = 0;

  const isValid = (r: number, c: number, val: number) => {
    for (let i=0;i<4;i++) if (grid[r][i]===val) return false;
    for (let i=0;i<4;i++) if (grid[i][c]===val) return false;
    const br = Math.floor(r/2)*2, bc = Math.floor(c/2)*2;
    for (let i=0;i<2;i++) for (let j=0;j<2;j++) if (grid[br+i][bc+j]===val) return false;
    return true;
  };

  const back = () => {
    for (let r=0;r<4;r++){
      for (let c=0;c<4;c++){
        if (grid[r][c]===0){
          for (let v=1;v<=4;v++){
            if (isValid(r,c,v)){
              grid[r][c]=v;
              back();
              grid[r][c]=0;
              if (count>=limit) return;
            }
          }
          return;
        }
      }
    }
    count++;
  };

  back();
  return count;
};

const generatePuzzle = (): { puzzle: Grid; solution: Grid } => {
  // create varied full solution
  let sol = deepCopy(baseSolution);
  sol = permuteNumbers(sol);
  sol = shuffleBands(sol);

  // remove cells while ensuring unique solution
  let puzzle = deepCopy(sol).map(r => r.map(_ => 0));

  // Start by filling puzzle with full then remove progressively
  puzzle = deepCopy(sol);
  const positions = shuffleArray(Array.from({length:16},(_,i)=>i));

  for (const pos of positions){
    const r = Math.floor(pos/4), c = pos%4;
    const backup = puzzle[r][c];
    puzzle[r][c]=0;
    const sols = countSolutions(puzzle,2);
    if (sols !== 1) {
      // revert
      puzzle[r][c]=backup;
    }
  }

  // To make playable, ensure we have at least 6 empty cells (so it's not trivial). If too few empties, remove some freely.
  const empties = puzzle.flat().filter(v=>v===0).length;
  if (empties < 6){
    const remaining = shuffleArray(Array.from({length:16},(_,i)=>i)).filter(pos=>puzzle[Math.floor(pos/4)][pos%4]!==0);
    for (const pos of remaining){
      const r = Math.floor(pos/4), c = pos%4;
      const backup = puzzle[r][c];
      puzzle[r][c]=0;
      // don't check uniqueness now to increase difficulty
      if (puzzle.flat().filter(v=>v===0).length >= 6) break;
    }
  }

  return { puzzle, solution: sol };
};

import { useRounds } from './useRounds';
import { startSession, endSession } from '../../utils/progressTracker';

export const MiniSudoku: React.FC = () => {
  const rounds = useRounds(4);
  const [puzzle, setPuzzle] = useState<Grid>(() => generatePuzzle().puzzle);
  const [solution, setSolution] = useState<Grid>(() => generatePuzzle().solution);
  const [user, setUser] = useState<Grid>(() => deepCopy(puzzle));
  const [message, setMessage] = useState<string>('');

  useEffect(()=>{
    // initial puzzle
    const g = generatePuzzle();
    setPuzzle(g.puzzle);
    setSolution(g.solution);
    setUser(deepCopy(g.puzzle));
    startSession('MiniSudoku');
    return () => { try { endSession('MiniSudoku'); } catch {} };
  },[]);

  const onSet = (r:number,c:number,v:number) => {
    setUser(prev => {
      const next = deepCopy(prev);
      next[r][c] = v;
      return next;
    });
  };

  const check = () => {
    // compare user vs solution
    let ok = true;
    for (let r=0;r<4;r++) for (let c=0;c<4;c++){
      if (user[r][c] !== solution[r][c]) { ok = false; break; }
    }
    if (ok){
      // If completed this round, advance rounds and either load next or finish
      const res = rounds.advance();
      if (!res.done) {
        setMessage('Nice! Loading next puzzle...');
        try { endSession('MiniSudoku'); } catch {}
        setTimeout(() => {
          const g = generatePuzzle();
          setPuzzle(g.puzzle);
          setSolution(g.solution);
          setUser(deepCopy(g.puzzle));
          setMessage('');
          startSession('MiniSudoku');
        }, 900);
        if ('speechSynthesis' in window){
          const s = new SpeechSynthesisUtterance('Nice work! Next puzzle.');
          window.speechSynthesis.speak(s);
        }
      } else {
        setMessage('All puzzles complete! Great job.');
        if ('speechSynthesis' in window){
          const s = new SpeechSynthesisUtterance('All puzzles complete! Great job.');
          window.speechSynthesis.speak(s);
        }
      }
    } else setMessage('Not quite — keep trying or use a Hint.');
  };

  const hint = () => {
    // reveal one empty or incorrect cell
    for (let r=0;r<4;r++){
      for (let c=0;c<4;c++){
        if (user[r][c]===0 || user[r][c]!==solution[r][c]){
          setUser(prev => {
            const next = deepCopy(prev);
            next[r][c] = solution[r][c];
            return next;
          });
          return;
        }
      }
    }
  };

  const reset = () => {
    rounds.resetAll();
    const g = generatePuzzle();
    setPuzzle(g.puzzle);
    setSolution(g.solution);
    setUser(deepCopy(g.puzzle));
    setMessage('');
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Mini Sudoku (4×4)</h2>
        <div className="flex items-center gap-2">
          <button onClick={hint} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-md">Hint</button>
          <button onClick={check} className="px-3 py-1 bg-purple-600 text-white rounded-md">Check</button>
          <button onClick={reset} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-md">Reset</button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 max-w-xs mx-auto mb-4">
        {user.map((row,r)=> row.map((v,c)=>(
          <div key={`${r}-${c}`} className={`h-12 flex items-center justify-center border rounded ${puzzle[r][c]===0 ? 'bg-purple-50' : 'bg-gray-100'}`}>
            {puzzle[r][c]!==0 ? (
              <div className="text-lg font-semibold">{puzzle[r][c]}</div>
            ) : (
              <input
                type="number"
                min={1}
                max={4}
                value={v === 0 ? '' : v}
                onChange={(e) => {
                  const raw = e.target.value;
                  const num = raw === '' ? 0 : Math.max(0, Math.min(4, Number(raw)));
                  onSet(r, c, Number.isNaN(num) ? 0 : num);
                }}
                className="bg-transparent text-lg text-center w-full h-full outline-none"
                inputMode="numeric"
              />
            )}
          </div>
        ))) }
      </div>

      {message && <div className="text-center text-green-600 font-medium">{message}</div>}

      <div className="mt-4 text-gray-600 text-sm">Fill the grid so 1–4 appear once per row, column and each 2×2 box. Solvable in a few minutes.</div>
    </div>
  );
};
