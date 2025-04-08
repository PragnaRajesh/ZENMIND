import { Strategy, strategies, exercises, copingStrategies } from '../data/mentalHealthStrategies';

export const getStrategyByCategory = (category: Strategy['category']): Strategy[] => {
  return strategies.filter(strategy => strategy.category === category);
};

export const getRandomCopingStrategy = (type: keyof typeof copingStrategies): string => {
  const strategies = copingStrategies[type];
  return strategies[Math.floor(Math.random() * strategies.length)];
};

export const formatStrategySteps = (strategy: Strategy): string => {
  return `${strategy.title}:\n${strategy.steps.map((step, index) => `${index + 1}. ${step}`).join('\n')}`;
};