import React from 'react';
import { Message } from '../../types';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  return (
    <div
      className={`max-w-[70%] rounded-2xl p-4 ${
        message.sender === 'user'
          ? 'bg-purple-600 text-white'
          : 'bg-white text-gray-900'
      } shadow-sm whitespace-pre-wrap`}
    >
      {message.content}
    </div>
  );
};