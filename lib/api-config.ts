/**
 * API configuration for backend communication
 */
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9062',
  ENDPOINTS: {
    AUTH: {
      LOGIN_ADMIN: '/api/auth/login/admin',
      REGISTER: '/api/auth/register',
      REFRESH: '/api/auth/refresh',
      LOGOUT: '/api/auth/logout',
    },
    ADMIN: {
      USERS: {
        LIST: '/api/admin/users',
        DETAIL: (id: string) => `/api/admin/users/${id}`,
        CREATE: '/api/admin/users',
        UPDATE: (id: string) => `/api/admin/users/${id}`,
        DELETE: (id: string) => `/api/admin/users/${id}`,
      },
      PUBLIC_TOKENS: {
        LIST: '/api/admin/public-tokens',
        CREATE: '/api/admin/public-tokens',
        UPDATE: (code: string) => `/api/admin/public-tokens/${encodeURIComponent(code)}`,
        DELETE: (code: string) => `/api/admin/public-tokens/${encodeURIComponent(code)}`,
      },
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
