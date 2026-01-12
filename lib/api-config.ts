/**
 * API configuration for backend communication
 */
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9062',
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/api/auth/login',
      LOGIN_ADMIN: '/api/auth/login/admin',
      REGISTER: '/api/auth/register',
      REFRESH: '/api/auth/refresh',
      LOGOUT: '/api/auth/logout-admin',
    },
  },
} as const;

/**
 * Storage keys for client-side persistence
 * Note: Access token không persist vì security
 * User/profile data được persist qua Zustand middleware
 */
export const STORAGE_KEYS = {
  USER_STORAGE: 'egift-admin-user-storage',
} as const;
