/**
 * Shared Fetcher Core
 * Core logic shared between server and client fetchers
 *
 * Features:
 * - httpOnly cookie-based authentication (access token in cookie)
 * - Token refresh with request queue
 * - Auto-retry on 401 errors
 * - Response parsing and error handling
 */

import { API_CONFIG } from '@/lib/api-config';
import { useUserStore } from '@/store/useUserStore';
import type { ApiResponse, FetcherOptions, QueuedRequest, ServerFetchResult } from './types';

/**
 * Token refresh state
 * Prevents multiple concurrent refresh calls
 */
let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;
const requestQueue: QueuedRequest[] = [];

/**
 * Refresh access token
 * Uses request queue to handle concurrent refresh attempts
 * Access token is set in httpOnly cookie by backend, no need to store in memory
 *
 * @param cookieString - Optional cookie string for server-side requests
 * @returns true if refresh succeeded, false otherwise
 */
export async function refreshAccessToken(cookieString?: string): Promise<boolean> {
  // If already refreshing, return existing promise
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  isRefreshing = true;
  refreshPromise = performRefresh(cookieString);

  try {
    const success = await refreshPromise;

    // Process all queued requests
    requestQueue.forEach(({ resolve, reject }) => {
      if (success) resolve(true);
      else reject(new Error('Token refresh failed'));
    });
    requestQueue.length = 0;

    return success;
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
 * Access token is set in httpOnly cookie by backend
 */
async function performRefresh(cookieString?: string): Promise<boolean> {
  try {
    // Use relative URL for client-side, full URL for server-side
    const refreshEndpoint = typeof window !== 'undefined'
      ? API_CONFIG.ENDPOINTS.AUTH.REFRESH
      : `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.REFRESH}`;

    const headers: Record<string, string> = {};

    // Forward cookie for server-side requests
    if (cookieString) {
      headers['Cookie'] = cookieString;
    }

    const response = await fetch(refreshEndpoint, {
      method: 'POST',
      headers,
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Refresh failed');
    }

    const data: ApiResponse<object> = await response.json();

    if (!data.success) {
      throw new Error(data.message);
    }

    // Access token is now in httpOnly cookie, no need to store in memory
    console.log('[Fetcher] Token refresh successful');
    return true;
  } catch (error) {
    console.error('[Fetcher] Token refresh failed:', error);
    // Clear user state on refresh failure
    useUserStore.getState().clearUser();
    return false;
  }
}

/**
 * Queue a request during token refresh
 *
 * @returns Promise that resolves when refresh completes
 */
export function queueRequest(): Promise<boolean> {
  return new Promise((resolve, reject) => {
    requestQueue.push({ resolve, reject });
  });
}

/**
 * Core fetch function with raw response
 * Returns both ApiResponse and raw Response for cookie forwarding
 * Uses httpOnly cookies for authentication (no Authorization header needed)
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
  // If running in the browser and a full BASE_URL is used, convert to same-origin path
  // so requests go to the application domain (Next.js API routes) and cookies set by the app
  // are applied to the app domain (staging/production).
  if (typeof window !== 'undefined' && endpoint.startsWith(API_CONFIG.BASE_URL)) {
    endpoint = endpoint.slice(API_CONFIG.BASE_URL.length) || '/';
  }
  // Build headers - no Authorization header needed, access token is in httpOnly cookie
  const headers: Record<string, string> = {
    // Only set Content-Type if not FormData
    ...(!(options.body instanceof FormData) && { 'Content-Type': 'application/json' }),
    ...options.headers,
  };

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
  let response: Response;
  try {
    response = await fetch(endpoint, {
      method: options.method || 'GET',
      headers,
      body,
      credentials: 'include', // Send cookies with request
    });
  } catch (error) {
    // Network error (backend not running, CORS, etc.)
    console.error('[Fetcher] Network error:', error);
    return {
      result: {
        success: false,
        status_code: 0,
        message: error instanceof Error ? error.message : 'Network error - backend may not be running',
        data: null as T,
      },
      rawResponse: new Response(null, { status: 0 }),
    };
  }

  // Handle 401 - token expired, try refresh
  if (response.status === 401 && !options.skipRefresh) {
    console.log('[Fetcher] 401 detected, refreshing token...');

    // If refresh in progress, queue this request
    if (isRefreshing) {
      console.log('[Fetcher] Refresh in progress, queuing request...');
      await queueRequest();
    } else {
      // Start new refresh - pass cookieString for server-side requests
      const success = await refreshAccessToken(cookieString);

      if (!success) {
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

    // Retry original request - new access token is in cookie
    console.log('[Fetcher] Retrying request after token refresh...');
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
 * Uses httpOnly cookies for authentication (no Authorization header needed)
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
  // If running in the browser and a full BASE_URL is used, convert to same-origin path
  if (typeof window !== 'undefined' && endpoint.startsWith(API_CONFIG.BASE_URL)) {
    endpoint = endpoint.slice(API_CONFIG.BASE_URL.length) || '/';
  }
  // Build headers - no Authorization header needed, access token is in httpOnly cookie
  const headers: Record<string, string> = {
    // Only set Content-Type if not FormData
    ...(!(options.body instanceof FormData) && { 'Content-Type': 'application/json' }),
    ...options.headers,
  };

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
  let response: Response;
  try {
    response = await fetch(endpoint, {
      method: options.method || 'GET',
      headers,
      body,
      credentials: 'include', // Send cookies with request
    });
  } catch (error) {
    // Network error (backend not running, CORS, etc.)
    console.error('[Fetcher] Network error:', error);
    return {
      success: false,
      status_code: 0,
      message: error instanceof Error ? error.message : 'Network error - backend may not be running',
      data: null as T,
    };
  }

  // Handle 401 - token expired, try refresh
  if (response.status === 401 && !options.skipRefresh) {
    console.log('[Fetcher] 401 detected, refreshing token...');

    // If refresh in progress, queue this request
    if (isRefreshing) {
      console.log('[Fetcher] Refresh in progress, queuing request...');
      await queueRequest();
    } else {
      // Start new refresh - pass cookieString for server-side requests
      const success = await refreshAccessToken(cookieString);

      if (!success) {
        // Refresh failed - return 401 error
        return {
          success: false,
          status_code: 401,
          message: 'Phiên đăng nhập hết hạn',
          data: null as T,
        };
      }
    }

    // Retry original request - new access token is in cookie
    console.log('[Fetcher] Retrying request after token refresh...');
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
