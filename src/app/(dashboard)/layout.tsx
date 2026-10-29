"use client"

import { usePathname, useRouter } from "next/navigation"
import { signOut, useSession } from "next-auth/react"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { AppSidebar } from "@/components/app-sidebar"

import React from "react"
import { UserMenu } from "@/components/logout/logout"


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session } = useSession()

  const pathname = usePathname()

 

  // Dynamic breadcrumb from path
  // /dashboard          → Dashboard
  // /dashboard/users    → Dashboard / Users
  // /dashboard/users/1  → Dashboard / Users / 1
  const segments = pathname
    .split("/")
    .filter(Boolean) // remove empty
    .slice(1) // remove "dashboard" prefix for cleaner crumbs (optional)



  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-[rgb(255,254,254)]">
        {/* Header */}
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-border/40 px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          {/* Left – Trigger + Breadcrumb */}
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-vertical:h-4 data-vertical:self-auto"
            />

            <Breadcrumb>
              <BreadcrumbList>
                {/* Always show Dashboard */}
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>

                {segments.length > 0 && (
                  <BreadcrumbSeparator className="hidden md:block" />
                )}

                {segments.map((segment, index) => {
                  const href = `/dashboard/${segments.slice(0, index + 1).join("/")}`
                  const isLast = index === segments.length - 1
                  const label =
                    segment.charAt(0).toUpperCase() +
                    segment.slice(1).replace(/-/g, " ")

                  return (
                    <React.Fragment key={href}>
                      <BreadcrumbItem>
                        {isLast ? (
                          <BreadcrumbPage>{label}</BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink href={href}>{label}</BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                      {!isLast && <BreadcrumbSeparator />}
                    </React.Fragment>
                  )
                })}
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          {/* Right – User Profile + Logout */}
          <UserMenu />
        </header>

        {/* Page content */}
        <div className="flex flex-1 flex-col gap-4 p-4 pt-4 bg-[rgb(255,254,254)]">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}