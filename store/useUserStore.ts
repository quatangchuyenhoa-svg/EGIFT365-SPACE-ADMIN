import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import type { User } from "@supabase/supabase-js"

/**
 * User Profile từ database (profiles table)
 */
export interface UserProfile {
  id: string
  email?: string
  full_name?: string
  avatar_url?: string
  role?: string
  phone?: string
  address?: string
  gender?: string
  date_of_birth?: string
  created_at?: string
  updated_at?: string
}

interface UserState {
  // Auth user từ Supabase
  user: User | null
  // Profile từ database
  profile: UserProfile | null
  // Loading state
  isLoading: boolean
  // Actions
  setUser: (user: User | null) => void
  setProfile: (profile: UserProfile | null) => void
  setLoading: (isLoading: boolean) => void
  // Clear all data (khi logout)
  clearUser: () => void
}

/**
 * Zustand store để quản lý user state
 * Sử dụng persist middleware để lưu vào localStorage
 * Tránh mất dữ liệu khi refresh trang (F5)
 */
export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      profile: null,
      isLoading: false,

      setUser: (user) => set({ user }),
      setProfile: (profile) => set({ profile }),
      setLoading: (isLoading) => set({ isLoading }),
      clearUser: () => {
        set({ user: null, profile: null, isLoading: false })
        // Xóa hoàn toàn dữ liệu khỏi localStorage khi logout
        if (typeof window !== "undefined") {
          localStorage.removeItem("egift-admin-user-storage")
        }
      },
    }),
    {
      name: "egift-admin-user-storage", // Tên key trong localStorage
      storage: createJSONStorage(() => localStorage),
      // Chỉ persist user và profile, không persist isLoading
      partialize: (state) => ({
        user: state.user,
        profile: state.profile,
      }),
    }
  )
)

