/**
 * Application route constants
 * Centralized route definitions to avoid hardcoding paths throughout the codebase
 */

export const ROUTES = {
  // Public routes
  HOME: "/",
  STUDIO: "/studio",
  
  // Auth routes
  AUTH: {
    LOGIN: "/auth/login",
    CALLBACK: "/auth/callback",
  },

  MANAGER: {
    USERS: "/manager/users",
    USERS_CREATE: "/manager/users/create",
    USERS_EDIT: (id: string) => `/manager/users/${id}/edit`,
    PUBLIC_CODES: "/manager/public-codes",
  },
} as const

/**
 * Helper function to build auth callback URL with redirect
 */
export function getAuthCallbackUrl(redirectTo?: string): string {
  const baseUrl = typeof window !== "undefined" ? window.location.origin : ""
  const callbackUrl = `${baseUrl}${ROUTES.AUTH.CALLBACK}`
  return redirectTo ? `${callbackUrl}?next=${encodeURIComponent(redirectTo)}` : callbackUrl
}

/**
 * Helper function to build login URL with error message
 */
export function getLoginUrlWithError(error: string): string {
  return `${ROUTES.AUTH.LOGIN}?error=${encodeURIComponent(error)}`
}

