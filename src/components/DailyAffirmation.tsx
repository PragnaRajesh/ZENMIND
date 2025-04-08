import React, { useState, useEffect } from 'react';
import { affirmations } from '../data/affirmations';
import { Sparkles } from 'lucide-react';

export const DailyAffirmation: React.FC = () => {
  const [currentAffirmation, setCurrentAffirmation] = useState(affirmations[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * affirmations.length);
      setCurrentAffirmation(affirmations[randomIndex]);
    }, 10000); // Change affirmation every 10 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-8 rounded-lg shadow-lg text-white text-center">
      <div className="flex items-center justify-center mb-4">
        <Sparkles className="h-6 w-6 mr-2" />
        <h2 className="text-xl font-semibold">Daily Affirmation</h2>
      </div>
      <p className="text-2xl font-bold mb-2">{currentAffirmation.text}</p>
      <p className="text-sm opacity-75">Take a moment to reflect on this thought</p>
    </div>
  );
};