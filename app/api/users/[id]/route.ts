/**
 * API route: User detail/update/delete
 * Proxies requests to NestJS backend
 */
import { NextRequest, NextResponse } from "next/server"
import { fetchServer } from "@/lib/fetcher"
import { API_CONFIG } from "@/lib/api-config"

type Params = { params: Promise<{ id: string }> }

export async function GET(_: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const cookie = _.headers.get("cookie") || undefined

    const result = await fetchServer<{ user: unknown }>(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ADMIN.USERS.DETAIL(id)}`,
      { method: "GET", cookie }
    )

    if (!result.success) {
      return NextResponse.json(
        { error: result.message },
        { status: result.status_code || 404 }
      )
    }

    return NextResponse.json(result.data, { status: 200 })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const body = await request.json()
    const cookie = request.headers.get("cookie") || undefined

    const result = await fetchServer<{ user: unknown }>(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ADMIN.USERS.UPDATE(id)}`,
      { method: "PUT", body, cookie }
      )

    if (!result.success) {
      return NextResponse.json(
        { error: result.message },
        { status: result.status_code || 500 }
      )
    }

    return NextResponse.json(result.data, { status: 200 })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(_: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const cookie = _.headers.get("cookie") || undefined

    const result = await fetchServer<{ success: boolean }>(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ADMIN.USERS.DELETE(id)}`,
      { method: "DELETE", cookie }
    )

    if (!result.success) {
      return NextResponse.json(
        { error: result.message },
        { status: result.status_code || 500 }
      )
    }

    return NextResponse.json(result.data, { status: 200 })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
