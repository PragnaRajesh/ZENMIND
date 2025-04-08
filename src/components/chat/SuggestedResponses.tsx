import React from 'react';

interface SuggestedResponsesProps {
  onSelect: (response: string) => void;
}

export const SuggestedResponses: React.FC<SuggestedResponsesProps> = ({ onSelect }) => {
  const suggestions = [
    "I'm having trouble sleeping due to anxiety",
    "Everything feels overwhelming right now",
    "I need help with negative thoughts",
    "How can I manage panic attacks?",
    "I'm feeling lonely and isolated",
    "What are some relaxation techniques?",
  ];

  return (
    <div className="mt-4">
      <p className="text-xs text-gray-500 mb-2">Suggested responses:</p>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => onSelect(suggestion)}
            className="text-sm px-3 py-1 rounded-full bg-gray-100 hover:bg-purple-100 text-gray-600 hover:text-purple-600 transition-colors"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
};