import React, { useState } from 'react';
import { MemoryGame } from './games/MemoryGame';
import { WordScramble } from './games/WordScramble';
import { Brain, Sparkles } from 'lucide-react';

export const BrainBreaks: React.FC = () => {
  const [activeGame, setActiveGame] = useState<'memory' | 'word'>('memory');

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-purple-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Brain className="h-8 w-8 text-purple-600 mr-2" />
            <h1 className="text-3xl font-bold text-gray-900">Brain Breaks</h1>
          </div>
          <p className="text-gray-600">
            Take a mental refresh with these engaging mind games
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-lg border border-gray-200 p-1 bg-white">
            <button
              onClick={() => setActiveGame('memory')}
              className={`px-4 py-2 rounded-md ${
                activeGame === 'memory'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-600 hover:text-purple-600'
              }`}
            >
              Memory Match
            </button>
            <button
              onClick={() => setActiveGame('word')}
              className={`px-4 py-2 rounded-md ${
                activeGame === 'word'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-600 hover:text-purple-600'
              }`}
            >
              Word Scramble
            </button>
          </div>
        </div>

        {activeGame === 'memory' ? <MemoryGame /> : <WordScramble />}

        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center mb-4">
            <Sparkles className="h-6 w-6 text-purple-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Benefits of Brain Games</h2>
          </div>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-center">
              <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
              Improves memory and concentration
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
              Reduces stress and anxiety
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
              Enhances problem-solving skills
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
              Provides a mental refresh during work breaks
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};