/**
 * Users Services for Admin
 * Uses clientFetcher - throws on error for React Query
 */

import { clientFetcher } from '@/lib/fetcher';
import { API_CONFIG } from '@/lib/api-config';

// Types
export interface UserRow {
  id: string;
  full_name?: string | null;
  email?: string | null;
  role?: string | null;
  created_at?: string | null;
}

export interface CreateUserInput {
  full_name?: string | null;
  email: string;
  role?: string;
  password: string;
}

export interface UpdateUserInput {
  full_name?: string | null;
  email: string;
  role?: string;
}

/**
 * List all users
 * Throws error on failure
 */
export async function listUsersService(): Promise<{ users: UserRow[] }> {
  return clientFetcher.get<{ users: UserRow[] }>(
    `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ADMIN.USERS.LIST}`,
  );
}

/**
 * Get user by ID
 * Throws error on failure
 */
export async function getUserService(id: string): Promise<{ user: UserRow }> {
  return clientFetcher.get<{ user: UserRow }>(
    `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ADMIN.USERS.DETAIL(id)}`,
  );
}

/**
 * Create new user
 * Throws error on failure
 */
export async function createUserService(
  data: CreateUserInput,
): Promise<{ user: UserRow }> {
  return clientFetcher.post<{ user: UserRow }>(
    `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ADMIN.USERS.CREATE}`,
    data,
  );
}

/**
 * Update user
 * Throws error on failure
 */
export async function updateUserService(
  id: string,
  data: UpdateUserInput,
): Promise<{ user: UserRow }> {
  return clientFetcher.put<{ user: UserRow }>(
    `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ADMIN.USERS.UPDATE(id)}`,
    data,
  );
}

/**
 * Delete user
 * Throws error on failure
 */
export async function deleteUserService(id: string): Promise<{ success: boolean }> {
  return clientFetcher.delete<{ success: boolean }>(
    `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ADMIN.USERS.DELETE(id)}`,
  );
}

