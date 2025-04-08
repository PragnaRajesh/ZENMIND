import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';

const words = [
  { word: 'MINDFUL', hint: 'Being present in the moment' },
  { word: 'BALANCE', hint: 'Equal distribution of weight' },
  { word: 'BREATHE', hint: 'Essential for life and relaxation' },
  { word: 'CALM', hint: 'State of tranquility' },
  { word: 'PEACE', hint: 'State of harmony' },
  { word: 'FOCUS', hint: 'Concentrated attention' },
  { word: 'RELAX', hint: 'Release tension' },
  { word: 'HAPPY', hint: 'Feeling of joy' },
];

export const WordScramble: React.FC = () => {
  const [currentWord, setCurrentWord] = useState('');
  const [scrambledWord, setScrambledWord] = useState('');
  const [hint, setHint] = useState('');
  const [userInput, setUserInput] = useState('');
  const [message, setMessage] = useState('');
  const [score, setScore] = useState(0);

  const scrambleWord = (word: string) => {
    return word
      .split('')
      .sort(() => Math.random() - 0.5)
      .join('');
  };

  const newWord = () => {
    const randomWord = words[Math.floor(Math.random() * words.length)];
    setCurrentWord(randomWord.word);
    setHint(randomWord.hint);
    setScrambledWord(scrambleWord(randomWord.word));
    setUserInput('');
    setMessage('');
  };

  useEffect(() => {
    newWord();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userInput.toUpperCase() === currentWord) {
      setMessage('Correct! Well done! 🎉');
      setScore(score + 1);
      setTimeout(newWord, 1500);
    } else {
      setMessage('Try again! 🤔');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Word Scramble</h2>
        <div className="flex items-center space-x-4">
          <span className="text-purple-600">Score: {score}</span>
          <button
            onClick={newWord}
            className="p-2 text-purple-600 hover:text-purple-700 transition-colors"
          >
            <RefreshCw className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="text-center mb-8">
        <div className="text-4xl font-bold text-purple-600 mb-4">{scrambledWord}</div>
        <div className="text-gray-600">Hint: {hint}</div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          placeholder="Enter your answer"
        />
        <button
          type="submit"
          className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          Check Answer
        </button>
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