"use client"

import { useUser } from "@/hooks/useUser"

/**
 * UserProvider - Component để init và sync user state
 * Nên đặt ở root layout hoặc component cần user data
 */
export function UserProvider({ children }: { children: React.ReactNode }) {
  useUser() // Init và sync user state

  return <>{children}</>
}

