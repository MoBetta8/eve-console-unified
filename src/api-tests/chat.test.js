/**
 * Tests for the chat API endpoint
 */

import handler from '../../api/chat.js';

// Mock the global fetch
global.fetch = jest.fn();

describe('Chat API', () => {
  let mockReq, mockRes;
  let originalEnv;

  beforeEach(() => {
    mockReq = {
      method: 'POST',
      body: {},
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    originalEnv = process.env.OPENROUTER_API_KEY;
    jest.clearAllMocks();
  });

  afterEach(() => {
    if (originalEnv) {
      process.env.OPENROUTER_API_KEY = originalEnv;
    } else {
      delete process.env.OPENROUTER_API_KEY;
    }
  });

  test('should return 405 for non-POST requests', async () => {
    mockReq.method = 'GET';
    
    await handler(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(405);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: 'Method not allowed',
    });
  });

  test('should return 400 when message is missing', async () => {
    mockReq.body = {};
    
    await handler(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: 'Message required',
    });
  });

  test('should return 400 when message is empty string', async () => {
    mockReq.body = { message: '' };
    
    await handler(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: 'Message required',
    });
  });

  test('should return 500 when API key is missing', async () => {
    delete process.env.OPENROUTER_API_KEY;
    mockReq.body = { message: 'Hello' };
    
    await handler(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: 'Missing OPENROUTER_API_KEY',
    });
  });

  test('should return 200 with reply on successful request', async () => {
    process.env.OPENROUTER_API_KEY = 'test-api-key';
    mockReq.body = { message: 'Hello' };

    const mockResponse = {
      choices: [
        {
          message: {
            content: 'Hello! How can I help you?',
          },
        },
      ],
    };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    await handler(mockReq, mockRes);

    expect(global.fetch).toHaveBeenCalledWith(
      'https://openrouter.ai/api/v1/chat/completions',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        }),
      })
    );

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      reply: 'Hello! How can I help you?',
    });
  });

  test('should return 502 when OpenRouter response is invalid', async () => {
    process.env.OPENROUTER_API_KEY = 'test-api-key';
    mockReq.body = { message: 'Hello' };

    const mockResponse = {
      error: 'Invalid request',
    };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    await handler(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(502);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: 'Bad response from OpenRouter',
      detail: mockResponse,
    });
  });

  test('should return 500 on network error', async () => {
    process.env.OPENROUTER_API_KEY = 'test-api-key';
    mockReq.body = { message: 'Hello' };

    global.fetch.mockRejectedValueOnce(new Error('Network error'));

    await handler(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: 'Upstream error',
      detail: 'Network error',
    });
  });

  test('should send correct model in request', async () => {
    process.env.OPENROUTER_API_KEY = 'test-api-key';
    mockReq.body = { message: 'Test message' };

    const mockResponse = {
      choices: [{ message: { content: 'Response' } }],
    };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    await handler(mockReq, mockRes);

    const fetchCall = global.fetch.mock.calls[0];
    const requestBody = JSON.parse(fetchCall[1].body);

    expect(requestBody).toEqual({
      model: 'openai/gpt-3.5-turbo',
      messages: [{ role: 'user', content: 'Test message' }],
    });
  });
});
