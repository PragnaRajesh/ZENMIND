import React, { useState } from 'react';

type Question = {
  id: number;
  text: string;
};

const questions: Question[] = [
  { id: 1, text: 'I found it hard to wind down' },
  { id: 2, text: 'I was aware of dryness of my mouth' },
  { id: 3, text: 'I couldn’t seem to experience any positive feeling at all' },
  { id: 4, text: 'I experienced breathing difficulty' },
  { id: 5, text: 'I found it difficult to work up the initiative to do things' },
  { id: 6, text: 'I tended to over-react to situations' },
  { id: 7, text: 'I experienced trembling' },
  { id: 8, text: 'I felt that I was using a lot of nervous energy' },
  { id: 9, text: 'I was worried about situations in which I might panic' },
  { id: 10, text: 'I felt that I had nothing to look forward to' },
  { id: 11, text: 'I found myself getting agitated' },
  { id: 12, text: 'I found it difficult to relax' },
  { id: 13, text: 'I felt down-hearted and blue' },
  { id: 14, text: 'I was intolerant of anything that kept me from getting on with what I was doing' },
  { id: 15, text: 'I felt I was close to panic' },
  { id: 16, text: 'I was unable to become enthusiastic about anything' },
  { id: 17, text: 'I felt I wasn’t worth much as a person' },
  { id: 18, text: 'I felt that I was rather touchy' },
  { id: 19, text: 'I was aware of the action of my heart in the absence of physical exertion' },
  { id: 20, text: 'I felt scared without any good reason' },
  { id: 21, text: 'I felt that life was meaningless' }
];

const options = [
  { label: 'Did not apply to me at all', value: 0 },
  { label: 'Applied to me to some degree', value: 1 },
  { label: 'Applied to me a considerable degree', value: 2 },
  { label: 'Applied to me very much', value: 3 }
];

const Dass21Screening: React.FC = () => {
  const [responses, setResponses] = useState<number[]>(Array(21).fill(-1));
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (questionIndex: number, value: number) => {
    const updated = [...responses];
    updated[questionIndex] = value;
    setResponses(updated);
  };

  const handleSubmit = () => {
    if (responses.includes(-1)) {
      alert('Please answer all questions before submitting.');
      return;
    }
    setSubmitted(true);
  };

  const getScores = () => {
    const depressionItems = [3, 5, 10, 13, 16, 17, 20];
    const anxietyItems = [2, 4, 7, 9, 15, 18, 19];
    const stressItems = [0, 1, 6, 8, 11, 12, 14];

    const depression = depressionItems.reduce((acc, i) => acc + responses[i], 0) * 2;
    const anxiety = anxietyItems.reduce((acc, i) => acc + responses[i], 0) * 2;
    const stress = stressItems.reduce((acc, i) => acc + responses[i], 0) * 2;

    return { depression, anxiety, stress };
  };

  const getInterpretation = (score: number, type: 'depression' | 'anxiety' | 'stress') => {
    const ranges = {
      depression: [
        { label: 'Normal', max: 9 },
        { label: 'Mild', max: 13 },
        { label: 'Moderate', max: 20 },
        { label: 'Severe', max: 27 },
        { label: 'Extremely Severe', max: Infinity }
      ],
      anxiety: [
        { label: 'Normal', max: 7 },
        { label: 'Mild', max: 9 },
        { label: 'Moderate', max: 14 },
        { label: 'Severe', max: 19 },
        { label: 'Extremely Severe', max: Infinity }
      ],
      stress: [
        { label: 'Normal', max: 14 },
        { label: 'Mild', max: 18 },
        { label: 'Moderate', max: 25 },
        { label: 'Severe', max: 33 },
        { label: 'Extremely Severe', max: Infinity }
      ]
    };

    const matched = ranges[type].find(range => score <= range.max);
    return matched ? matched.label : 'Unknown';
  };

  const scores = getScores();

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4">DASS-21 Mental Health Screening</h2>
      {!submitted ? (
        <div className="space-y-6">
          {questions.map((q, idx) => (
            <div key={q.id}>
              <p className="font-medium mb-2">{q.id}. {q.text}</p>
              <div className="space-y-1">
                {options.map((option, optIdx) => (
                  <label key={optIdx} className="block">
                    <input
                      type="radio"
                      name={`question-${q.id}`}
                      value={option.value}
                      checked={responses[idx] === option.value}
                      onChange={() => handleChange(idx, option.value)}
                      className="mr-2"
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            </div>
          ))}
          <button
            className="mt-6 px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      ) : (
        <div className="mt-6 text-lg">
          <h3 className="font-semibold mb-2">Your Scores</h3>
          <p><strong>Depression:</strong> {scores.depression} — {getInterpretation(scores.depression, 'depression')}</p>
          <p><strong>Anxiety:</strong> {scores.anxiety} — {getInterpretation(scores.anxiety, 'anxiety')}</p>
          <p><strong>Stress:</strong> {scores.stress} — {getInterpretation(scores.stress, 'stress')}</p>
        </div>
      )}
    </div>
  );
};

export default Dass21Screening;
