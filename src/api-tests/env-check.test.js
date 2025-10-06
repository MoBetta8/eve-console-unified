/**
 * Tests for the env-check API endpoint
 */

import handler from '../../api/env-check.js';

describe('Env-check API', () => {
  let mockReq, mockRes;
  let originalEnv;

  beforeEach(() => {
    mockReq = {};
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    originalEnv = process.env.OPENROUTER_API_KEY;
  });

  afterEach(() => {
    if (originalEnv) {
      process.env.OPENROUTER_API_KEY = originalEnv;
    } else {
      delete process.env.OPENROUTER_API_KEY;
    }
  });

  test('should return 200 with ok: true when API key is set', () => {
    process.env.OPENROUTER_API_KEY = 'test-api-key';
    
    handler(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      ok: true,
      routerKeySet: true,
    });
  });

  test('should return 500 with error when API key is missing', () => {
    delete process.env.OPENROUTER_API_KEY;
    
    handler(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      ok: false,
      error: 'Missing OPENROUTER_API_KEY',
    });
  });

  test('should return 500 when API key is empty string', () => {
    process.env.OPENROUTER_API_KEY = '';
    
    handler(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      ok: false,
      error: 'Missing OPENROUTER_API_KEY',
    });
  });
});
