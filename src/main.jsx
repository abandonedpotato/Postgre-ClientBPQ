// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route
        path="/leaderboard"
        element={
          <App
            endpoint="https://postgre-backendbpq.onrender.com/getStats"
            title="Leaderboard"
            needsQuizId={true}
          />
        }
      />
      <Route
        path="/leaderboardmain"
        element={
          <App
            endpoint="https://postgre-backendbpq.onrender.com/getMainStats"
            title="Main Leaderboard"
            needsQuizId={true}
          />
        }
      />
      <Route
        path="/leaderboardsubs"
        element={
          <App
            endpoint="https://postgre-backendbpq.onrender.com/getSubStats"
            title="Subscriber Leaderboard"
            needsQuizId={true}
          />
        }
      />
      <Route
        path="/leaderboardnew"
        element={
          <App
            endpoint="https://postgre-backendbpq.onrender.com/getNewStats"
            title="New Players"
            needsQuizId={true}
          />
        }
      />
      {/* Add more routes here if needed */}
      <Route path="*" element={<div style={{color: "white"}}>404 - Not Found</div>} />
    </Routes>
  </BrowserRouter>
);r