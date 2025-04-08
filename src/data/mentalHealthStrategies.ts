export interface Strategy {
  id: string;
  category: 'anxiety' | 'stress' | 'depression' | 'general';
  title: string;
  description: string;
  steps: string[];
  duration?: string;
  frequency?: string;
}

export const strategies: Strategy[] = [
  {
    id: 'breathing-exercise',
    category: 'anxiety',
    title: '4-7-8 Breathing Technique',
    description: 'A calming breathing exercise to reduce anxiety and promote relaxation.',
    steps: [
      'Find a comfortable sitting position',
      'Inhale quietly through your nose for 4 seconds',
      'Hold your breath for 7 seconds',
      'Exhale completely through your mouth for 8 seconds',
      'Repeat this cycle 4 times'
    ],
    duration: '5 minutes',
    frequency: '2-3 times daily'
  },
  {
    id: 'progressive-relaxation',
    category: 'stress',
    title: 'Progressive Muscle Relaxation',
    description: 'Technique to release physical tension and mental stress.',
    steps: [
      'Start with your toes, tense them for 5 seconds',
      'Release and notice the relaxation',
      'Move up to your feet, then calves',
      'Continue up through your body',
      'End with your facial muscles'
    ],
    duration: '15 minutes',
    frequency: 'Once daily'
  },
  {
    id: 'thought-reframing',
    category: 'depression',
    title: 'Cognitive Reframing',
    description: 'Challenge and change negative thought patterns.',
    steps: [
      'Identify the negative thought',
      'Examine the evidence for and against it',
      'Consider alternative perspectives',
      'Create a balanced thought',
      'Practice self-compassion'
    ],
    duration: '10 minutes',
    frequency: 'As needed'
  }
];

export const exercises = [
  {
    id: 'mindful-walking',
    title: 'Mindful Walking',
    description: 'A gentle exercise combining physical movement with mindfulness.',
    steps: [
      'Find a quiet place to walk',
      'Focus on each step',
      'Notice the sensation in your feet',
      'Observe your surroundings mindfully',
      'Walk for at least 10 minutes'
    ]
  },
  {
    id: 'gentle-yoga',
    title: 'Gentle Yoga Sequence',
    description: 'Simple yoga poses to release tension and promote relaxation.',
    steps: [
      'Child\'s pose - 1 minute',
      'Cat-cow stretches - 5 cycles',
      'Downward dog - 30 seconds',
      'Forward fold - 30 seconds',
      'Corpse pose - 5 minutes'
    ]
  }
];

export const copingStrategies = {
  immediate: [
    'Take 3 deep breaths',
    'Count backward from 20',
    'Name 5 things you can see',
    'Hold an ice cube',
    'Listen to calming music'
  ],
  shortTerm: [
    'Go for a walk',
    'Call a friend',
    'Write in a journal',
    'Take a warm bath',
    'Practice mindfulness'
  ],
  longTerm: [
    'Establish a daily routine',
    'Build a support network',
    'Regular exercise',
    'Healthy sleep habits',
    'Professional support'
  ]
};