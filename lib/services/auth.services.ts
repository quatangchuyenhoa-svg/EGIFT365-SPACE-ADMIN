/**
 * Auth service layer
 * Following code standards: Define request functions for API calls
 * Client components should use React Query hooks, not these directly
 */

import { API_CONFIG } from '@/lib/api-config';
import { clientFetcher } from '@/lib/fetcher';
import type { LoginInput, LoginResponse } from '@/types/auth.type';

/**
 * Admin login request to Next.js API
 * Returns data directly (not ApiResponse) for React Query
 * Throws error on failure for React Query error handling
 */
export async function loginRequest(credentials: LoginInput): Promise<LoginResponse> {
  return clientFetcher.post<LoginResponse>(API_CONFIG.ENDPOINTS.AUTH.LOGIN_ADMIN, credentials, {
    skipAuth: true,
    skipRefresh: true,
  });
}

/**
 * Admin logout request to Next.js API
 * Returns data directly (not ApiResponse)
 * Throws error on failure
 */
export async function logoutRequest(): Promise<null> {
  return clientFetcher.post<null>(API_CONFIG.ENDPOINTS.AUTH.LOGOUT, undefined, {
    skipRefresh: true,
  });
}
