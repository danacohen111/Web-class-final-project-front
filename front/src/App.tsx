import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AIRecommendations from './components/recommendations/AiRecommendations';
import SignupForm from './components/signup/SignupForm';
import LoginForm from './components/login/LoginForm';
import { GoogleOAuthProvider } from '@react-oauth/google';
import './App.css';

const App: React.FC = () => {
  return (
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
      <Router>
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route path="/ai-recommendations" element={<AIRecommendations />} />
          <Route path="/signup" element={<SignupForm />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
};

export default App;
