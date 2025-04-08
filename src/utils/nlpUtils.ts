import { SentimentAnalysis, Intent, EntityType } from '../types';
import { chatResponses, generalResponses, encouragementResponses } from '../data/chatResponses';

export const analyzeSentiment = (text: string): SentimentAnalysis => {
  // Simple sentiment analysis based on keyword matching
  const positiveWords = ['happy', 'good', 'great', 'better', 'hopeful', 'calm', 'peaceful', 'grateful'];
  const negativeWords = ['sad', 'bad', 'anxious', 'depressed', 'stressed', 'worried', 'hopeless', 'overwhelmed'];
  
  const words = text.toLowerCase().split(' ');
  let score = 0;
  
  words.forEach(word => {
    if (positiveWords.includes(word)) score += 1;
    if (negativeWords.includes(word)) score -= 1;
  });

  const intensity = Math.abs(score);
  
  return {
    score,
    sentiment: score > 0 ? 'positive' : score < 0 ? 'negative' : 'neutral',
    intensity
  };
};

export const detectIntent = (text: string): Intent => {
  const lowercaseText = text.toLowerCase();
  
  // Emergency keywords
  if (lowercaseText.includes('suicide') || 
      lowercaseText.includes('kill myself') || 
      lowercaseText.includes('end it all')) {
    return 'emergency';
  }

  // Gratitude
  if (lowercaseText.includes('thank') || 
      lowercaseText.includes('grateful') || 
      lowercaseText.includes('appreciate')) {
    return 'gratitude';
  }

  // Help seeking
  if (lowercaseText.includes('help') || 
      lowercaseText.includes('advice') || 
      lowercaseText.includes('need')) {
    return 'seeking_help';
  }

  // Information seeking
  if (lowercaseText.includes('what') || 
      lowercaseText.includes('how') || 
      lowercaseText.includes('why') ||
      lowercaseText.includes('when')) {
    return 'asking_information';
  }

  // Sharing experience
  if (lowercaseText.includes('feel') || 
      lowercaseText.includes('feeling') || 
      lowercaseText.includes('felt') ||
      lowercaseText.includes('experiencing')) {
    return 'sharing_experience';
  }

  return 'general_conversation';
};

export const extractEntities = (text: string): Record<EntityType, string[]> => {
  const lowercaseText = text.toLowerCase();
  
  const entities: Record<EntityType, string[]> = {
    symptoms: [],
    timeIndicators: [],
    relationships: [],
    activities: []
  };

  // Symptoms
  const symptoms = [
    'anxiety', 'anxious', 'worried', 'panic',
    'depression', 'depressed', 'sad', 'hopeless',
    'stress', 'stressed', 'overwhelmed',
    'tired', 'exhausted', 'fatigue',
    'insomnia', 'cant sleep', "can't sleep"
  ];

  // Time indicators
  const timeWords = [
    'today', 'yesterday', 'week', 'month',
    'always', 'never', 'sometimes', 'often',
    'morning', 'night', 'evening'
  ];

  // Relationships
  const relationshipWords = [
    'friend', 'family', 'parent', 'child',
    'partner', 'spouse', 'colleague', 'coworker',
    'relationship', 'marriage'
  ];

  // Activities
  const activityWords = [
    'work', 'study', 'exercise', 'sleep',
    'eat', 'meditation', 'therapy', 'medication'
  ];

  // Extract entities
  symptoms.forEach(symptom => {
    if (lowercaseText.includes(symptom)) entities.symptoms.push(symptom);
  });

  timeWords.forEach(time => {
    if (lowercaseText.includes(time)) entities.timeIndicators.push(time);
  });

  relationshipWords.forEach(relation => {
    if (lowercaseText.includes(relation)) entities.relationships.push(relation);
  });

  activityWords.forEach(activity => {
    if (lowercaseText.includes(activity)) entities.activities.push(activity);
  });

  return entities;
};

export const generateContextualResponse = (
  sentiment: SentimentAnalysis,
  intent: Intent,
  entities: Record<EntityType, string[]>
): string => {
  let response = '';

  // Emergency response takes precedence
  if (intent === 'emergency') {
    return `I'm very concerned about what you're saying. Please know that you're not alone, and help is available 24/7. Would you like me to provide you with emergency helpline numbers? Your life matters, and there are people who want to help.`;
  }

  // Add empathetic acknowledgment based on sentiment
  if (sentiment.sentiment === 'negative' && sentiment.intensity > 1) {
    response += `${generalResponses[Math.floor(Math.random() * generalResponses.length)]} `;
  } else if (sentiment.sentiment === 'negative') {
    response += `${encouragementResponses[Math.floor(Math.random() * encouragementResponses.length)]} `;
  } else if (sentiment.sentiment === 'positive') {
    response += `I'm glad you're feeling this way. `;
  }

  // Add specific coping strategies based on detected symptoms
  if (entities.symptoms.length > 0) {
    const symptom = entities.symptoms[0];
    let strategies;
    
    if (symptom.includes('anxiety') || symptom.includes('worried') || symptom.includes('panic')) {
      strategies = chatResponses.anxiety.immediateStrategies;
    } else if (symptom.includes('depress') || symptom.includes('sad') || symptom.includes('hopeless')) {
      strategies = chatResponses.depression.immediateStrategies;
    } else if (symptom.includes('stress') || symptom.includes('overwhelm')) {
      strategies = chatResponses.stress.immediateStrategies;
    }

    if (strategies) {
      response += `Here's a technique that might help: ${strategies[Math.floor(Math.random() * strategies.length)]} `;
    }
  }

  // Add self-care suggestion
  response += `\n\nWould you like to try one of these self-care activities? ${chatResponses.selfCare.daily[Math.floor(Math.random() * chatResponses.selfCare.daily.length)]}`;

  return response;
};