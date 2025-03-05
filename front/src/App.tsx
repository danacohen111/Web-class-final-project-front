import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AIRecommendations from './components/recommendations/AiRecommendations';
import SignupForm from './components/signup/SignupForm';
import LoginForm from './components/login/LoginForm';
import './App.css';

const App: React.FC = () => {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route path="/ai-recommendations" element={<AIRecommendations />} />
          <Route path="/signup" element={<SignupForm />} />
        </Routes>
      </Router>
  );
};

export default App;
