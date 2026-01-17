import { useMutation } from "@tanstack/react-query"
import toast from "react-hot-toast"

/**
 * OAuth authentication hook
 * Currently disabled - OAuth not yet implemented in NestJS backend
 *
 * TODO: Implement OAuth flow with NestJS backend
 * - Add OAuth endpoints in auth controller
 * - Handle OAuth callbacks
 * - Store tokens and user data
 */
export function useAuthOAuth() {
  const mutation = useMutation({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    mutationFn: async (_provider: "github") => {
      throw new Error("OAuth chưa được hỗ trợ. Vui lòng đăng nhập bằng email/password.")
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
