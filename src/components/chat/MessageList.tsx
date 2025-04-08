import React from 'react';
import { Message } from '../../types';
import { MessageBubble } from './MessageBubble';
import { BotTypingIndicator } from './BotTypingIndicator';

interface MessageListProps {
  messages: Message[];
  isTyping: boolean;
}

export const MessageList: React.FC<MessageListProps> = ({ messages, isTyping }) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <MessageBubble message={message} />
        </div>
      ))}
      {isTyping && <BotTypingIndicator />}
    </div>
  );
};