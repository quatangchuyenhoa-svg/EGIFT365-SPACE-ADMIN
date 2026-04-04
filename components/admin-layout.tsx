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
    <div className="relative min-h-screen">
      {/* Premium Elegant Background Pattern for Admin */}
      <div className="fixed inset-0 z-[-1] h-full w-full bg-background bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(234,88,12,0.15),rgba(255,255,255,0))]" />

      <SidebarProvider
        style={
          {
            "--sidebar-width": "18rem", // A bit wider for elegant typography
            "--header-height": "4rem",
          } as React.CSSProperties
        }
      >
        {/* Use floating variant for a detached glassmorphism look */}
        <AppSidebar variant="floating" />
        <SidebarInset className="bg-transparent/0">
          <SiteHeader title={title} />
          <div className="flex flex-1 flex-col px-4 pb-8 pt-4 md:px-8">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}

