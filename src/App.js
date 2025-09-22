import React, { useState, useEffect } from "react";

function App() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const res = await fetch("/api/env-check");
        const data = await res.json();
        if (data.ok) {
          setStatus("online");
        } else {
          setStatus("offline");
        }
      } catch (err) {
        setStatus("offline");
      }
    };

    checkBackend();
  }, []);

  const handleSend = async () => {
    if (!message.trim()) return;

    setResponse("Sending...");
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();

      if (res.ok && data.reply) {
        setResponse(data.reply);
      } else {
        setResponse(data.error || "Something went wrong.");
      }
    } catch (err) {
      setResponse("Failed to connect to API.");
    }
  };

  return (
    <div style={{ backgroundColor: "#000", color: "#fff", minHeight: "100vh", padding: "40px", textAlign: "center" }}>
      <h1>Welcome to Eve Console</h1>
      <p>Your AI-powered coding assistant is {status === "online" ? "🟢 online" : "🔴 offline"}.</p>

      <div style={{ marginTop: "40px" }}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask EVE Council..."
          style={{ padding: "10px", width: "300px", fontSize: "16px" }}
        />
        <button
          onClick={handleSend}
          style={{ padding: "10px 20px", marginLeft: "10px", fontSize: "16px" }}
        >
          Send
        </button>
      </div>

      <div style={{ marginTop: "20px", color: "#00ff00", fontSize: "16px" }}>{response}</div>
    </div>
  );
}

export default App;
