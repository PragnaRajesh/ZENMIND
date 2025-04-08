export interface User {
  id: string;
  username: string;
  email: string;
}

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  sentiment?: SentimentAnalysis;
  intent?: Intent;
  entities?: Record<EntityType, string[]>;
}

export interface Strategy {
  id: string;
  category: 'anxiety' | 'stress' | 'depression' | 'general';
  title: string;
  description: string;
  steps: string[];
  duration?: string;
  frequency?: string;
}

export interface Exercise {
  id: string;
  title: string;
  description: string;
  steps: string[];
}

export interface CopingStrategies {
  immediate: string[];
  shortTerm: string[];
  longTerm: string[];
}

export interface SentimentAnalysis {
  score: number;
  sentiment: 'positive' | 'negative' | 'neutral';
  intensity: number;
}

export type Intent = 
  | 'seeking_help'
  | 'sharing_experience'
  | 'asking_information'
  | 'emergency'
  | 'gratitude'
  | 'general_conversation';

export type EntityType = 'symptoms' | 'timeIndicators' | 'relationships' | 'activities';