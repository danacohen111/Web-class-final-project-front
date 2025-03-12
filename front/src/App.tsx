import React from "react";
import { BrowserRouter as Router, Route, Routes, useLocation, Navigate } from "react-router-dom";
import Login from "./components/login/loginForm";
import Profile from "./components/profile/profile";
import AIRecommendations from "./components/recommendations/AiRecommendations";
import AppMenu from "./components/menu/appMenu";
import SignupForm from "./components/signup/SignupForm";

const App: React.FC = () => {
  const location = useLocation();

  return (
    <div>
      {location.pathname !== "/login" && <AppMenu />}
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/ai-recommendations" element={<AIRecommendations />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignupForm />} />
      </Routes>
    </div>
  );
};

const AppWrapper: React.FC = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;