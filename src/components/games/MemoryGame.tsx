import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

interface Card {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export const MemoryGame: React.FC = () => {
  const emojis = ['🧠', '💭', '⭐', '💡', '🎯', '🌈', '🎨', '🎮'];
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matches, setMatches] = useState<number>(0);
  const [moves, setMoves] = useState<number>(0);

  const initializeGame = () => {
    const shuffledCards = [...emojis, ...emojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false,
      }));
    setCards(shuffledCards);
    setFlippedCards([]);
    setMatches(0);
    setMoves(0);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  const handleCardClick = (id: number) => {
    if (flippedCards.length === 2 || cards[id].isMatched || cards[id].isFlipped) return;

    const newCards = [...cards];
    newCards[id].isFlipped = true;
    setCards(newCards);
    setFlippedCards([...flippedCards, id]);

    if (flippedCards.length === 1) {
      setMoves(moves + 1);
      if (cards[flippedCards[0]].emoji === cards[id].emoji) {
        newCards[flippedCards[0]].isMatched = true;
        newCards[id].isMatched = true;
        setCards(newCards);
        setFlippedCards([]);
        setMatches(matches + 1);
      } else {
        setTimeout(() => {
          newCards[flippedCards[0]].isFlipped = false;
          newCards[id].isFlipped = false;
          setCards(newCards);
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Memory Match</h2>
        <div className="flex items-center space-x-4">
          <span className="text-purple-600">Moves: {moves}</span>
          <span className="text-green-600">Matches: {matches}</span>
          <button
            onClick={initializeGame}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            New Game
          </button>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {cards.map((card) => (
          <button
            key={card.id}
            onClick={() => handleCardClick(card.id)}
            className={`aspect-square text-4xl rounded-lg transition-all duration-300 ${
              card.isFlipped || card.isMatched
                ? 'bg-purple-100 rotate-0'
                : 'bg-purple-600 rotate-180'
            }`}
            disabled={card.isMatched}
          >
            <span className={card.isFlipped || card.isMatched ? '' : 'invisible'}>
              {card.emoji}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};