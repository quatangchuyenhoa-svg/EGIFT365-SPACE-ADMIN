import { useMutation } from "@tanstack/react-query"
import toast from "react-hot-toast"

/**
 * Hook xóa user theo id, sử dụng React Query + react-hot-toast.
 * API chạy trên server thông qua route /api/users/[id].
 */
export function useDeleteUser(options?: { onSuccess?: () => Promise<void> | void }) {
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/users/${id}`, { method: "DELETE" })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(json?.error || "Failed to delete user")
      }
    },
    onSuccess: async (_data, _variables, _context) => {
      toast.success("Xóa user thành công")
      if (options?.onSuccess) {
        await options.onSuccess()
      }
    },
    onError: (error) => {
      const message =
        error instanceof Error ? error.message : "Xóa user thất bại. Vui lòng thử lại."
      toast.error(message)
    },
  })
}


