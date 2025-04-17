import React, { useEffect, useState } from 'react';
import avatar from '../../assets/therapist-avatar.png';
import dataset from '../../data/therapy_dataset.json';
import '../../styles/therapist.css'; // make sure this file exists

const TalkTherapy: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<string | null>(null);
  const [followUpIndex, setFollowUpIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false); // for sound indicator

  const SpeechRecognition =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.lang = 'en-US';
  recognition.interimResults = false;

  const stopWords = ['stop', 'done', 'no more', 'enough', 'that’s it'];

  const speak = (text: string, onEndCallback?: () => void) => {
    if (!text) return;
    setIsSpeaking(true);

    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const preferredVoices = [
      'Google UK English Female',
      'Samantha',
      'Karen',
      'Martha',
      'Shelley (English (United States))'
    ];
    const selectedVoice = voices.find((v) => preferredVoices.includes(v.name));
    if (selectedVoice) utterance.voice = selectedVoice;

    utterance.rate = 0.95;
    utterance.pitch = 1.05;
    utterance.volume = 1;

    utterance.onend = () => {
      setIsSpeaking(false);
      onEndCallback?.();
    };

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const findMatchingCategory = (input: string) => {
    const text = input.toLowerCase();
    return dataset.find((item) =>
      item.triggers.some((trigger: string) => text.includes(trigger))
    );
  };

  const findResponse = (input: string): string => {
    const text = input.toLowerCase();

    if (stopWords.some((word) => text.includes(word))) {
      setCurrentCategory(null);
      setFollowUpIndex(0);
      return "Alright, we can pause here. I'm always here when you need me.";
    }

    if (!currentCategory) {
      const matched = findMatchingCategory(text);
      if (matched) {
        setCurrentCategory(matched.category);
        setFollowUpIndex(0);
        return matched.first_response;
      }
      return "Could you share how you're feeling in another way?";
    }

    const matched = dataset.find((item) => item.category === currentCategory);

    if (matched) {
      if (followUpIndex < matched.follow_ups.length) {
        const reply = matched.follow_ups[followUpIndex];
        setFollowUpIndex(followUpIndex + 1);
        return reply;
      } else {
        setCurrentCategory(null);
        setFollowUpIndex(0);
        return matched.affirmation;
      }
    }

    return "I'm listening.";
  };

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
    const response = findResponse(spokenText);

    speak(response, () => {
      if (!stopWords.some((word) => spokenText.includes(word)) && currentCategory) {
        setTimeout(() => startListening(), 1200);
      } else {
        stopListening();
      }
    });
  };

  recognition.onerror = (event: any) => {
    console.error('Speech recognition error:', event.error);
    setIsListening(false);
  };

  useEffect(() => {
    const loadVoices = () => window.speechSynthesis.getVoices();
    if (typeof window !== 'undefined') {
      window.speechSynthesis.onvoiceschanged = loadVoices;
      loadVoices();
    }
  }, []);

  return (
    <div className="flex flex-col items-center text-center bg-white/80 p-8 rounded-xl shadow-lg max-w-xl mx-auto fade-in">
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">Talk Therapy</h2>
      <p className="text-gray-600 mb-4 max-w-md">
        Your therapist is here to listen, understand, and guide you — at your pace.
      </p>

      <div className="relative w-56 h-auto mb-4 therapist-avatar">
        <img
          src={avatar}
          alt="Therapist Avatar"
          className={`w-full h-auto rounded-xl shadow-md bg-gradient-to-br from-pink-100 to-purple-100 ${
            isSpeaking ? 'lip-move blink-animation' : ''
          }`}
        />
        {isSpeaking && <div className="sound-indicator"></div>}
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
