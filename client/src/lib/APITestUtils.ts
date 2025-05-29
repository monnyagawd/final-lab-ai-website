/**
 * API testing utilities for Lab AI
 * This module provides utilities for testing API endpoints and integration
 */

import { queryClient } from './queryClient';
import { AuthenticationError, APIError, ValidationError } from './errorHandling';
import { setupTest, mockAPIResponse } from './testSetup';

/**
 * Test API query with success response
 * @param endpoint API endpoint to test
 * @param mockData Mock data to return
 * @param options Additional options
 */
export async function testQuerySuccess<T>(
  endpoint: string,
  mockData: T,
  options: {
    validateResponse?: (data: T) => void;
    queryFn?: () => Promise<T>;
  } = {}
): Promise<void> {
  // Setup test environment
  const cleanup = setupTest();
  
  try {
    // Mock API response
    mockAPIResponse(endpoint, mockData);
    
    // Create query function or use default
    const fetchData = options.queryFn || async () => {
      const res = await fetch(endpoint, { credentials: 'include' });
      if (!res.ok) {
        throw new Error('API request failed');
      }
      return await res.json();
    };
    
    // Execute query
    const data = await fetchData();
    
    // Validate results
    expect(data).toEqual(mockData);
    
    // Run custom validation if provided
    if (options.validateResponse) {
      options.validateResponse(data);
    }
  } finally {
    // Clean up test environment
    cleanup();
  }
}

/**
 * Test API query with error response
 * @param endpoint API endpoint to test
 * @param errorResponse Error response to mock
 * @param options Additional options
 */
export async function testQueryError(
  endpoint: string,
  errorResponse: { message: string; status: number; data?: any },
  options: {
    expectedErrorType?: 'api' | 'validation' | 'authentication';
    validateError?: (error: Error) => void;
    queryFn?: () => Promise<any>;
  } = {}
): Promise<void> {
  // Setup test environment
  const cleanup = setupTest();
  
  try {
    // Mock API error response
    mockAPIResponse(endpoint, errorResponse, errorResponse.status);
    
    // Create query function or use default
    const fetchData = options.queryFn || async () => {
      const res = await fetch(endpoint, { credentials: 'include' });
      if (!res.ok) {
        const data = await res.json();
        
        // Create appropriate error type
        if (res.status === 401) {
          throw new AuthenticationError(data.message);
        }
        
        if (res.status === 422 && data.errors) {
          throw new ValidationError(data.message, data.errors);
        }
        
        throw new APIError(data.message, res.status, data);
      }
      return await res.json();
    };
    
    // Execute query and expect it to throw
    await expect(fetchData()).rejects.toThrow();
    
    // Try to execute and catch error for additional validation
    try {
      await fetchData();
    } catch (error) {
      // Validate error type if specified
      if (options.expectedErrorType === 'api') {
        expect(error).toBeInstanceOf(APIError);
      } else if (options.expectedErrorType === 'validation') {
        expect(error).toBeInstanceOf(ValidationError);
      } else if (options.expectedErrorType === 'authentication') {
        expect(error).toBeInstanceOf(AuthenticationError);
      }
      
      // Run custom validation if provided
      if (options.validateError) {
        options.validateError(error as Error);
      }
    }
  } finally {
    // Clean up test environment
    cleanup();
  }
}

/**
 * Test API mutation with success response
 * @param endpoint API endpoint to test
 * @param inputData Data to send in the request
 * @param responseData Data to mock in the response
 * @param options Additional options
 */
export async function testMutationSuccess<T, R>(
  endpoint: string,
  inputData: T,
  responseData: R,
  options: {
    method?: string;
    validateResponse?: (data: R) => void;
    validateRequest?: (requestBody: T) => void;
    mutationFn?: (data: T) => Promise<R>;
  } = {}
): Promise<void> {
  // Setup test environment
  const cleanup = setupTest();
  
  try {
    // Track if the request was made with correct body
    let requestBodyValidated = false;
    
    // Mock fetch to intercept and validate request
    global.fetch = jest.fn().mockImplementation((url: string, init?: RequestInit) => {
      if (url.includes(endpoint)) {
        // Validate request method
        expect(init?.method || 'GET').toBe(options.method || 'POST');
        
        // Validate headers and body if present
        if (init?.body) {
          const requestBody = JSON.parse(init.body as string);
          expect(requestBody).toEqual(inputData);
          
          // Run custom validation if provided
          if (options.validateRequest) {
            options.validateRequest(requestBody);
          }
          
          requestBodyValidated = true;
        }
        
        // Return mock response
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve(responseData),
          text: () => Promise.resolve(JSON.stringify(responseData)),
          headers: new Headers({ 'Content-Type': 'application/json' })
        } as Response);
      }
      
      // Return 404 for unmatched URLs
      return Promise.resolve({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: () => Promise.resolve({ message: 'Not found' }),
        text: () => Promise.resolve('Not found'),
        headers: new Headers({ 'Content-Type': 'application/json' })
      } as Response);
    });
    
    // Create mutation function or use default
    const executeMutation = options.mutationFn || async (data: T) => {
      const res = await fetch(endpoint, {
        method: options.method || 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include'
      });
      
      if (!res.ok) {
        throw new Error('API request failed');
      }
      
      return await res.json();
    };
    
    // Execute mutation
    const result = await executeMutation(inputData);
    
    // Validate results
    expect(result).toEqual(responseData);
    expect(requestBodyValidated).toBe(true);
    
    // Run custom validation if provided
    if (options.validateResponse) {
      options.validateResponse(result);
    }
  } finally {
    // Clean up test environment
    cleanup();
  }
}

/**
 * Helper to test React Query's useQuery hook behavior
 * @param queryKey Query key to test
 * @param mockData Mock data to return
 * @param options Additional options
 */
export function testUseQueryHook<T>(
  queryKey: string | readonly unknown[],
  mockData: T,
  options: {
    initialData?: T;
    isPaginated?: boolean;
    queryFn?: () => Promise<T>;
  } = {}
): void {
  // Clear query client
  queryClient.clear();
  
  // Convert queryKey to array if it's a string
  const normalizedQueryKey = typeof queryKey === 'string' ? [queryKey] : queryKey;
  
  // Set mock data as query data
  queryClient.setQueryData(normalizedQueryKey, mockData);
  
  // Validate that the data is correctly set
  const cachedData = queryClient.getQueryData<T>(normalizedQueryKey);
  expect(cachedData).toEqual(mockData);
  
  // If paginated, check pagination data structure
  if (options.isPaginated) {
    expect(cachedData).toHaveProperty('pages');
    expect(cachedData).toHaveProperty('pageParams');
  }
}

/**
 * Add predefined API mocks for common endpoints
 */
export function setupCommonAPIMocks(): void {
  // Mock authentication endpoints
  mockAPIResponse('/api/login', { id: 1, username: 'testuser', email: 'test@example.com' });
  mockAPIResponse('/api/register', { id: 1, username: 'testuser', email: 'test@example.com' });
  mockAPIResponse('/api/logout', { success: true });
  
  // Mock user profile endpoint
  mockAPIResponse('/api/user', { 
    id: 1, 
    username: 'testuser', 
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    role: 'customer'
  });
  
  // Add more common endpoints as needed
}