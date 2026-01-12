"use client"

import { useCallback } from "react"
import toast from "react-hot-toast"
import { ROUTES } from "@/lib/constants/routes"
import { useUserStore } from "@/store/useUserStore"
import { API_CONFIG } from "@/lib/api-config"

export function useAuthLogout() {
  const { clearUser, accessToken } = useUserStore()

  return useCallback(async () => {
    try {
      // Call logout endpoint to revoke tokens on server
      // Backend will clear admin_refresh_token cookie (httpOnly cookie, only backend can clear)
      if (accessToken) {
        await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.LOGOUT}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          credentials: 'include', // Include cookies so backend can clear the correct cookie
        })
      }
    } catch (error) {
      // Even if logout API fails, continue with local cleanup
      console.error('Logout API error:', error)
    }

    // Clear Zustand store (including accessToken)
    clearUser()

    toast.success("Đăng xuất thành công!")
    window.location.replace(ROUTES.AUTH.LOGIN)
  }, [clearUser, accessToken])
}

