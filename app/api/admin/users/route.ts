import { API_CONFIG } from "@/lib/api-config"
import { createProxyRoute } from "@/lib/utils/api-proxy"

export const GET = createProxyRoute<{ users: unknown[] }>({
  method: "GET",
  url: API_CONFIG.ENDPOINTS.ADMIN.USERS.LIST,
})

export const POST = createProxyRoute<{ user: unknown }>({
  method: "POST",
  url: API_CONFIG.ENDPOINTS.ADMIN.USERS.CREATE,
})
