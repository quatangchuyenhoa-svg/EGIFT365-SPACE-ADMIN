"use client"

import * as React from "react"
import {
  BookOpen,
  ChartBar,
  Home,
  Palette,
  GalleryVerticalEnd,
} from "lucide-react"

import { NavMain } from "@/components/layout/nav-main"
import { NavUser } from "@/components/layout/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import { useUser } from "@/hooks/useUser"
import { ROUTES } from "@/lib/constants/routes"
import Image from "next/image"
import Link from "next/link"

const data = {
  navMain: [
    {
      title: "Home",
      url: ROUTES.HOME,
      icon: Home,
      isActive: true,
    },
    {
      title: "Sanity Studio",
      url: ROUTES.STUDIO,
      icon: Palette,
    },
    {
      title: "Content Hub",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Kho Tri Thức",
          url: ROUTES.MANAGER.KNOWLEDGE,
        },
        {
          title: "Kho Quan Niệm",
          url: ROUTES.MANAGER.CONCEPTS,
        },
      ],
    },
    {
      title: "Manager",
      url: "#",
      icon: ChartBar,
      items: [
        {
          title: "Users manager",
          url: ROUTES.MANAGER.USERS,
        },
        {
          title: "Public Codes",
          url: ROUTES.MANAGER.PUBLIC_CODES,
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { profile } = useUser()

  const user = {
    name: profile?.full_name || "Admin User",
    email: profile?.email || "",
    avatar: profile?.avatar_url || "",
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground group-data-[collapsible=icon]:!p-0"
              asChild
            >
              <Link href={ROUTES.HOME} className="flex items-center gap-2 overflow-hidden">
                <div className="flex aspect-square size-8 min-w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground group-data-[collapsible=icon]:mx-auto">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight transition-all group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:w-0 group-data-[collapsible=icon]:hidden">
                  <span className="truncate font-bold text-base text-primary">
                    Egift Digital Space
                  </span>
                  <span className="truncate text-xs opacity-70">Admin Panel</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
