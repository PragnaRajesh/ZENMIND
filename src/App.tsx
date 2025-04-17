import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { Login } from './components/Login';
import ChatInterface from './components/ChatInterface';
import { WellnessTips } from './components/WellnessTips';
import { HealingLibrary } from './components/HealingLibrary';
import { Hotlines } from './components/Hotlines';
import { Statistics } from './components/Statistics';
import { DailyAffirmation } from './components/DailyAffirmation';
import { Feedback } from './components/Feedback';
import { BrainBreaks } from './components/BrainBreaks';
import { useAuthStore } from './store/authStore';
import Dass21Screening from './components/Dass21Screening';


const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navigation />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
          path="/chat"
          element={
            <div className="max-w-7xl mx-auto px-4 py-6">
              <DailyAffirmation />
              <div className="mt-6">
                <ChatInterface />
              </div>
             </div>
         }
      />

          <Route
            path="/wellness"
            element={
              <PrivateRoute>
                <WellnessTips />
              </PrivateRoute>
            }
          />
          <Route
            path="/library"
            element={
              <PrivateRoute>
                <HealingLibrary />
              </PrivateRoute>
            }
          />
          <Route
            path="/hotlines"
            element={
              <PrivateRoute>
                <Hotlines />
              </PrivateRoute>
            }
          />
          <Route
            path="/stats"
            element={
              <PrivateRoute>
                <Statistics />
              </PrivateRoute>
            }
          />
          <Route
            path="/dass21"
            element={
              <PrivateRoute>
                <Dass21Screening />
             </PrivateRoute>
            }
          />
          <Route
            path="/feedback"
            element={
              <PrivateRoute>
                <Feedback />
              </PrivateRoute>
            }
          />
          <Route
            path="/brain-breaks"
            element={
              <PrivateRoute>
                <BrainBreaks />
              </PrivateRoute>
            }
          />
          <Route path="/" element={<Navigate to="/chat" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;