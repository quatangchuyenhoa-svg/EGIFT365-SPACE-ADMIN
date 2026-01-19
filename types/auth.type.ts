/**
 * Auth domain types
 * Following code standards: All types must be defined and organized by domain
 */

/**
 * Standard API response wrapper
 * Imported from fetcher for consistency
 */
export type { ApiResponse } from '@/lib/fetcher';

/**
 * Auth API request/response types
 */
export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  email: string;
  password: string;
  fullName: string;
}

export interface AuthUser {
  id: string;
  email: string;
  fullName: string | null;
  role: string;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LoginResponse {
  accessToken: string;
  user: AuthUser;
}

export interface RegisterResponse {
  accessToken: string;
  user: AuthUser;
}
