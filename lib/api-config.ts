/**
 * API configuration for backend communication
 */
export const API_CONFIG = {
  BASE_URL:
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9062',
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/api/auth/login',
      LOGIN_ADMIN: '/api/auth/login/admin',
      REGISTER: '/api/auth/register',
    },
  },
} as const;

/**
 * Storage keys for client-side persistence
 */
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'egift-admin-access-token',
  USER_STORAGE: 'egift-admin-user-storage',
} as const;
