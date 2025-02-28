import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignupForm from './components/SignupForm';
import AIRecommendations from './components/AiRecommendations';

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