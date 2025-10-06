import React, { useState, useEffect } from "react";

export default function App() {
  const [status, setStatus] = useState("checking");
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [logs, setLogs] = useState([]);

  const logMessage = (msg) => {
    setLogs((prev) => [...prev, `${new Date().toLocaleTimeString()}: ${msg}`]);
  };

  useEffect(() => {
    const checkStatus = async () => {
      logMessage("🔍 Checking /api/env-check...");
      try {
        const res = await fetch("/api/env-check");
        const data = await res.json();
        logMessage(`🔍 API response: ${JSON.stringify(data)}`);
        if (res.ok && data.ok) {
          logMessage("✅ Backend is online");
          setStatus("online");
        } else {
          logMessage(`⚠️ env-check failed: ${JSON.stringify(data)}`);
          setStatus("offline");
        }
      } catch (err) {
        logMessage(`❌ env-check error: ${err.message}`);
        setStatus("offline");
      }
    };
    checkStatus();
  }, []);

  const handleSend = async () => {
    if (!message.trim()) return;
    logMessage(`🔍 Sending to /api/chat: ${message}`);
    setResponse("Sending...");
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const data = await res.json();
      logMessage(`🔍 Chat response: ${JSON.stringify(data)}`);
      if (res.ok && data.reply) {
        setResponse(data.reply);
      } else {
        setResponse(data.error || "Something went wrong.");
      }
    } catch (err) {
      logMessage(`❌ Chat error: ${err.message}`);
      setResponse("Request failed.");
    }
  };

  return (
    <div style={{ color: "white", textAlign: "center", padding: "50px", fontFamily: "Arial", backgroundColor: "black", minHeight: "100vh" }}>
      <h1>Welcome to Eve Console 🚀 (FRESH BUILD 0923)</h1>
      <p>Status: {status === "online" ? "✅ Online" : "❌ Offline"}</p>
      {status === "offline" ? (
        <div style={{ color: "red", marginTop: "20px" }}>
          EVE is offline — demo will queue once API is up
        </div>
      ) : (
        <div style={{ marginTop: "40px" }}>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask EVE Council..."
            style={{ padding: "10px", width: "300px", marginRight: "10px", fontSize: "16px" }}
          />
          <button onClick={handleSend} style={{ padding: "10px 20px", fontSize: "16px" }}>
            Send
          </button>
          <div style={{ marginTop: "20px", color: "#00ff00" }}>{response}</div>
        </div>
      )}
      <div style={{ marginTop: "20px", maxHeight: "200px", overflowY: "auto", color: "#ccc" }}>
        <h3>Debug Logs:</h3>
        {logs.map((log, index) => (
          <div key={index}>{log}</div>
        ))}
      </div>
    </div>
  );
}
