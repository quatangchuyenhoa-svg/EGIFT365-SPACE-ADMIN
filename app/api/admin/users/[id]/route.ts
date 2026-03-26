import { API_CONFIG } from "@/lib/api-config"
import { createProxyRoute } from "@/lib/utils/api-proxy"

export const GET = createProxyRoute<{ user: unknown }>({
  method: "GET",
  url: async (req, params) => API_CONFIG.ENDPOINTS.ADMIN.USERS.DETAIL(params.id),
})

export const PUT = createProxyRoute<{ user: unknown }>({
  method: "PUT",
  url: async (req, params) => API_CONFIG.ENDPOINTS.ADMIN.USERS.UPDATE(params.id),
})

export const DELETE = createProxyRoute<{ deleted: boolean }>({
  method: "DELETE",
  url: async (req, params) => API_CONFIG.ENDPOINTS.ADMIN.USERS.DELETE(params.id),
})
