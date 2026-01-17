/**
 * Hook to fetch a single user by ID
 * Uses React Query for data fetching and caching
 */

import { useQuery } from "@tanstack/react-query"
import { getUserService } from "@/lib/services/users.services"

export function useUserDetail(id: string | undefined) {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () => getUserService(id!),
    enabled: !!id && id !== "undefined",
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

