import React, { useEffect, useState } from "react";
import { Box, Typography, Tooltip, Avatar } from "@mui/material";
import goldMedal from "/src/assets/gold-medal.png";

// Utility: Check if a date is today
const isToday = (dateString) => {
  if (!dateString) return false;
  const today = new Date();
  const date = new Date(dateString);
  return date.toDateString() === today.toDateString();
};

function Leaderboard({ endpoint, title, needsQuizId }) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch leaderboard data and auto-refresh every 3 seconds
  useEffect(() => {
    setLoading(true);
    setError("");
    let timerId;
    async function fetchLeaderboard() {
      try {
        let data;
        if (needsQuizId) {
          // Send an empty quizId (backend uses global selected_quiz_id)
          const res = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ quizId: "" }),
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
          setLeaderboard([]);
          setError("No leaderboard data found.");
        }
      } catch (e) {
        setLeaderboard([]);
        setError("Failed to fetch leaderboard.");
      }
      setLoading(false);
    }

    fetchLeaderboard(); // Initial load
    timerId = setInterval(fetchLeaderboard, 3000); // Every 3 seconds

    return () => clearInterval(timerId);
  }, [endpoint, needsQuizId]);

  return (
    <Box
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        minHeight: "100vh",
        background: "#18181a",
        overflowX: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        boxSizing: "border-box",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: "500px",
          paddingX: "16px",
          boxSizing: "border-box",
        }}
      >
        {error && (
          <Typography color="red" align="center">
            {error}
          </Typography>
        )}
        {loading ? (
          <Typography color="#fff" align="center">
            Loading...
          </Typography>
        ) : leaderboard.length === 0 ? (
          <Typography color="#fff" align="center">
            {error || "No leaderboard data found."}
          </Typography>
        ) : (
          leaderboard.map((row, index) => (
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
                overflow: "hidden",
              }}
            >
              {/* Rank */}
              <Typography
                color="#fff"
                sx={{
                  width: 36,
                  textAlign: "center",
                  fontWeight: 600,
                  fontSize: 25,
                  mr: 2.4,
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
          ))
        )}
      </Box>
    </Box>
  );
}

export default Leaderboard;
