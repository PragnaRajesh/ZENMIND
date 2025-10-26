import React, { useEffect, useState } from 'react';
import avatar from '../../assets/therapist-avatar.png';
import '../../styles/therapist.css'; // make sure this file exists

const TalkTherapy: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false); // for sound indicator

  const SpeechRecognition =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.lang = 'en-US';
  recognition.interimResults = false;

  const stopWords = ['stop', 'done', 'no more', 'enough', "that's it"]; // normalized

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

  const systemPrompt = `You are a calm, supportive mental wellbeing companion.\nYou talk naturally and keep your messages short, clear, and kind.\nListen to the user’s feelings with warmth and empathy — like a caring friend who understands.\nDon’t ask too many questions at once. Ask only one gentle, helpful question if needed.\nGive emotional support, not therapy or medical advice. Avoid diagnosing or labeling conditions.\nWhen the user feels low, remind them that it’s okay to feel that way, and offer gentle suggestions like taking a short break, journaling, breathing, walking, listening to music, or talking to someone they trust.\nIf the user sounds very upset or mentions self-harm, encourage them to reach out for immediate help and share crisis helpline resources.\nKeep your tone soft, kind, human, hopeful. Keep messages under 3 sentences.`;

  const getAIResponse = async (inputText: string): Promise<string> => {
    try {
      const key = (import.meta.env as any).VITE_OPENAI_KEY;
      if (!key) throw new Error('Missing OpenAI API key');

      const resp = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${key}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: inputText },
          ],
          max_tokens: 250,
          temperature: 0.7,
        }),
      });

      if (!resp.ok) {
        console.error('OpenAI error', resp.status, await resp.text());
        return "I'm here with you — could you tell me a little more?";
      }

      const data = await resp.json();
      const text = data?.choices?.[0]?.message?.content?.trim();
      return text || "I'm here with you — could you tell me a little more?";
    } catch (e) {
      console.error('AI request failed', e);
      return "I'm here with you — could you tell me a little more?";
    }
  };

  const startListening = () => {
    try {
      recognition.start();
      setIsListening(true);
    } catch (e) {
      console.error('Failed to start recognition', e);
    }
  };

  const stopListening = () => {
    try {
      recognition.stop();
    } catch (e) {}
    setIsListening(false);
  };

  recognition.onresult = async (event: any) => {
    const spokenText = (event.results[0][0].transcript || '').toLowerCase().trim();

    if (!spokenText) {
      stopListening();
      return;
    }

    if (stopWords.some((w) => spokenText.includes(w))) {
      speak("Alright, we can pause here. I'm always here when you need me.", () => stopListening());
      return;
    }

    const response = await getAIResponse(spokenText);

    speak(response, () => {
      // continue listening after a short pause unless user asked to stop
      if (!stopWords.some((w) => spokenText.includes(w))) {
        setTimeout(() => {
          startListening();
        }, 900);
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
