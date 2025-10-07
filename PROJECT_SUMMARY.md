# Eve Console - Project Summary

## What is Eve Console?

Eve Console is a unified AI assistant platform that combines:
- A modern React web interface
- A Python command-line interface
- OpenRouter API integration for AI responses
- Optional text-to-speech capabilities

## Key Features

### 🔒 Security
- No hardcoded API keys (uses environment variables)
- Secure serverless deployment support

### 🌍 Cross-Platform
- Works on Windows, Linux, and macOS
- Automatic platform detection for voice paths

### 💬 Flexible Interaction
- Web chat interface with modern UI
- Terminal-based chat via Python CLI
- Optional voice output with Piper TTS

### 🚀 Easy Deployment
- Ready for Netlify or Vercel deployment
- Serverless API functions included
- Simple environment configuration

## Architecture

```
┌─────────────────────────────────────┐
│         User Interfaces             │
├─────────────────┬───────────────────┤
│  Web Browser    │   Terminal (CLI)  │
│  (React App)    │  (Python Script)  │
└────────┬────────┴────────┬──────────┘
         │                 │
         ▼                 ▼
┌─────────────────────────────────────┐
│      OpenRouter API Gateway         │
│    (DeepSeek v3.1 Free Model)       │
└─────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│         AI Response                 │
│   (Text or Voice Output)            │
└─────────────────────────────────────┘
```

## Tech Stack

### Frontend
- React 18
- Modern CSS-in-JS styling
- Responsive design

### Backend
- Serverless functions (Netlify/Vercel)
- OpenRouter API integration
- DeepSeek v3.1 model (free tier)

### CLI
- Python 3.12+
- Requests library
- Optional Piper TTS integration

## Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/MoBetta8/eve-console-unified.git
   cd eve-console-unified
   ```

2. **Set up environment**
   ```bash
   cp .env.example .env
   # Edit .env and add your OPENROUTER_API_KEY
   ```

3. **Choose your interface:**

   **Web Interface:**
   ```bash
   npm install
   npm start
   ```

   **Python CLI:**
   ```bash
   pip install -r requirements.txt
   python digimaster_brain.py
   ```

## Recent Improvements

### Security & Best Practices
- ✅ Removed all hardcoded API keys
- ✅ Added environment variable configuration
- ✅ Improved .gitignore to exclude sensitive files

### Code Quality
- ✅ Cross-platform support for all operating systems
- ✅ Better error handling with informative messages
- ✅ Optimized React components with hooks
- ✅ Added comprehensive documentation

### User Experience
- ✅ Modern dark theme UI
- ✅ Keyboard shortcuts (Enter to send)
- ✅ Loading states and visual feedback
- ✅ Collapsible debug logs
- ✅ Graceful fallbacks when TTS unavailable

## Future Enhancements

Potential areas for expansion:
- Multi-turn conversation support with context
- Additional AI model options
- Voice input (speech-to-text)
- User authentication
- Conversation history persistence
- Custom voice model selection

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

This project is open source. See LICENSE file for details.

## Support

For questions or issues, please open a GitHub issue.

---

**Built with ❤️ by the Eve Console team**
