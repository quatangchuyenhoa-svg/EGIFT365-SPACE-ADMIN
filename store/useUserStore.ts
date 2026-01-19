import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

/**
 * Simple user object
 */
export interface SimpleUser {
  id: string
  email: string
}

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
  // Auth user (từ NestJS backend)
  user: SimpleUser | null
  // Profile từ database
  profile: UserProfile | null
  // Access token (temporary in memory, not persisted for security)
  accessToken: string | null
  // Loading state
  isLoading: boolean
  // Actions
  setUser: (user: SimpleUser | null) => void
  setProfile: (profile: UserProfile | null) => void
  setAccessToken: (token: string | null) => void
  setLoading: (isLoading: boolean) => void
  // Clear all data (khi logout)
  clearUser: () => void
}

/**
 * Zustand store để quản lý user state
 * Sử dụng persist middleware để lưu vào localStorage
 * Access token is stored in httpOnly cookie (not in store for security)
 */
export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      profile: null,
      accessToken: null,
      isLoading: false,

      setUser: (user) => set({ user }),
      setProfile: (profile) => set({ profile }),
      setAccessToken: (token) => set({ accessToken: token }),
      setLoading: (isLoading) => set({ isLoading }),
      clearUser: () => {
        set({ user: null, profile: null, accessToken: null, isLoading: false })
        // Xóa hoàn toàn dữ liệu khỏi localStorage khi logout
        if (typeof window !== "undefined") {
          localStorage.removeItem("egift-admin-user-storage")
        }
      },
    }),
    {
      name: "egift-admin-user-storage", // Tên key trong localStorage
      storage: createJSONStorage(() => localStorage),
      // Persist user và profile, access token is in memory only (not persisted)
      partialize: (state) => ({
        user: state.user,
        profile: state.profile,
      }),
    }
  )
)

