/**
 * Hook xử lý đăng nhập cho admin
 * Sử dụng React Query để gọi API và quản lý state
 * Access token is stored in httpOnly cookie by backend (not in memory)
 */

import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { ROUTES } from "@/lib/constants/routes"
import { useUserStore } from "@/store/useUserStore"
import type { UserProfile } from "@/store/useUserStore"
import type { LoginInput } from "@/types/auth.type"
import { loginRequest } from "@/lib/services/auth.services"

interface LoginResponse {
  accessToken: string
  user: {
    id: string
    email: string
    fullName: string | null
    role: string
    avatarUrl: string | null
    createdAt: string
    updatedAt: string
  }
}

export function useAuthLogin() {
  const router = useRouter()
  const { setUser, setProfile, setAccessToken } = useUserStore()

  const mutation = useMutation({
    mutationFn: async (credentials: LoginInput) => {
      // loginRequest now throws on error, returns data directly
      const data = await loginRequest(credentials)
      return data
    },
    onSuccess: (data) => {
      // Store access token temporarily in memory (not persisted) for logout
      setAccessToken(data.accessToken)

      // Store user and profile in Zustand store (persisted to localStorage)
      // Transform null to undefined to match UserProfile type
      const profile: UserProfile = {
        id: data.user.id,
        email: data.user.email,
        full_name: data.user.fullName ?? undefined,
        role: data.user.role,
        avatar_url: data.user.avatarUrl ?? undefined,
        created_at: data.user.createdAt,
        updated_at: data.user.updatedAt,
      }

      const user = {
        id: data.user.id,
        email: data.user.email,
      }

      setUser(user)
      setProfile(profile)

      toast.success("Đăng nhập thành công!")
      router.push(ROUTES.HOME)
      router.refresh()
    },
    onError: (error: Error) => {
      toast.error(error.message || "Đã xảy ra lỗi. Vui lòng thử lại.")
    },
  })

  return {
    login: mutation.mutate,
    loginAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error as Error | null,
    isError: mutation.isError,
  }
}

