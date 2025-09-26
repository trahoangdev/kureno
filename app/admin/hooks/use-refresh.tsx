"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface RefreshOptions {
  showToast?: boolean
  revalidate?: boolean
  customAction?: () => Promise<void> | void
}

export function useRefresh() {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const refresh = useCallback(async (options: RefreshOptions = {}) => {
    const {
      showToast = true,
      revalidate = true,
      customAction
    } = options

    try {
      setIsRefreshing(true)

      // Execute custom action if provided
      if (customAction) {
        await customAction()
      }

      // Revalidate current page data
      if (revalidate) {
        router.refresh()
      }

      // Force reload of certain components by clearing cache
      if (typeof window !== 'undefined' && 'caches' in window) {
        const cacheNames = await caches.keys()
        await Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        )
      }

      if (showToast) {
        toast({
          title: "Refreshed",
          description: "Page data has been updated",
          duration: 2000,
        })
      }

    } catch (error) {
      console.error("Refresh error:", error)
      
      if (showToast) {
        toast({
          title: "Refresh Failed",
          description: "Failed to refresh page data",
          variant: "destructive",
        })
      }
    } finally {
      setIsRefreshing(false)
    }
  }, [router, toast])

  // Quick refresh with default options
  const quickRefresh = useCallback(() => {
    refresh({ showToast: true, revalidate: true })
  }, [refresh])

  // Silent refresh without toast
  const silentRefresh = useCallback(() => {
    refresh({ showToast: false, revalidate: true })
  }, [refresh])

  // Hard refresh (full page reload)
  const hardRefresh = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.location.reload()
    }
  }, [])

  return {
    refresh,
    quickRefresh,
    silentRefresh,
    hardRefresh,
    isRefreshing,
  }
}
