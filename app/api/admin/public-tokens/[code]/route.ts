import { API_CONFIG } from "@/lib/api-config"
import { createProxyRoute } from "@/lib/utils/api-proxy"

export const PUT = createProxyRoute<{ token: unknown }>({
  method: "PUT",
  url: async (req, params) => API_CONFIG.ENDPOINTS.ADMIN.PUBLIC_TOKENS.UPDATE(params.code),
})

export const DELETE = createProxyRoute<{ deleted: boolean }>({
  method: "DELETE",
  url: async (req, params) => API_CONFIG.ENDPOINTS.ADMIN.PUBLIC_TOKENS.DELETE(params.code),
})
