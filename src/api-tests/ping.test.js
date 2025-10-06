/**
 * Tests for the ping API endpoint
 */

import handler from '../../api/ping.js';

describe('Ping API', () => {
  let mockReq, mockRes;

  beforeEach(() => {
    mockReq = {};
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  test('should return 200 with ok: true and timestamp', async () => {
    await handler(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        ok: true,
        time: expect.any(String),
      })
    );
  });

  test('should return valid ISO timestamp', async () => {
    await handler(mockReq, mockRes);

    const callArgs = mockRes.json.mock.calls[0][0];
    const timestamp = new Date(callArgs.time);
    
    expect(timestamp.toISOString()).toBe(callArgs.time);
  });
});
