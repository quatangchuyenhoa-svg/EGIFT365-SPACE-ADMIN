/**
 * API route: Public tokens list/create
 * Proxies requests to NestJS backend
 */
import { NextRequest, NextResponse } from "next/server"
import { fetchServer } from "@/lib/fetcher"
import { API_CONFIG } from "@/lib/api-config"
import type { ApiResponse } from "@/lib/fetcher/types"

export async function GET(request: NextRequest) {
  try {
    const cookie = request.headers.get("cookie") || undefined

    const result = await fetchServer<{ tokens: unknown[] }>(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ADMIN.PUBLIC_TOKENS.LIST}`,
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

    return NextResponse.json<ApiResponse<{ tokens: unknown[] }>>(
      result,
      { status: 200 }
    )
  } catch (err) {
    console.error('Public tokens list API error:', err);
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const cookie = request.headers.get("cookie") || undefined

    const result = await fetchServer<{ token: unknown }>(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ADMIN.PUBLIC_TOKENS.CREATE}`,
      { method: "POST", body, cookie }
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

    return NextResponse.json<ApiResponse<{ token: unknown }>>(
      result,
      { status: 201 }
    )
  } catch (err) {
    console.error('Public tokens list API error:', err);
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
