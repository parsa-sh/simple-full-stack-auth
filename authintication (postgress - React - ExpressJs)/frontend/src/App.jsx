import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { userStore } from "./utils/contex";
import "./App.css";

function App() {
  const user = userStore((state) => state.isLoggedIn);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/home"
          element={user ? <Home /> : <Navigate to="/login" replace />}
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
        <Route
          path="/login"
          element={user ? <Navigate to="/home" replace /> : <Login />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
