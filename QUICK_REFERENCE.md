# Eve Console - Quick Reference

## 🚀 Quick Start Commands

### Web Interface
```bash
npm install              # Install dependencies
npm start               # Start development server
npm run build           # Build for production
npm test                # Run tests
npm run deploy:check    # Verify deployment readiness
```

### Python CLI
```bash
pip install -r requirements.txt    # Install dependencies
python digimaster_brain.py         # Run the assistant
```

## 🔧 Configuration

### Setup Environment
```bash
cp .env.example .env
# Edit .env and add: OPENROUTER_API_KEY=your_key_here
```

### Get API Key
Visit: https://openrouter.ai/keys

## 📁 Important Files

| File | Purpose |
|------|---------|
| `README.md` | Main documentation |
| `DEPLOYMENT.md` | Deployment instructions |
| `CONTRIBUTING.md` | Contribution guidelines |
| `CHANGELOG.md` | Version history |
| `.env.example` | Environment template |
| `requirements.txt` | Python dependencies |
| `package.json` | Node.js dependencies |

## 🧪 Testing

```bash
npm test                          # Run React tests
npm test -- --watchAll=false     # Run once without watch
npm run build                    # Test build
```

## 🐛 Troubleshooting

### "Missing OPENROUTER_API_KEY"
**Solution**: Create `.env` file with your API key

### "Module not found" (Python)
**Solution**: `pip install -r requirements.txt`

### "Module not found" (Node)
**Solution**: `npm install`

### Build fails
**Solution**: Delete `node_modules` and `package-lock.json`, then `npm install`

## 🔗 Useful Links

- **OpenRouter**: https://openrouter.ai
- **Piper TTS**: https://github.com/rhasspy/piper
- **React Docs**: https://react.dev
- **Netlify**: https://netlify.com
- **Vercel**: https://vercel.com

## 💡 Tips

1. Always set `OPENROUTER_API_KEY` in environment variables
2. Never commit `.env` files
3. Run `npm run deploy:check` before deploying
4. Use `npm run fresh` for a clean reinstall
5. Check `DEPLOYMENT.md` for platform-specific instructions

## 🆘 Get Help

- Read `README.md` for detailed documentation
- Check `DEPLOYMENT.md` for deployment issues
- Review `CONTRIBUTING.md` for development guidelines
- Open a GitHub issue for bugs or questions

---

**Quick Deploy**: `npm run build` → Deploy `build/` folder to your platform
