import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { useRounds } from './useRounds';
import { startSession, endSession } from '../../utils/progressTracker';

interface Card {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

type Level = 'easy' | 'medium' | 'hard';

export const MemoryGame: React.FC = () => {
  const allEmojis = [
    '����','💭','⭐','💡','🎯','🌈','🎨','🎮','🌿','🌸','☀️','🌙','🔥','🌊','🐦','🍃','🍀','🎵','✨','🕊️','🌻','🍁','🌱','🌼','🎈','🧩','🪴','🔆','💖','🛋️','🕯️','🧘','🩵','🟣','🟣'
  ];

  const [level, setLevel] = useState<Level>('easy');
  const [pairs, setPairs] = useState<number>(8);
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matches, setMatches] = useState<number>(0);
  const [moves, setMoves] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);
  const timerRef = useRef<number | null>(null);
  const [running, setRunning] = useState(false);
  const [bestTime, setBestTime] = useState<number | null>(null);

  useEffect(() => {
    if (level === 'easy') setPairs(8);
    if (level === 'medium') setPairs(12);
    if (level === 'hard') setPairs(18);
  }, [level]);

  const initializeGame = (startRunning = false) => {
    const selected = allEmojis.slice(0, pairs);
    const base = [...selected, ...selected];
    const shuffled = base
      .map((v) => ({ v, r: Math.random() }))
      .sort((a, b) => a.r - b.r)
      .map((x, idx) => ({ id: idx, emoji: x.v, isFlipped: false, isMatched: false }));
    setCards(shuffled);
    setFlippedCards([]);
    setMatches(0);
    setMoves(0);
    setSeconds(0);
    setRunning(startRunning);
  };

  useEffect(() => {
    const raw = localStorage.getItem('memory_best_time');
    if (raw) setBestTime(Number(raw));
    initializeGame(false);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (running) {
      timerRef.current = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    } else if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [running]);

  const rounds = useRounds(4);

  useEffect(() => { startSession('MemoryGame'); return () => { try { endSession('MemoryGame'); } catch {} }; }, []);

  useEffect(() => {
    if (matches === pairs) {
      setRunning(false);
      if (bestTime === null || seconds < bestTime) {
        setBestTime(seconds);
        localStorage.setItem('memory_best_time', String(seconds));
      }
      try { endSession('MemoryGame'); } catch {}
      const res = rounds.advance();
      if (!res.done) {
        // start next round with new shuffled deck
        setTimeout(() => { initializeGame(false); startSession('MemoryGame'); }, 900);
      } else {
        // completed all rounds
        // keep the final board visible and show a brief message
        setTimeout(() => {
          // noop for now - could show toast
        }, 400);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matches]);

  const handleCardClick = (id: number) => {
    if (flippedCards.length === 2 || cards[id].isMatched || cards[id].isFlipped) return;

    if (!running) setRunning(true);

    const newCards = [...cards];
    newCards[id].isFlipped = true;
    setCards(newCards);
    setFlippedCards((prev) => {
      const next = [...prev, id];
      if (next.length === 2) {
        setMoves((m) => m + 1);
        const [a, b] = next;
        if (newCards[a].emoji === newCards[b].emoji) {
          newCards[a].isMatched = true;
          newCards[b].isMatched = true;
          setCards(newCards);
          setFlippedCards([]);
          setMatches((m) => m + 1);
        } else {
          setTimeout(() => {
            newCards[a].isFlipped = false;
            newCards[b].isFlipped = false;
            setCards([...newCards]);
            setFlippedCards([]);
          }, 900);
        }
      }
      return next;
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Memory Match</h2>
        <div className="flex items-center space-x-4">
          <select value={level} onChange={(e) => setLevel(e.target.value as Level)} className="p-2 border rounded-md">
            <option value="easy">Easy (4x4)</option>
            <option value="medium">Medium (4x6)</option>
            <option value="hard">Hard (6x6)</option>
          </select>
          <span className="text-purple-600">Moves: {moves}</span>
          <span className="text-purple-600">Matches: {matches}</span>
          <span className="text-gray-600">Time: {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, '0')}</span>
          <button
            onClick={() => initializeGame(true)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            New Game
          </button>
        </div>
      </div>

      <div className={`grid gap-4 ${pairs <= 8 ? 'grid-cols-4' : pairs <= 12 ? 'grid-cols-6' : 'grid-cols-6'}`}>
        {cards.map((card) => (
          <button
            key={card.id}
            onClick={() => handleCardClick(card.id)}
            className={`aspect-square text-3xl rounded-lg transition-all duration-300 ${
              card.isFlipped || card.isMatched ? 'bg-purple-100 rotate-0' : 'bg-purple-600 rotate-180'
            }`}
            disabled={card.isMatched}
          >
            <span className={card.isFlipped || card.isMatched ? '' : 'invisible'}>
              {card.emoji}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-4 text-sm text-gray-600">Best time: {bestTime !== null ? `${Math.floor(bestTime / 60)}:${String(bestTime % 60).padStart(2,'0')}` : '—'}</div>
    </div>
  );
};
