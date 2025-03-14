import React from "react";
import { BrowserRouter as Router, Route, Routes, useLocation, Navigate } from "react-router-dom";
import Login from "./components/login/loginForm";
import Profile from "./components/profile/profile";
import AIRecommendations from "./components/recommendations/AiRecommendations";
import AppMenu from "./components/menu/appMenu";
import SignupForm from "./components/signup/SignupForm";
import Posts from './components/posts/RealEstatePost';
import AddPostPage from "./components/posts/AddPost";

const App: React.FC = () => {
  const location = useLocation();

  return (
    <div>
      {location.pathname !== "/login" && location.pathname !== "/signup" && <AppMenu />}
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/ai-recommendations" element={<AIRecommendations />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/posts" element={<Posts />} />
        <Route path="/addPost" element={<AddPostPage />} />
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