'use client'

import { useSession } from "next-auth/react"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"

export default function DashboardSidebarClient() {
  const { data: session } = useSession()

  return <DashboardSidebar session={session} />
}