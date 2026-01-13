/**
 * Shared Fetcher Core
 * Core logic shared between server and client fetchers
 *
 * Features:
 * - Token refresh with request queue
 * - Auto-retry on 401 errors
 * - Response parsing and error handling
 */

import { useUserStore } from '@/store/useUserStore';
import type { ApiResponse, FetcherOptions, QueuedRequest, ServerFetchResult } from './types';

/**
 * Token refresh state
 * Prevents multiple concurrent refresh calls
 */
let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;
const requestQueue: QueuedRequest[] = [];

/**
 * Refresh access token
 * Uses request queue to handle concurrent refresh attempts
 *
 * @returns New access token or null if refresh failed
 */
export async function refreshAccessToken(): Promise<string | null> {
  // If already refreshing, return existing promise
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  isRefreshing = true;
  refreshPromise = performRefresh();

  try {
    const newToken = await refreshPromise;

    // Process all queued requests
    requestQueue.forEach(({ resolve }) => {
      if (newToken) resolve(newToken);
    });
    requestQueue.length = 0;

    return newToken;
  } catch (error) {
    // Reject all queued requests
    requestQueue.forEach(({ reject }) => {
      reject(new Error('Token refresh failed'));
    });
    requestQueue.length = 0;
    throw error;
  } finally {
    isRefreshing = false;
    refreshPromise = null;
  }
}

/**
 * Perform actual token refresh
 * Calls /api/auth/refresh endpoint
 */
async function performRefresh(): Promise<string | null> {
  try {
    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Refresh failed');
    }

    const data: ApiResponse<{ accessToken: string }> = await response.json();

    if (!data.success) {
      throw new Error(data.message);
    }

    // Update access token in store
    useUserStore.getState().setAccessToken(data.data.accessToken);

    return data.data.accessToken;
  } catch (error) {
    console.error('[Fetcher] Token refresh failed:', error);
    // Clear user state on refresh failure
    useUserStore.getState().clearUser();
    return null;
  }
}

/**
 * Queue a request during token refresh
 *
 * @returns Promise that resolves with new token
 */
export function queueRequest(): Promise<string> {
  return new Promise((resolve, reject) => {
    requestQueue.push({ resolve, reject });
  });
}

/**
 * Core fetch function with raw response
 * Returns both ApiResponse and raw Response for cookie forwarding
 *
 * @param endpoint - API endpoint URL
 * @param options - Fetch options
 * @param cookieString - Optional cookie string for SSR
 * @returns ApiResponse and raw Response
 */
export async function coreFetchRaw<T>(
  endpoint: string,
  options: FetcherOptions,
  cookieString?: string
): Promise<ServerFetchResult<T>> {
  // Build headers
  const headers: Record<string, string> = {
    // Only set Content-Type if not FormData
    ...(!(options.body instanceof FormData) && { 'Content-Type': 'application/json' }),
    ...options.headers,
  };

  // Attach access token if not skipped
  if (!options.skipAuth) {
    const token = useUserStore.getState().accessToken;
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  // Attach cookie for server-side requests
  if (cookieString) {
    headers['Cookie'] = cookieString;
  }

  // Prepare body
  const body =
    options.body instanceof FormData
      ? options.body // FormData as-is
      : options.body
        ? JSON.stringify(options.body) // JSON stringify for objects
        : undefined;

  // Make initial request
  let response = await fetch(endpoint, {
    method: options.method || 'GET',
    headers,
    body,
    credentials: 'include',
  });

  // Handle 401 - token expired
  if (response.status === 401 && !options.skipRefresh) {
    console.log('[Fetcher] 401 detected, refreshing token...');

    // If refresh in progress, queue this request
    if (isRefreshing) {
      console.log('[Fetcher] Refresh in progress, queuing request...');
      const newToken = await queueRequest();
      headers['Authorization'] = `Bearer ${newToken}`;
    } else {
      // Start new refresh
      const newToken = await refreshAccessToken();

      if (newToken) {
        headers['Authorization'] = `Bearer ${newToken}`;
      } else {
        // Refresh failed - return 401 error
        return {
          result: {
            success: false,
            status_code: 401,
            message: 'Phiên đăng nhập hết hạn',
            data: null as T,
          },
          rawResponse: response,
        };
      }
    }

    // Retry original request with new token
    console.log('[Fetcher] Retrying request with new token...');
    response = await fetch(endpoint, {
      method: options.method || 'GET',
      headers,
      body,
      credentials: 'include',
    });
  }

  // Parse and return response with raw Response
  const result = await parseResponse<T>(response);
  return {
    result,
    rawResponse: response,
  };
}

/**
 * Core fetch function
 * Shared logic for server and client fetchers
 *
 * @param endpoint - API endpoint URL
 * @param options - Fetch options
 * @param cookieString - Optional cookie string for SSR
 * @returns ApiResponse with typed data
 */
export async function coreFetch<T>(
  endpoint: string,
  options: FetcherOptions,
  cookieString?: string
): Promise<ApiResponse<T>> {
  // Build headers
  const headers: Record<string, string> = {
    // Only set Content-Type if not FormData
    ...(!(options.body instanceof FormData) && { 'Content-Type': 'application/json' }),
    ...options.headers,
  };

  // Attach access token if not skipped
  if (!options.skipAuth) {
    const token = useUserStore.getState().accessToken;
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  // Attach cookie for server-side requests
  if (cookieString) {
    headers['Cookie'] = cookieString;
  }

  // Prepare body
  const body =
    options.body instanceof FormData
      ? options.body // FormData as-is
      : options.body
        ? JSON.stringify(options.body) // JSON stringify for objects
        : undefined;

  // Make initial request
  let response = await fetch(endpoint, {
    method: options.method || 'GET',
    headers,
    body,
    credentials: 'include',
  });

  // Handle 401 - token expired
  if (response.status === 401 && !options.skipRefresh) {
    console.log('[Fetcher] 401 detected, refreshing token...');

    // If refresh in progress, queue this request
    if (isRefreshing) {
      console.log('[Fetcher] Refresh in progress, queuing request...');
      const newToken = await queueRequest();
      headers['Authorization'] = `Bearer ${newToken}`;
    } else {
      // Start new refresh
      const newToken = await refreshAccessToken();

      if (newToken) {
        headers['Authorization'] = `Bearer ${newToken}`;
      } else {
        // Refresh failed - return 401 error
        return {
          success: false,
          status_code: 401,
          message: 'Phiên đăng nhập hết hạn',
          data: null as T,
        };
      }
    }

    // Retry original request with new token
    console.log('[Fetcher] Retrying request with new token...');
    response = await fetch(endpoint, {
      method: options.method || 'GET',
      headers,
      body,
      credentials: 'include',
    });
  }

  // Parse and return response
  return parseResponse<T>(response);
}

/**
 * Parse fetch response into ApiResponse format
 *
 * @param response - Fetch Response object
 * @returns Standardized ApiResponse
 */
async function parseResponse<T>(response: Response): Promise<ApiResponse<T>> {
  try {
    const data = await response.json();

    // If response already in ApiResponse format
    if ('success' in data && 'status_code' in data) {
      return data as ApiResponse<T>;
    }

    // Convert to ApiResponse format
    return {
      success: response.ok,
      status_code: response.status,
      message: data.message || (response.ok ? 'Success' : 'Error'),
      data: data.data !== undefined ? data.data : data,
    };
  } catch (error) {
    // JSON parse error or network error
    return {
      success: false,
      status_code: response.status || 500,
      message: error instanceof Error ? error.message : 'Network error',
      data: null as T,
    };
  }
}
