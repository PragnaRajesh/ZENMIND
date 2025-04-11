// Multi-turn conversation logic
import { conversationResponses } from '../data/conversations';
import { generalResponses, encouragementResponses } from '../data/chatResponses';

interface ChatState {
  topic: string | null;
  step: number;
}

let chatState: ChatState = { topic: null, step: 0 };

function getRandom(array: string[]): string {
  return array[Math.floor(Math.random() * array.length)];
}

export function handleUserMessage(message: string): string[] {
  const lowerMessage = message.toLowerCase().trim();

  if (!chatState.topic) {
    const foundTopic = Object.keys(conversationResponses).find((topic) =>
      conversationResponses[topic].triggers.some((trigger) => lowerMessage.includes(trigger))
    );

    if (foundTopic) {
      chatState.topic = foundTopic;
      chatState.step = 1;

      const response = getRandom(conversationResponses[foundTopic].responses);
      const followUp = getRandom(conversationResponses[foundTopic].followUp || []);
      return [response, followUp];
    } else {
      return [getRandom(generalResponses)];
    }
  }

  if (chatState.step === 1 && chatState.topic) {
    const strategy = getRandom(conversationResponses[chatState.topic].strategies || []);
    const encouragement = getRandom(encouragementResponses);

    chatState = { topic: null, step: 0 };

    return [strategy, encouragement];
  }

  return [getRandom(generalResponses)];
}