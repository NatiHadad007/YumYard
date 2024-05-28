import React from "react";
import { Routes, Route } from "react-router-dom";
import Main from "./social-files/main";
import Login from "./social-files/logIn";
import Signin from "./social-files/signIn";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/log-in" element={<Login />} />
        <Route path="/sign-in" element={<Signin />} />
      </Routes>
    </div>
  );
}

export default App;
