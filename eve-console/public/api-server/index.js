const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "YOUR_OPENROUTER_API_KEY_HERE";

app.get("/", (req, res) => {
  res.send("API server is running!");
});

app.get("/api/env-check", async (req, res) => {
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3.1-8b-instruct",
        messages: [{ role: "user", content: "ping" }],
      }),
    });
    if (response.ok) {
      res.json({ ok: true, timestamp: new Date().toISOString() });
    } else {
      res.status(500).json({ ok: false, error: "API check failed" });
    }
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.post("/api/chat", async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: "Message required" });
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3.1-8b-instruct",
        messages: [{ role: "user", content: message }],
      }),
    });
    const data = await response.json();
    if (response.ok) {
      res.json({ reply: data.choices[0].message.content });
    } else {
      res.status(500).json({ error: data.error?.message || "API error" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));