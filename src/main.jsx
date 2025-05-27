// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import ShoutOut from "./pages/ShoutOut.jsx"; // ✅ make sure this path matches your file structure
import "./index.css";
//const BASE_URL = "https://golive.bigpotatoquiz.co.uk";
const BASE_URL = "https://postgre-clientbpq.onrender.com/";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route
        path="/leaderboard"
        element={
          <App
            endpoint={`${BASE_URL}/getStats`}
            title="Leaderboard"
            needsQuizId={true}
          />
        }
      />
      <Route
        path="/leaderboardmain"
        element={
          <App
            endpoint={`${BASE_URL}/getMainStats`}
            title="Main Leaderboard"
            needsQuizId={true}
          />
        }
      />
      <Route
        path="/leaderboardsubs"
        element={
          <App
            endpoint={`${BASE_URL}/getSubStats`}
            title="Subscriber Leaderboard"
            needsQuizId={true}
          />
        }
      />
      <Route
        path="/leaderboardnew"
        element={
          <App
            endpoint={`${BASE_URL}/getNewStats`}
            title="New Players"
            needsQuizId={true}
          />
        }
      />
      <Route
        path="/leaderboardminus"
        element={
          <App
            endpoint={`${BASE_URL}/getNewStats`}
            title="Minus Players"
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
