import React, { useEffect, useState } from "react";
import goldMedal from "./assets/gold-medal.png"; // <-- Adjust the import path as needed

const LEADERBOARD_ENDPOINT = "https://postgre-backendbpq.onrender.com/getStats";
const GET_QUIZ_ENDPOINT = "https://postgre-backendbpq.onrender.com/getAllQuiz";

// Utility: is date today
function isToday(dateString) {
  if (!dateString) return false;
  const today = new Date();
  const date = new Date(dateString);
  return date.toDateString() === today.toDateString();
}

function App() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [quizId, setQuizId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch latest quizId on mount
  useEffect(() => {
    async function fetchQuizId() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(GET_QUIZ_ENDPOINT);
        const data = await res.json();
        if (data.type === "QUIZ_DATA" && Array.isArray(data.data) && data.data.length > 0) {
          setQuizId(data.data[0][0]);
        } else {
          setError("No quizzes found.");
        }
      } catch (e) {
        setError("Failed to fetch quiz list.");
      }
      setLoading(false);
    }
    fetchQuizId();
  }, []);

  // Poll for leaderboard updates every 10 seconds
  useEffect(() => {
    if (!quizId) return;

    let isMounted = true;

    async function fetchLeaderboard() {
      try {
        const res = await fetch(LEADERBOARD_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quizId: String(quizId) }),
        });
        const data = await res.json();
        if (data.type === "STATS_DATA" && Array.isArray(data.data) && isMounted) {
          setLeaderboard(data.data);
          setError("");
        } else if (isMounted) {
          setLeaderboard([]);
          setError("No leaderboard data found.");
        }
      } catch (e) {
        if (isMounted) {
          setLeaderboard([]);
          setError("Failed to fetch leaderboard.");
        }
      }
      setLoading(false);
    }

    fetchLeaderboard();
    const intervalId = setInterval(fetchLeaderboard, 10000); // poll every 10 seconds

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [quizId]);

  // ---- RENDER ----

  return (
    <div style={{
      background: "#222",
      minHeight: "100vh",
      padding: "2rem 0",
      fontFamily: "sans-serif"
    }}>
      <h1 style={{ color: "#fff", textAlign: "center", marginBottom: "2rem" }}>
        Quiz Leaderboard
      </h1>
      {error && <div style={{ color: "red", textAlign: "center" }}>{error}</div>}
      {loading ? (
        <div style={{ color: "#fff", textAlign: "center" }}>Loading...</div>
      ) : leaderboard.length === 0 ? (
        <div style={{ color: "#fff", textAlign: "center" }}>No leaderboard data found.</div>
      ) : (
        <div style={{ maxWidth: 480, margin: "0 auto" }}>
          {leaderboard.map((row, idx) => {
            const avatarStyle = isToday(row[5])
              ? { border: "3px solid #18e818" }
              : { border: "3px solid #444" };
            return (
              <div key={idx}
                style={{
                  display: "flex",
                  alignItems: "center",
                  background: "#222",
                  borderRadius: 12,
                  margin: "8px 0",
                  padding: "10px 18px",
                  boxShadow: "0 2px 8px #0002"
                }}
              >
                {/* Place */}
                <span style={{
                  width: 32,
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 22,
                  textAlign: "center"
                }}>
                  {row[0]}
                </span>
                {/* Avatar */}
                <img
                  src={
                    row[3]
                      ? row[3]
                      : `https://bpqcdn.co.uk/avatar/${row[2]}.webp`
                  }
                  alt={row[6] || row[2]}
                  width={48}
                  height={48}
                  style={{
                    borderRadius: "50%",
                    margin: "0 14px",
                    objectFit: "cover",
                    ...avatarStyle
                  }}
                  onError={e => {
                    // fallback to placeholder if needed
                    e.target.onerror = null;
                    e.target.src = "/vite.svg";
                  }}
                />
                {/* Name and Points stacked */}
                <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                  <span style={{
                    color: "#fff",
                    fontSize: 19,
                    fontWeight: 600,
                    lineHeight: 1.1,
                    textTransform: "none"
                  }}>
                    {row[6]}
                  </span>
                  <span style={{
                    color: "#ccc",
                    fontSize: 16,
                    marginTop: 2,
                  }}>
                    {row[1]} Points
                  </span>
                </div>
                {/* Medal */}
                {row[7] === "Yes" && (
                  <img
                    src={goldMedal}
                    alt="Winner"
                    width={40}
                    height={36}
                    style={{ marginLeft: 8 }}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default App;
