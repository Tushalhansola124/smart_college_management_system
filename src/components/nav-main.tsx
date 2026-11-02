"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: React.ReactNode
  }[]
}) {
  const pathname = usePathname()

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu className="gap-1.5">
        {items.map((item) => {
          const isActive =
            pathname === item.url || pathname.startsWith(item.url + "/")

          return (
            <SidebarMenuItem key={item.title} className="px-1">
              <SidebarMenuButton
                
                isActive={isActive}
                tooltip={item.title}
                className={cn(
                  "h-11 px-3 rounded-lg transition-all duration-200",
                  "text-[#0F172A]",
                  // Hover → solid secondary
                  "hover:!from-[#0F766E] hover:!to-[#0D9488] hover:!text-white hover:!bg-[#0F766E] hover:!text-white",
                  // Active → gradient (left #0F766E → right #0D9488)
                  isActive &&
                    "!bg-gradient-to-r !from-[#0F766E] !to-[#28c2b5] !text-white"
                )}
              >
                <Link href={item.url} className="flex  text-base items-center gap-3 w-full">
                  {item.icon}
                  <span className="font-medium text-base">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}