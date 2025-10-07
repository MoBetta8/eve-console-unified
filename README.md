# Eve Console

Eve Console - AI-powered unified assistant with voice capabilities and multi-modal interaction.

## Features

- 🤖 AI chat powered by DeepSeek v3.1 (free tier)
- 🎙️ Optional text-to-speech using Piper TTS
- 🌐 Web interface with React
- 🐍 Python CLI for local interaction
- ☁️ Serverless deployment ready (Netlify/Vercel)

## Quick Start

### Web Interface

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env and add your OPENROUTER_API_KEY
   ```

3. **Run locally:**
   ```bash
   npm start
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

### Python CLI

1. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env and add your OPENROUTER_API_KEY
   ```

3. **Run the assistant:**
   ```bash
   python digimaster_brain.py
   ```

#### Optional: Text-to-Speech Setup

To enable voice output in the Python CLI:

1. Install [Piper TTS](https://github.com/rhasspy/piper)
2. Download voice models to:
   - Windows: `C:\piper_voices\en_amy\`
   - Linux/macOS: `~/piper_voices/en_amy/`
3. Download `en_US-amy-medium.onnx` and `en_US-amy-medium.onnx.json`

If TTS is not available, the script will fall back to text-only output.

## Deployment

### Netlify Deployment

1. Connect your repository to Netlify
2. Set the environment variable `OPENROUTER_API_KEY` in your Netlify project settings
3. The build will automatically use the settings in `netlify.toml`
4. Deploy!

### Vercel Deployment

1. Connect your repository to Vercel
2. Set the environment variable `OPENROUTER_API_KEY` in your Vercel project settings
3. Deploy!

## Environment Variables

- `OPENROUTER_API_KEY` - Required for the chat functionality. Get your key from [OpenRouter](https://openrouter.ai/keys)

## Project Structure

```
eve-console-unified/
├── src/                    # React frontend source
│   ├── App.js             # Main React component
│   ├── index.js           # React entry point
│   └── MyComponent.js     # Example component
├── api/                    # Serverless functions
│   ├── chat.js            # Chat endpoint
│   └── env-check.js       # Environment check
├── public/                 # Static assets
├── legacy/                 # Legacy code reference
├── digimaster_brain.py    # Python CLI assistant
├── requirements.txt       # Python dependencies
├── package.json           # Node.js dependencies
├── netlify.toml           # Netlify config
└── README.md              # This file
```

## Development

The application consists of:
- **Frontend**: React app with chat interface
- **Backend**: Serverless functions for API integration
- **CLI**: Python script for terminal-based interaction

All components use the same AI model (DeepSeek v3.1) for consistency.

## Contributing

This is an open-source project. Contributions are welcome!

## License

See LICENSE file for details.

