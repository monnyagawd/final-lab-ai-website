/**
 * Test setup utilities for Lab AI testing environment
 * This module configures the test environment and provides setup/teardown utilities
 */

import { QueryClient } from '@tanstack/react-query';
import { APIError, ValidationError, AuthenticationError } from './errorHandling';
import * as testUtils from './testUtils';

/**
 * Create a test query client for testing
 * @returns Configured QueryClient for tests
 */
export function createTestQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        cacheTime: 0,
        staleTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
    logger: {
      log: console.log,
      warn: console.warn,
      error: () => {}, // Silent errors during tests
    },
  });
}

/**
 * Mock the fetch function for testing
 * @param responseData Mock response data
 * @param status HTTP status code
 * @returns Mocked fetch function
 */
export function mockFetch(responseData: any, status = 200) {
  return jest.fn().mockImplementation(() => 
    Promise.resolve(testUtils.mockHttpResponse(responseData, status))
  );
}

/**
 * Mock an API error response
 * @param message Error message
 * @param status HTTP status code
 * @param data Additional error data
 * @returns Mock API error
 */
export function mockAPIError(message: string, status = 500, data?: any): APIError {
  return new APIError(message, status, data);
}

/**
 * Mock a validation error response
 * @param message Error message
 * @param errors Validation errors by field
 * @returns Mock validation error
 */
export function mockValidationError(message: string, errors: Record<string, string[]>): ValidationError {
  return new ValidationError(message, errors);
}

/**
 * Mock an authentication error response
 * @param message Optional error message
 * @returns Mock authentication error
 */
export function mockAuthError(message?: string): AuthenticationError {
  return new AuthenticationError(message);
}

/**
 * Setup a test suite with mocks
 * @param setupFn Function containing mock setup logic
 * @returns Cleanup function to restore all mocks
 */
export function setupTest(setupFn?: () => void): () => void {
  // Save original implementations
  const originalFetch = global.fetch;
  const originalConsoleError = console.error;
  const originalConsoleWarn = console.warn;
  
  // Replace with mocks
  global.fetch = jest.fn() as any;
  console.error = jest.fn();
  console.warn = jest.fn();
  
  // Run custom setup if provided
  if (setupFn) {
    setupFn();
  }
  
  // Return cleanup function
  return () => {
    // Restore original implementations
    global.fetch = originalFetch;
    console.error = originalConsoleError;
    console.warn = originalConsoleWarn;
    
    // Clear all mocks
    jest.clearAllMocks();
  };
}

/**
 * Mock React component props for testing
 * @param Component React component to mock props for
 * @param defaultProps Default props to use
 * @returns Mock props generator
 */
export function createMockProps<P>(
  Component: React.ComponentType<P>, 
  defaultProps: Partial<P> = {}
) {
  return (overrides: Partial<P> = {}): P => {
    return {
      ...defaultProps,
      ...overrides,
    } as P;
  };
}

/**
 * Mock global window methods and properties for testing
 * @param overrides Override values for specific properties
 * @returns Cleanup function to restore original values
 */
export function mockWindowProperties(overrides: Record<string, any> = {}) {
  const original: Record<string, any> = {};
  
  // Store original values and apply mocks
  Object.entries(overrides).forEach(([key, value]) => {
    original[key] = window[key as keyof Window];
    Object.defineProperty(window, key, { 
      value, 
      writable: true,
      configurable: true
    });
  });
  
  // Return cleanup function
  return () => {
    // Restore original values
    Object.entries(original).forEach(([key, value]) => {
      Object.defineProperty(window, key, { 
        value,
        writable: true,
        configurable: true
      });
    });
  };
}

/**
 * Mock the response of API requests
 * @param url URL pattern to match
 * @param data Response data
 * @param status HTTP status code
 */
export function mockAPIResponse(url: string | RegExp, data: any, status = 200) {
  // Mock the fetch implementation to return our data for matching URLs
  (global.fetch as jest.Mock).mockImplementation((fetchUrl: string, options: RequestInit) => {
    if (typeof url === 'string' && fetchUrl.includes(url) || 
        url instanceof RegExp && url.test(fetchUrl)) {
      return Promise.resolve(testUtils.mockHttpResponse(data, status));
    }
    
    // Default mock response for unmatched URLs
    return Promise.resolve(testUtils.mockHttpResponse({ message: 'Not found' }, 404));
  });
}

// Export all test utilities for easy access
export * from './testUtils';