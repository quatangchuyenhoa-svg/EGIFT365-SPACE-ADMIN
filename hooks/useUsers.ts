import { useCallback, useEffect, useState } from "react"

export type UserRow = {
  id: string
  full_name?: string | null
  email?: string | null
  role?: string | null
  created_at?: string | null
}

type UseUsersResult = {
  users: UserRow[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useUsers(): UseUsersResult {
  const [users, setUsers] = useState<UserRow[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/users", { cache: "no-store" })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        const message = body?.error || `Failed with status ${res.status}`
        throw new Error(message)
      }
      const json = await res.json()
      setUsers((json?.users ?? []) as UserRow[])
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error"
      setError(message)
      setUsers([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  return { users, loading, error, refetch: fetchUsers }
}

