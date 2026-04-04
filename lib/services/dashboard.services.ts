/**
 * Dashboard Services for Admin
 */

import { clientFetcher } from '@/lib/fetcher';
import { API_CONFIG } from '@/lib/api-config';

export interface DashboardStatsResponse {
  users: {
    total: number;
  };
  googleAnalytics: {
    total_this_month: number;
  };
  qrCodes: {
    total_scans: number;
  };
  topConcept: {
    code: string;
    title: string | null;
    path: string;
    usage_count: number;
  } | null;
  chartData: {
    date: string;
    home: number;
    concepts: number;
  }[];
}

/**
 * Get dashboard statistics
 * Throws error on failure
 */
export async function getDashboardStatsService(): Promise<DashboardStatsResponse> {
  return clientFetcher.get<DashboardStatsResponse>(
    `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ADMIN.DASHBOARD.STATS}`,
  );
}
