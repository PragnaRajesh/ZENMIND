import { Message } from '../types';
import { analyzeSentiment, detectIntent, extractEntities, generateContextualResponse } from './nlpUtils';

export const createMessage = (content: string, sender: 'user' | 'bot'): Message => {
  const message: Message = {
    id: Date.now().toString(),
    content,
    sender,
    timestamp: new Date(),
  };

  if (sender === 'user') {
    const sentiment = analyzeSentiment(content);
    const intent = detectIntent(content);
    const entities = extractEntities(content);

    message.sentiment = sentiment;
    message.intent = intent;
    message.entities = entities;
  }

  return message;
};

export const formatMessageContent = (content: string): string => {
  return content.trim();
};

export const generateBotResponse = (userMessage: Message): string => {
  if (!userMessage.sentiment || !userMessage.intent || !userMessage.entities) {
    return "I'm here to help. Could you tell me more about what's on your mind?";
  }

  return generateContextualResponse(
    userMessage.sentiment,
    userMessage.intent,
    userMessage.entities
  );
};