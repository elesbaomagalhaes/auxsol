"use client"

import { signOut } from "next-auth/react"
import React from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
 
interface BotaoProps {
    children: React.ReactNode
    className: string
    variant?: "primary" | "secondary" | "destructive" | "ghost" | "default" | "link" | "outline" | null | undefined
  }

export default function SignOut({ children, className, variant = "default"}: BotaoProps) {
  const classBase = "flex items-center justify-center gap-2"
  
  return (
    <Button 
      variant={variant as "link" | "default" | "destructive" | "outline" | "secondary" | "ghost" | null | undefined} 
      className={cn(classBase, className)} 
      onClick={() => signOut()}
    >
    {children}
    </Button>
)
}