"use client"

import React, { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { 
  Bell, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Check, 
  CheckCheck,
  X, 
  Trash2, 
  Eye,
  AlertCircle,
  Info,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Calendar,
  User,
  Tag,
  ExternalLink,
  Zap,
  TrendingUp,
  Activity
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
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
  relatedEntity?: {
    type: string
    id: string
  }
}

interface NotificationStats {
  total: number
  unread: number
  byType: Record<string, number>
  byCategory: Record<string, number>
  byPriority: Record<string, number>
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
      return "bg-red-500 text-white"
    case "high":
      return "bg-orange-500 text-white"
    case "medium":
      return "bg-blue-500 text-white"
    default:
      return "bg-gray-500 text-white"
  }
}

const getCategoryColor = (category: string) => {
  switch (category) {
    case "orders":
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
    case "products":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
    case "users":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
    case "system":
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
    case "comments":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
    case "reviews":
      return "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300"
    case "messages":
      return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
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

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [stats, setStats] = useState<NotificationStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [filterType, setFilterType] = useState("all")
  const [filterPriority, setFilterPriority] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)

  const { toast } = useToast()

  const fetchNotifications = useCallback(async () => {
    try {
      setIsLoading(true)
      
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "20",
      })

      if (filterCategory !== "all") params.append("category", filterCategory)
      if (filterType !== "all") params.append("type", filterType)  
      if (filterPriority !== "all") params.append("priority", filterPriority)
      if (filterStatus === "unread") params.append("unreadOnly", "true")
      if (searchQuery) params.append("search", searchQuery)

      const response = await fetch(`/api/admin/notifications?${params}`)
      
      if (!response.ok) {
        throw new Error("Failed to fetch notifications")
      }

      const data = await response.json()
      setNotifications(data.notifications)
      setTotalPages(data.pagination.pages)
      
      // Calculate stats
      const statsData: NotificationStats = {
        total: data.pagination.total,
        unread: data.unreadCount,
        byType: {},
        byCategory: {},
        byPriority: {},
      }

      data.notifications.forEach((notif: Notification) => {
        statsData.byType[notif.type] = (statsData.byType[notif.type] || 0) + 1
        statsData.byCategory[notif.category] = (statsData.byCategory[notif.category] || 0) + 1
        statsData.byPriority[notif.priority] = (statsData.byPriority[notif.priority] || 0) + 1
      })

      setStats(statsData)
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
  }, [currentPage, filterCategory, filterType, filterPriority, filterStatus, searchQuery, toast])

  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(new Set(notifications.map(n => n._id)))
    } else {
      setSelectedItems(new Set())
    }
  }

  const handleSelectItem = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedItems)
    if (checked) {
      newSelected.add(id)
    } else {
      newSelected.delete(id)
    }
    setSelectedItems(newSelected)
  }

  const markAsRead = async (notificationIds: string[]) => {
    try {
      await Promise.all(
        notificationIds.map(id =>
          fetch(`/api/admin/notifications/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ isRead: true }),
          })
        )
      )

      setNotifications(prev =>
        prev.map(notif =>
          notificationIds.includes(notif._id)
            ? { ...notif, isRead: true, readAt: new Date().toISOString() }
            : notif
        )
      )

      toast({
        title: "Success",
        description: `${notificationIds.length} notification(s) marked as read`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark notifications as read",
        variant: "destructive",
      })
    }
  }

  const deleteNotifications = async (notificationIds: string[]) => {
    try {
      await Promise.all(
        notificationIds.map(id =>
          fetch(`/api/admin/notifications/${id}`, {
            method: "DELETE",
          })
        )
      )

      setNotifications(prev => prev.filter(notif => !notificationIds.includes(notif._id)))
      setSelectedItems(new Set())

      toast({
        title: "Success",
        description: `${notificationIds.length} notification(s) deleted`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete notifications",
        variant: "destructive",
      })
    }
  }

  const handleBulkAction = (action: string) => {
    const selectedIds = Array.from(selectedItems)
    if (selectedIds.length === 0) return

    switch (action) {
      case "markRead":
        markAsRead(selectedIds)
        break
      case "delete":
        setDeleteTarget("bulk")
        setShowDeleteDialog(true)
        break
    }
  }

  const handleDeleteConfirm = () => {
    if (deleteTarget === "bulk") {
      deleteNotifications(Array.from(selectedItems))
    } else if (deleteTarget) {
      deleteNotifications([deleteTarget])
    }
    setShowDeleteDialog(false)
    setDeleteTarget(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">
            Manage and monitor system notifications
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => fetchNotifications()}
            disabled={isLoading}
          >
            <Activity className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Notifications</CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">
                All time notifications
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unread</CardTitle>
              <AlertCircle className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.unread}</div>
              <p className="text-xs text-muted-foreground">
                Require attention
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">High Priority</CardTitle>
              <Zap className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {(stats.byPriority.urgent || 0) + (stats.byPriority.high || 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                Urgent + High priority
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {stats.total > 0 ? Math.round(((stats.byType.success || 0) / stats.total) * 100) : 0}%
              </div>
              <p className="text-xs text-muted-foreground">
                Success notifications
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters & Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search notifications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="unread">Unread</SelectItem>
                  <SelectItem value="read">Read</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                  <SelectItem value="orders">Orders</SelectItem>
                  <SelectItem value="products">Products</SelectItem>
                  <SelectItem value="users">Users</SelectItem>
                  <SelectItem value="comments">Comments</SelectItem>
                  <SelectItem value="reviews">Reviews</SelectItem>
                  <SelectItem value="messages">Messages</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedItems.size > 0 && (
        <Card className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{selectedItems.size} selected</Badge>
                <span className="text-sm text-muted-foreground">
                  {selectedItems.size} notification(s) selected
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction("markRead")}
                >
                  <Check className="h-4 w-4 mr-2" />
                  Mark as Read
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction("delete")}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedItems(new Set())}
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notifications Table */}
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>
            {stats && `${stats.total} total notifications, ${stats.unread} unread`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div className="h-4 w-4 bg-muted animate-pulse rounded" />
                  <div className="h-4 w-8 bg-muted animate-pulse rounded" />
                  <div className="h-4 flex-1 bg-muted animate-pulse rounded" />
                  <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                  <div className="h-4 w-16 bg-muted animate-pulse rounded" />
                </div>
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedItems.size === notifications.length && notifications.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {notifications.map((notification) => (
                  <TableRow
                    key={notification._id}
                    className={cn(
                      "transition-colors hover:bg-muted/50",
                      !notification.isRead && "bg-blue-50/30 dark:bg-blue-950/20"
                    )}
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedItems.has(notification._id)}
                        onCheckedChange={(checked) =>
                          handleSelectItem(notification._id, checked as boolean)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getTypeIcon(notification.type)}
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className={cn(
                          "font-medium",
                          !notification.isRead && "font-semibold"
                        )}>
                          {notification.title}
                        </div>
                        <div className="text-sm text-muted-foreground line-clamp-1">
                          {notification.message}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={getCategoryColor(notification.category)}
                      >
                        {notification.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={getPriorityColor(notification.priority)}
                      >
                        {notification.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground">
                        {formatTimeAgo(notification.createdAt)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {!notification.isRead && (
                            <DropdownMenuItem
                              onClick={() => markAsRead([notification._id])}
                            >
                              <Check className="mr-2 h-4 w-4" />
                              Mark as Read
                            </DropdownMenuItem>
                          )}
                          {notification.actionUrl && (
                            <DropdownMenuItem asChild>
                              <Link href={notification.actionUrl}>
                                <ExternalLink className="mr-2 h-4 w-4" />
                                Open Link
                              </Link>
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => {
                              setDeleteTarget(notification._id)
                              setShowDeleteDialog(true)
                            }}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {!isLoading && notifications.length === 0 && (
            <div className="text-center py-8">
              <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No notifications found</h3>
              <p className="text-muted-foreground">
                {searchQuery || filterCategory !== "all" || filterStatus !== "all"
                  ? "Try adjusting your filters"
                  : "No notifications have been created yet"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget === "bulk"
                ? `Are you sure you want to delete ${selectedItems.size} selected notification(s)?`
                : "Are you sure you want to delete this notification?"
              }
              {" "}This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
