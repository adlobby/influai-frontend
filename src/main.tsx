import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import AuthPage from "./pages/AuthPage";
import AuthCallback from "./pages/AuthCallback";
import AppHome from "./pages/AppHome";
import ProtectedRoute from "./pages/ProtectedRoute";

import "./styles/globals.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  // Note: StrictMode makes effects run twice in dev (so you might see duplicate logs).
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/app" element={<AppHome />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
