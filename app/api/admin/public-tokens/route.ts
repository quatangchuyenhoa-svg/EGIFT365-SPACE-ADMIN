import { API_CONFIG } from "@/lib/api-config"
import { createProxyRoute } from "@/lib/utils/api-proxy"

export const GET = createProxyRoute<{ tokens: unknown[] }>({
  method: "GET",
  url: API_CONFIG.ENDPOINTS.ADMIN.PUBLIC_TOKENS.LIST,
})

export const POST = createProxyRoute<{ token: unknown }>({
  method: "POST",
  url: API_CONFIG.ENDPOINTS.ADMIN.PUBLIC_TOKENS.CREATE,
})
