import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../login/loginForm";
import Profile from "../profile/profile";
import AIRecommendations from "../recommendations/AiRecommendations";
import SignupForm from "../signup/SignupForm";
import Posts from "../posts/RealEstatePost";
import AddPostPage from "../posts/AddPost";
import PrivateRoute from "./PrivateRoute";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/posts" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignupForm />} />
      <Route
        path="/profile"
        element={<PrivateRoute element={<Profile />} />} 
      />
      <Route
        path="/ai-recommendations"
        element={<PrivateRoute element={<AIRecommendations />} />} 
      />
      <Route
        path="/posts"
        element={<PrivateRoute element={<Posts />} />} 
      />
      <Route
        path="/addPost"
        element={<PrivateRoute element={<AddPostPage />} />}
      />
    </Routes>
  );
};

export default AppRoutes;