/**
 * Shared Fetcher Core
 * Core logic shared between server and client fetchers
 *
 * Features:
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
let refreshPromise: Promise<{ success: boolean; cookies?: string }> | null = null;
const requestQueue: QueuedRequest[] = [];

/**
 * Resolve full URL from endpoint
 * - If endpoint is relative (/api/...) → prefix with BASE_URL
 * - If endpoint is absolute (http://...) → use as-is
 *
 * @param endpoint - Relative or absolute URL
 * @returns Full URL
 */
function resolveUrl(endpoint: string): string {
  // Already absolute URL
  if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
    return endpoint;
  }

  // Relative URL → prefix with BASE_URL
  // If running in browser and targeting Next.js API route, keep same-origin path
  // so the request goes to the application domain (so cookies can be set for that domain).
  // Server-side should still prefix with BASE_URL to call backend directly.
  if (typeof window !== 'undefined' && endpoint.startsWith('/api/')) {
    return endpoint;
  }

  return `${API_CONFIG.BASE_URL}${endpoint}`;
}

/**
 * Refresh access token
 * Uses request queue to handle concurrent refresh attempts
 *
 * @returns { success: boolean; cookies?: string } - success status and new cookies for server-side
 */
export async function refreshAccessToken(): Promise<{ success: boolean; cookies?: string }> {
  // If already refreshing, return existing promise
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  isRefreshing = true;
  refreshPromise = performRefresh();

  try {
    const result = await refreshPromise;

    // Process all queued requests
    requestQueue.forEach(({ resolve, reject }) => {
      if (result.success) resolve(result);
      else reject(new Error('Token refresh failed'));
    });
    requestQueue.length = 0;

    return result;
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
 * Calls /api/auth/refresh endpoint
 * Access token is set in httpOnly cookie by backend
 */
async function performRefresh(): Promise<{ success: boolean; cookies?: string }> {
  try {
    // Use relative URL - works in browser, auto-resolves to current origin
    // For SSR, this will be called from Next.js API route which handles the request
    const refreshEndpoint = typeof window !== 'undefined'
      ? API_CONFIG.ENDPOINTS.AUTH.REFRESH // Client-side: relative URL
      : `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.REFRESH}`; // Server-side: full URL

    const response = await fetch(refreshEndpoint, {
      method: 'POST',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Refresh failed');
    }

    const data: ApiResponse<{ accessToken: string; cookies?: { accessTokenCookie: string; refreshTokenCookie: string } }> = await response.json();

    if (!data.success) {
      throw new Error(data.message);
    }

    // Extract cookies for server-side retry
    let cookies: string | undefined;
    if (data.data.cookies) {
      // For server-side, construct cookie string from response data
      const accessToken = response.headers.get('set-cookie')?.split(';')[0]?.split('=')[1];
      const refreshToken = response.headers.get('set-cookie')?.split(';')[0]?.split('=')[1];
      if (accessToken && refreshToken) {
        cookies = `${data.data.cookies.accessTokenCookie}=${accessToken}; ${data.data.cookies.refreshTokenCookie}=${refreshToken}`;
      }
    }

    return { success: true, cookies };
  } catch (error) {
    console.error('[Fetcher] Token refresh failed:', error);
    // Clear user state on refresh failure
    useUserStore.getState().clearUser();
    return { success: false };
  }
}

/**
 * @returns Promise that resolves when refresh completes
 */
export function queueRequest(): Promise<{ success: boolean; cookies?: string }> {
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
  // If running in the browser and a full BASE_URL is used, convert to same-origin path
  // so requests go to the application domain (Next.js API routes) and cookies set by the app
  // are applied to the app domain (staging/production).
  if (typeof window !== 'undefined' && endpoint.startsWith(API_CONFIG.BASE_URL)) {
    endpoint = endpoint.slice(API_CONFIG.BASE_URL.length) || '/';
  }
  // Build headers
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
  const fullUrl = resolveUrl(endpoint);
  let response = await fetch(fullUrl, {
    method: options.method || 'GET',
    headers,
    body,
    credentials: 'include',
  });

  // Handle 401 - token expired, try refresh (client-side OR server-side with cookies)
  if (response.status === 401 && !options.skipRefresh && (typeof window !== 'undefined' || cookieString)) {
    // If refresh in progress, queue this request
    if (isRefreshing) {
      await queueRequest();
    } else {
      // Start new refresh
      const refreshResult = await refreshAccessToken();

      if (!refreshResult.success) {
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

      // Update cookie header for retry if cookies provided (server-side)
      if (refreshResult.cookies && cookieString) {
        headers['Cookie'] = refreshResult.cookies;
      }
    }

    // Retry original request - new access token is in cookie
    response = await fetch(fullUrl, {
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
  // If running in the browser and a full BASE_URL is used, convert to same-origin path
  if (typeof window !== 'undefined' && endpoint.startsWith(API_CONFIG.BASE_URL)) {
    endpoint = endpoint.slice(API_CONFIG.BASE_URL.length) || '/';
  }
  // Build headers
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
  const fullUrl = resolveUrl(endpoint);
  let response = await fetch(fullUrl, {
    method: options.method || 'GET',
    headers,
    body,
    credentials: 'include',
  });

  // Handle 401 - token expired, try refresh (client-side OR server-side with cookies)
  if (response.status === 401 && !options.skipRefresh && (typeof window !== 'undefined' || cookieString)) {
    // If refresh in progress, queue this request
    if (isRefreshing) {
      await queueRequest();
    } else {
      // Start new refresh
      const refreshResult = await refreshAccessToken();

      if (!refreshResult.success) {
        // Refresh failed - return 401 error
        return {
          success: false,
          status_code: 401,
          message: 'Phiên đăng nhập hết hạn',
          data: null as T,
        };
      }

      // Update cookie header for retry if cookies provided (server-side)
      if (refreshResult.cookies && cookieString) {
        headers['Cookie'] = refreshResult.cookies;
      }
    }

    // Retry original request
    response = await fetch(fullUrl, {
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
