/**
 * Hook xử lý đăng nhập cho admin
 * Sử dụng React Query để gọi API và quản lý state
 */

import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { ROUTES } from "@/lib/constants/routes"
import { useUserStore } from "@/store/useUserStore"
import type { UserProfile } from "@/store/useUserStore"
import { API_CONFIG } from "@/lib/api-config"
import { fetchClient } from "@/lib/fetcher"

interface LoginCredentials {
  email: string
  password: string
}

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
    mutationFn: async (credentials: LoginCredentials): Promise<LoginResponse> => {
      // Call NestJS backend API for admin login using fetchClient
      // fetchClient throws on error automatically
      const data = await fetchClient<LoginResponse>(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.LOGIN_ADMIN}`,
        {
          method: 'POST',
          body: {
            email: credentials.email,
            password: credentials.password,
          },
        }
      )

      // Refresh token is automatically set in httpOnly cookie by backend
      // Store access token temporarily in memory (not persisted) for logout
      setAccessToken(data.accessToken)

      // Store user and profile in Zustand store
      // Convert backend response to match UserProfile interface
      const profile: UserProfile = {
        id: data.user.id,
        email: data.user.email,
        full_name: data.user.fullName ?? undefined,
        role: data.user.role,
        avatar_url: data.user.avatarUrl ?? undefined,
        created_at: data.user.createdAt,
        updated_at: data.user.updatedAt,
      }

      // Create a simplified user object for the store
      const user = {
        id: data.user.id,
        email: data.user.email,
      }

      setUser(user)
      setProfile(profile)

      return data
    },
    onSuccess: () => {
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

