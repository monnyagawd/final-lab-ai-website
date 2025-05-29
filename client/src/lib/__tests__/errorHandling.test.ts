/**
 * Tests for error handling utilities
 */

import { 
  APIError, 
  ValidationError, 
  AuthenticationError, 
  parseErrorResponse,
  retryWithBackoff
} from '../errorHandling';

// Mock the toast hook
jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn()
  })
}));

describe('Error handling utilities', () => {
  describe('Error classes', () => {
    it('creates APIError with correct properties', () => {
      const error = new APIError('API error occurred', 500, { detailed: 'info' });
      
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(APIError);
      expect(error.message).toBe('API error occurred');
      expect(error.status).toBe(500);
      expect(error.data).toEqual({ detailed: 'info' });
      expect(error.name).toBe('APIError');
    });
    
    it('creates ValidationError with correct properties', () => {
      const errors = {
        email: ['Invalid email format'],
        password: ['Password too short']
      };
      
      const error = new ValidationError('Validation failed', errors);
      
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(ValidationError);
      expect(error.message).toBe('Validation failed');
      expect(error.errors).toEqual(errors);
      expect(error.name).toBe('ValidationError');
    });
    
    it('creates AuthenticationError with correct properties', () => {
      const error = new AuthenticationError('Login required');
      
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(AuthenticationError);
      expect(error.message).toBe('Login required');
      expect(error.name).toBe('AuthenticationError');
    });
    
    it('creates AuthenticationError with default message if none provided', () => {
      const error = new AuthenticationError();
      
      expect(error.message).toBe('Authentication required');
    });
  });
  
  describe('parseErrorResponse', () => {
    it('parses JSON error responses', async () => {
      const mockResponse = new Response(
        JSON.stringify({ message: 'Something went wrong', code: 'ERROR_CODE' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
      
      const error = await parseErrorResponse(mockResponse);
      
      expect(error).toBeInstanceOf(APIError);
      expect(error.message).toBe('Something went wrong');
      expect((error as APIError).status).toBe(500);
      expect((error as APIError).data).toHaveProperty('code', 'ERROR_CODE');
    });
    
    it('parses validation error responses', async () => {
      const mockResponse = new Response(
        JSON.stringify({
          message: 'Validation failed',
          errors: {
            email: ['Invalid email format'],
            password: ['Password too short']
          }
        }),
        {
          status: 422,
          headers: { 'Content-Type': 'application/json' }
        }
      );
      
      const error = await parseErrorResponse(mockResponse);
      
      expect(error).toBeInstanceOf(ValidationError);
      expect(error.message).toBe('Validation failed');
      expect((error as ValidationError).errors).toEqual({
        email: ['Invalid email format'],
        password: ['Password too short']
      });
    });
    
    it('parses authentication error responses', async () => {
      const mockResponse = new Response(
        JSON.stringify({ message: 'Authentication required' }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
      
      const error = await parseErrorResponse(mockResponse);
      
      expect(error).toBeInstanceOf(AuthenticationError);
      expect(error.message).toBe('Authentication required');
    });
    
    it('handles non-JSON responses', async () => {
      const mockResponse = new Response(
        'Internal server error',
        {
          status: 500,
          headers: { 'Content-Type': 'text/plain' }
        }
      );
      
      const error = await parseErrorResponse(mockResponse);
      
      expect(error).toBeInstanceOf(APIError);
      expect(error.message).toBe('Internal server error');
      expect((error as APIError).status).toBe(500);
    });
    
    it('handles JSON parsing errors', async () => {
      // Create a response with invalid JSON
      const mockResponse = new Response(
        'Invalid JSON content',
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
      
      const error = await parseErrorResponse(mockResponse);
      
      expect(error).toBeInstanceOf(APIError);
      expect((error as APIError).status).toBe(500);
    });
  });
  
  describe('retryWithBackoff', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });
    
    afterEach(() => {
      jest.useRealTimers();
    });
    
    it('returns the result if function succeeds on first try', async () => {
      const mockFn = jest.fn().mockResolvedValue('success');
      
      const resultPromise = retryWithBackoff(mockFn);
      
      // Fast-forward all timers to resolve any pending promises
      jest.runAllTimers();
      
      const result = await resultPromise;
      
      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(result).toBe('success');
    });
    
    it('retries the function on failure until success', async () => {
      const mockFn = jest.fn()
        .mockRejectedValueOnce(new Error('First try failed'))
        .mockRejectedValueOnce(new Error('Second try failed'))
        .mockResolvedValueOnce('success');
      
      const resultPromise = retryWithBackoff(mockFn, 3, 100);
      
      // First attempt fails
      await jest.advanceTimersByTimeAsync(0);
      expect(mockFn).toHaveBeenCalledTimes(1);
      
      // Wait for the first retry delay
      await jest.advanceTimersByTimeAsync(100);
      expect(mockFn).toHaveBeenCalledTimes(2);
      
      // Wait for the second retry delay (with exponential backoff)
      await jest.advanceTimersByTimeAsync(200);
      expect(mockFn).toHaveBeenCalledTimes(3);
      
      const result = await resultPromise;
      expect(result).toBe('success');
    });
    
    it('throws the error after all retries fail', async () => {
      const testError = new Error('Test error');
      const mockFn = jest.fn().mockRejectedValue(testError);
      
      const resultPromise = retryWithBackoff(mockFn, 2, 100);
      
      // First attempt fails
      await jest.advanceTimersByTimeAsync(0);
      
      // First retry fails
      await jest.advanceTimersByTimeAsync(100);
      
      // Second retry fails
      await jest.advanceTimersByTimeAsync(200);
      
      await expect(resultPromise).rejects.toThrow(testError);
      expect(mockFn).toHaveBeenCalledTimes(3); // Initial + 2 retries
    });
    
    it('uses the correct exponential backoff timing', async () => {
      const mockFn = jest.fn()
        .mockRejectedValueOnce(new Error('First try failed'))
        .mockRejectedValueOnce(new Error('Second try failed'))
        .mockRejectedValueOnce(new Error('Third try failed'))
        .mockResolvedValueOnce('success');
      
      const resultPromise = retryWithBackoff(mockFn, 3, 100);
      
      // First attempt
      await jest.advanceTimersByTimeAsync(0);
      expect(mockFn).toHaveBeenCalledTimes(1);
      
      // First retry after 100ms
      await jest.advanceTimersByTimeAsync(100);
      expect(mockFn).toHaveBeenCalledTimes(2);
      
      // Second retry after 200ms (2 * 100ms)
      await jest.advanceTimersByTimeAsync(200);
      expect(mockFn).toHaveBeenCalledTimes(3);
      
      // Third retry after 400ms (2 * 200ms)
      await jest.advanceTimersByTimeAsync(400);
      expect(mockFn).toHaveBeenCalledTimes(4);
      
      const result = await resultPromise;
      expect(result).toBe('success');
    });
  });
});