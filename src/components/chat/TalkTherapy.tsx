import React, { useEffect, useState } from 'react';
import avatar from '../../assets/therapist-avatar.png';
import dataset from '../../data/therapy_dataset_large.json';

// 🛠️ Stop commands
const stopWords = ['stop', 'done', 'enough', 'no more', 'that’s it'];

// 🎤 Respond with voice
const speak = (text: string, onEndCallback?: () => void) => {
  const utterance = new SpeechSynthesisUtterance(text);
  const voices = window.speechSynthesis.getVoices();

  const preferredVoices = [
    'Google UK English Female',
    'Samantha',
    'Karen',
    'Martha',
    'Shelley (English (United States))',
  ];

  const selectedVoice = voices.find((v) => preferredVoices.includes(v.name));
  if (selectedVoice) utterance.voice = selectedVoice;

  utterance.rate = 0.95;
  utterance.pitch = 1.05;
  utterance.volume = 1;

  utterance.onend = () => {
    onEndCallback?.();
  };

  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
};

// 🔍 Match input to dataset
const findMatchingCategory = (input: string) => {
  const text = input.toLowerCase();
  return dataset.find((item) =>
    item.triggers.some((t: string) => text.includes(t))
  );
};

const findResponse = (input: string): string => {
  const text = input.toLowerCase();

  if (stopWords.some((word) => text.includes(word))) {
    return "Thank you for sharing with me. I'm here whenever you need me again.";
  }

  const matched = findMatchingCategory(input);
  if (matched) {
    const followups = matched.follow_ups || [];
    const nextFollowUp =
      followups[Math.floor(Math.random() * followups.length)] || '';
    return `${matched.first_response} ${nextFollowUp} ${matched.affirmation}`;
  }

  return "I'm here to listen. Tell me more about what's on your mind.";
};

const TalkTherapy: React.FC = () => {
  const [isListening, setIsListening] = useState(false);

  const SpeechRecognition =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.lang = 'en-US';
  recognition.interimResults = false;

  // 🎙️ Start / stop mic
  const startListening = () => {
    recognition.start();
    setIsListening(true);
  };

  const stopListening = () => {
    recognition.stop();
    setIsListening(false);
  };

  recognition.onresult = (event: any) => {
    const spokenText = event.results[0][0].transcript.toLowerCase();

    if (stopWords.some((word) => spokenText.includes(word))) {
      stopListening();
      const goodbye = findResponse(spokenText);
      speak(goodbye); // Final response without chaining
      return;
    }

    const response = findResponse(spokenText);
    speak(response, () => {
      setTimeout(() => startListening(), 1500);
    });
  };

  recognition.onerror = (event: any) => {
    console.error('Speech recognition error:', event.error);
    setIsListening(false);
  };

  useEffect(() => {
    const preload = () => window.speechSynthesis.getVoices();
    if (typeof window !== 'undefined') {
      window.speechSynthesis.onvoiceschanged = preload;
      preload();
    }
  }, []);

  return (
    <div className="flex flex-col items-center text-center bg-white/80 p-8 rounded-xl shadow-lg max-w-xl mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">Talk Therapy</h2>
      <p className="text-gray-600 mb-4 max-w-md">
        Your therapist is here to listen, understand, and guide you — at your pace.
      </p>

      <div className="w-56 h-auto mb-4">
        <img
          src={avatar}
          alt="Therapist Avatar"
          className="w-full h-auto rounded-xl shadow-md bg-gradient-to-br from-pink-100 to-purple-100"
        />
      </div>

      <button
        onClick={isListening ? stopListening : startListening}
        className={`px-5 py-2 mt-4 rounded-full text-white transition-all ${
          isListening ? 'bg-red-500' : 'bg-pink-500 hover:bg-pink-600'
        }`}
      >
        {isListening ? 'Stop Listening' : 'Speak to Therapist'}
      </button>

      <p className="mt-4 text-gray-500 text-xs italic">
        “I'm here whenever you're ready to talk.”
      </p>
    </div>
  );
};

export default TalkTherapy;
