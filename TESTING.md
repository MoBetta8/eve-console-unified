# Testing Guide for Eve Console

This document explains how to debug and test the Eve Console application.

## Table of Contents
1. [Setup](#setup)
2. [Running Tests](#running-tests)
3. [Debugging](#debugging)
4. [API Testing](#api-testing)
5. [Frontend Testing](#frontend-testing)
6. [Python Testing](#python-testing)

## Setup

### Install Dependencies

#### JavaScript/React Dependencies
```bash
npm install
```

#### Python Dependencies
```bash
pip install -r requirements.txt
```

### Environment Configuration

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Add your OpenRouter API key to `.env`:
```
OPENROUTER_API_KEY=your_actual_api_key_here
```

**⚠️ Security Note:** Never commit `.env` file or hardcode API keys in source code!

## Running Tests

### All Tests (React)
```bash
npm test
```

### Run Tests in Watch Mode
```bash
npm test -- --watch
```

### Run Tests with Coverage
```bash
npm test -- --coverage
```

### Run Specific Test File
```bash
npm test -- App.test.js
```

### Python Tests
```bash
python -m pytest test_digimaster_brain.py -v
```

Or using unittest:
```bash
python -m unittest test_digimaster_brain.py
```

## Debugging

### Frontend Debugging

The App component includes built-in debug logging. When running the app:

```bash
npm start
```

You'll see debug logs in the UI showing:
- API check status
- Request/response details
- Error messages

### Backend API Debugging

#### Test Environment Check
```bash
curl http://localhost:3000/api/env-check
```

Expected response when configured:
```json
{"ok": true, "routerKeySet": true}
```

#### Test Ping Endpoint
```bash
curl http://localhost:3000/api/ping
```

Expected response:
```json
{"ok": true, "time": "2024-01-01T00:00:00.000Z"}
```

#### Test Chat Endpoint
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello, EVE!"}'
```

Expected response:
```json
{"reply": "Hello! How can I help you?"}
```

### Python Script Debugging

Run the Python script with environment variables:
```bash
export OPENROUTER_API_KEY=your_key_here
python digimaster_brain.py
```

Or use a `.env` file (recommended):
```bash
python digimaster_brain.py
```

## API Testing

### Test Files Location
- `api/__tests__/ping.test.js` - Tests for ping endpoint
- `api/__tests__/env-check.test.js` - Tests for environment check
- `api/__tests__/chat.test.js` - Tests for chat endpoint

### What's Tested

#### Ping API (`/api/ping`)
- ✅ Returns 200 status
- ✅ Returns valid timestamp
- ✅ Timestamp is in ISO format

#### Env-check API (`/api/env-check`)
- ✅ Returns 200 when API key is set
- ✅ Returns 500 when API key is missing
- ✅ Handles empty API key correctly

#### Chat API (`/api/chat`)
- ✅ Rejects non-POST requests
- ✅ Validates message requirement
- ✅ Checks API key configuration
- ✅ Handles successful OpenRouter responses
- ✅ Handles API errors gracefully
- ✅ Handles network errors
- ✅ Uses correct model configuration

## Frontend Testing

### Test Files Location
- `src/__tests__/App.test.js` - Tests for main App component

### What's Tested

#### App Component
- ✅ Renders welcome heading
- ✅ Shows online/offline status
- ✅ Displays appropriate UI based on status
- ✅ Handles user input and sends messages
- ✅ Displays responses from API
- ✅ Shows error messages on failure
- ✅ Prevents sending empty messages
- ✅ Shows debug logs

## Python Testing

### Test Files Location
- `test_digimaster_brain.py` - Tests for Python chat script

### What's Tested

#### Digimaster Brain
- ✅ Successful GPT API calls
- ✅ Error handling for network issues
- ✅ Invalid API response handling
- ✅ Text-to-speech function
- ✅ Correct model usage
- ✅ Message formatting
- ✅ Environment variable validation

## Common Issues and Solutions

### Issue: Tests fail with "Cannot find module"
**Solution:** Make sure all dependencies are installed:
```bash
npm install
```

### Issue: Python tests fail with missing modules
**Solution:** Install Python dependencies:
```bash
pip install -r requirements.txt
```

### Issue: API tests fail with "Missing OPENROUTER_API_KEY"
**Solution:** The tests mock the environment variable, but ensure your test environment is clean. The test should handle this automatically.

### Issue: Frontend tests timeout
**Solution:** The tests mock fetch calls. Ensure you're using the correct version of testing libraries.

## Writing New Tests

### For API Endpoints

```javascript
import handler from '../your-endpoint.js';

describe('Your API', () => {
  let mockReq, mockRes;

  beforeEach(() => {
    mockReq = { method: 'POST', body: {} };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  test('should do something', async () => {
    await handler(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(200);
  });
});
```

### For React Components

```javascript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import YourComponent from '../YourComponent';

test('should render correctly', () => {
  render(<YourComponent />);
  expect(screen.getByText(/some text/i)).toBeInTheDocument();
});
```

### For Python Functions

```python
import unittest
from unittest.mock import Mock, patch

class TestYourFunction(unittest.TestCase):
    @patch('your_module.some_dependency')
    def test_something(self, mock_dep):
        # Arrange
        mock_dep.return_value = 'expected'
        
        # Act
        result = your_function()
        
        # Assert
        self.assertEqual(result, 'expected')
```

## Continuous Integration

When setting up CI/CD, run:

```bash
# Install dependencies
npm install
pip install -r requirements.txt

# Run all tests
npm test -- --watchAll=false --coverage
python -m pytest test_digimaster_brain.py -v

# Build
npm run build
```

## Additional Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Python unittest Documentation](https://docs.python.org/3/library/unittest.html)
- [pytest Documentation](https://docs.pytest.org/)

## Getting Help

If you encounter issues:
1. Check the debug logs in the UI
2. Review the test output for specific error messages
3. Ensure environment variables are correctly set
4. Verify all dependencies are installed
5. Check API key configuration

---

**Last Updated:** 2024
**Version:** 1.0.0
