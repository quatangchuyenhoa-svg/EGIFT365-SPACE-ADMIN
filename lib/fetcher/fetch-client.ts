/**
 * Client-Side Fetcher
 * For use in React components and React Query hooks
 *
 * Features:
 * - Throws errors for React Query error handling
 * - Auto token refresh
 * - Type-safe with generics
 */

import { coreFetch } from './shared-fetcher-core';
import type { ApiResponse, FetcherOptions } from './types';

/**
 * Client-side fetcher (throws on error)
 * Use with React Query hooks
 *
 * @param endpoint - API endpoint URL
 * @param options - Fetcher options
 * @returns Promise<T> - Response data (not wrapped in ApiResponse)
 * @throws Error with message on failure
 *
 * @example
 * ```typescript
 * // In service file
 * export async function getUserProfile() {
 *   return fetchClient<UserProfile>('/api/user/profile');
 * }
 *
 * // In React Query hook
 * export function useUserProfile() {
 *   return useQuery({
 *     queryKey: ['user', 'profile'],
 *     queryFn: getUserProfile,
 *   });
 * }
 * ```
 */
export async function fetchClient<T, TBody = unknown>(
  endpoint: string,
  options: FetcherOptions<TBody> = {}
): Promise<T> {
  const result = await coreFetch<T>(endpoint, options);

  // Throw error for React Query
  if (!result.success) {
    throw new Error(result.message);
  }

  return result.data;
}

/**
 * Raw client fetcher (returns ApiResponse)
 * Use when you need full response control
 *
 * @param endpoint - API endpoint URL
 * @param options - Fetcher options
 * @returns Promise<ApiResponse<T>>
 *
 * @example
 * ```typescript
 * const response = await fetchClientRaw<UserProfile>('/api/user/profile');
 * if (response.success) {
 *   console.log(response.data);
 * } else {
 *   console.error(response.message);
 * }
 * ```
 */
export async function fetchClientRaw<T, TBody = unknown>(
  endpoint: string,
  options: FetcherOptions<TBody> = {}
): Promise<ApiResponse<T>> {
  return coreFetch<T>(endpoint, options);
}

/**
 * Convenience methods for client-side requests
 * All methods throw on error for React Query
 */
export const clientFetcher = {
  /**
   * GET request (throws on error)
   */
  get: <T>(endpoint: string, options?: Omit<FetcherOptions, 'method' | 'body'>) =>
    fetchClient<T>(endpoint, { ...options, method: 'GET' }),

  /**
   * POST request (throws on error)
   */
  post: <T, TBody = unknown>(endpoint: string, body?: TBody, options?: Omit<FetcherOptions<TBody>, 'method' | 'body'>) =>
    fetchClient<T, TBody>(endpoint, { ...options, method: 'POST', body }),

  /**
   * PUT request (throws on error)
   */
  put: <T, TBody = unknown>(endpoint: string, body?: TBody, options?: Omit<FetcherOptions<TBody>, 'method' | 'body'>) =>
    fetchClient<T, TBody>(endpoint, { ...options, method: 'PUT', body }),

  /**
   * DELETE request (throws on error)
   */
  delete: <T>(endpoint: string, options?: Omit<FetcherOptions, 'method' | 'body'>) =>
    fetchClient<T>(endpoint, { ...options, method: 'DELETE' }),

  /**
   * PATCH request (throws on error)
   */
  patch: <T, TBody = unknown>(endpoint: string, body?: TBody, options?: Omit<FetcherOptions<TBody>, 'method' | 'body'>) =>
    fetchClient<T, TBody>(endpoint, { ...options, method: 'PATCH', body }),

  // Raw versions (return ApiResponse)
  /**
   * GET request (returns ApiResponse)
   */
  getRaw: <T>(endpoint: string, options?: Omit<FetcherOptions, 'method' | 'body'>) =>
    fetchClientRaw<T>(endpoint, { ...options, method: 'GET' }),

  /**
   * POST request (returns ApiResponse)
   */
  postRaw: <T, TBody = unknown>(endpoint: string, body?: TBody, options?: Omit<FetcherOptions<TBody>, 'method' | 'body'>) =>
    fetchClientRaw<T, TBody>(endpoint, { ...options, method: 'POST', body }),

  /**
   * PUT request (returns ApiResponse)
   */
  putRaw: <T, TBody = unknown>(endpoint: string, body?: TBody, options?: Omit<FetcherOptions<TBody>, 'method' | 'body'>) =>
    fetchClientRaw<T, TBody>(endpoint, { ...options, method: 'PUT', body }),

  /**
   * DELETE request (returns ApiResponse)
   */
  deleteRaw: <T>(endpoint: string, options?: Omit<FetcherOptions, 'method' | 'body'>) =>
    fetchClientRaw<T>(endpoint, { ...options, method: 'DELETE' }),

  /**
   * PATCH request (returns ApiResponse)
   */
  patchRaw: <T, TBody = unknown>(endpoint: string, body?: TBody, options?: Omit<FetcherOptions<TBody>, 'method' | 'body'>) =>
    fetchClientRaw<T, TBody>(endpoint, { ...options, method: 'PATCH', body }),
};
