import { useQuery } from "@tanstack/react-query"

export type AnalyticsRow = {
  id: string
  path: string
  title: string
  slug: string
  views: number
}

export function useAnalytics(dateRange: string, type: 'concepts' | 'home') {
  const query = useQuery({
    queryKey: ["analytics", dateRange, type],
    queryFn: async () => {
      const response = await fetch(`/api/analytics?dateRange=${dateRange}&type=${type}`)
      const json = await response.json()
      
      if (!response.ok) {
        throw new Error(json.error || "Failed to fetch analytics")
      }
      
      const rows = (json.data || []) as Record<string, unknown>[]
      return rows.map((row) => ({
        ...row,
        id: (row.path as string) || (row.slug as string) || Math.random().toString(),
      })) as AnalyticsRow[]
    },
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
  })

  return {
    data: query.data ?? [],
    loading: query.isPending || query.isRefetching,
    error: query.error ? (query.error as Error).message : null,
    refetch: query.refetch,
  }
}
