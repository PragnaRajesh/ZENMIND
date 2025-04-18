import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const questions = [
  'I found it hard to wind down',
  'I was aware of dryness of my mouth',
  'I couldn’t seem to experience any positive feeling at all',
  'I experienced breathing difficulty',
  'I found it difficult to work up the initiative to do things',
  'I tended to over-react to situations',
  'I experienced trembling',
  'I felt that I was using a lot of nervous energy',
  'I was worried about situations in which I might panic',
  'I felt that I had nothing to look forward to',
  'I found myself getting agitated',
  'I found it difficult to relax',
  'I felt down-hearted and blue',
  'I was intolerant of anything that kept me from getting on with what I was doing',
  'I felt I was close to panic',
  'I was unable to become enthusiastic about anything',
  'I felt I wasn’t worth much as a person',
  'I felt that I was rather touchy',
  'I was aware of the action of my heart in the absence of physical exertion',
  'I felt scared without any good reason',
  'I felt that life was meaningless',
];

const options = [
  { label: 'Did not apply at all', value: 0 },
  { label: 'Applied somewhat', value: 1 },
  { label: 'Applied considerably', value: 2 },
  { label: 'Applied very much', value: 3 },
];

const depressionItems = [3, 5, 10, 13, 16, 17, 21];
const anxietyItems = [2, 4, 7, 9, 15, 19, 20];
const stressItems = [1, 6, 8, 11, 12, 14, 18];

const Dass21Screening: React.FC = () => {
  const [responses, setResponses] = useState<number[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleAnswer = (value: number) => {
    const updated = [...responses];
    updated[currentIndex] = value;
    setResponses(updated);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setSubmitted(true);
      setTimeout(() => checkModerateRedirect(), 2000);
    }
  };

  const getScore = (items: number[]) =>
    items.reduce((acc, i) => acc + responses[i - 1], 0) * 2;

  const getLevel = (score: number, type: 'depression' | 'anxiety' | 'stress') => {
    const ranges = {
      depression: [9, 13, 20, 27],
      anxiety: [7, 9, 14, 19],
      stress: [14, 18, 25, 33],
    };
    const labels = ['Normal', 'Mild', 'Moderate', 'Severe', 'Extremely Severe'];
    const index = ranges[type].findIndex((max) => score <= max);
    return labels[index === -1 ? 4 : index];
  };

  const checkModerateRedirect = () => {
    const d = getLevel(getScore(depressionItems), 'depression');
    const a = getLevel(getScore(anxietyItems), 'anxiety');
    const s = getLevel(getScore(stressItems), 'stress');
    if ([d, a, s].includes('Moderate')) {
      navigate('/chat');
    }
  };

  const depressionScore = getScore(depressionItems);
  const anxietyScore = getScore(anxietyItems);
  const stressScore = getScore(stressItems);

  const depressionLevel = getLevel(depressionScore, 'depression');
  const anxietyLevel = getLevel(anxietyScore, 'anxiety');
  const stressLevel = getLevel(stressScore, 'stress');

  const isSevere =
    ['Severe', 'Extremely Severe'].includes(depressionLevel) ||
    ['Severe', 'Extremely Severe'].includes(anxietyLevel) ||
    ['Severe', 'Extremely Severe'].includes(stressLevel);

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-md">

      {!submitted ? (
        <>
          <p className="text-lg font-medium mb-2">
            Q{currentIndex + 1}. {questions[currentIndex]}
          </p>

          <div className="space-y-2">
            {options.map((opt, i) => (
              <button
                key={i}
                className="block w-full px-4 py-2 rounded bg-purple-100 hover:bg-purple-200 text-left"
                onClick={() => handleAnswer(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div className="mt-6">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-purple-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
            <p className="text-sm mt-1 text-gray-500 text-right">
              {currentIndex + 1} / {questions.length}
            </p>
          </div>
        </>
      ) : (
        <div className="space-y-4 text-lg">
          <p>
            <strong>Depression:</strong> {depressionScore} — {depressionLevel}
          </p>
          <p>
            <strong>Anxiety:</strong> {anxietyScore} — {anxietyLevel}
          </p>
          <p>
            <strong>Stress:</strong> {stressScore} — {stressLevel}
          </p>

          {/* 🌟 Affirmation */}
          <div className="mt-4 p-4 bg-green-100 border border-green-300 rounded-md text-green-800">
            You’ve taken an important step by completing this check-in. You are not alone — support is always here for you 🫂❤️
          </div>

          {/* 🧘 Grounding Suggestion for Moderate */}
          {['Moderate'].some((level) =>
            [depressionLevel, anxietyLevel, stressLevel].includes(level)
          ) && (
            <div className="mt-4 p-4 bg-blue-100 border border-blue-300 rounded-md text-blue-800">
              🧘 Try a quick grounding technique: Breathe in for 4 seconds, hold for 4, and exhale for 6. Or try the 5-4-3-2-1 mindfulness trick to calm your mind.
            </div>
          )}

          {/* 🚨 Severe Level: Call Therapist */}
          {isSevere && (
            <div className="mt-6">
              <p className="text-red-600 font-semibold mb-2">
                We recommend reaching out to a therapist immediately.
              </p>
              <a
                href="tel:+919876543210"
                className="inline-block px-6 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition"
              >
                📞 Call Therapist
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dass21Screening;
