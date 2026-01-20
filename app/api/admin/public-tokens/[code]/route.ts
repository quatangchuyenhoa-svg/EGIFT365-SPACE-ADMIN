import { NextRequest, NextResponse } from "next/server"
import { fetchServer } from "@/lib/fetcher"
import { API_CONFIG } from "@/lib/api-config"
import type { ApiResponse } from "@/lib/fetcher/types"

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params
    const cookie = request.headers.get("cookie") || undefined

    const result = await fetchServer<{ deleted: boolean }>(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ADMIN.PUBLIC_TOKENS.DELETE(code)}`,
      { method: "DELETE", cookie }
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

    return NextResponse.json<ApiResponse<{ deleted: boolean }>>(
      result,
      { status: 200 }
    )
  } catch (err) {
    console.error('Admin public token API error:', err);
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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params
    const body = await request.json()
    const cookie = request.headers.get("cookie") || undefined

    const result = await fetchServer<{ token: unknown }>(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ADMIN.PUBLIC_TOKENS.UPDATE(code)}`,
      { method: "PUT", body, cookie }
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
      { status: 200 }
    )
  } catch (err) {
    console.error('Admin public token API error:', err);
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
