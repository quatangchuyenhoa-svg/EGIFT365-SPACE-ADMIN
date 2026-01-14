/**
 * Hook for deleting user
 * Uses React Query with service layer
 */
import { useMutation, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { deleteUserService } from "@/lib/services/users.services"

export function useDeleteUser(options?: { onSuccess?: () => Promise<void> | void }) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      await deleteUserService(id)
    },
    onSuccess: async () => {
      // Invalidate users query to refetch
      await queryClient.invalidateQueries({ queryKey: ["users"] })
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
