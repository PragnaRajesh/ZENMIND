import { conversationResponses } from '../data/conversations';

export const analyzeMessage = (message: string): {
  category: string | null;
  response: string;
  followUp?: string;
  strategy?: string;
} => {
  const lowercaseMessage = message.toLowerCase();
  
  // Find matching category based on triggers
  const category = Object.entries(conversationResponses).find(([_, data]) =>
    data.triggers.some(trigger => lowercaseMessage.includes(trigger))
  )?.[0] || null;

  if (!category) {
    return {
      category: null,
      response: "I'm here to support you. Would you like to talk about what's on your mind? You can share your feelings about anxiety, stress, or anything else that's bothering you."
    };
  }

  const responseData = conversationResponses[category];
  
  return {
    category,
    response: getRandomItem(responseData.responses),
    followUp: getRandomItem(responseData.followUp || []),
    strategy: getRandomItem(responseData.strategies || [])
  };
};

const getRandomItem = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};