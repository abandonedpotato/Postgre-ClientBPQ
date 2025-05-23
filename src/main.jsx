// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import ShoutOut from "./pages/ShoutOut.jsx"; // ✅ make sure this path matches your file structure
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
      <Route
        path="/shoutouts" // ✅ this is your new shoutout page route
        element={<ShoutOut />}
      />
      <Route path="*" element={<div style={{ color: "white" }}>404 - Not Found</div>} />
    </Routes>
  </BrowserRouter>
);
