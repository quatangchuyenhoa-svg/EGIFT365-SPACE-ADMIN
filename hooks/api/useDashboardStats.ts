import { useQuery } from '@tanstack/react-query';
import { getDashboardStatsService } from '@/lib/services/dashboard.services';

export const DASHBOARD_QUERY_KEYS = {
  STATS: ['dashboard', 'stats'] as const,
};

export function useDashboardStats() {
  return useQuery({
    queryKey: DASHBOARD_QUERY_KEYS.STATS,
    queryFn: () => getDashboardStatsService(),
    // Cache for 5 minutes since dashboard data doesn't change rapidly
    staleTime: 5 * 60 * 1000,
  });
}
