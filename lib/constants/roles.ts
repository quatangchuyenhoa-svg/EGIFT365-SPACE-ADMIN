export const ROLES = ["guest", "member", "mentor", "master"] as const
export type Role = (typeof ROLES)[number]

