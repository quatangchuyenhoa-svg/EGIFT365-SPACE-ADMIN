export const QUERY_KEYS = {
  USERS: ["users"] as const,
  PUBLIC_TOKENS: ["public_tokens"] as const,
  CONTENT: (type?: string) => type ? ["content", type] as const : ["content"] as const,
  RECENT_ARTICLES: ["recent-articles"] as const,
} as const;
