import React, { useState } from 'react';
import React, { useState, useRef, useEffect } from 'react';
import { handleUserMessage } from '../utils/conversationUtils';
import { Send, Smile } from 'lucide-react';
import { QuickReplies } from './chat/QuickReplies';
import { MessageList } from './chat/MessageList';
import { SuggestedResponses } from './chat/SuggestedResponses';
import { useChatStore } from '../store/chatStore';
import { createMessage, generateBotResponse } from '../utils/chatUtils';

const ChatInterface = () => {
  const [activeTab, setActiveTab] = useState<'chat' | 'therapy'>('chat');

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
          💬 Chat View
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
      </div>

      {/* Tab Content */}
      {activeTab === 'chat' ? (
        <div className="bg-white/70 p-6 rounded-xl shadow-md">
          {/* Your existing chat UI goes here */}
          <h2 className="text-xl font-semibold mb-4">Your Safe Space</h2>
          {/* include your existing message list, input, etc. */}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center bg-white/80 p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Meet Your Talk Therapist</h2>
          <p className="text-gray-600 mb-6">
            This is a safe space to express yourself freely. Your virtual therapist is here to listen.
          </p>
          <div className="w-48 h-48 bg-gradient-to-br from-pink-300 to-purple-300 rounded-full shadow-inner flex items-center justify-center text-6xl text-white">
            👩🏻‍⚕️
          </div>
          <p className="mt-4 text-gray-700">(Coming to life soon...)</p>
        </div>
      )}
    </div>
  );
};
