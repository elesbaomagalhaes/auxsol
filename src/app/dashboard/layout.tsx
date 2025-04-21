"use client"

import type React from "react"
import "./globals.css";
import { DashboardSidebar } from "@/components/dashboardpage/dashboard-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

// Dados de exemplo do usuário

const user = {
  name: "João Silva",
  email: "joao@exemplo.com",
  image: "/placeholder.svg?height=32&width=32",
}

// Adicione os imports necessários
import { usePathname } from "next/navigation"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

// Modifique a função DashboardLayout para incluir o Breadcrumb
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  // Função para gerar o breadcrumb com base no pathname
  const generateBreadcrumb = () => {
    const paths = pathname?.split("/").filter(Boolean) ?? []

    // Se estamos apenas em /dashboard, não precisamos de breadcrumb completo
    if (paths.length === 1) {
      return (
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Dashboard</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      )
    }

    return (
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        {paths.slice(1).map((path, index) => {
          const href = `/${paths.slice(0, index + 2).join("/")}`
          const isLast = index === paths.slice(1).length - 1

          // Formatar o texto do breadcrumb para capitalizar a primeira letra
          const formattedPath = path.charAt(0).toUpperCase() + path.slice(1)

          return (
            <BreadcrumbItem key={path}>
              {isLast ? (
                <BreadcrumbPage>{formattedPath}</BreadcrumbPage>
              ) : (
                <>
                  <BreadcrumbLink href={href}>{formattedPath}</BreadcrumbLink>
                  <BreadcrumbSeparator />
                </>
              )}
            </BreadcrumbItem>
          )
        })}
      </BreadcrumbList>
    )
  }

  return (
    <SidebarProvider>
      <DashboardSidebar user={user} />
      <SidebarInset>
        <div className="flex flex-col min-h-screen">
          <header className="h-14 border-b flex items-center px-6">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="h-8 w-8" />
              <Separator orientation="vertical" className="h-6" />
              <Breadcrumb>{generateBreadcrumb()}</Breadcrumb>
            </div>
          </header>
          <main className="flex-1 p-6">{children}</main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
