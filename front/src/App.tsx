import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AIRecommendations from './components/AiRecommendations';
import SignupForm from './components/signup/SignupForm'
import './App.css'

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignupForm />} />
        <Route path="/ai-recommendations" element={<AIRecommendations />} />
      </Routes>
    </Router>
  );
};

export default App;