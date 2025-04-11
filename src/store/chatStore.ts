import { create } from 'zustand';
import { Message } from '../types';

interface ChatState {
  messages: Message[];
  input: string;
  setInput: (value: string) => void;
  addMessage: (message: Message) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  input: '',
  setInput: (value) => set({ input: value }),
  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),
}));
