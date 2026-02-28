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
  createToken: (path: string, title?: string, code?: string, category?: string) => Promise<PublicTokenRow | null>
  updateToken: (code: string, path: string, title?: string, newCode?: string, category?: string) => Promise<PublicTokenRow | null>
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
    mutationFn: ({ path, title, code, category }: { path: string; title?: string; code?: string; category?: string }) =>
      createPublicTokenService({ path, title, code, category }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey })
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ code, path, title, newCode, category }: { code: string; path: string; title?: string; newCode?: string; category?: string }) =>
      updatePublicTokenService(code, { path, title, code: newCode, category }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: ({ code }: { code: string }) => deletePublicTokenService(code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey })
    },
    onError: (error: Error) => {
      console.error('Delete token error:', error)
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
    createToken: async (path, title, code, category) => {
      const result = await createMutation.mutateAsync({ path, title, code, category })
      return result.token ?? null
    },
    updateToken: async (code, path, title, newCode, category) => {
      const result = await updateMutation.mutateAsync({ code, path, title, newCode, category })
      return result.token ?? null
    },
    deleteToken: async (code) => {
      await deleteMutation.mutateAsync({ code })
      return true
    },
  }
}
