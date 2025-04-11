import React from 'react';
import { Message } from '../../types';
import { MessageBubble } from './MessageBubble';

interface MessageListProps {
  messages: Message[];
  isTyping: boolean;
}

export const MessageList: React.FC<MessageListProps> = ({ messages, isTyping }) => {
  return (
    <div className="flex flex-col gap-2 p-4 overflow-y-auto">
      {messages.map((msg) => (
        <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
          <MessageBubble message={msg} />
        </div>
      ))}
      {isTyping && (
        <div className="flex justify-start text-sm text-gray-400 italic">Typing...</div>
      )}
    </div>
  );
};
