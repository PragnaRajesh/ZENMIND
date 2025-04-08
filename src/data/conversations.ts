interface ConversationResponse {
  triggers: string[];
  responses: string[];
  followUp?: string[];
  strategies?: string[];
}

export const conversationResponses: Record<string, ConversationResponse> = {
  anxiety: {
    triggers: ['anxiety', 'anxious', 'worried', 'panic', 'nervous', 'overwhelmed'],
    responses: [
      "I hear that you're feeling anxious. Let's work through this together.",
      "Anxiety can feel overwhelming, but you're not alone in this.",
      "I understand you're experiencing anxiety. Let's try some calming techniques."
    ],
    followUp: [
      "Would you like to try a breathing exercise together?",
      "How long have you been feeling this way?",
      "What helps you feel grounded when you're anxious?"
    ],
    strategies: [
      "Let's try the 5-4-3-2-1 grounding technique: Name 5 things you can see, 4 things you can touch, 3 things you can hear, 2 things you can smell, and 1 thing you can taste.",
      "Practice box breathing: Breathe in for 4 counts, hold for 4, exhale for 4, hold for 4. Repeat this cycle 4 times.",
      "Try progressive muscle relaxation: Start from your toes and work up to your head, tensing each muscle group for 5 seconds, then releasing."
    ]
  },
  depression: {
    triggers: ['depression', 'depressed', 'sad', 'hopeless', 'empty', 'worthless'],
    responses: [
      "I'm here with you, and I understand you're going through a difficult time.",
      "Depression can make everything feel heavy, but you don't have to carry this alone.",
      "Thank you for sharing this with me. It takes courage to talk about these feelings."
    ],
    followUp: [
      "Have you been able to talk to anyone else about how you're feeling?",
      "What activities usually bring you joy, even if they feel difficult right now?",
      "Would you like to explore some small steps we can take together?"
    ],
    strategies: [
      "Start with one small achievement today - even getting out of bed or taking a shower counts.",
      "Try the 'opposite action' technique: When you feel like isolating, reach out to one person.",
      "Create a gratitude list - start with just one thing, no matter how small it seems."
    ]
  },
  stress: {
    triggers: ['stress', 'stressed', 'pressure', 'burnout', 'exhausted', 'overwhelmed'],
    responses: [
      "It sounds like you're under a lot of pressure. Let's find ways to manage this stress.",
      "Feeling stressed is a natural response, but there are ways we can help you cope.",
      "I understand you're feeling overwhelmed. Let's break this down into manageable steps."
    ],
    followUp: [
      "What's contributing most to your stress right now?",
      "Have you noticed any physical symptoms of stress?",
      "Would you like to try some stress-relief techniques?"
    ],
    strategies: [
      "Take a 5-minute break to step outside and get some fresh air.",
      "Try this quick stress-relief exercise: Roll your shoulders back, take a deep breath, and imagine releasing tension with each exhale.",
      "Write down your stressors, then categorize them into 'can control' and 'cannot control' lists."
    ]
  }
};