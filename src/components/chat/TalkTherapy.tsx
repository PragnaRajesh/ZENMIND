import React from 'react';
import avatar from '../../assets/therapist-avatar.png'; // the one you finalized

export const TalkTherapy = () => {
  return (
    <div className="flex flex-col items-center text-center bg-white/80 p-8 rounded-xl shadow-lg">
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

      <p className="text-sm text-gray-500 italic">
        “I'm here whenever you're ready to talk.”
      </p>
    </div>
  );
};
