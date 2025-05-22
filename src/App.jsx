import React, { useEffect, useState } from "react";
import { Box, Typography, Tooltip, Avatar } from "@mui/material";
import goldMedal from "./assets/gold-medal.png"; // Adjust path as needed

// Util: check if the date is today
const isToday = (dateString) => {
  if (!dateString) return false;
  const today = new Date();
  const date = new Date(dateString);
  return date.toDateString() === today.toDateString();
};

function App({ 
  endpoint = "https://postgre-backendbpq.onrender.com/getStats", 
  title = "Leaderboard", 
  showQuizId = true 
}) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quizId, setQuizId] = useState(null);
  const [error, setError] = useState("");

  // Fetch latest quiz ID if needed
  useEffect(() => {
    if (!showQuizId) return;
    async function fetchQuizId() {
      try {
        const res = await fetch("https://postgre-backendbpq.onrender.com/getAllQuiz");
        let data = await res.json();
        if (typeof data === "string") data = JSON.parse(data);
        if (
          data &&
          typeof data === "object" &&
          data.type === "QUIZ_DATA" &&
          Array.isArray(data.data) &&
          data.data.length > 0
        ) {
          setQuizId(data.data[0][0]);
        } else {
          setError("No quizzes found.");
          setLoading(false);
        }
      } catch (e) {
        setError("Failed to fetch quiz list.");
        setLoading(false);
      }
    }
    fetchQuizId();
  }, [showQuizId]);

  // Fetch leaderboard data
  useEffect(() => {
    async function fetchLeaderboard() {
      setLoading(true);
      try {
        let data;
        if (endpoint.endsWith("/getStats")) {
          if (!quizId) return;
          const res = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ quizId: String(quizId) }),
          });
          data = await res.json();
          if (typeof data === "string") data = JSON.parse(data);
        } else {
          const res = await fetch(endpoint);
          data = await res.json();
          if (typeof data === "string") data = JSON.parse(data);
        }
        if (
          (data.type === "STATS_DATA" ||
            data.type === "MAIN_LEADERBOARD" ||
            data.type === "SUB_LEADERBOARD") &&
          Array.isArray(data.data)
        ) {
          setLeaderboard(data.data);
        } else {
          setError("No leaderboard data found.");
        }
      } catch (e) {
        setError("Failed to fetch leaderboard.");
      }
      setLoading(false);
    }
    if (endpoint.endsWith("/getStats")) {
      if (quizId) fetchLeaderboard();
    } else {
      fetchLeaderboard();
    }
    // eslint-disable-next-line
  }, [endpoint, quizId]);

  return (
    <Box sx={{ background: "#18181a", minHeight: "100vh", py: 4 }}>
      {loading ? (
        <Typography color="#fff" align="center">
          Loading...
        </Typography>
      ) : leaderboard.length === 0 ? (
        <Typography color="#fff" align="center">
          No leaderboard data found.
        </Typography>
      ) : (
        <Box sx={{ maxWidth: 500, mx: "auto" }}>
          {leaderboard.map((row, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                alignItems: "center",
                background: "#222",
                borderRadius: "16px",
                px: 2,
                py: 1.5,
                my: 1.2,
                boxShadow: "0 1px 12px rgba(0,0,0,0.35)",
              }}
            >
              {/* Rank */}
              <Typography
                color="#fff"
                sx={{
                  width: 32,
                  textAlign: "center",
                  fontWeight: 600,
                  fontSize: 25,
                  mr: 1,
                }}
              >
                {row[0]}
              </Typography>
              {/* Avatar */}
              <Tooltip title={row[2]}>
                <Avatar
                  src={row[3] ? row[3] : `https://bpqcdn.co.uk/avatar/${row[2]}.webp`}
                  alt={row[2]}
                  sx={{
                    width: 54,
                    height: 54,
                    mr: 1.8,
                    border: isToday(row[5]) ? "3px solid #2ecc40" : "2px solid #444",
                    boxSizing: "border-box",
                  }}
                />
              </Tooltip>
              {/* Name & Points */}
              <Box sx={{ flex: 1 }}>
                <Typography
                  color="#fff"
                  sx={{ fontWeight: 600, fontSize: 20, lineHeight: 1.15 }}
                >
                  {row[6]}
                </Typography>
                <Typography color="#ccc" sx={{ fontWeight: 500, fontSize: 17, mt: 0.2 }}>
                  {row[1]} Points
                </Typography>
              </Box>
              {/* Medal at end, only if winner */}
              {row[7] === "Yes" && (
                <Box sx={{ ml: 2 }}>
                  <img
                    src={goldMedal}
                    alt="Winner"
                    width={48}
                    height={44}
                    style={{
                      filter: "drop-shadow(0 2px 6px #111)",
                    }}
                  />
                </Box>
              )}
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}

export default App;
