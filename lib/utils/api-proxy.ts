import { NextRequest, NextResponse } from "next/server"
import { fetchServer } from "@/lib/fetcher"
import type { ApiResponse } from "@/lib/fetcher/types"
import { API_CONFIG } from "@/lib/api-config"

type ProxyOptions = {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH"
  url: string | ((request: NextRequest, params: any) => string | Promise<string>)
  successStatus?: number
}

/**
 * Creates a generic API proxy route to forward requests to the backend.
 * Handles extracting cookies, parsing JSON body, forwarding requests, and standardizing errors.
 */
export function createProxyRoute<T>(options: ProxyOptions) {
  return async (request: NextRequest, context: { params?: any } = {}) => {
    try {
      const cookie = request.headers.get("cookie") || undefined
      let body

      if (["POST", "PUT", "PATCH"].includes(options.method)) {
        try {
          body = await request.json()
        } catch (e) {
          // ignore parsing error if body is empty
        }
      }

      // Next.js 15+ dynamic params can be a Promise
      const parsedParams = context.params instanceof Promise ? await context.params : context.params

      const targetUrl = typeof options.url === "function"
        ? await options.url(request, parsedParams)
        : options.url

      // Attach BASE_URL automatically if it's a relative API config path
      const fullUrl = targetUrl.startsWith("http") ? targetUrl : `${API_CONFIG.BASE_URL}${targetUrl}`

      const result = await fetchServer<T>(fullUrl, {
        method: options.method,
        body,
        cookie,
      })

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

      return NextResponse.json<ApiResponse<T>>(result, {
        status: options.successStatus || (options.method === "POST" ? 201 : 200),
      })
    } catch (err) {
      console.error(`Proxy API error (${options.method}):`, err)
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
}
