/**
 * Debugging utilities for Eve Console
 * 
 * This module provides helper functions for debugging the application.
 */

const DEBUG = process.env.NODE_ENV === 'development';

/**
 * Logger utility with different log levels
 */
export const logger = {
  /**
   * Log debug messages (only in development)
   */
  debug: (...args) => {
    if (DEBUG) {
      console.log('[DEBUG]', new Date().toISOString(), ...args);
    }
  },

  /**
   * Log info messages
   */
  info: (...args) => {
    console.info('[INFO]', new Date().toISOString(), ...args);
  },

  /**
   * Log warning messages
   */
  warn: (...args) => {
    console.warn('[WARN]', new Date().toISOString(), ...args);
  },

  /**
   * Log error messages
   */
  error: (...args) => {
    console.error('[ERROR]', new Date().toISOString(), ...args);
  },

  /**
   * Log API calls
   */
  api: (method, url, data) => {
    if (DEBUG) {
      console.log('[API]', new Date().toISOString(), method, url, data || '');
    }
  },
};

/**
 * Performance monitoring utility
 */
export class PerformanceMonitor {
  constructor(label) {
    this.label = label;
    this.startTime = performance.now();
  }

  end() {
    const endTime = performance.now();
    const duration = endTime - this.startTime;
    logger.debug(`⏱️ ${this.label} took ${duration.toFixed(2)}ms`);
    return duration;
  }
}

/**
 * API request debugger
 */
export const debugFetch = async (url, options = {}) => {
  const perf = new PerformanceMonitor(`Fetch ${url}`);
  
  logger.api(options.method || 'GET', url, options.body);
  
  try {
    const response = await fetch(url, options);
    const duration = perf.end();
    
    logger.debug(`Response status: ${response.status}`);
    
    // Clone response to read it without consuming
    const clonedResponse = response.clone();
    const data = await clonedResponse.json();
    logger.debug('Response data:', data);
    
    return response;
  } catch (error) {
    perf.end();
    logger.error('Fetch error:', error);
    throw error;
  }
};

/**
 * Environment checker
 */
export const checkEnvironment = () => {
  const checks = {
    nodeEnv: process.env.NODE_ENV || 'not set',
    apiKey: process.env.OPENROUTER_API_KEY ? '✅ Set' : '❌ Missing',
    browser: typeof window !== 'undefined' ? '✅ Yes' : '❌ No',
  };
  
  logger.info('Environment check:', checks);
  return checks;
};

/**
 * Component render tracker (for debugging React re-renders)
 */
export const useRenderCount = (componentName) => {
  if (!DEBUG) return;
  
  const renderCount = React.useRef(0);
  
  React.useEffect(() => {
    renderCount.current += 1;
    logger.debug(`🔄 ${componentName} rendered ${renderCount.current} times`);
  });
};

/**
 * Error boundary helper
 */
export const formatError = (error) => {
  return {
    message: error.message || 'Unknown error',
    stack: error.stack || 'No stack trace',
    timestamp: new Date().toISOString(),
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown',
  };
};

/**
 * Network status monitor
 */
export const monitorNetworkStatus = (callback) => {
  if (typeof window === 'undefined') return;
  
  const updateStatus = () => {
    const status = {
      online: navigator.onLine,
      timestamp: new Date().toISOString(),
    };
    logger.info('Network status:', status);
    callback(status);
  };
  
  window.addEventListener('online', updateStatus);
  window.addEventListener('offline', updateStatus);
  
  // Initial check
  updateStatus();
  
  // Return cleanup function
  return () => {
    window.removeEventListener('online', updateStatus);
    window.removeEventListener('offline', updateStatus);
  };
};

/**
 * Local storage debugger
 */
export const debugLocalStorage = () => {
  if (typeof window === 'undefined') return;
  
  logger.debug('LocalStorage contents:');
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const value = localStorage.getItem(key);
    logger.debug(`  ${key}:`, value);
  }
};

/**
 * API response validator
 */
export const validateApiResponse = (response, expectedFields = []) => {
  const issues = [];
  
  if (!response) {
    issues.push('Response is null or undefined');
    return { valid: false, issues };
  }
  
  expectedFields.forEach(field => {
    if (!(field in response)) {
      issues.push(`Missing field: ${field}`);
    }
  });
  
  if (issues.length > 0) {
    logger.warn('API response validation failed:', issues);
    return { valid: false, issues };
  }
  
  logger.debug('API response is valid ✅');
  return { valid: true, issues: [] };
};

export default {
  logger,
  PerformanceMonitor,
  debugFetch,
  checkEnvironment,
  formatError,
  monitorNetworkStatus,
  debugLocalStorage,
  validateApiResponse,
};
