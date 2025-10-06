# Eve Console

Eve Console Prototype - An AI-powered coding assistant with voice and chat capabilities.

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- Python 3.8+ (for the Python assistant)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/MoBetta8/eve-console-unified.git
cd eve-console-unified
```

2. Install JavaScript dependencies:
```bash
npm install
```

3. Install Python dependencies (optional, for digimaster_brain.py):
```bash
pip install -r requirements.txt
```

4. Set up environment variables:
```bash
cp .env.example .env
# Edit .env and add your OPENROUTER_API_KEY
```

### Running the Application

**React Frontend:**
```bash
npm start
```

**Python Assistant:**
```bash
python digimaster_brain.py
```

## 🧪 Testing & Debugging

See [TESTING.md](./TESTING.md) for comprehensive testing and debugging guide.

**Quick test commands:**

```bash
# Run all JavaScript tests
npm test

# Run Python tests
python -m unittest test_digimaster_brain.py -v

# Run with coverage
npm test -- --coverage
```

## 📁 Project Structure

```
eve-console-unified/
├── api/              # API endpoints (Vercel serverless functions)
├── src/              # React frontend source
│   ├── __tests__/    # React component tests
│   └── api-tests/    # API endpoint tests
├── legacy/           # Legacy code
├── public/           # Static assets
├── digimaster_brain.py   # Python AI assistant
├── test_digimaster_brain.py  # Python tests
├── TESTING.md        # Testing guide
└── requirements.txt  # Python dependencies
```

## 🔐 Security

⚠️ **Important:** Never commit API keys to the repository!

- Always use environment variables for sensitive data
- Use `.env` file locally (already in `.gitignore`)
- See `.env.example` for required variables

## 📚 Documentation

- [Testing Guide](./TESTING.md) - Comprehensive guide for testing and debugging
- [Frontend Design](./Frontend.txt) - Frontend architecture notes
- [Brand Design](./BrandDesign.txt) - Branding and design guidelines

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run tests: `npm test`
4. Submit a pull request

## 📝 License

See LICENSE file for details.

## 🆘 Support

For issues and questions, please open an issue on GitHub.

