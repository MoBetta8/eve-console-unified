# Changelog

All notable changes to the Eve Console project will be documented in this file.

## [Unreleased]

### Added
- Requirements.txt for Python dependencies management
- .env.example file for environment variable configuration
- CONTRIBUTING.md with contribution guidelines
- Cross-platform support for Windows, Linux, and macOS in Python CLI
- Better error handling with timeout support and detailed error messages
- Loading states and visual feedback in React UI
- Debug logs now collapsible in UI
- Keyboard support (Enter to send) in chat interface
- Enhanced UI styling with modern dark theme
- Additional npm scripts (clean, fresh, deploy:check)

### Changed
- **SECURITY**: Removed hardcoded API key from digimaster_brain.py
- API chat endpoint now uses DeepSeek v3.1 model (consistent with Python CLI)
- Improved React app performance with useCallback optimization
- Enhanced text-to-speech with fallback to text-only mode
- Better voice model path handling for different operating systems
- Improved README with comprehensive setup instructions
- Updated .gitignore to exclude Python cache files

### Removed
- Duplicate digimaster_brain.py from legacy folder (had hardcoded API key)
- Build number from UI title for cleaner appearance

### Fixed
- API error handling now provides more detailed feedback
- TTS errors no longer crash the application
- Input field is now disabled during API requests
- Empty messages are no longer sent to the API

## [1.0.0] - Previous Release

### Initial Features
- React-based web interface
- Python CLI assistant
- Integration with OpenRouter API
- Piper TTS support for voice output
- Serverless deployment support (Netlify/Vercel)
