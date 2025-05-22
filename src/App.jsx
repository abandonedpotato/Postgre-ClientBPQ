import React, { useEffect, useState } from "react";

function App() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quizId, setQuizId] = useState(null);
  const [error, setError] = useState("");

  // Fetch latest quiz ID
  useEffect(() => {
    async function fetchQuizId() {
      try {
        const res = await fetch("https://postgre-backendbpq.onrender.com/getAllQuiz");
        let data = await res.json();
        // Double-parse if backend returns JSON string instead of object
        if (typeof data === "string") {
          console.warn("Double parsing JSON string from backend");
          data = JSON.parse(data);
        }
        console.log("getAllQuiz result:", data);
        if (
          data &&
          typeof data === "object" &&
          data.type === "QUIZ_DATA" &&
          Array.isArray(data.data) &&
          data.data.length > 0
        ) {
          setQuizId(data.data[0][0]);
          console.log("Setting quizId to", data.data[0][0]);
        } else {
          setError("No quizzes found.");
          setLoading(false);
        }
      } catch (e) {
        setError("Failed to fetch quiz list.");
        setLoading(false);
        console.error("EXCEPTION in fetchQuizId", e);
      }
    }
    fetchQuizId();
  }, []);

  // Fetch leaderboard for latest quiz
  useEffect(() => {
    if (!quizId) return;
    async function fetchLeaderboard() {
      setLoading(true);
      try {
        const res = await fetch("https://postgre-backendbpq.onrender.com/getStats", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quizId: String(quizId) }),
        });
        let data = await res.json();
        if (typeof data === "string") {
          console.warn("Double parsing leaderboard JSON string from backend");
          data = JSON.parse(data);
        }
        console.log("getStats result:", data);
        if (data.type === "STATS_DATA" && Array.isArray(data.data)) {
          setLeaderboard(data.data);
        } else {
          setError("No leaderboard data found.");
        }
      } catch (e) {
        setError("Failed to fetch leaderboard.");
        console.error("Leaderboard fetch error:", e);
      }
      setLoading(false);
    }
    fetchLeaderboard();
  }, [quizId]);

  // Table headings
  const columns = [
    "Rank",
    "Points",
    "Username",
    "Avatar",
    "Subscriber",
    "Date Joined",
    "Display Name",
    "Is Subscriber"
  ];

  return (
    <div style={{ maxWidth: 900, margin: "2rem auto", fontFamily: "sans-serif" }}>
      <h1>Quiz Leaderboard</h1>
      {quizId && (
        <div style={{ marginBottom: "1rem", color: "#333" }}>
          <strong>Quiz ID:</strong> {quizId}
        </div>
      )}
      {error && <div style={{ color: "red" }}>{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : leaderboard.length === 0 ? (
        <div>No leaderboard data found.</div>
      ) : (
        <table border="1" cellPadding="8" cellSpacing="0" style={{ width: "100%", background: "#fff" }}>
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col} style={{ background: "#f5f5f5" }}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((row, idx) => (
              <tr key={idx}>
                <td>{row[0]}</td>
                <td>{row[1]}</td>
                <td>
                  <a href={`https://www.tiktok.com/@${row[2]}`} target="_blank" rel="noopener noreferrer">
                    @{row[2]}
                  </a>
                </td>
                <td>
                  {row[3] ? (
                    <img
                      src={row[3]}
                      alt={row[6] || row[2]}
                      style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover" }}
                    />
                  ) : (
                    <span style={{ color: "#bbb" }}>No avatar</span>
                  )}
                </td>
                <td>{row[4] === 1 ? "Yes" : "No"}</td>
                <td>{row[5] ? new Date(row[5]).toLocaleDateString() : ""}</td>
                <td>{row[6]}</td>
                <td>{row[7]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;