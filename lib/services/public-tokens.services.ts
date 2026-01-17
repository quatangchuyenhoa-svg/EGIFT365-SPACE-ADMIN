/**
 * Public Tokens Services for Admin
 * Uses clientFetcher - throws on error for React Query
 */

import { clientFetcher } from '@/lib/fetcher';
import { API_CONFIG } from '@/lib/api-config';

// Types
export interface PublicTokenRow {
  code: string;
  path: string;
  created_at: string;
  updated_at: string;
}

export interface CreatePublicTokenInput {
  path: string;
  code?: string;
}

export interface UpdatePublicTokenInput {
  path?: string;
  code?: string;
}

/**
 * List all public tokens
 * Throws error on failure
 */
export async function listPublicTokensService(): Promise<{ tokens: PublicTokenRow[] }> {
  return clientFetcher.get<{ tokens: PublicTokenRow[] }>(
    `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ADMIN.PUBLIC_TOKENS.LIST}`,
  );
}

/**
 * Get token by code
 * Throws error on failure
 */
export async function getPublicTokenService(code: string): Promise<{ token: PublicTokenRow }> {
  return clientFetcher.get<{ token: PublicTokenRow }>(
    `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ADMIN.PUBLIC_TOKENS.UPDATE(code)}`,
  );
}

/**
 * Create new token
 * Throws error on failure
 */
export async function createPublicTokenService(
  data: CreatePublicTokenInput,
): Promise<{ token: PublicTokenRow }> {
  return clientFetcher.post<{ token: PublicTokenRow }>(
    `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ADMIN.PUBLIC_TOKENS.CREATE}`,
    data,
  );
}

/**
 * Update token
 * Throws error on failure
 */
export async function updatePublicTokenService(
  code: string,
  data: UpdatePublicTokenInput,
): Promise<{ token: PublicTokenRow }> {
  return clientFetcher.put<{ token: PublicTokenRow }>(
    `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ADMIN.PUBLIC_TOKENS.UPDATE(code)}`,
    data,
  );
}

/**
 * Delete token
 * Throws error on failure
 */
export async function deletePublicTokenService(code: string): Promise<{ success: boolean }> {
  return clientFetcher.delete<{ success: boolean }>(
    `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ADMIN.PUBLIC_TOKENS.DELETE(code)}`,
  );
}

