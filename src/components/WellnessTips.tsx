import React, { useState } from 'react';
import { wellnessTips as originalTips } from '../data/wellnessTips';
import * as Icons from 'lucide-react';

export const WellnessTips: React.FC = () => {
  const [tips, setTips] = useState(originalTips);

  const handleRefresh = () => {
    const shuffled = [...originalTips].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 9);
    setTips(selected);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Daily Wellness Tips</h1>
          <p className="text-lg text-gray-600 mb-4">
            Simple practices for a healthier mind and body
          </p>
          <button
            onClick={handleRefresh}
            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md shadow hover:bg-purple-700 transition"
          >
            🔄 Refresh Tips
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tips.map((tip) => {
            const IconComponent = Icons[tip.icon as keyof typeof Icons] as React.ElementType;
            return (
              <div
                key={tip.id}
                className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex items-center mb-4">
                  {IconComponent && (
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <IconComponent className="h-6 w-6 text-purple-600" />
                    </div>
                  )}
                  <h3 className="text-xl font-semibold text-gray-900 ml-3">{tip.title}</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">{tip.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
