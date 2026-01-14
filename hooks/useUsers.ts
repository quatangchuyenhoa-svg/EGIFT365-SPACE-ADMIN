/**
 * Hook for fetching users list
 * Uses React Query with service layer
 */
import { useQuery } from "@tanstack/react-query"
import { listUsersService } from "@/lib/services/users.services"

export type UserRow = {
  id: string
  full_name?: string | null
  email?: string | null
  role?: string | null
  created_at?: string | null
}

export function useUsers() {
  const query = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const result = await listUsersService()
      return result.users
    },
    staleTime: 0,
    gcTime: 5 * 60 * 1000,
  })

  return {
    users: query.data ?? [],
    loading: query.isPending || query.isRefetching,
    error: query.error ? (query.error as Error).message : null,
    refetch: query.refetch,
  }
}
