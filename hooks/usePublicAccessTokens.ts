import { useMemo } from "react"
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"

export type PublicAccessToken = {
  code: string
  path: string
  created_at: string
  updated_at: string
}

type UsePublicAccessTokensResult = {
  tokens: PublicAccessToken[]
  loading: boolean
  error: string | null
  refetch: () => Promise<unknown>
  createToken: (path: string, code?: string) => Promise<PublicAccessToken | null>
  updateToken: (code: string, path: string, newCode?: string) => Promise<PublicAccessToken | null>
  deleteToken: (code: string) => Promise<boolean>
}

const queryKey = ["public-access-tokens"]

async function fetchTokensApi(): Promise<PublicAccessToken[]> {
  const res = await fetch("/api/public-tokens", { cache: "no-store" })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    const message = body?.error || `Failed with status ${res.status}`
    throw new Error(message)
  }
  const json = await res.json()
  return (json?.tokens ?? []) as PublicAccessToken[]
}

async function createTokenApi(path: string, code?: string): Promise<PublicAccessToken> {
  const res = await fetch("/api/public-tokens", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path, code }),
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    const message = body?.error || `Failed with status ${res.status}`
    throw new Error(message)
  }
  const json = await res.json()
  return json.token as PublicAccessToken
}

async function updateTokenApi(code: string, path: string, newCode?: string): Promise<PublicAccessToken> {
  const res = await fetch(`/api/public-tokens/${encodeURIComponent(code)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path, newCode }),
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    const message = body?.error || `Failed with status ${res.status}`
    throw new Error(message)
  }
  const json = await res.json()
  return json.token as PublicAccessToken
}

async function deleteTokenApi(code: string): Promise<void> {
  const res = await fetch(`/api/public-tokens/${encodeURIComponent(code)}`, {
    method: "DELETE",
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    const message = body?.error || `Failed with status ${res.status}`
    throw new Error(message)
  }
}

export function usePublicAccessTokens(): UsePublicAccessTokensResult {
  const queryClient = useQueryClient()

  const tokensQuery = useQuery({
    queryKey,
    queryFn: fetchTokensApi,
    staleTime: 0,
    gcTime: 5 * 60 * 1000,
  })

  const createMutation = useMutation({
    mutationFn: ({ path, code }: { path: string; code?: string }) =>
      createTokenApi(path, code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey })
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ code, path, newCode }: { code: string; path: string; newCode?: string }) =>
      updateTokenApi(code, path, newCode),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: ({ code }: { code: string }) => deleteTokenApi(code),
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
      const res = await createMutation.mutateAsync({ path, code })
      return res ?? null
    },
    updateToken: async (code, path, newCode) => {
      const res = await updateMutation.mutateAsync({ code, path, newCode })
      return res ?? null
    },
    deleteToken: async code => {
      await deleteMutation.mutateAsync({ code })
      return true
    },
  }
}

