/**
 * Hook for managing public access tokens
 * Uses React Query with service layer
 */
import { useMemo } from "react"
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"
import {
  listPublicTokensService,
  createPublicTokenService,
  updatePublicTokenService,
  deletePublicTokenService,
  type PublicTokenRow,
} from "@/lib/services/public-tokens.services"

// Re-export for consumers
export type PublicAccessToken = PublicTokenRow

type UsePublicAccessTokensResult = {
  tokens: PublicTokenRow[]
  loading: boolean
  error: string | null
  refetch: () => Promise<unknown>
  createToken: (path: string, code?: string) => Promise<PublicTokenRow | null>
  updateToken: (code: string, path: string, newCode?: string) => Promise<PublicTokenRow | null>
  deleteToken: (code: string) => Promise<boolean>
}

const queryKey = ["public-access-tokens"]

export function usePublicAccessTokens(): UsePublicAccessTokensResult {
  const queryClient = useQueryClient()

  const tokensQuery = useQuery({
    queryKey,
    queryFn: async () => {
      const result = await listPublicTokensService()
      return result.tokens
    },
    staleTime: 0,
    gcTime: 5 * 60 * 1000,
  })

  const createMutation = useMutation({
    mutationFn: ({ path, code }: { path: string; code?: string }) =>
      createPublicTokenService({ path, code }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey })
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ code, path, newCode }: { code: string; path: string; newCode?: string }) =>
      updatePublicTokenService(code, { path, code: newCode }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: ({ code }: { code: string }) => deletePublicTokenService(code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey })
    },
  })

  const error = useMemo(() => {
    return (
      (tokensQuery.error as Error | undefined)?.message ??
      (createMutation.error as Error | undefined)?.message ??
      (updateMutation.error as Error | undefined)?.message ??
      (deleteMutation.error as Error | undefined)?.message ??
      null
    )
  }, [
    tokensQuery.error,
    createMutation.error,
    updateMutation.error,
    deleteMutation.error,
  ])

  return {
    tokens: tokensQuery.data ?? [],
    loading: tokensQuery.isPending || tokensQuery.isRefetching,
    error,
    refetch: tokensQuery.refetch,
    createToken: async (path, code) => {
      const result = await createMutation.mutateAsync({ path, code })
      return result.token ?? null
    },
    updateToken: async (code, path, newCode) => {
      const result = await updateMutation.mutateAsync({ code, path, newCode })
      return result.token ?? null
    },
    deleteToken: async (code) => {
      await deleteMutation.mutateAsync({ code })
      return true
    },
  }
}
