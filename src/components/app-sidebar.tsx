"use client"

import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,

  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { BuildingComplex, CalendarDays, GalleryVerticalEndIcon, HomeIcon, NotebookDot, UsersIcon } from "lucide-react"

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
   teams: [
    {
      name: "Acme Inc",
      logo: (
        <GalleryVerticalEndIcon/>
        
      ),
      plan: "Enterprise",
    },
  ],
 
 navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: <HomeIcon className="h-5 w-5" />,
    },
    {
      title: "Users",
      url: "/user",
      icon: <UsersIcon className="h-5 w-5" />,
    },
      {
      title: "Department",
      url: "/department",
      icon: <BuildingComplex className="h-5 w-5" />,
    },
    {
      title: "Courses",
      url: "/course",
      icon: <NotebookDot className="h-5 w-5" />,
    },
    {
  title: "Academic Years",
  url: "/academic-year",
  icon: <CalendarDays className="h-5 w-5" />,
}
    
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar className="bg-[#FAFAFA] border-r border-[#E5E7EB]" collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
       
      </SidebarContent>
      {/* <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter> */}
      <SidebarRail />
    </Sidebar>
  )
}
