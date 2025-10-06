/**
 * Tests for the App component
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App';

// Mock fetch
global.fetch = jest.fn();

describe('App Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders welcome heading', () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ ok: false }),
    });

    render(<App />);
    expect(screen.getByText(/Welcome to Eve Console/i)).toBeInTheDocument();
  });

  test('shows offline status when env-check fails', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ ok: false, error: 'Missing API key' }),
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/❌ Offline/i)).toBeInTheDocument();
    });
  });

  test('shows online status when env-check succeeds', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ ok: true, routerKeySet: true }),
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/✅ Online/i)).toBeInTheDocument();
    });
  });

  test('displays offline message when backend is offline', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ ok: false }),
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/EVE is offline/i)).toBeInTheDocument();
    });
  });

  test('renders input and send button when online', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ ok: true, routerKeySet: true }),
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Ask EVE Council/i)).toBeInTheDocument();
      expect(screen.getByText(/Send/i)).toBeInTheDocument();
    });
  });

  test('sends message when send button is clicked', async () => {
    // Mock env-check
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ ok: true, routerKeySet: true }),
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/✅ Online/i)).toBeInTheDocument();
    });

    // Mock chat response
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ reply: 'Hello, I am EVE!' }),
    });

    const input = screen.getByPlaceholderText(/Ask EVE Council/i);
    const sendButton = screen.getByText(/Send/i);

    fireEvent.change(input, { target: { value: 'Hello' } });
    fireEvent.click(sendButton);

    await waitFor(() => {
      const responses = screen.getAllByText(/Hello, I am EVE!/i);
      // The response should appear in the response div (not in logs)
      expect(responses.length).toBeGreaterThan(0);
    });
  });

  test('shows error message when chat request fails', async () => {
    // Mock env-check
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ ok: true, routerKeySet: true }),
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/✅ Online/i)).toBeInTheDocument();
    });

    // Mock chat error
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'API error' }),
    });

    const input = screen.getByPlaceholderText(/Ask EVE Council/i);
    const sendButton = screen.getByText(/Send/i);

    fireEvent.change(input, { target: { value: 'Hello' } });
    fireEvent.click(sendButton);

    await waitFor(() => {
      const errors = screen.getAllByText(/API error/i);
      // The error should appear somewhere
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  test('does not send empty messages', async () => {
    // Mock env-check
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ ok: true, routerKeySet: true }),
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/✅ Online/i)).toBeInTheDocument();
    });

    const sendButton = screen.getByText(/Send/i);
    
    // Clear all previous fetch calls
    global.fetch.mockClear();
    
    fireEvent.click(sendButton);

    // No new fetch should be called
    expect(global.fetch).not.toHaveBeenCalled();
  });

  test('logs debug messages', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ ok: true, routerKeySet: true }),
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/Debug Logs:/i)).toBeInTheDocument();
      expect(screen.getByText(/Checking \/api\/env-check/i)).toBeInTheDocument();
    });
  });
});
