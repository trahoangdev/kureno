"use client"

import React from "react"
import { RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useRefresh } from "../hooks/use-refresh"

interface RefreshButtonProps {
  variant?: "ghost" | "outline" | "default"
  size?: "sm" | "default" | "lg" | "icon"
  className?: string
  customAction?: () => Promise<void> | void
  showToast?: boolean
  children?: React.ReactNode
}

export default function RefreshButton({
  variant = "ghost",
  size = "sm",
  className,
  customAction,
  showToast = true,
  children,
}: RefreshButtonProps) {
  const { refresh, isRefreshing } = useRefresh()

  const handleRefresh = () => {
    refresh({
      showToast,
      revalidate: true,
      customAction,
    })
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleRefresh}
      disabled={isRefreshing}
      className={cn(
        "transition-all duration-200",
        size === "sm" && !children && "h-8 w-8 p-0 rounded-lg bg-white/40 dark:bg-slate-800/40 hover:bg-white/60 dark:hover:bg-slate-800/60 border border-white/20 dark:border-slate-700/20",
        className
      )}
    >
      <RefreshCw 
        className={cn(
          "transition-transform duration-500",
          isRefreshing && "animate-spin",
          children ? "mr-2 h-4 w-4" : "h-4 w-4"
        )} 
      />
      {children && (
        <span>{isRefreshing ? "Refreshing..." : children}</span>
      )}
      {!children && <span className="sr-only">Refresh</span>}
    </Button>
  )
}
