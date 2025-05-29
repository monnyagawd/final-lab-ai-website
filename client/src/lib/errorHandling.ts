/**
 * Error handling utilities for Lab AI frontend
 * This module provides error handling and reporting functions for the client
 */

import { useToast } from "@/hooks/use-toast";

/**
 * Custom API error with status code and optional data
 */
export class APIError extends Error {
  status: number;
  data?: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.data = data;
  }
}

/**
 * Custom validation error with structured validation errors
 */
export class ValidationError extends Error {
  errors: Record<string, string[]>;

  constructor(message: string, errors: Record<string, string[]>) {
    super(message);
    this.name = 'ValidationError';
    this.errors = errors;
  }
}

/**
 * Authentication error for unauthorized access
 */
export class AuthenticationError extends Error {
  constructor(message: string = 'Authentication required') {
    super(message);
    this.name = 'AuthenticationError';
  }
}

/**
 * Display an error toast notification
 * @param error Error object or message string
 * @param title Optional title for the toast
 */
export function displayErrorToast(error: Error | string, title: string = 'Error'): void {
  const { toast } = useToast();
  const message = typeof error === 'string' ? error : error.message;
  
  toast({
    title,
    description: message,
    variant: 'destructive',
  });
}

/**
 * Handle API errors with appropriate user feedback
 * @param error Error object to handle
 * @param customHandler Optional custom handler for specific error cases
 */
export function handleAPIError(
  error: Error,
  customHandler?: (error: APIError) => boolean
): void {
  console.error('API Error:', error);

  // If it's an API error and we have a custom handler
  if (error instanceof APIError && customHandler) {
    // If the custom handler returns true, it was handled
    if (customHandler(error)) {
      return;
    }
  }

  // Default error handling
  if (error instanceof APIError) {
    switch (error.status) {
      case 401:
        displayErrorToast('Please log in to continue', 'Authentication Required');
        // Could also redirect to login page if needed
        // window.location.href = '/auth';
        break;
        
      case 403:
        displayErrorToast('You don\'t have permission to perform this action', 'Access Denied');
        break;
        
      case 404:
        displayErrorToast('The requested resource was not found', 'Not Found');
        break;
        
      case 422:
        if (error.data && typeof error.data === 'object') {
          // Handle validation errors
          const validationErrors = formatValidationErrors(error.data);
          displayErrorToast(
            Object.values(validationErrors).flat().join('\n'),
            'Validation Error'
          );
        } else {
          displayErrorToast(error.message);
        }
        break;
        
      case 429:
        displayErrorToast('Too many requests. Please try again later.', 'Rate Limited');
        break;
        
      case 500:
      case 502:
      case 503:
      case 504:
        displayErrorToast('The server encountered an error. Please try again later.', 'Server Error');
        break;
        
      default:
        displayErrorToast(error.message);
    }
  } else if (error instanceof ValidationError) {
    // Format and display validation errors
    const errorMessages = Object.values(error.errors).flat().join('\n');
    displayErrorToast(errorMessages, 'Validation Error');
  } else if (error instanceof AuthenticationError) {
    displayErrorToast(error.message, 'Authentication Required');
    // Could also redirect to login page if needed
    // window.location.href = '/auth';
  } else {
    // Generic error handling
    displayErrorToast(error.message);
  }
}

/**
 * Format validation errors into a user-friendly object
 * @param errors Raw validation errors
 * @returns Formatted validation errors
 */
export function formatValidationErrors(
  errors: Record<string, any>
): Record<string, string[]> {
  const formattedErrors: Record<string, string[]> = {};

  // Process the error object
  Object.entries(errors).forEach(([field, error]) => {
    if (field === '_errors' && Array.isArray(error)) {
      formattedErrors['general'] = error;
    } else if (typeof error === 'object' && error !== null) {
      if (Array.isArray(error._errors)) {
        formattedErrors[field] = error._errors;
      } else if (typeof error._errors === 'string') {
        formattedErrors[field] = [error._errors];
      }
    }
  });

  return formattedErrors;
}

/**
 * Parse error response from API
 * @param response Response object from fetch
 * @returns Error object with appropriate type
 */
export async function parseErrorResponse(response: Response): Promise<Error> {
  // Try to parse the error response
  try {
    const contentType = response.headers.get('content-type');
    
    if (contentType?.includes('application/json')) {
      const data = await response.json();
      const message = data.message || response.statusText || 'An error occurred';
      
      if (response.status === 422 || response.status === 400) {
        if (data.errors) {
          return new ValidationError(message, data.errors);
        }
      }
      
      if (response.status === 401) {
        return new AuthenticationError(message);
      }
      
      return new APIError(message, response.status, data);
    }
    
    // Non-JSON response
    const text = await response.text();
    return new APIError(
      text || response.statusText || 'An error occurred',
      response.status
    );
  } catch (error) {
    // Fallback if parsing fails
    return new APIError(
      response.statusText || 'Failed to parse error response',
      response.status
    );
  }
}

/**
 * Global error handler for unexpected errors
 * @param error Error object
 * @param info Additional error info
 */
export function globalErrorHandler(error: Error, info: any): void {
  console.error('Uncaught error:', error, info);
  
  // Log to monitoring service if available
  // logErrorToMonitoringService(error, info);
  
  // Display user-friendly error
  displayErrorToast(
    'Something went wrong. Our team has been notified.',
    'Unexpected Error'
  );
}

/**
 * Retry a function with exponential backoff
 * @param fn Function to retry
 * @param retries Maximum number of retries
 * @param delay Initial delay in ms
 * @returns Result of the function
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  retries: number = 3,
  delay: number = 300
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 0) {
      throw error;
    }
    
    // Wait with exponential backoff
    await new Promise(resolve => setTimeout(resolve, delay));
    
    // Retry with increased delay
    return retryWithBackoff(fn, retries - 1, delay * 2);
  }
}