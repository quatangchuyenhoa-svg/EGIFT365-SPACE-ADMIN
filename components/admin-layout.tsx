"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { ROUTES } from "@/lib/constants/routes"

const pageTitles: Record<string, string> = {
  [ROUTES.HOME]: "Home",
  [ROUTES.MANAGER.USERS]: "Users Manager",
  [ROUTES.MANAGER.PUBLIC_CODES]: "Public Codes Manager",
  [ROUTES.STUDIO]: "Studio",
}

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const title = pageTitles[pathname] || "Home"

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader title={title} />
        <div className="flex flex-1 flex-col">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

