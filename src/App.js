import React, { useState, useEffect, useCallback } from "react";

export default function App() {
  const [status, setStatus] = useState("checking");
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const logMessage = useCallback((msg) => {
    setLogs((prev) => [...prev, `${new Date().toLocaleTimeString()}: ${msg}`]);
  }, []);

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
  }, [logMessage]);

  const handleSend = async () => {
    if (!message.trim() || isLoading) return;
    
    const userMessage = message.trim();
    setMessage("");
    logMessage(`📤 Sending to /api/chat: ${userMessage}`);
    setResponse("Thinking...");
    setIsLoading(true);
    
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });
      const data = await res.json();
      logMessage(`📥 Chat response: ${JSON.stringify(data)}`);
      if (res.ok && data.reply) {
        setResponse(data.reply);
      } else {
        setResponse(`Error: ${data.error || "Something went wrong."}`);
      }
    } catch (err) {
      logMessage(`❌ Chat error: ${err.message}`);
      setResponse("Request failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div style={{ 
      color: "white", 
      textAlign: "center", 
      padding: "50px", 
      fontFamily: "Arial, sans-serif", 
      backgroundColor: "#0a0a0a", 
      minHeight: "100vh" 
    }}>
      <h1 style={{ fontSize: "2.5em", marginBottom: "10px" }}>
        Welcome to Eve Console 🚀
      </h1>
      <p style={{ fontSize: "1.2em", color: "#888" }}>
        Status: {status === "online" ? "✅ Online" : "❌ Offline"}
      </p>
      
      {status === "offline" ? (
        <div style={{ 
          color: "#ff6b6b", 
          marginTop: "20px",
          padding: "20px",
          backgroundColor: "#2a1a1a",
          borderRadius: "10px",
          maxWidth: "500px",
          margin: "20px auto"
        }}>
          <p>⚠️ EVE is offline</p>
          <p style={{ fontSize: "0.9em", color: "#aaa" }}>
            Please ensure OPENROUTER_API_KEY is set in your environment
          </p>
        </div>
      ) : (
        <div style={{ marginTop: "40px", maxWidth: "800px", margin: "40px auto" }}>
          <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask EVE anything..."
              disabled={isLoading}
              style={{ 
                padding: "15px", 
                flex: 1,
                fontSize: "16px",
                borderRadius: "8px",
                border: "2px solid #333",
                backgroundColor: "#1a1a1a",
                color: "white",
                outline: "none"
              }}
            />
            <button 
              onClick={handleSend} 
              disabled={isLoading || !message.trim()}
              style={{ 
                padding: "15px 30px", 
                fontSize: "16px",
                borderRadius: "8px",
                border: "none",
                backgroundColor: isLoading ? "#555" : "#00aa00",
                color: "white",
                cursor: isLoading ? "not-allowed" : "pointer",
                fontWeight: "bold",
                transition: "background-color 0.3s"
              }}
            >
              {isLoading ? "⏳" : "Send"}
            </button>
          </div>
          
          {response && (
            <div style={{ 
              marginTop: "30px", 
              padding: "20px",
              backgroundColor: "#1a1a1a",
              borderRadius: "10px",
              textAlign: "left",
              color: "#00ff00",
              whiteSpace: "pre-wrap",
              wordWrap: "break-word",
              border: "2px solid #333"
            }}>
              <strong style={{ color: "#00aa00" }}>🤖 Eve:</strong>
              <div style={{ marginTop: "10px" }}>{response}</div>
            </div>
          )}
        </div>
      )}
      
      <details style={{ marginTop: "40px", maxWidth: "800px", margin: "40px auto" }}>
        <summary style={{ 
          cursor: "pointer", 
          color: "#888",
          fontSize: "0.9em",
          padding: "10px"
        }}>
          🔍 Debug Logs ({logs.length})
        </summary>
        <div style={{ 
          marginTop: "10px", 
          maxHeight: "200px", 
          overflowY: "auto", 
          color: "#666",
          textAlign: "left",
          backgroundColor: "#0a0a0a",
          padding: "15px",
          borderRadius: "8px",
          fontSize: "0.85em",
          fontFamily: "monospace"
        }}>
          {logs.length === 0 ? (
            <div>No logs yet</div>
          ) : (
            logs.map((log, index) => (
              <div key={index} style={{ marginBottom: "5px" }}>
                {log}
              </div>
            ))
          )}
        </div>
      </details>
    </div>
  );
}
