import { NextRequest, NextResponse } from "next/server"
import { fetchServer } from "@/lib/fetcher"
import { API_CONFIG } from "@/lib/api-config"
import type { ApiResponse } from "@/lib/fetcher/types"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const cookie = request.headers.get("cookie") || undefined

    const result = await fetchServer<{ user: unknown }>(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ADMIN.USERS.DETAIL(id)}`,
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

    return NextResponse.json<ApiResponse<{ user: unknown }>>(
      result,
      { status: 200 }
    )
  } catch (err) {
    console.error('Admin user API error:', err);
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const cookie = request.headers.get("cookie") || undefined

    const result = await fetchServer<{ user: unknown }>(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ADMIN.USERS.UPDATE(id)}`,
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

    return NextResponse.json<ApiResponse<{ user: unknown }>>(
      result,
      { status: 200 }
    )
  } catch (err) {
    console.error('Admin user API error:', err);
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const cookie = request.headers.get("cookie") || undefined

    const result = await fetchServer<{ deleted: boolean }>(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ADMIN.USERS.DELETE(id)}`,
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
    console.error('Admin user API error:', err);
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
