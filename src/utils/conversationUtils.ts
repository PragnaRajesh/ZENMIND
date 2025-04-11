export const handleUserMessage = (input: string): string[] => {
  const text = input.toLowerCase();

  const anxietyTriggers = ['anxiety', 'anxious', 'panic', 'nervous', 'overthinking'];
  const stressTriggers = ['stress', 'stressed', 'pressure', 'burnout', 'overwhelmed'];
  const sadnessTriggers = ['sad', 'depressed', 'low', 'hopeless', 'worthless'];
  const lonelinessTriggers = ['alone', 'lonely', 'isolated', 'ignored'];

  const randomPick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

  if (anxietyTriggers.some(word => text.includes(word))) {
    return [
      randomPick([
        "When did you start feeling this anxiety today?",
        "Can you tell me what triggered this anxious feeling?",
        "Would talking it through help a little right now?",
        "How does your body usually react when anxiety kicks in?",
        "Do you usually feel this way at a certain time or around certain people?"
      ])
    ];
  }

  if (stressTriggers.some(word => text.includes(word))) {
    return [
      randomPick([
        "What’s weighing on you the most right now?",
        "Would it help to break things down together?",
        "When you feel this kind of stress, is there anything that grounds you?",
        "How long have you been carrying this pressure?",
        "Do you want me to guide you through a 2-minute mental reset?"
      ])
    ];
  }

  if (sadnessTriggers.some(word => text.includes(word))) {
    return [
      randomPick([
        "Want to share what’s been making you feel this way?",
        "When did this low feeling begin?",
        "Would writing out how you're feeling help you process it?",
        "Have there been small moments of peace recently?",
        "What usually brings you a little comfort when you're down?"
      ])
    ];
  }

  if (lonelinessTriggers.some(word => text.includes(word))) {
    return [
      randomPick([
        "That feeling of being alone is real — I'm here with you now.",
        "Would it help to talk about when you feel most alone?",
        "Do you want to talk through what helps you feel connected?",
        "You’re not invisible — your voice matters here.",
        "Would you like to do a check-in together?"
      ])
    ];
  }

  return [
    randomPick([
      "I’m listening — tell me what’s on your mind.",
      "Let’s slow things down and talk through this.",
      "Would it help to unpack this a little more?",
      "Tell me what’s been bothering you — you’re not alone.",
      "What do you feel like you need most right now?"
    ])
  ];
};
