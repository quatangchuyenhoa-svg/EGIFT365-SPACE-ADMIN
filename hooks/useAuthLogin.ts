import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { ROUTES } from "@/lib/constants/routes"
import { useUserStore } from "@/store/useUserStore"
import type { UserProfile } from "@/store/useUserStore"
import { API_CONFIG, STORAGE_KEYS } from "@/lib/api-config"

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
  const { setUser, setProfile } = useUserStore()

  const mutation = useMutation({
    mutationFn: async (credentials: LoginCredentials): Promise<LoginResponse> => {
      // Call NestJS backend API for admin login
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.LOGIN_ADMIN}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          }),
        }
      )

      let data
      try {
        const text = await response.text()
        try {
          data = JSON.parse(text)
        } catch (parseError) {
          console.error('Failed to parse JSON:', { url: `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.LOGIN_ADMIN}`, status: response.status, text: text.substring(0, 200) })
          throw new Error('Server trả về lỗi không hợp lệ. Vui lòng kiểm tra lại kết nối.')
        }
      } catch (error) {
        if (error instanceof Error) {
          throw error
        }
        throw new Error('Không thể kết nối đến server. Vui lòng thử lại.')
      }

      if (!response.ok) {
        // Backend returns error with message field
        throw new Error(data.message || 'Đã xảy ra lỗi. Vui lòng thử lại.')
      }

      // Store JWT token in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, data.accessToken)
      }

      // Store user and profile in Zustand store
      // Convert backend response to match UserProfile interface
      const profile: UserProfile = {
        id: data.user.id,
        email: data.user.email,
        full_name: data.user.fullName,
        role: data.user.role,
        avatar_url: data.user.avatarUrl,
        created_at: data.user.createdAt,
        updated_at: data.user.updatedAt,
      }

      // Create a simplified user object for the store
      const user = {
        id: data.user.id,
        email: data.user.email,
      }

      setUser(user as any)
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

