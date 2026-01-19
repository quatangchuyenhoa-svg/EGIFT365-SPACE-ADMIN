/**
 * Hook xử lý đăng xuất cho admin
 * Gọi API logout và xóa state trong Zustand store
 * Access token is in httpOnly cookie, no need to check store
 */

"use client"

import { useCallback } from "react"
import toast from "react-hot-toast"
import { ROUTES } from "@/lib/constants/routes"
import { useUserStore } from "@/store/useUserStore"
import { logoutRequest } from "@/lib/services/auth.services"

export function useAuthLogout() {
  const { clearUser, user } = useUserStore()

  return useCallback(async () => {
    try {
      // Call local logout API route
      // API route will proxy to backend and handle cookie clearing
      if (user) {
        await logoutRequest()
      }
    } catch (error) {
      // Even if logout API fails, continue with local cleanup
      console.error('Logout API error:', error)
    }

    // Clear Zustand store
    clearUser()

    toast.success("Đăng xuất thành công!")
    window.location.replace(ROUTES.AUTH.LOGIN)
  }, [clearUser, user])
}

