import React, { useState, useRef, useEffect } from 'react';
import { Send, Smile } from 'lucide-react';
import { QuickReplies } from './chat/QuickReplies';
import { MessageList } from './chat/MessageList';
import { SuggestedResponses } from './chat/SuggestedResponses';
import { useChatStore } from '../store/chatStore';
import { handleUserMessage } from '../utils/conversationUtils';
import { createMessage } from '../utils/chatUtils';
import TalkTherapy from './chat/TalkTherapy';
import Dass21Screening from './Dass21Screening';

const ChatInterface: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'chat' | 'therapy' | 'dass'>('chat');
  const { messages, addMessage } = useChatStore();
  const [input, setInput] = useState('');
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

    setTimeout(() => {
      const replies = handleUserMessage(content);
      replies.forEach((reply) => {
        const botMessage = createMessage(reply, 'bot');
        addMessage(botMessage);
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-4 px-6">
      {/* Tabs */}
      <div className="flex justify-center mb-6 gap-4">
        <button
          onClick={() => setActiveTab('chat')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition ${
            activeTab === 'chat'
              ? 'bg-purple-600 text-white'
              : 'bg-white text-purple-600 border border-purple-300'
          }`}
        >
          💬 Chat Therapy
        </button>
        <button
          onClick={() => setActiveTab('therapy')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition ${
            activeTab === 'therapy'
              ? 'bg-pink-500 text-white'
              : 'bg-white text-pink-500 border border-pink-300'
          }`}
        >
          👩🏻 Talk Therapy
        </button>
        <button
          onClick={() => setActiveTab('dass')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition ${
            activeTab === 'dass'
              ? 'bg-blue-500 text-white'
              : 'bg-white text-blue-500 border border-blue-300'
          }`}
        >
          🧠 DASS-21 Screening
        </button>
      </div>

      {/* Views */}
      {activeTab === 'chat' && (
        <div className="flex flex-col w-full max-w-6xl h-[85vh] bg-white/80 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden mx-auto">
          <div className="p-4 border-b">
            <h2 className="text-xl font-semibold text-gray-800">Your Safe Space</h2>
            <p className="text-sm text-gray-600">Share your thoughts and feelings freely</p>
          </div>

          <MessageList messages={messages} messagesEndRef={messagesEndRef} />

          <div className="p-4 border-t bg-white/70 rounded-b-xl">
            <QuickReplies onSelect={(reply) => handleSend(reply)} />

            <div className="flex items-center space-x-2 mt-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
                  placeholder="Type your message..."
                  className="w-full p-3 pr-12 rounded-full border border-gray-300 focus:ring-2 focus:ring-purple-500 bg-white/90"
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
                className="p-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>

            <SuggestedResponses onSelect={(response) => handleSend(response)} />
            <div ref={messagesEndRef} />
          </div>
        </div>
      )}

      {activeTab === 'therapy' && (
        <div className="bg-white/80 p-6 rounded-xl shadow-lg max-w-4xl mx-auto">
          <TalkTherapy />
        </div>
      )}

      {activeTab === 'dass' && (
        <div className="bg-white/80 p-6 rounded-xl shadow-lg max-w-4xl mx-auto">
          <Dass21Screening />
        </div>
      )}
    </div>
  );
};

export default ChatInterface;
