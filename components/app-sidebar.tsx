"use client";

import * as React from "react";
import {
  IconChartBar,
  IconHome2,
  IconInnerShadowTop,
  IconKey,
  IconPalette,
  IconUsers,
} from "@tabler/icons-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useUser } from "@/hooks/useUser";
import { ROUTES } from "@/lib/constants/routes";

const data = {
  navMain: [
    {
      title: "Home",
      url: ROUTES.HOME,
      icon: IconHome2,
    },
    {
      title: "Studio",
      url: "/studio",
      icon: IconPalette,
    },
    {
      title: "Manager",
      url: "#",
      icon: IconChartBar,
      items: [
        {
          title: "Users manager",
          url: ROUTES.MANAGER.USERS,
          icon: IconUsers,
        },
        {
          title: "Public Codes",
          url: ROUTES.MANAGER.PUBLIC_CODES,
          icon: IconKey,
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { profile } = useUser();

  const user = {
    name: profile?.full_name || "User",
    email: profile?.email || "",
    avatar: profile?.avatar_url || undefined,
  };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <a href={ROUTES.HOME}>
                <IconInnerShadowTop className="size-5!" />
                <span className="text-base font-semibold">Egift365 Admin</span>
              </a>
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
    </Sidebar>
  );
}
