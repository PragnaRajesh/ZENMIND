import { useCallback, useState } from 'react';

// Generic rounds hook for games. roundsCount: number of rounds to play.
// advance() returns an object { done: boolean, index: number } where done=true when all rounds completed.
export const useRounds = (roundsCount = 4) => {
  const [index, setIndex] = useState(0);
  const [done, setDone] = useState(false);

  const advance = useCallback(() => {
    if (done) return { done: true, index };
    if (index + 1 >= roundsCount) {
      setDone(true);
      return { done: true, index };
    }
    setIndex((i) => i + 1);
    return { done: false, index: index + 1 };
  }, [done, index, roundsCount]);

  const resetAll = useCallback(() => {
    setIndex(0);
    setDone(false);
  }, []);

  return { index, roundsCount, done, advance, resetAll };
};
