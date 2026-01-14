"use client"

import { useEffect } from "react"
import { useUserStore } from "@/store/useUserStore"

/**
 * Hook to access user state from Zustand store
 * User data is automatically restored from localStorage via Zustand persist middleware
 * 
 * Note: User data is set during login via useAuthLogin hook
 */
export function useUser() {
  const { user, profile, setLoading } = useUserStore()

  useEffect(() => {
    // Reset loading state on mount
    // User data is automatically restored from localStorage by Zustand persist
    setLoading(false)
  }, [setLoading])

  return {
    user,
    profile,
    isLoading: useUserStore((state) => state.isLoading),
  }
}

