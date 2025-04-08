import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Flower2, Phone, BarChart2, MessageCircle, Heart, LogOut, Brain } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export const Navigation: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/feedback');
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <Heart className="h-8 w-8 text-purple-600" />
              <span className="ml-2 text-xl font-semibold">MindMateAI</span>
            </Link>
            
            {isAuthenticated && (
              <div className="hidden md:flex md:items-center md:ml-10 space-x-8">
                <Link to="/wellness" className="flex items-center text-gray-700 hover:text-purple-600">
                  <Flower2 className="h-5 w-5 mr-1" />
                  <span>Wellness Tips</span>
                </Link>
                <Link to="/library" className="flex items-center text-gray-700 hover:text-purple-600">
                  <BookOpen className="h-5 w-5 mr-1" />
                  <span>Healing Library</span>
                </Link>
                <Link to="/hotlines" className="flex items-center text-gray-700 hover:text-purple-600">
                  <Phone className="h-5 w-5 mr-1" />
                  <span>Hotlines</span>
                </Link>
                <Link to="/stats" className="flex items-center text-gray-700 hover:text-purple-600">
                  <BarChart2 className="h-5 w-5 mr-1" />
                  <span>Statistics</span>
                </Link>
                <Link to="/brain-breaks" className="flex items-center text-gray-700 hover:text-purple-600">
                  <Brain className="h-5 w-5 mr-1" />
                  <span>Brain Breaks</span>
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center">
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="flex items-center bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
              >
                <LogOut className="h-5 w-5 mr-2" />
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};