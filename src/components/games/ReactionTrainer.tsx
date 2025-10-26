import React, { useEffect, useRef, useState } from 'react';
import { useRounds } from './useRounds';
import { startSession, endSession } from '../../utils/progressTracker';

export const ReactionTrainer: React.FC = () => {
  const rounds = useRounds(5);
  useEffect(() => { startSession('ReactionTrainer'); return () => { try { endSession('ReactionTrainer'); } catch {} }; }, []);
  const [status, setStatus] = useState<'ready' | 'waiting' | 'go' | 'result'>('ready');
  const [message, setMessage] = useState('Press Start to begin');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [reaction, setReaction] = useState<number | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const [best, setBest] = useState<number | null>(null);
  const [trials, setTrials] = useState<number[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem('reaction_best');
    if (raw) setBest(Number(raw));
    const rawList = localStorage.getItem('reaction_trials');
    if (rawList) setTrials(JSON.parse(rawList));
  }, []);

  useEffect(() => {
    localStorage.setItem('reaction_trials', JSON.stringify(trials));
    if (trials.length > 0) {
      const min = Math.min(...trials);
      setBest((b) => {
        const nb = b === null || min < b ? min : b;
        localStorage.setItem('reaction_best', String(nb));
        return nb;
      });
    }
  }, [trials]);

  const start = () => {
    if (status === 'waiting') return;
    setReaction(null);
    setStatus('waiting');
    setMessage('Get ready...');
    const delay = 800 + Math.random() * 2200;
    timeoutRef.current = window.setTimeout(() => {
      setStatus('go');
      setMessage('Click!');
      setStartTime(Date.now());
    }, delay);
  };

  const userClick = () => {
    if (status === 'waiting') {
      // clicked too early
      if (timeoutRef.current) { window.clearTimeout(timeoutRef.current); timeoutRef.current = null; }
      setStatus('ready');
      setMessage('Too soon! Try again');
      return;
    }
    if (status === 'go' && startTime) {
      const dt = Date.now() - startTime;
      setReaction(dt);
      setTrials((t) => [dt, ...t].slice(0, 20));
      setStatus('result');
      setMessage(`Reaction: ${dt} ms`);
      try { endSession('ReactionTrainer'); } catch {}
      const res = rounds.advance();
      if (!res.done) {
        // reset for next round after a short delay
        setTimeout(() => {
          setStatus('ready');
          setMessage('Press Start to begin');
          setReaction(null);
          try { startSession('ReactionTrainer'); } catch {}
        }, 900);
      } else {
        setMessage(`All rounds finished! Best: ${best !== null ? `${best} ms` : '—'}`);
      }
    }
  };

  const reset = () => {
    setStatus('ready');
    setMessage('Press Start to begin');
    setReaction(null);
    if (timeoutRef.current) { window.clearTimeout(timeoutRef.current); timeoutRef.current = null; }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Reaction Trainer</h2>
        <div className="flex items-center gap-2">
          <button onClick={start} className="px-4 py-2 bg-purple-600 text-white rounded-md">Start</button>
          <button onClick={reset} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-md">Reset</button>
        </div>
      </div>

      <div className="flex flex-col items-center">
        <div
          onClick={userClick}
          role="button"
          tabIndex={0}
          className={`w-56 h-56 rounded-full flex items-center justify-center text-2xl font-semibold cursor-pointer select-none transition-colors ${
            status === 'go' ? 'bg-green-400 text-white' : 'bg-purple-100 text-purple-700'
          }`}
        >
          {message}
        </div>

        <div className="mt-4 w-full max-w-md">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <div>Last: {reaction !== null ? `${reaction} ms` : '—'}</div>
            <div>Best: {best !== null ? `${best} ms` : '—'}</div>
            <div>Attempts: {trials.length}</div>
          </div>

          <div className="grid grid-cols-5 gap-2">
            {trials.map((t, i) => (
              <div key={i} className="text-xs bg-purple-50 p-2 rounded text-purple-700">{t} ms</div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 text-gray-600 text-sm">When the circle turns green, click it as fast as you can. Avoid clicking early.</div>
    </div>
  );
};
