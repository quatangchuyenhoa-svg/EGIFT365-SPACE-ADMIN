"use client";

import * as React from "react";
import {
  IconChartBar,
  IconHome2,
  IconKey,
  IconBook2,
  IconEdit,
  IconUsers,
} from "@tabler/icons-react";
import Image from "next/image";

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
import { useTranslation } from "@/lib/i18n/client";

export function AppSidebar({ lng, ...props }: React.ComponentProps<typeof Sidebar> & { lng: string }) {
  const { profile } = useUser();
  const { t } = useTranslation('common', { lng });

  const sidebarData = {
    navMain: [
      {
        title: t('sidebar.home'),
        url: ROUTES.HOME,
        icon: IconHome2,
      },
      {
        title: t('sidebar.sanity'),
        url: ROUTES.STUDIO,
        icon: IconEdit,
      },
      {
        title: t('sidebar.content_hub'),
        url: "#",
        icon: IconBook2,
        items: [
          {
            title: t('sidebar.knowledge_base'),
            url: ROUTES.MANAGER.KNOWLEDGE,
            icon: IconBook2,
          },
          {
            title: t('sidebar.concepts_base'),
            url: ROUTES.MANAGER.CONCEPTS,
            icon: IconBook2,
          },
        ],
      },
      {
        title: t('sidebar.manager'),
        url: "#",
        icon: IconChartBar,
        items: [
          {
            title: t('sidebar.concepts'),
            url: ROUTES.MANAGER.ANALYTICS,
            icon: IconChartBar,
          },
          {
            title: t('sidebar.users_manager'),
            url: ROUTES.MANAGER.USERS,
            icon: IconUsers,
          },
          {
            title: t('sidebar.public_codes'),
            url: ROUTES.MANAGER.PUBLIC_CODES,
            icon: IconKey,
          },
        ],
      },
    ],
  };

  const user = {
    name: profile?.full_name || "User",
    email: profile?.email || "",
    avatar: profile?.avatar_url || undefined,
  };

  return (
    <Sidebar
      collapsible="offcanvas"
      className="bg-white/60 dark:bg-black/30 backdrop-blur-2xl border-white/20 shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-300"
      {...props}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              size="lg"
              className="data-[slot=sidebar-menu-button]:h-auto data-[slot=sidebar-menu-button]:py-2"
            >
              <a href={ROUTES.HOME}>
                <Image
                  src="/logo/space_logo.png"
                  alt="Egift365 Admin"
                  width={150}
                  height={50}
                  className="h-12 w-auto object-contain"
                />
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={sidebarData.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
