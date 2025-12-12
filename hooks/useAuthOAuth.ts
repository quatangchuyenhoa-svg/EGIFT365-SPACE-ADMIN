import { useMutation } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { createClient } from "@/lib/supabase/client"
import { ROUTES } from "@/lib/constants/routes"

export function useAuthOAuth() {
  const mutation = useMutation({
    mutationFn: async (provider: "github") => {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}${ROUTES.AUTH.CALLBACK}`,
        },
      })

      if (error) {
        throw new Error(error.message)
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "Đã xảy ra lỗi. Vui lòng thử lại.")
    },
  })

  return {
    loginWithOAuth: mutation.mutate,
    isLoading: mutation.isPending,
    error: mutation.error,
    isError: mutation.isError,
  }
}

