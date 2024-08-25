import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
//import SetAvatar from "./components/SetAvatar";
import Window from "./components/mainWindow/Window";
import SignIn from "./components/signin/SignIn";
import SignUp from "./components/signup/SignUp";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/" element={<Window />} />
      </Routes>
    </BrowserRouter>
  );
}