import React, { forwardRef, useImperativeHandle, useEffect, useState, useRef } from 'react';

export type BreathingHandle = {
  start: () => void;
  stop: () => void;
};

export const BreathingExercise = forwardRef<BreathingHandle, { guidance?: boolean; initialCycles?: number }>(
  ({ guidance = false, initialCycles = 3 }, ref) => {
    const inhaleDuration = 4;
    const holdDuration = 4;
    const exhaleDuration = 6;

    const [running, setRunning] = React.useState(false);
    const [phase, setPhase] = React.useState<'idle' | 'inhale' | 'hold' | 'exhale'>('idle');
    const [cycleCount, setCycleCount] = React.useState(0);
    const [remaining, setRemaining] = React.useState(0);
    const [targetCycles, setTargetCycles] = React.useState(initialCycles);
    const intervalRef = React.useRef<number | null>(null);

    const speak = (text: string) => {
      if (!guidance || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
      try {
        const u = new SpeechSynthesisUtterance(text);
        u.rate = 0.95;
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(u);
      } catch (e) {
        // ignore
      }
    };

    const start = () => {
      if (running) return;
      setCycleCount(0);
      setRunning(true);
      setPhase('inhale');
      setRemaining(inhaleDuration);
      speak('Begin breathing exercise. Inhale.');
    };

    const stop = () => {
      setRunning(false);
      setPhase('idle');
      setRemaining(0);
      if (intervalRef.current) window.clearInterval(intervalRef.current);
      if (guidance && 'speechSynthesis' in window) window.speechSynthesis.cancel();
    };

    useImperativeHandle(ref, () => ({ start, stop }));

    React.useEffect(() => {
      if (!running) return;

      if (intervalRef.current) window.clearInterval(intervalRef.current);

      intervalRef.current = window.setInterval(() => {
        setRemaining((r) => {
          if (r <= 1) {
            setPhase((p) => {
              if (p === 'inhale') return 'hold';
              if (p === 'hold') return 'exhale';
              if (p === 'exhale') return 'inhale';
              return 'idle';
            });
            return 0;
          }
          return r - 1;
        });
      }, 1000);

      return () => {
        if (intervalRef.current) window.clearInterval(intervalRef.current);
      };
    }, [running]);

    React.useEffect(() => {
      if (!running) return;

      if (phase === 'inhale') {
        setRemaining(inhaleDuration);
        speak('Inhale');
      } else if (phase === 'hold') {
        setRemaining(holdDuration);
        speak('Hold');
      } else if (phase === 'exhale') {
        setRemaining(exhaleDuration);
        speak('Exhale slowly');
      } else setRemaining(0);

      if (phase === 'inhale' && running && cycleCount >= targetCycles) {
        stop();
      }
    }, [phase, running]);

    React.useEffect(() => {
      if (!running) return;
      if (phase === 'inhale' && remaining === 0) {
        setCycleCount((c) => c + 1);
      }
    }, [phase, remaining, running]);

    React.useEffect(() => {
      return () => {
        if (intervalRef.current) window.clearInterval(intervalRef.current);
      };
    }, []);

    const scale = phase === 'inhale' ? 1.2 : phase === 'hold' ? 1.05 : phase === 'exhale' ? 0.85 : 1;
    const color = 'bg-purple-100';

    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Breathing Exercise</h2>
          <div className="flex items-center space-x-4">
            <span className="text-purple-600">Cycles: {cycleCount}</span>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                min={1}
                max={10}
                value={targetCycles}
                onChange={(e) => setTargetCycles(Math.max(1, Math.min(10, Number(e.target.value) || 1)))}
                className="w-16 p-1 text-center border border-gray-300 rounded-md"
                aria-label="Target cycles"
              />
              <button onClick={running ? stop : start} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                {running ? 'Stop' : 'Start'}
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div aria-live="polite" className="flex flex-col items-center justify-center w-56 h-56 rounded-full shadow-inner mb-6 transition-transform duration-700 ease-in-out" style={{ transform: `scale(${scale})` }}>
            <div className={`w-40 h-40 rounded-full ${color} flex items-center justify-center`}>
              <div className="text-center">
                <div className="text-xl font-semibold text-purple-700">{phase === 'idle' ? 'Ready' : phase.toUpperCase()}</div>
                {phase !== 'idle' && <div className="text-sm text-gray-600">{remaining}s</div>}
              </div>
            </div>
          </div>

          <div className="text-gray-600 text-center max-w-md">
            <p className="mb-2">Follow the circle: inhale, hold, exhale. This paced breathing helps reduce stress and anchor your attention.</p>
            <p className="text-sm text-gray-500">Recommended: 3–5 cycles for a quick reset. Target cycles set to {targetCycles}.</p>
          </div>
        </div>
      </div>
    );
  }
);

BreathingExercise.displayName = 'BreathingExercise';
