import React, { useState, useRef, useEffect } from 'react';
import { handleUserMessage } from '../utils/conversationUtils';
import { Send, Smile } from 'lucide-react';
import { QuickReplies } from './chat/QuickReplies';
import { MessageList } from './chat/MessageList';
import { SuggestedResponses } from './chat/SuggestedResponses';
import { useChatStore } from '../store/chatStore';
import { createMessage, generateBotResponse } from '../utils/chatUtils';

export const ChatInterface: React.FC = () => {
  const { messages, addMessage } = useChatStore();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (content: string) => {
    if (!content.trim()) return;
  
    const userMessage = createMessage(content, 'user');
    addMessage(userMessage);
    setInput('');
    setIsTyping(true);
  
    // Bot response using smart conversation handler
    setTimeout(() => {
      const replies = handleUserMessage(content); // 🧠 New logic from your utils
      replies.forEach(reply => {
        const botMessage = createMessage(reply, 'bot');
        addMessage(botMessage);
      });
      setIsTyping(false);
    }, 1000);
  };
  
  return (
    <div className="flex flex-col h-[calc(100vh-16rem)] bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl shadow-lg">
      <div className="p-4 bg-white/80 backdrop-blur-sm rounded-t-xl border-b">
        <h2 className="text-xl font-semibold text-gray-800">Your Safe Space</h2>
        <p className="text-sm text-gray-600">Share your thoughts and feelings freely</p>
      </div>

      <MessageList messages={messages} isTyping={isTyping} />

      <div className="p-4 bg-white/80 backdrop-blur-sm border-t">
        <QuickReplies onSelect={(reply) => handleSend(reply)} />
        
        <div className="flex items-center space-x-2 mt-4">
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend(input)}
              placeholder="Type your message..."
              className="w-full p-3 pr-12 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/90"
            />
            <button
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-500"
              onClick={() => setInput(input + ' 😊')}
            >
              <Smile className="h-5 w-5" />
            </button>
          </div>
          <button
            onClick={() => handleSend(input)}
            className="p-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>

        <SuggestedResponses onSelect={(response) => handleSend(response)} />
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};