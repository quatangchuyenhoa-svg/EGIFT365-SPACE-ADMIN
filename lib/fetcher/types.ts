/**
 * Fetcher Type Definitions
 * Shared types for server and client fetchers
 */

/**
 * Standard API response format
 * All API endpoints return this structure
 */
export type ApiResponse<T> = {
  success: boolean;
  status_code: number;
  message: string;
  data: T;
};

/**
 * Base fetcher configuration options
 */
export interface FetcherOptions<TBody = unknown> {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: TBody;
  headers?: Record<string, string>;
  skipAuth?: boolean;
  skipRefresh?: boolean;
}

/**
 * Server-specific fetcher options
 * Extends base options with cookie forwarding
 */
export interface ServerFetcherOptions<TBody = unknown> extends FetcherOptions<TBody> {
  cookie?: string;
}

/**
 * Queued request during token refresh
 * Resolves with boolean (success) since access token is in httpOnly cookie
 */
export interface QueuedRequest {
  resolve: (success: boolean) => void;
  reject: (error: Error) => void;
}

/**
 * Server fetch result with raw response
 * Used for cookie forwarding in API routes
 */
export interface ServerFetchResult<T> {
  result: ApiResponse<T>;
  rawResponse: Response;
}
