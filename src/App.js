import React, { useState, useEffect } from "react";
import axios from "axios";

export default function App() {
  const [status, setStatus] = useState("checking");
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);

  const logMessage = (msg) => {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = `${timestamp}: ${msg}`;
    setLogs((prev) => [...prev, logEntry]);
    console.log(logEntry);
  };

  useEffect(() => {
    const checkStatus = async () => {
      logMessage("🔍 Checking Eve Console status...");
      try {
        const res = await axios.get("http://localhost:3001/api/status");
        logMessage(`✅ Backend is online: ${JSON.stringify(res.data)}`);
        setStatus("online");
      } catch (err) {
        logMessage(`❌ Backend connection failed: ${err.message}`);
        setStatus("offline");
      }
    };
    checkStatus();
  }, []);

  const handleSend = async () => {
    if (!message.trim() || isLoading) return;
    
    setIsLoading(true);
    const userMessage = message.trim();
    setMessage("");
    
    // Add user message to conversation
    const newEntry = { role: "user", content: userMessage, timestamp: new Date() };
    setConversationHistory(prev => [...prev, newEntry]);
    
    logMessage(`💬 Sending message: ${userMessage}`);
    
    try {
      const res = await axios.post("http://localhost:3001/api/chat", {
        message: userMessage,
        history: conversationHistory
      });
      
      const aiResponse = res.data.reply;
      logMessage(`🤖 Eve response: ${aiResponse}`);
      
      // Add AI response to conversation
      const aiEntry = { role: "assistant", content: aiResponse, timestamp: new Date() };
      setConversationHistory(prev => [...prev, aiEntry]);
      setResponse(aiResponse);
      
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message || "Request failed";
      logMessage(`❌ Chat error: ${errorMsg}`);
      setResponse(`Error: ${errorMsg}`);
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

  const clearHistory = () => {
    setConversationHistory([]);
    setResponse("");
    logMessage("🗑️ Conversation history cleared");
  };

  return (
    <div style={{ 
      color: "white", 
      minHeight: "100vh", 
      backgroundColor: "#0a0a0a",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      {/* Header */}
      <div style={{ 
        background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
        padding: "20px",
        borderBottom: "2px solid #00d4ff",
        textAlign: "center"
      }}>
        <h1 style={{ 
          margin: 0, 
          fontSize: "2.5rem",
          background: "linear-gradient(45deg, #00d4ff, #ff6b6b)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          textShadow: "0 0 20px rgba(0, 212, 255, 0.5)"
        }}>
          🚀 Eve Console Unified
        </h1>
        <p style={{ margin: "10px 0 0 0", color: "#888", fontSize: "1.1rem" }}>
          Advanced AI Assistant with OpenRouter Integration
        </p>
        <div style={{ marginTop: "15px" }}>
          <span style={{ 
            padding: "8px 16px", 
            borderRadius: "20px",
            backgroundColor: status === "online" ? "#00ff88" : "#ff4444",
            color: "black",
            fontWeight: "bold",
            fontSize: "0.9rem"
          }}>
            {status === "online" ? "🟢 Online" : "🔴 Offline"}
          </span>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
        {/* Main Chat Interface */}
        <div style={{ 
          backgroundColor: "#1a1a1a",
          borderRadius: "15px",
          padding: "30px",
          marginBottom: "20px",
          border: "1px solid #333",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)"
        }}>
          {status === "offline" ? (
            <div style={{ 
              textAlign: "center", 
              color: "#ff6b6b",
              padding: "40px",
              fontSize: "1.2rem"
            }}>
              <h3>⚠️ Eve is Offline</h3>
              <p>Please start the backend server to begin chatting</p>
              <code style={{ 
                backgroundColor: "#333", 
                padding: "10px", 
                borderRadius: "5px",
                display: "block",
                margin: "20px auto",
                maxWidth: "300px"
              }}>
                npm run server
              </code>
            </div>
          ) : (
            <>
              {/* Chat Input */}
              <div style={{ marginBottom: "20px" }}>
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask Eve anything... (Press Enter to send)"
                    disabled={isLoading}
                    style={{ 
                      flex: 1,
                      padding: "15px 20px", 
                      fontSize: "16px",
                      backgroundColor: "#2a2a2a",
                      border: "2px solid #444",
                      borderRadius: "25px",
                      color: "white",
                      outline: "none",
                      transition: "border-color 0.3s"
                    }}
                    onFocus={(e) => e.target.style.borderColor = "#00d4ff"}
                    onBlur={(e) => e.target.style.borderColor = "#444"}
                  />
                  <button 
                    onClick={handleSend} 
                    disabled={isLoading || !message.trim()}
                    style={{ 
                      padding: "15px 25px", 
                      fontSize: "16px",
                      backgroundColor: isLoading ? "#666" : "#00d4ff",
                      color: "black",
                      border: "none",
                      borderRadius: "25px",
                      cursor: isLoading ? "not-allowed" : "pointer",
                      fontWeight: "bold",
                      transition: "all 0.3s"
                    }}
                  >
                    {isLoading ? "⏳" : "🚀"}
                  </button>
                  <button 
                    onClick={clearHistory}
                    style={{ 
                      padding: "15px 20px", 
                      fontSize: "16px",
                      backgroundColor: "#ff6b6b",
                      color: "white",
                      border: "none",
                      borderRadius: "25px",
                      cursor: "pointer",
                      fontWeight: "bold"
                    }}
                  >
                    🗑️
                  </button>
                </div>
              </div>

              {/* Current Response */}
              {response && (
                <div style={{ 
                  backgroundColor: "#2a2a2a",
                  padding: "20px",
                  borderRadius: "10px",
                  marginBottom: "20px",
                  borderLeft: "4px solid #00d4ff"
                }}>
                  <div style={{ color: "#00d4ff", fontWeight: "bold", marginBottom: "10px" }}>
                    🤖 Eve's Response:
                  </div>
                  <div style={{ color: "#fff", lineHeight: "1.6" }}>
                    {response}
                  </div>
                </div>
              )}

              {/* Conversation History */}
              {conversationHistory.length > 0 && (
                <div style={{ 
                  backgroundColor: "#1e1e1e",
                  borderRadius: "10px",
                  padding: "20px",
                  maxHeight: "400px",
                  overflowY: "auto"
                }}>
                  <h4 style={{ color: "#00d4ff", marginTop: 0 }}>💬 Conversation History</h4>
                  {conversationHistory.map((entry, index) => (
                    <div key={index} style={{ 
                      marginBottom: "15px",
                      padding: "10px",
                      backgroundColor: entry.role === "user" ? "#2a2a2a" : "#1a2a1a",
                      borderRadius: "8px",
                      borderLeft: `4px solid ${entry.role === "user" ? "#ff6b6b" : "#00d4ff"}`
                    }}>
                      <div style={{ 
                        color: entry.role === "user" ? "#ff6b6b" : "#00d4ff", 
                        fontWeight: "bold",
                        fontSize: "0.9rem",
                        marginBottom: "5px"
                      }}>
                        {entry.role === "user" ? "👤 You" : "🤖 Eve"}
                      </div>
                      <div style={{ color: "#fff" }}>{entry.content}</div>
                      <div style={{ 
                        color: "#666", 
                        fontSize: "0.8rem", 
                        marginTop: "5px" 
                      }}>
                        {entry.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Debug Logs */}
        <div style={{ 
          backgroundColor: "#1a1a1a",
          borderRadius: "15px",
          padding: "20px",
          border: "1px solid #333"
        }}>
          <h3 style={{ color: "#00d4ff", marginTop: 0 }}>🔍 Debug Logs</h3>
          <div style={{ 
            maxHeight: "200px", 
            overflowY: "auto", 
            color: "#ccc",
            fontFamily: "monospace",
            fontSize: "0.9rem",
            backgroundColor: "#0a0a0a",
            padding: "15px",
            borderRadius: "8px"
          }}>
            {logs.length === 0 ? (
              <div style={{ color: "#666", fontStyle: "italic" }}>
                No logs yet...
              </div>
            ) : (
              logs.map((log, index) => (
                <div key={index} style={{ marginBottom: "5px" }}>
                  {log}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
