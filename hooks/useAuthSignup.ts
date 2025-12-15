import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { createClient } from "@/lib/supabase/client"
import { ROUTES } from "@/lib/constants/routes"

interface SignupCredentials {
  name: string
  email: string
  password: string
}

export function useAuthSignup() {
  const router = useRouter()

  const mutation = useMutation({
    mutationFn: async (credentials: SignupCredentials) => {
      const supabase = createClient()

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          data: {
            full_name: credentials.name.trim() || null,
          },
        },
      })

      if (signUpError) {
        // Nếu status code là 422 (Unprocessable Entity), thường là email đã tồn tại hoặc không hợp lệ
        if (signUpError.status === 422) {
          throw new Error("Email không hợp lệ!")
        }
        throw new Error(signUpError.message)
      }

      // Profile sẽ được tự động tạo bởi database trigger handle_new_user()
      // Trigger sẽ tự động lấy full_name từ user_metadata (credentials.name)
      // Không cần client-side upsert vì:
      // 1. User chưa authenticated nên RLS sẽ block
      // 2. Trigger đã tự động tạo profile với full_name từ user_metadata
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

