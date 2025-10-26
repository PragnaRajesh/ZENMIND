import React, { useEffect, useMemo, useRef, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { useRounds } from './useRounds';
import { startSession, endSession } from '../../utils/progressTracker';

const words = [
  { word: 'MINDFUL', hint: 'Being present in the moment', difficulty: 'easy' },
  { word: 'BALANCE', hint: 'Equal distribution of weight', difficulty: 'easy' },
  { word: 'BREATHE', hint: 'Essential for life and relaxation', difficulty: 'easy' },
  { word: 'CALM', hint: 'State of tranquility', difficulty: 'easy' },
  { word: 'PEACE', hint: 'State of harmony', difficulty: 'easy' },
  { word: 'FOCUS', hint: 'Concentrated attention', difficulty: 'easy' },
  { word: 'RELAX', hint: 'Release tension', difficulty: 'easy' },
  { word: 'HAPPY', hint: 'Feeling of joy', difficulty: 'easy' },
  { word: 'RESILIENCE', hint: 'Ability to recover from difficulties', difficulty: 'medium' },
  { word: 'MINDFULNESS', hint: 'Awareness of the present moment', difficulty: 'medium' },
  { word: 'GROUNDING', hint: 'Techniques to stay present', difficulty: 'medium' },
  { word: 'REFLECT', hint: 'Think deeply', difficulty: 'medium' },
  { word: 'COMPASSION', hint: 'Kindness to oneself and others', difficulty: 'hard' },
  { word: 'AFFIRMATION', hint: 'Positive statement', difficulty: 'hard' },
  { word: 'THOUGHTFUL', hint: 'Careful consideration', difficulty: 'hard' },
];

export const WordScramble: React.FC = () => {
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [currentWord, setCurrentWord] = useState('');
  const [scrambledWord, setScrambledWord] = useState('');
  const [hint, setHint] = useState('');
  const [userInput, setUserInput] = useState('');
  const [message, setMessage] = useState('');
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const timerRef = useRef<number | null>(null);

  const scrambleWord = (word: string) => {
    const arr = word.split('');
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.join('');
  };

  const pickWord = () => {
    const pool = words.filter((w) => w.difficulty === difficulty);
    const randomWord = pool[Math.floor(Math.random() * pool.length)];
    setCurrentWord(randomWord.word);
    setHint(randomWord.hint);
    setScrambledWord(scrambleWord(randomWord.word));
    setUserInput('');
    setMessage('');
    setTimeLeft(difficulty === 'easy' ? 30 : difficulty === 'medium' ? 45 : 60);
  };

  useEffect(() => {
    pickWord();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [difficulty]);

  useEffect(() => {
    if (timerRef.current) window.clearInterval(timerRef.current);
    timerRef.current = window.setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          window.clearInterval(timerRef.current!);
          setMessage('Time up!');
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [currentWord]);

  const revealHint = () => {
    // show first letter(s) depending on difficulty
    if (difficulty === 'easy') setMessage(`Hint: starts with ${currentWord[0]}`);
    else if (difficulty === 'medium') setMessage(`Hint: starts with ${currentWord.slice(0,2)}`);
    else setMessage(`Hint: starts with ${currentWord.slice(0,3)}`);
  };

  const rounds = useRounds(4);

  useEffect(() => { startSession('WordScramble'); return () => { try { endSession('WordScramble'); } catch {} }; }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userInput.toUpperCase() === currentWord) {
      setMessage('Correct! Well done! 🎉');
      try { endSession('WordScramble'); } catch {}
      const res = rounds.advance();
      if (!res.done) {
        setTimeout(() => { pickWord(); startSession('WordScramble'); }, 900);
      } else {
        setMessage('All rounds complete! Great job.');
      }
    } else {
      setMessage('Try again! 🤔');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Word Scramble</h2>
        <div className="flex items-center space-x-4">
          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value as any)} className="p-2 border rounded-md">
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
          <button
            onClick={pickWord}
            className="p-2 text-purple-600 hover:text-purple-700 transition-colors"
          >
            <RefreshCw className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="text-center mb-4">
        <div className="text-4xl font-bold text-purple-600 mb-2">{scrambledWord}</div>
        <div className="text-gray-600">Hint: {hint}</div>
        <div className="text-sm text-gray-500">Time left: {timeLeft}s</div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={userInput}
          disabled={timeLeft === 0}
          onChange={(e) => setUserInput(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          placeholder="Enter your answer"
        />
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={timeLeft === 0}
            className="flex-1 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Check Answer
          </button>
          <button type="button" onClick={revealHint} className="px-4 py-3 bg-purple-100 text-purple-700 rounded-lg">Hint</button>
        </div>
      </form>

      {message && (
        <div className={`mt-4 text-center text-lg ${
          message.includes('Correct') ? 'text-green-600' : 'text-orange-600'
        }`}>
          {message}
        </div>
      )}
    </div>
  );
};
