"use client"

import { useState } from "react"
import Link from "next/link"
import { IconChevronDown, IconChevronRight, type Icon } from "@tabler/icons-react"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: Icon
    items?: {
      title: string
      url: string
      icon?: Icon
    }[]
  }[]
}) {
  const [openMap, setOpenMap] = useState<Record<string, boolean>>({})

  const toggle = (key: string) =>
    setOpenMap((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-3">
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild={!item.items}
                tooltip={item.title}
                onClick={item.items ? () => toggle(item.title) : undefined}
                className="gap-4 h-11"
                size="lg"
              >
                {item.items ? (
                  <div className="flex w-full items-center gap-4">
                    {item.icon && <item.icon className="size-6 shrink-0" />}
                    <span className="flex-1 text-left font-medium text-base">{item.title}</span>
                    {openMap[item.title] ? (
                      <IconChevronDown className="size-5 shrink-0" />
                    ) : (
                      <IconChevronRight className="size-5 shrink-0" />
                    )}
                  </div>
                ) : item.url === "/studio" ? (
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 w-full">
                    {item.icon && <item.icon className="size-6 shrink-0" />}
                    <span className="font-medium text-base">{item.title}</span>
                  </a>
                ) : (
                  <Link href={item.url} className="flex items-center gap-4 w-full">
                    {item.icon && <item.icon className="size-6 shrink-0" />}
                    <span className="font-medium text-base">{item.title}</span>
                  </Link>
                )}
              </SidebarMenuButton>
              {item.items && item.items.length > 0 && (
                <SidebarMenuSub className={cn(!openMap[item.title] && "hidden")}>
                  {item.items.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton asChild size="md" className="h-10">
                        <Link href={subItem.url} className="flex items-center gap-3 w-full">
                          {subItem.icon && <subItem.icon className="size-5 shrink-0" />}
                          <span className="font-medium text-base">{subItem.title}</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              )}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
