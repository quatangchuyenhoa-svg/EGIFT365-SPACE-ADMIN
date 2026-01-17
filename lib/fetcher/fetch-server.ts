/**
 * Server-Side Fetcher
 * For use in SSR, API routes, and server components
 *
 * Features:
 * - Cookie forwarding for authentication
 * - Returns ApiResponse format
 * - Auto token refresh
 */

import { coreFetch, coreFetchRaw } from './shared-fetcher-core';
import type { ApiResponse, ServerFetcherOptions, ServerFetchResult } from './types';

/**
 * Server-side fetcher
 * Use in Next.js API routes and server components
 *
 * @param endpoint - API endpoint URL
 * @param options - Server fetcher options (includes cookie)
 * @returns Promise<ApiResponse<T>>
 *
 * @example
 * ```typescript
 * // In API route
 * export async function GET(request: NextRequest) {
 *   const cookie = request.headers.get('cookie');
 *   const result = await fetchServer<UserProfile>(
 *     '/api/user/profile',
 *     { method: 'GET', cookie: cookie || undefined }
 *   );
 *   return NextResponse.json(result, { status: result.status_code });
 * }
 * ```
 */
export async function fetchServer<T, TBody = unknown>(
  endpoint: string,
  options: ServerFetcherOptions<TBody> = {}
): Promise<ApiResponse<T>> {
  const { cookie, ...fetchOptions } = options;

  return coreFetch<T>(endpoint, fetchOptions, cookie);
}

/**
 * Server-side fetcher with raw response
 * Returns both ApiResponse and raw Response for cookie forwarding
 * Use in API routes that need to forward cookies
 *
 * @param endpoint - API endpoint URL
 * @param options - Server fetcher options (includes cookie)
 * @returns ApiResponse and raw Response
 *
 * @example
 * ```typescript
 * // In API route that needs cookie forwarding
 * export async function POST(request: NextRequest) {
 *   const cookie = request.headers.get('cookie');
 *   const { result, rawResponse } = await fetchServerRaw<UserProfile>(
 *     '/api/user/profile',
 *     { method: 'POST', body, cookie: cookie || undefined }
 *   );
 *
 *   const nextResponse = NextResponse.json(result, { status: result.status_code });
 *
 *   // Forward set-cookie header from backend
 *   const setCookie = rawResponse.headers.get('set-cookie');
 *   if (setCookie) {
 *     nextResponse.headers.set('set-cookie', setCookie);
 *   }
 *
 *   return nextResponse;
 * }
 * ```
 */
export async function fetchServerRaw<T, TBody = unknown>(
  endpoint: string,
  options: ServerFetcherOptions<TBody> = {}
): Promise<ServerFetchResult<T>> {
  const { cookie, ...fetchOptions } = options;

  return coreFetchRaw<T>(endpoint, fetchOptions, cookie);
}

/**
 * Convenience methods for server-side requests
 */
export const serverFetcher = {
  /**
   * GET request
   */
  get: <T>(endpoint: string, cookie?: string) =>
    fetchServer<T>(endpoint, { method: 'GET', cookie }),

  /**
   * POST request
   */
  post: <T, TBody = unknown>(endpoint: string, body: TBody, cookie?: string) =>
    fetchServer<T, TBody>(endpoint, { method: 'POST', body, cookie }),

  /**
   * PUT request
   */
  put: <T, TBody = unknown>(endpoint: string, body: TBody, cookie?: string) =>
    fetchServer<T, TBody>(endpoint, { method: 'PUT', body, cookie }),

  /**
   * DELETE request
   */
  delete: <T>(endpoint: string, cookie?: string) =>
    fetchServer<T>(endpoint, { method: 'DELETE', cookie }),

  /**
   * PATCH request
   */
  patch: <T, TBody = unknown>(endpoint: string, body: TBody, cookie?: string) =>
    fetchServer<T, TBody>(endpoint, { method: 'PATCH', body, cookie }),
};
