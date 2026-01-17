/**
 * Hook xử lý đăng xuất cho admin
 * Gọi API logout và xóa state trong Zustand store
 */

"use client"

import { useCallback } from "react"
import toast from "react-hot-toast"
import { ROUTES } from "@/lib/constants/routes"
import { useUserStore } from "@/store/useUserStore"
import { API_CONFIG } from "@/lib/api-config"
import { fetchClient } from "@/lib/fetcher"

export function useAuthLogout() {
  const { clearUser, accessToken } = useUserStore()

  return useCallback(async () => {
    try {
      // Call logout endpoint to revoke tokens on server using fetchClient
      // Backend will clear admin_refresh_token cookie (httpOnly cookie, only backend can clear)
      // fetchClient auto-attaches Authorization header from accessToken in store
      if (accessToken) {
        await fetchClient<void>(
          `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.LOGOUT}`,
          {
            method: 'POST',
          }
        )
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

