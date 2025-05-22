import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/leaderboardmain" element={<App endpoint="https://postgre-backendbpq.onrender.com/getStats" title="Main Leaderboard" showQuizId={false} />} />
        <Route path="/leaderboardsub" element={<App endpoint="https://postgre-backendbpq.onrender.com/getStats" title="Subscriber Leaderboard" showQuizId={false} />} />
        <Route path="/leaderboard" element={<App endpoint="https://postgre-backendbpq.onrender.com/getStats" title="Quiz Leaderboard" showQuizId={true} />} />
        <Route path="*" element={<div>Leaderboard not found.</div>} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);