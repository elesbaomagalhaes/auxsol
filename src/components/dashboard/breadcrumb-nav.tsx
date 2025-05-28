'use client'

import { usePathname } from "next/navigation"
import { ChevronRight } from "lucide-react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"

export default function BreadcrumbNav() {
  const pathname = usePathname()
  const paths = pathname?.split("/").filter(Boolean) ?? []

  if (paths.length === 1) {
    return (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Dashboard</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    )
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
        </BreadcrumbItem>
        {paths.slice(1).map((path, index) => {
          const href = `/${paths.slice(0, index + 2).join("/")}`
          const isLast = index === paths.slice(1).length - 1
          const formattedPath = path.charAt(0).toUpperCase() + path.slice(1)

          return (
            <BreadcrumbItem key={path}>
              {isLast ? (
                <BreadcrumbPage>{formattedPath}</BreadcrumbPage>
              ) : (
                <>
                  <BreadcrumbLink href={href}>{formattedPath}</BreadcrumbLink>
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
                </>
              )}
            </BreadcrumbItem>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}