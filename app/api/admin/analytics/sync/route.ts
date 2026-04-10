/**
 * API route: Analytics Sync
 * Proxies requests to NestJS backend
 */
import { NextRequest, NextResponse } from "next/server"
import { fetchServer } from "@/lib/fetcher"
import { API_CONFIG } from "@/lib/api-config"
import type { ApiResponse } from "@/lib/fetcher/types"

export async function POST(request: NextRequest) {
  try {
    const cookie = request.headers.get("cookie") || undefined

    const result = await fetchServer<{ message: string }>(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ADMIN.ANALYTICS.SYNC}`,
      { method: "POST", cookie }
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

    return NextResponse.json<ApiResponse<{ message: string }>>(
      result,
      { status: 200 }
    )
  } catch (err) {
    console.error('Admin analytics sync API error:', err);
    return NextResponse.json<ApiResponse<never>>(
      {
        success: false,
        status_code: 500,
        message: "Đã xảy ra lỗi khi đồng bộ dữ liệu",
        data: null as never,
      },
      { status: 500 }
    )
  }
}
