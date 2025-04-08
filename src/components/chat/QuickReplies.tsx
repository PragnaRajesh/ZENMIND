import React from 'react';
import { Heart, Brain, Frown, Sparkles, CloudRain } from 'lucide-react';

interface QuickRepliesProps {
  onSelect: (reply: string) => void;
}

export const QuickReplies: React.FC<QuickRepliesProps> = ({ onSelect }) => {
  const quickReplies = [
    { icon: CloudRain, text: "I'm feeling anxious", color: 'text-blue-500' },
    { icon: Brain, text: "I'm stressed", color: 'text-purple-500' },
    { icon: Frown, text: "I'm feeling depressed", color: 'text-indigo-500' },
    { icon: Heart, text: "I need support", color: 'text-pink-500' },
    { icon: Sparkles, text: "Share a coping strategy", color: 'text-yellow-500' },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {quickReplies.map((reply, index) => (
        <button
          key={index}
          onClick={() => onSelect(reply.text)}
          className="flex items-center space-x-2 px-4 py-2 rounded-full bg-white border border-gray-200 hover:border-purple-500 hover:bg-purple-50 transition-colors"
        >
          <reply.icon className={`h-4 w-4 ${reply.color}`} />
          <span className="text-sm text-gray-700">{reply.text}</span>
        </button>
      ))}
    </div>
  );
};