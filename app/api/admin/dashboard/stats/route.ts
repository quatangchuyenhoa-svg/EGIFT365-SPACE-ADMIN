/**
 * API route: Dashboard Stats
 * Proxies requests to NestJS backend
 */
import { NextRequest, NextResponse } from "next/server"
import { fetchServer } from "@/lib/fetcher"
import { API_CONFIG } from "@/lib/api-config"
import type { ApiResponse } from "@/lib/fetcher/types"
import type { DashboardStatsResponse } from "@/lib/services/dashboard.services"

export async function GET(request: NextRequest) {
  try {
    const cookie = request.headers.get("cookie") || undefined

    const result = await fetchServer<DashboardStatsResponse>(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ADMIN.DASHBOARD.STATS}`,
      { method: "GET", cookie }
    )

    if (!result.success) {
      return NextResponse.json<ApiResponse<never>>(
        {
          success: false,
          status_code: result.status_code || 500,
          message: result.message,
          data: null as never,
        },
        { status: result.status_code || 500 }
      )
    }

    return NextResponse.json<ApiResponse<DashboardStatsResponse>>(
      result,
      { status: 200 }
    )
  } catch (err) {
    console.error('Admin dashboard stats API error:', err);
    return NextResponse.json<ApiResponse<never>>(
      {
        success: false,
        status_code: 500,
        message: "Đã xảy ra lỗi hệ thống",
        data: null as never,
      },
      { status: 500 }
    )
  }
}
