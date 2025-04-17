import { QueryClient } from '@tanstack/react-query';

/**
 * Helper function to throw an error if the response is not ok
 * @param res The fetch response object
 * @throws Error with the response status text or a generic error message
 */
async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    let errorMessage;
    try {
      const data = await res.json();
      errorMessage = data.message || res.statusText || 'An error occurred';
    } catch {
      errorMessage = res.statusText || 'An error occurred';
    }
    
    const error = new Error(errorMessage);
    (error as any).status = res.status;
    throw error;
  }
}

/**
 * Helper function to make API requests
 * @param method The HTTP method
 * @param url The API URL
 * @param body The request body
 * @returns The fetch promise
 */
export async function apiRequest(
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  url: string,
  body?: any
): Promise<Response> {
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  };

  if (body && method !== 'GET') {
    options.body = JSON.stringify(body);
  }

  const res = await fetch(url, options);
  
  if (res.status === 401) {
    // Let the consumer handle unauthorized errors
    return res;
  }
  
  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";

/**
 * Factory function to create a query function for React Query
 * @param options Options for the query function
 * @returns A query function for React Query
 */
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => (url: string) => Promise<T | null> = ({ on401 }) => async (url) => {
  try {
    const res = await apiRequest('GET', url);
    
    if (res.status === 401) {
      if (on401 === 'throw') {
        throw new Error('Unauthorized');
      }
      return null;
    }
    
    return await res.json();
  } catch (error) {
    throw error;
  }
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});