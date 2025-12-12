"use client"

import { useCallback } from "react"
import toast from "react-hot-toast"
import { createClient } from "@/lib/supabase/client"
import { ROUTES } from "@/lib/constants/routes"
import { useUserStore } from "@/store/useUserStore"

export function useAuthLogout() {
  const { clearUser } = useUserStore()

  return useCallback(async () => {
    clearUser()

    const supabase = createClient()
    supabase.auth.signOut().catch((error) => {
      console.error("SignOut error:", error)
    })

    toast.success("Đăng xuất thành công!")
    window.location.replace(ROUTES.AUTH.LOGIN)
  }, [clearUser])
}

