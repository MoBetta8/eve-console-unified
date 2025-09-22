import React, { useState } from "react";

export default function App() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function send() {
    if (!input.trim() || loading) return;
    setLoading(true);
    setError("");
    const userMsg = { role: "user", content: input };
    setHistory((h) => [...h, userMsg]);
    setInput("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg.content }),
      });
      const data = await res.json();
      const botText =
        data?.choices?.[0]?.message?.content ??
        data?.error ??
        "No response";
      setHistory((h) => [...h, { role: "assistant", content: botText }]);
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }

  function onKey(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0b0b0b", color: "#f5f5f5" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
        <h1 style={{ fontSize: 36, marginBottom: 8 }}>Welcome to Eve Console</h1>
        <p style={{ opacity: 0.8, marginBottom: 24 }}>
          Your AI-powered coding assistant (server key is hidden).
        </p>

        <div
          style={{
            border: "1px solid #333",
            borderRadius: 12,
            padding: 16,
            minHeight: 320,
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <div style={{ flex: 1, overflowY: "auto", paddingRight: 4 }}>
            {history.length === 0 && (
              <div style={{ opacity: 0.6 }}>Say hello to EVE to get started.</div>
            )}
            {history.map((m, i) => (
              <div
                key={i}
                style={{
                  background: m.role === "user" ? "#1e1e1e" : "#151515",
                  padding: "10px 12px",
                  borderRadius: 8,
                  margin: "8px 0",
                }}
              >
                <b style={{ opacity: 0.8 }}>{m.role === "user" ? "You" : "EVE"}</b>
                <div style={{ whiteSpace: "pre-wrap" }}>{m.content}</div>
              </div>
            ))}
          </div>

          {error && <div style={{ color: "#ff6b6b" }}>{error}</div>}

          <div style={{ display: "flex", gap: 8 }}>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKey}
              placeholder="Ask EVE…"
              style={{
                flex: 1,
                minHeight: 48,
                resize: "vertical",
                background: "#0f0f0f",
                color: "#fff",
                border: "1px solid #333",
                borderRadius: 8,
                padding: 10,
              }}
            />
            <button
              onClick={send}
              disabled={loading}
              style={{
                minWidth: 100,
                borderRadius: 8,
                border: "1px solid #333",
                background: loading ? "#222" : "#1a73e8",
                color: "#fff",
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Sending…" : "Send"}
            </button>
          </div>
        </div>

        <div style={{ fontSize: 12, opacity: 0.6, marginTop: 12 }}>
          Built with a serverless /api/chat. Frontend never sees your key.
        </div>
      </div>
    </div>
  );
}
