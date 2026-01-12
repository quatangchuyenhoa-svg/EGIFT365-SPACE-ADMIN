"use client"

import { useCallback } from "react"
import toast from "react-hot-toast"
import { ROUTES } from "@/lib/constants/routes"
import { useUserStore } from "@/store/useUserStore"
import { STORAGE_KEYS } from "@/lib/api-config"

export function useAuthLogout() {
  const { clearUser } = useUserStore()

  return useCallback(async () => {
    // Clear Zustand store
    clearUser()

    // Remove JWT token from localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
    }

    toast.success("Đăng xuất thành công!")
    window.location.replace(ROUTES.AUTH.LOGIN)
  }, [clearUser])
}

