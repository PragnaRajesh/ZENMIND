import React from 'react';
import { helplines } from '../data/helplines';
import { Phone, Globe, Clock } from 'lucide-react';

export const Hotlines: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Mental Health Helplines</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            If you're in crisis, these helplines are available to support you.
            Remember, seeking help is a sign of strength, not weakness.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {helplines.map((helpline) => (
            <div
              key={helpline.id}
              className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="flex items-center mb-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Globe className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 ml-3">{helpline.country}</h3>
              </div>
              <div className="space-y-4">
                <p className="text-gray-600 font-medium">{helpline.organization}</p>
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Phone className="h-5 w-5 text-green-600" />
                  </div>
                  <p className="text-lg font-semibold text-green-600">{helpline.number}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Clock className="h-5 w-5 text-purple-600" />
                  </div>
                  <p className="text-gray-600">{helpline.hours}</p>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-500">
                    Available in: {helpline.languages.join(', ')}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};