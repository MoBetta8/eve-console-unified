# Contributing to Eve Console

Thank you for your interest in contributing to Eve Console!

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/eve-console-unified.git`
3. Create a branch: `git checkout -b feature/your-feature-name`

## Development Setup

### Web Interface
```bash
npm install
cp .env.example .env
# Edit .env and add your OPENROUTER_API_KEY
npm start
```

### Python CLI
```bash
pip install -r requirements.txt
cp .env.example .env
# Edit .env and add your OPENROUTER_API_KEY
python digimaster_brain.py
```

## Making Changes

1. Make your changes in your feature branch
2. Test your changes thoroughly
3. Commit with clear, descriptive messages
4. Push to your fork
5. Create a Pull Request

## Code Style

- **JavaScript/React**: Follow existing code style, use meaningful variable names
- **Python**: Follow PEP 8 guidelines
- **Comments**: Add comments for complex logic
- **Documentation**: Update README.md if you add new features

## Testing

Before submitting a PR:

1. **Build the frontend**: `npm run build` should complete without errors
2. **Test the API**: Ensure API endpoints work correctly
3. **Test the Python CLI**: Verify the script runs without errors
4. **Check for security issues**: No hardcoded credentials or sensitive data

## Pull Request Guidelines

- Provide a clear description of what your PR does
- Reference any related issues
- Keep PRs focused on a single feature/fix
- Update documentation as needed

## Questions?

Open an issue for discussion or questions!

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.
