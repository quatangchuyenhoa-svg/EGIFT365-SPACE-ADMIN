/**
 * API route: Users list/create
 * Proxies requests to NestJS backend
 */
import { NextRequest, NextResponse } from "next/server"
import { fetchServer } from "@/lib/fetcher"
import { API_CONFIG } from "@/lib/api-config"

export async function GET(request: NextRequest) {
  try {
    const cookie = request.headers.get("cookie") || undefined

    const result = await fetchServer<{ users: unknown[] }>(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ADMIN.USERS.LIST}`,
      { method: "GET", cookie }
    )

    if (!result.success) {
      return NextResponse.json(
        { error: result.message, users: [] },
        { status: result.status_code || 500 }
      )
    }

    return NextResponse.json(result.data, { status: 200 })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error"
    return NextResponse.json(
      { error: message, users: [] },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const cookie = request.headers.get("cookie") || undefined

    const result = await fetchServer<{ user: unknown }>(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ADMIN.USERS.CREATE}`,
      { method: "POST", body, cookie }
    )

    if (!result.success) {
      return NextResponse.json(
        { error: result.message },
        { status: result.status_code || 500 }
      )
    }

    return NextResponse.json(result.data, { status: 201 })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
