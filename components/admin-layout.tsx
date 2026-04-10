"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { ROUTES } from "@/lib/constants/routes"
import { useTranslation, TranslationProvider } from "@/lib/i18n/client"

function AdminLayoutContent({ 
  children, 
  lng 
}: { 
  children: React.ReactNode, 
  lng: string 
}) {
  const pathname = usePathname()
  const { t } = useTranslation('common')

  const pageTitles: Record<string, string> = {
    [ROUTES.HOME]: t('sidebar.home'),
    [ROUTES.MANAGER.USERS]: t('sidebar.users_manager'),
    [ROUTES.MANAGER.PUBLIC_CODES]: t('sidebar.public_codes'),
    [ROUTES.MANAGER.KNOWLEDGE]: t('sidebar.knowledge_base'),
    [ROUTES.MANAGER.CONCEPTS]: t('sidebar.concepts_base'),
    [ROUTES.STUDIO]: t('sidebar.sanity'),
  }

  const title = pageTitles[pathname] || t('sidebar.home')

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
        <AppSidebar variant="floating" lng={lng} />
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

export function AdminLayout({
  children,
  lng,
  resources,
}: {
  children: React.ReactNode,
  lng: string,
  resources: Record<string, Record<string, unknown>>,
}) {
  return (
    <TranslationProvider lng={lng} resources={resources}>
      <AdminLayoutContent lng={lng}>
        {children}
      </AdminLayoutContent>
    </TranslationProvider>
  )
}

