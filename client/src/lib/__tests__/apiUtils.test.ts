/**
 * Tests for API utilities
 */

import { APIError, AuthenticationError, ValidationError } from '../errorHandling';
import { queryClient, apiRequest, getQueryFn } from '../queryClient';

// Mock fetch
global.fetch = jest.fn();

describe('API utilities', () => {
  beforeEach(() => {
    // Reset mocks
    jest.resetAllMocks();
    
    // Clear query client
    queryClient.clear();
  });
  
  describe('apiRequest function', () => {
    it('makes a request with the correct parameters', async () => {
      // Mock a successful response
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({ data: 'test' })
      };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);
      
      // Test GET request
      await apiRequest('GET', '/api/test');
      
      // Verify fetch was called correctly
      expect(global.fetch).toHaveBeenCalledWith('/api/test', {
        method: 'GET',
        headers: {},
        body: undefined,
        credentials: 'include'
      });
      
      // Test POST request with data
      const testData = { name: 'test' };
      await apiRequest('POST', '/api/test', testData);
      
      // Verify fetch was called correctly
      expect(global.fetch).toHaveBeenCalledWith('/api/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testData),
        credentials: 'include'
      });
    });
    
    it('throws an error for non-OK responses', async () => {
      // Mock an error response
      const errorData = { message: 'Not found' };
      const mockResponse = {
        ok: false,
        status: 404,
        statusText: 'Not Found',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        json: jest.fn().mockResolvedValue(errorData),
        text: jest.fn().mockResolvedValue(JSON.stringify(errorData))
      };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);
      
      // Expect apiRequest to throw
      await expect(apiRequest('GET', '/api/test')).rejects.toThrow();
      
      // Verify fetch was called
      expect(global.fetch).toHaveBeenCalled();
    });
    
    it('retries the request on failure', async () => {
      // Mock a failed response followed by a successful one
      const errorResponse = {
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        json: jest.fn().mockResolvedValue({ message: 'Server error' }),
        text: jest.fn().mockResolvedValue('Server error')
      };
      
      const successResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({ data: 'test' })
      };
      
      // First call fails, second succeeds
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce(errorResponse)
        .mockResolvedValueOnce(successResponse);
      
      // Use Jest's fake timers to control setTimeout
      jest.useFakeTimers();
      
      // Start the request (will fail first time)
      const requestPromise = apiRequest('GET', '/api/test', undefined, 1);
      
      // Fast-forward timers to trigger retry
      jest.runAllTimers();
      
      // Resolve the request
      const response = await requestPromise;
      
      // Verify fetch was called twice
      expect(global.fetch).toHaveBeenCalledTimes(2);
      
      // Restore real timers
      jest.useRealTimers();
    });
  });
  
  describe('getQueryFn function', () => {
    it('returns null for 401 responses when configured to do so', async () => {
      // Create the query function with returnNull behavior
      const queryFn = getQueryFn<any>({ on401: 'returnNull' });
      
      // Mock a 401 response
      const mockResponse = {
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        json: jest.fn().mockResolvedValue({ message: 'Not authenticated' }),
        text: jest.fn().mockResolvedValue('Not authenticated')
      };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);
      
      // Execute the query function
      const result = await queryFn({ queryKey: ['/api/user'] } as any);
      
      // Verify the result is null
      expect(result).toBeNull();
      
      // Verify fetch was called
      expect(global.fetch).toHaveBeenCalledWith('/api/user', {
        credentials: 'include'
      });
    });
    
    it('throws for 401 responses when configured to throw', async () => {
      // Create the query function with throw behavior
      const queryFn = getQueryFn<any>({ on401: 'throw' });
      
      // Mock a 401 response
      const mockResponse = {
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        json: jest.fn().mockResolvedValue({ message: 'Not authenticated' }),
        text: jest.fn().mockResolvedValue('Not authenticated')
      };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);
      
      // Execute the query function and expect it to throw
      await expect(queryFn({ queryKey: ['/api/user'] } as any)).rejects.toThrow();
      
      // Verify fetch was called
      expect(global.fetch).toHaveBeenCalledWith('/api/user', {
        credentials: 'include'
      });
    });
    
    it('returns data for successful responses', async () => {
      // Create the query function
      const queryFn = getQueryFn<any>({ on401: 'throw' });
      
      // Mock a successful response
      const mockData = { id: 1, username: 'testuser' };
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(mockData)
      };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);
      
      // Execute the query function
      const result = await queryFn({ queryKey: ['/api/user'] } as any);
      
      // Verify the result matches the mock data
      expect(result).toEqual(mockData);
      
      // Verify fetch was called
      expect(global.fetch).toHaveBeenCalledWith('/api/user', {
        credentials: 'include'
      });
    });
    
    it('handles and rethrows typed errors', async () => {
      // Create the query function
      const queryFn = getQueryFn<any>({ on401: 'throw' });
      
      // Mock an error that will be parsed as a validation error
      const errorData = {
        message: 'Validation failed',
        errors: {
          username: ['Username is required']
        }
      };
      
      const mockResponse = {
        ok: false,
        status: 422,
        statusText: 'Unprocessable Entity',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        json: jest.fn().mockResolvedValue(errorData),
        text: jest.fn().mockResolvedValue(JSON.stringify(errorData))
      };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);
      
      // Execute the query function and expect it to throw a ValidationError
      try {
        await queryFn({ queryKey: ['/api/user'] } as any);
        fail('Query function should have thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        expect((error as ValidationError).errors).toEqual({
          username: ['Username is required']
        });
      }
    });
  });
});