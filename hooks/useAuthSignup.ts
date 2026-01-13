import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { ROUTES } from "@/lib/constants/routes"
import { API_CONFIG } from "@/lib/api-config"
import { fetchClient } from "@/lib/fetcher"

interface SignupCredentials {
  name: string
  email: string
  password: string
}

interface SignupResponse {
  message: string
  user: {
    id: string
    email: string
    fullName: string | null
    role: string
  }
}

export function useAuthSignup() {
  const router = useRouter()

  const mutation = useMutation({
    mutationFn: async (credentials: SignupCredentials): Promise<SignupResponse> => {
      // Call NestJS backend API for registration using fetchClient
      // fetchClient throws on error automatically
      return fetchClient<SignupResponse>(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.REGISTER}`,
        {
          method: 'POST',
          body: {
            name: credentials.name,
            email: credentials.email,
            password: credentials.password,
          },
        }
      )
    },
    onSuccess: () => {
      toast.success("Tạo tài khoản thành công! Vui lòng đăng nhập.")
      router.push(ROUTES.AUTH.LOGIN)
      router.refresh()
    },
    onError: (error: Error) => {
      toast.error(error.message || "Đã xảy ra lỗi. Vui lòng thử lại.")
    },
  })

  return {
    signup: mutation.mutate,
    signupAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error as Error | null,
    isError: mutation.isError,
  }
}

