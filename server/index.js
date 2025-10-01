const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// OpenRouter Configuration
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1";

// Available models - including Grok AI
const AVAILABLE_MODELS = {
  "grok-beta": "x-ai/grok-beta",
  "grok-2": "x-ai/grok-2", 
  "gpt-4": "openai/gpt-4",
  "gpt-3.5-turbo": "openai/gpt-3.5-turbo",
  "claude-3": "anthropic/claude-3-sonnet",
  "deepseek-r1": "deepseek/deepseek-r1",
  "llama-3": "meta-llama/llama-3.1-8b-instruct"
};

// Default model - using Grok AI
const DEFAULT_MODEL = "grok-beta";

// Health check endpoint
app.get("/api/status", (req, res) => {
  res.json({ 
    ok: true, 
    timestamp: new Date().toISOString(),
    model: DEFAULT_MODEL,
    availableModels: Object.keys(AVAILABLE_MODELS),
    openrouterConfigured: !!OPENROUTER_API_KEY
  });
});

// Chat endpoint with OpenRouter integration
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history = [], model = DEFAULT_MODEL } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    if (!OPENROUTER_API_KEY) {
      return res.status(500).json({ 
        error: "OpenRouter API key not configured. Please set OPENROUTER_API_KEY environment variable." 
      });
    }

    // Build conversation history
    const messages = [
      {
        role: "system",
        content: `You are Eve, an advanced AI assistant with a friendly, helpful personality. You have access to real-time information and can help with a wide variety of tasks including coding, research, analysis, and general conversation. Be concise but thorough in your responses.`
      }
    ];

    // Add conversation history (last 10 messages to avoid token limits)
    const recentHistory = history.slice(-10);
    recentHistory.forEach(entry => {
      messages.push({
        role: entry.role,
        content: entry.content
      });
    });

    // Add current message
    messages.push({
      role: "user",
      content: message
    });

    // Get the model identifier
    const modelId = AVAILABLE_MODELS[model] || AVAILABLE_MODELS[DEFAULT_MODEL];

    console.log(`🤖 Sending request to OpenRouter with model: ${modelId}`);

    // Make request to OpenRouter
    const response = await axios.post(
      `${OPENROUTER_BASE_URL}/chat/completions`,
      {
        model: modelId,
        messages: messages,
        temperature: 0.7,
        max_tokens: 2000,
        stream: false
      },
      {
        headers: {
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "eve-console-unified",
          "X-Title": "Eve Console Unified"
        },
        timeout: 30000 // 30 second timeout
      }
    );

    if (!response.data.choices || !response.data.choices[0]) {
      throw new Error("Invalid response from OpenRouter");
    }

    const reply = response.data.choices[0].message.content;
    
    console.log(`✅ Received response from ${modelId}: ${reply.substring(0, 100)}...`);

    res.json({ 
      reply: reply,
      model: model,
      modelId: modelId,
      usage: response.data.usage || null
    });

  } catch (error) {
    console.error("❌ Chat error:", error.message);
    
    let errorMessage = "An error occurred while processing your request";
    let statusCode = 500;

    if (error.response) {
      // OpenRouter API error
      statusCode = error.response.status;
      errorMessage = error.response.data?.error?.message || error.response.data?.error || errorMessage;
    } else if (error.code === "ECONNABORTED") {
      errorMessage = "Request timeout - the AI is taking too long to respond";
    } else if (error.code === "ENOTFOUND" || error.code === "ECONNREFUSED") {
      errorMessage = "Unable to connect to AI service";
    }

    res.status(statusCode).json({ 
      error: errorMessage,
      details: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
});

// Get available models
app.get("/api/models", (req, res) => {
  res.json({
    models: AVAILABLE_MODELS,
    default: DEFAULT_MODEL,
    configured: !!OPENROUTER_API_KEY
  });
});

// Test OpenRouter connection
app.get("/api/test-openrouter", async (req, res) => {
  if (!OPENROUTER_API_KEY) {
    return res.status(500).json({ 
      error: "OpenRouter API key not configured" 
    });
  }

  try {
    const response = await axios.post(
      `${OPENROUTER_BASE_URL}/chat/completions`,
      {
        model: AVAILABLE_MODELS[DEFAULT_MODEL],
        messages: [
          { role: "user", content: "Hello! This is a test message." }
        ],
        max_tokens: 50
      },
      {
        headers: {
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        },
        timeout: 10000
      }
    );

    res.json({
      success: true,
      model: DEFAULT_MODEL,
      response: response.data.choices[0].message.content,
      usage: response.data.usage
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.response?.data?.error?.message || error.message
    });
  }
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Eve Console Unified API Server",
    version: "1.0.0",
    endpoints: {
      "GET /api/status": "Health check and server status",
      "POST /api/chat": "Chat with AI (supports multiple models including Grok)",
      "GET /api/models": "List available AI models",
      "GET /api/test-openrouter": "Test OpenRouter connection"
    },
    configured: !!OPENROUTER_API_KEY
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error("Unhandled error:", error);
  res.status(500).json({ 
    error: "Internal server error",
    details: process.env.NODE_ENV === "development" ? error.message : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Eve Console Unified API Server running on http://localhost:${PORT}`);
  console.log(`📡 OpenRouter configured: ${!!OPENROUTER_API_KEY ? "✅ Yes" : "❌ No"}`);
  console.log(`🤖 Default model: ${DEFAULT_MODEL} (${AVAILABLE_MODELS[DEFAULT_MODEL]})`);
  console.log(`🔧 Available models: ${Object.keys(AVAILABLE_MODELS).join(", ")}`);
  
  if (!OPENROUTER_API_KEY) {
    console.log("⚠️  WARNING: OPENROUTER_API_KEY not set. Please configure it to use AI features.");
    console.log("   Create a .env file with: OPENROUTER_API_KEY=your_key_here");
  }
});

module.exports = app;

