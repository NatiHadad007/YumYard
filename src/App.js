import React from "react";
import { Routes, Route } from "react-router-dom";
import Main from "./social-files/main";
import Login from "./social-files/logIn";
import Signin from "./social-files/signIn";
import ProfileBanner from "./social-files/profileBanner";
import "./App.css";
import AuthProvider from "./context/AuthProvider";
import PostsProvider from "./context/PostsProvider";
function App() {
  return (
    <AuthProvider>
      <PostsProvider>
        <div className="App">
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/log-in" element={<Login />} />
            <Route path="/sign-in" element={<Signin />} />
            <Route path="/profile-banner" element={<ProfileBanner />} />
          </Routes>
        </div>
      </PostsProvider>
    </AuthProvider>
  );
}

export default App;
