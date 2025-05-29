import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { APIError, ValidationError, AuthenticationError, parseErrorResponse } from "./errorHandling";
import { retryWithBackoff } from "./errorHandling";

/**
 * Check if a response is OK, throw appropriate typed error if not
 * @param res Response object to check
 * @throws APIError, ValidationError, or AuthenticationError
 */
async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    // Parse the error into appropriate type
    const error = await parseErrorResponse(res);
    throw error;
  }
}

/**
 * Make an API request with proper error handling
 * @param method HTTP method
 * @param url API endpoint URL
 * @param data Optional request payload
 * @param retries Number of times to retry on failure (default: 1)
 * @returns Response object
 */
export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
  retries: number = 1
): Promise<Response> {
  // Use the retry with backoff utility for potentially transient errors
  return retryWithBackoff(async () => {
    const res = await fetch(url, {
      method,
      headers: data ? { "Content-Type": "application/json" } : {},
      body: data ? JSON.stringify(data) : undefined,
      credentials: "include",
    });

    await throwIfResNotOk(res);
    return res;
  }, retries);
}

/**
 * Behavior to apply when receiving a 401 unauthorized response
 */
type UnauthorizedBehavior = "returnNull" | "throw";

/**
 * Create a React Query query function with proper error handling
 * @param options Configuration options
 * @returns Query function that can be used with useQuery
 */
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    try {
      const res = await retryWithBackoff(async () => {
        return await fetch(queryKey[0] as string, {
          credentials: "include",
        });
      }, 1); // One retry for transient network issues

      // Handle 401 according to specified behavior
      if (unauthorizedBehavior === "returnNull" && res.status === 401) {
        return null;
      }

      // Check for errors and parse response
      await throwIfResNotOk(res);
      return await res.json();
    } catch (error) {
      // Re-throw API errors as is
      if (error instanceof APIError || 
          error instanceof ValidationError || 
          error instanceof AuthenticationError) {
        throw error;
      }
      
      // Wrap other errors
      throw new Error(`Query failed for ${queryKey[0]}: ${(error as Error).message}`);
    }
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
