'use client'

import { ReactNode } from "react"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

import DashboardSidebarClient from "@/components/dashboard/dashboard-sidebar-client"
import BreadcrumbNav from "@/components/dashboard/breadcrumb-nav"
import { SessionProvider } from "next-auth/react"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <SidebarProvider>
        <DashboardSidebarClient />
        <SidebarInset>
          <div className="flex flex-col min-h-screen">
            <header className="h-14 border-b flex items-center px-6">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="h-8 w-8" />
                <Separator orientation="vertical" className="h-6" />
                <BreadcrumbNav />
              </div>
            </header>
            <main className="flex-1 p-6">{children}</main>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </SessionProvider>
  )
}