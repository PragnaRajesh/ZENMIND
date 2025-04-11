import React, { useState, useEffect } from 'react';
import avatar from '../../assets/therapist-avatar.png';

const moodScripts: Record<string, string> = {
  anxious: "I hear you're feeling anxious. Let’s try a calming breathing technique together. Inhale... and exhale.",
  sad: "I'm sorry you're feeling low. Want to share what’s on your heart?",
  frustrated: "That frustration is valid. Would it help to vent for a moment?",
  calm: "I'm glad you're feeling calm. Let’s hold onto that peaceful energy together.",
  numb: "Feeling numb can be confusing. We can explore it together, gently."
};

export const TalkTherapy: React.FC = () => {
  const [selectedMood, setSelectedMood] = useState('');
  const [spokenText, setSpokenText] = useState('');
  const [listening, setListening] = useState(false);

  // Speak aloud using text-to-speech
  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice =
      speechSynthesis.getVoices().find(v => v.name.includes('Female') || v.lang.includes('en')) ||
      speechSynthesis.getVoices()[0];
    speechSynthesis.speak(utterance);
  };

  // Voice input from user
  const handleMicInput = () => {
    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();
    setListening(true);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setSpokenText(transcript);
      setListening(false);
    };

    recognition.onerror = () => {
      setListening(false);
    };
  };

  // Speak when a mood is selected
  useEffect(() => {
    if (selectedMood) {
      const message = moodScripts[selectedMood];
      speak(message);
    }
  }, [selectedMood]);

  return (
    <div className="flex flex-col items-center text-center bg-white/80 p-8 rounded-xl shadow-lg max-w-xl mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">Talk Therapy Session</h2>
      <p className="text-gray-600 mb-4 max-w-md">
        You're not alone. Your therapist is here to listen, understand, and guide you — at your pace.
      </p>

      <div className="w-60 h-auto mb-4">
        <img
          src={avatar}
          alt="Therapist Avatar"
          className="w-full h-auto rounded-xl shadow-md bg-gradient-to-br from-pink-100 to-purple-100 animate-pulse"
        />
      </div>

      <p className="text-sm text-gray-500 italic mb-6">
        “I'm here whenever you're ready to talk.”
      </p>

      {/* Mood Buttons */}
      <div className="mb-6">
        <p className="text-gray-700 font-medium mb-2">How are you feeling today?</p>
        <div className="flex flex-wrap justify-center gap-3">
          <button onClick={() => setSelectedMood('anxious')} className="text-xl px-4 py-2 bg-white rounded-full border hover:bg-purple-100">😰 Anxious</button>
          <button onClick={() => setSelectedMood('sad')} className="text-xl px-4 py-2 bg-white rounded-full border hover:bg-purple-100">😔 Low</button>
          <button onClick={() => setSelectedMood('frustrated')} className="text-xl px-4 py-2 bg-white rounded-full border hover:bg-purple-100">😠 Frustrated</button>
          <button onClick={() => setSelectedMood('calm')} className="text-xl px-4 py-2 bg-white rounded-full border hover:bg-purple-100">😌 Calm</button>
          <button onClick={() => setSelectedMood('numb')} className="text-xl px-4 py-2 bg-white rounded-full border hover:bg-purple-100">😐 Numb</button>
        </div>
      </div>

      {/* Mic Input */}
      <div className="mb-3">
        <p className="text-gray-700 font-medium mb-2">Want to say something?</p>
        <button
          onClick={handleMicInput}
          className={`px-4 py-2 rounded-full bg-purple-600 text-white hover:bg-purple-700 transition ${
            listening ? 'animate-pulse' : ''
          }`}
        >
          🎤 Speak Now
        </button>
        {spokenText && (
          <p className="text-gray-600 italic mt-3">You said: “{spokenText}”</p>
        )}
      </div>
    </div>
  );
};
