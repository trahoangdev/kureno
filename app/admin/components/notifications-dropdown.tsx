"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { Bell, Check, CheckCheck, X, AlertCircle, Info, CheckCircle2, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

interface Notification {
  _id: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  category: string
  priority: "low" | "medium" | "high" | "urgent"
  isRead: boolean
  actionUrl?: string
  createdAt: string
  readAt?: string
}

interface NotificationsResponse {
  notifications: Notification[]
  unreadCount: number
  success: boolean
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case "success":
      return <CheckCircle2 className="h-4 w-4 text-green-500" />
    case "warning":
      return <AlertTriangle className="h-4 w-4 text-yellow-500" />
    case "error":
      return <AlertCircle className="h-4 w-4 text-red-500" />
    default:
      return <Info className="h-4 w-4 text-blue-500" />
  }
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "urgent":
      return "bg-red-500"
    case "high":
      return "bg-orange-500"
    case "medium":
      return "bg-blue-500"
    default:
      return "bg-gray-500"
  }
}

const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
  
  if (diffInMinutes < 1) return "Just now"
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`
  
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `${diffInHours}h ago`
  
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) return `${diffInDays}d ago`
  
  return date.toLocaleDateString()
}

export default function NotificationsDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const { toast } = useToast()

  const fetchNotifications = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/admin/notifications?limit=10&unreadOnly=false")
      
      if (!response.ok) {
        throw new Error("Failed to fetch notifications")
      }

      const data: NotificationsResponse = await response.json()
      setNotifications(data.notifications)
      setUnreadCount(data.unreadCount)
    } catch (error) {
      console.error("Error fetching notifications:", error)
      toast({
        title: "Error",
        description: "Failed to load notifications",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/admin/notifications/${notificationId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isRead: true }),
      })

      if (!response.ok) {
        throw new Error("Failed to mark notification as read")
      }

      // Update local state
      setNotifications(prev =>
        prev.map(notif =>
          notif._id === notificationId
            ? { ...notif, isRead: true, readAt: new Date().toISOString() }
            : notif
        )
      )
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (error) {
      console.error("Error marking notification as read:", error)
      toast({
        title: "Error",
        description: "Failed to mark notification as read",
        variant: "destructive",
      })
    }
  }

  const markAllAsRead = async () => {
    try {
      const response = await fetch("/api/admin/notifications?action=markAllRead", {
        method: "PATCH",
      })

      if (!response.ok) {
        throw new Error("Failed to mark all notifications as read")
      }

      // Update local state
      setNotifications(prev =>
        prev.map(notif => ({ ...notif, isRead: true, readAt: new Date().toISOString() }))
      )
      setUnreadCount(0)
      
      toast({
        title: "Success",
        description: "All notifications marked as read",
      })
    } catch (error) {
      console.error("Error marking all notifications as read:", error)
      toast({
        title: "Error",
        description: "Failed to mark all notifications as read",
        variant: "destructive",
      })
    }
  }

  const deleteNotification = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/admin/notifications/${notificationId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete notification")
      }

      // Update local state
      const notification = notifications.find(n => n._id === notificationId)
      setNotifications(prev => prev.filter(notif => notif._id !== notificationId))
      
      if (notification && !notification.isRead) {
        setUnreadCount(prev => Math.max(0, prev - 1))
      }
    } catch (error) {
      console.error("Error deleting notification:", error)
      toast({
        title: "Error",
        description: "Failed to delete notification",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    fetchNotifications()
    
    // Set up polling for real-time updates
    const interval = setInterval(fetchNotifications, 30000) // 30 seconds
    
    return () => clearInterval(interval)
  }, [])

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="relative h-8 w-8 p-0 rounded-lg bg-white/40 dark:bg-slate-800/40 hover:bg-white/60 dark:hover:bg-slate-800/60 border border-white/20 dark:border-slate-700/20"
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-gradient-to-r from-red-500 to-red-600 text-white text-xs animate-pulse">
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-80 max-h-[480px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-lg rounded-lg overflow-hidden"
        sideOffset={8}
      >
        {/* Clean Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
              <Bell className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Notifications
              </h3>
              {unreadCount > 0 && (
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {unreadCount} unread
                </p>
              )}
            </div>
          </div>
          
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="h-7 px-2 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              <CheckCheck className="h-3 w-3 mr-1" />
              Mark all read
            </Button>
          )}
        </div>

        {/* Notifications List */}
        <ScrollArea className="max-h-72">
          {isLoading ? (
            <div className="p-4">
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 animate-pulse">
                    <div className="w-2 h-2 bg-slate-200 dark:bg-slate-700 rounded-full" />
                    <div className="w-8 h-8 bg-slate-200 dark:bg-slate-700 rounded" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
                      <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <Bell className="h-6 w-6 text-slate-400" />
              </div>
              <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-1">
                All caught up!
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                No new notifications
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={cn(
                    "group flex items-start gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer",
                    !notification.isRead && "bg-blue-50/50 dark:bg-blue-950/20 border-l-2 border-blue-500"
                  )}
                >
                  {/* Type Icon with Status */}
                  <div className="flex-shrink-0 relative">
                    {getTypeIcon(notification.type)}
                    {!notification.isRead && (
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h4 className={cn(
                          "text-sm text-slate-900 dark:text-slate-100 leading-tight",
                          !notification.isRead && "font-semibold"
                        )}>
                          {notification.title}
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                          {notification.message}
                        </p>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {!notification.isRead && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              markAsRead(notification._id)
                            }}
                            className="h-6 w-6 p-0 hover:bg-green-100 dark:hover:bg-green-900/50 rounded"
                          >
                            <Check className="h-3 w-3 text-green-600 dark:text-green-400" />
                          </Button>
                        )}
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteNotification(notification._id)
                          }}
                          className="h-6 w-6 p-0 hover:bg-red-100 dark:hover:bg-red-900/50 rounded"
                        >
                          <X className="h-3 w-3 text-red-600 dark:text-red-400" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {formatTimeAgo(notification.createdAt)}
                        </span>
                        
                        <Badge
                          variant="secondary"
                          className="text-xs px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                        >
                          {notification.category}
                        </Badge>
                      </div>
                      
                      {notification.actionUrl && (
                        <Link href={notification.actionUrl}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 text-xs text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                            onClick={() => {
                              if (!notification.isRead) {
                                markAsRead(notification._id)
                              }
                              setIsOpen(false)
                            }}
                          >
                            View
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Footer */}
        {notifications.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <div className="p-3 bg-slate-50 dark:bg-slate-800">
              <Link href="/admin/notifications">
                <Button
                  variant="ghost"
                  className="w-full justify-center text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  View all notifications
                  <span className="ml-2 text-xs bg-slate-200 dark:bg-slate-600 px-1.5 py-0.5 rounded">
                    {notifications.length}
                  </span>
                </Button>
              </Link>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
