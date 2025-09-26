"use client"

import React, { useEffect, useMemo, useState } from "react"
import RefreshButton from "../components/refresh-button"
import ExportImportDialog from "../components/export-import-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Search, 
  MoreHorizontal, 
  Eye, 
  Trash, 
  CheckCircle, 
  Download, 
  CheckSquare, 
  XSquare,
  MessageSquare,
  TrendingUp,
  Users,
  Calendar,
  Clock,
  Filter,
  Upload,
  RefreshCw,
  Grid3X3,
  List,
  SortAsc,
  SortDesc,
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  X,
  Check,
  Copy,
  ExternalLink,
  Mail,
  Phone,
  MapPin,
  Heart,
  Star,
  AlertTriangle,
  Clock3,
  Globe,
  Lock,
  Unlock,
  Archive,
  Bookmark,
  Settings,
  MoreVertical,
  Printer,
  Send,
  Bell,
  Flag,
  Layers,
  Database,
  Server,
  Cloud,
  Sun,
  Moon,
  Sunrise,
  Sunset,
  Thermometer,
  Droplets,
  Wind,
  Waves,
  Mountain,
  Trees,
  Leaf,
  Flower,
  Bug,
  Fish,
  Bird,
  Cat,
  Dog,
  Rabbit,
  Turtle,
  Reply,
  Forward,
  Archive as ArchiveIcon,
  Tag,
  User,
  UserCheck,
  UserX,
  Shield,
  Crown,
  Award,
  Zap,
  Target,
  Activity,
  BarChart3,
  PieChart,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Minus,
  Edit,
  Save,
  Trash2,
  Ban,
  Key,
  EyeOff,
  Eye as EyeIcon
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

interface MessageItem {
  _id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  subject: string
  message: string
  read: boolean
  priority?: "low" | "medium" | "high"
  category?: string
  tags?: string[]
  createdAt: string
  updatedAt?: string
  repliedAt?: string
  archived?: boolean
  starred?: boolean
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<MessageItem[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [viewItem, setViewItem] = useState<MessageItem | null>(null)
  const [statusFilter, setStatusFilter] = useState("all")
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [total, setTotal] = useState(0)
  const [selected, setSelected] = useState<Record<string, boolean>>({})
  const [viewMode, setViewMode] = useState<"table" | "grid">("table")
  const [sortBy, setSortBy] = useState("createdAt")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [showFilters, setShowFilters] = useState(false)
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const params = new URLSearchParams({ page: String(page), limit: String(limit) })
      if (search) params.set("q", search)
      if (statusFilter !== "all") params.set("status", statusFilter)
      const res = await fetch(`/api/admin/messages?${params.toString()}`)
      const data = await res.json()
      setMessages(data.messages)
      setTotal(data.pagination?.total || 0)
      setLoading(false)
    }
    fetchData()
  }, [page, limit, search, statusFilter])

  const filtered = useMemo(() => {
    let filteredMessages = messages

    // Search filter
    if (search) {
      filteredMessages = filteredMessages.filter((m) => 
        [m.firstName, m.lastName, m.email, m.subject, m.message].some((v) => 
          v?.toLowerCase().includes(search.toLowerCase())
        )
      )
    }

    // Status filter
    if (statusFilter !== "all") {
      filteredMessages = filteredMessages.filter((m) => 
        statusFilter === "read" ? m.read : !m.read
      )
    }

    // Priority filter
    if (priorityFilter !== "all") {
      filteredMessages = filteredMessages.filter((m) => m.priority === priorityFilter)
    }

    // Category filter
    if (categoryFilter !== "all") {
      filteredMessages = filteredMessages.filter((m) => m.category === categoryFilter)
    }

    // Sorting
    filteredMessages.sort((a, b) => {
      let aValue: any = a[sortBy as keyof MessageItem]
      let bValue: any = b[sortBy as keyof MessageItem]

      if (sortBy === "createdAt" || sortBy === "updatedAt" || sortBy === "repliedAt") {
        aValue = new Date(aValue || 0).getTime()
        bValue = new Date(bValue || 0).getTime()
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    return filteredMessages
  }, [messages, search, statusFilter, priorityFilter, categoryFilter, sortBy, sortOrder])

  // Calculate stats
  const stats = useMemo(() => {
    const totalMessages = messages.length
    const unreadMessages = messages.filter(m => !m.read).length
    const readMessages = totalMessages - unreadMessages
    const highPriorityMessages = messages.filter(m => m.priority === "high").length
    const starredMessages = messages.filter(m => m.starred).length
    const archivedMessages = messages.filter(m => m.archived).length
    const repliedMessages = messages.filter(m => m.repliedAt).length

    return {
      totalMessages,
      unreadMessages,
      readMessages,
      highPriorityMessages,
      starredMessages,
      archivedMessages,
      repliedMessages
    }
  }, [messages])

  // Helper functions
  const handleSelectMessage = (messageId: string) => {
    setSelected(prev => ({
      ...prev,
      [messageId]: !prev[messageId]
    }))
  }

  const handleSelectAll = () => {
    const allSelected = Object.keys(selected).length === filtered.length && filtered.length > 0
    if (allSelected) {
      setSelected({})
    } else {
      const newSelected: Record<string, boolean> = {}
      filtered.forEach(m => newSelected[m._id] = true)
      setSelected(newSelected)
    }
  }

  const handleBulkAction = async (action: string) => {
    const selectedIds = Object.entries(selected).filter(([, v]) => v).map(([k]) => k)
    
    switch (action) {
      case 'markRead':
        await Promise.all(selectedIds.map((id) => markRead(id, true)))
        break
      case 'markUnread':
        await Promise.all(selectedIds.map((id) => markRead(id, false)))
        break
      case 'delete':
        if (confirm(`Delete ${selectedIds.length} messages?`)) {
          await bulkDelete()
        }
        break
      case 'archive':
        // Implement archive functionality
        break
    }
    setSelected({})
  }

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(column)
      setSortOrder("desc")
    }
  }

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500/20 text-red-600 dark:text-red-400"
      case "medium":
        return "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400"
      case "low":
        return "bg-green-500/20 text-green-600 dark:text-green-400"
      default:
        return "bg-gray-500/20 text-gray-600 dark:text-gray-400"
    }
  }

  const getPriorityIcon = (priority?: string) => {
    switch (priority) {
      case "high":
        return AlertTriangle
      case "medium":
        return Clock3
      case "low":
        return CheckCircle
      default:
        return MessageSquare
    }
  }

  const getStatusColor = (read: boolean) => {
    return read 
      ? "bg-green-500/20 text-green-600 dark:text-green-400" 
      : "bg-blue-500/20 text-blue-600 dark:text-blue-400"
  }

  const getStatusIcon = (read: boolean) => {
    return read ? CheckCircle : Clock3
  }

  const markRead = async (id: string, read: boolean) => {
    const res = await fetch("/api/admin/messages", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, read }),
    })
    if (res.ok) setMessages((prev) => prev.map((m) => (m._id === id ? { ...m, read } : m)))
  }

  const remove = async (id: string) => {
    if (!confirm("Delete this message?")) return
    const res = await fetch(`/api/admin/messages?id=${id}`, { method: "DELETE" })
    if (res.ok) setMessages((prev) => prev.filter((m) => m._id !== id))
  }

  const selectedIds = Object.entries(selected).filter(([, v]) => v).map(([k]) => k)
  const toggleSelect = (id: string, value: boolean) => setSelected((p) => ({ ...p, [id]: value }))
  const selectPage = (value: boolean) => {
    const ids = messages.map((m) => m._id)
    setSelected((p) => {
      const copy = { ...p }
      ids.forEach((id) => (copy[id] = value))
      return copy
    })
  }
  const bulkMark = async (read: boolean) => {
    await Promise.all(selectedIds.map((id) => markRead(id, read)))
    setSelected({})
  }
  const bulkDelete = async () => {
    if (!selectedIds.length) return
    if (!confirm(`Delete ${selectedIds.length} messages?`)) return
    const res = await fetch(`/api/admin/messages?ids=${selectedIds.join(",")}`, { method: "DELETE" })
    if (res.ok) {
      setMessages((prev) => prev.filter((m) => !selectedIds.includes(m._id)))
      setSelected({})
    }
  }
  const exportCsv = () => {
    const rows = [["Name", "Email", "Subject", "Date", "Read"], ...messages.map((m) => [
      `${m.firstName} ${m.lastName}`.trim(), m.email, m.subject, new Date(m.createdAt).toISOString(), String(m.read),
    ])]
    const csv = rows.map((r) => r.map((f) => `"${String(f).replace(/"/g, '""')}"`).join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `messages_page_${page}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-8">
      {/* Enhanced Header Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 dark:from-cyan-950/20 dark:via-blue-950/20 dark:to-indigo-950/20 p-8">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(6,182,212,0.1),transparent_50%),radial-gradient(ellipse_at_bottom_left,rgba(59,130,246,0.1),transparent_50%)] -z-10" />
        
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Badge className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-3 py-1 text-sm font-medium">
                <MessageSquare className="h-3 w-3 mr-1" />
                Message Center
              </Badge>
              <Badge variant="outline" className="text-xs">
                <Activity className="h-3 w-3 mr-1" />
                Communication Hub
              </Badge>
            </div>
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Contact Messages
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Manage customer inquiries, support requests, and feedback with powerful communication tools and automated workflows.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <ExportImportDialog 
              trigger={
                <Button variant="outline" size="sm" className="rounded-full">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              }
            />
            <RefreshButton variant="outline" size="sm" className="rounded-full" />
            <Button variant="outline" size="sm" className="rounded-full">
              <Send className="mr-2 h-4 w-4" />
              Compose
            </Button>
          </div>
        </div>
        
        {/* Quick Stats Preview */}
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-cyan-600">{stats.totalMessages}</div>
            <div className="text-xs text-muted-foreground">Total Messages</div>
            <div className="text-xs text-green-600 flex items-center justify-center gap-1">
              <TrendingUp className="h-3 w-3" />
              +15%
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.unreadMessages}</div>
            <div className="text-xs text-muted-foreground">Unread</div>
            <div className="text-xs text-orange-600 flex items-center justify-center gap-1">
              <Clock3 className="h-3 w-3" />
              Needs attention
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-600">{stats.highPriorityMessages}</div>
            <div className="text-xs text-muted-foreground">High Priority</div>
            <div className="text-xs text-red-600 flex items-center justify-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              Urgent
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{stats.repliedMessages}</div>
            <div className="text-xs text-muted-foreground">Replied</div>
            <div className="text-xs text-green-600 flex items-center justify-center gap-1">
              <CheckCircle className="h-3 w-3" />
              {Math.round((stats.repliedMessages / stats.totalMessages) * 100)}%
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Search and Filter Section */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                  placeholder="Search messages, names, subjects..." 
                  className="pl-10 rounded-full" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowFilters(!showFilters)}
                className="rounded-full"
              >
                <Filter className="mr-2 h-4 w-4" />
                Filters
                {showFilters ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center border rounded-full p-1">
                <Button
                  variant={viewMode === "table" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("table")}
                  className="rounded-full"
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-full"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-6 p-4 border rounded-lg bg-muted/30">
              <div className="grid gap-4 md:grid-cols-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Sort By</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="createdAt">Date Received</SelectItem>
                      <SelectItem value="updatedAt">Last Updated</SelectItem>
                      <SelectItem value="subject">Subject</SelectItem>
                      <SelectItem value="firstName">Sender Name</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="priority">Priority</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Order</label>
                  <Select value={sortOrder} onValueChange={(value: "asc" | "desc") => setSortOrder(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="desc">Newest First</SelectItem>
                      <SelectItem value="asc">Oldest First</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                <SelectContent>
                      <SelectItem value="all">All Messages</SelectItem>
                      <SelectItem value="unread">Unread</SelectItem>
                  <SelectItem value="read">Read</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Priority</label>
                  <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priorities</SelectItem>
                      <SelectItem value="high">High Priority</SelectItem>
                      <SelectItem value="medium">Medium Priority</SelectItem>
                      <SelectItem value="low">Low Priority</SelectItem>
                </SelectContent>
              </Select>
                </div>
              </div>
            </div>
          )}

          {/* Bulk Actions */}
          {Object.keys(selected).length > 0 && (
            <div className="mt-4 p-3 bg-primary/10 border border-primary/20 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  {Object.keys(selected).length} message{Object.keys(selected).length > 1 ? 's' : ''} selected
                </span>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleBulkAction('markRead')}>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Mark Read
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleBulkAction('markUnread')}>
                    <Clock3 className="mr-2 h-4 w-4" />
                    Mark Unread
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleBulkAction('archive')}>
                    <ArchiveIcon className="mr-2 h-4 w-4" />
                    Archive
              </Button>
                  <Button variant="outline" size="sm" onClick={() => handleBulkAction('delete')}>
                    <Trash className="mr-2 h-4 w-4" />
                    Delete
              </Button>
                  <Button variant="ghost" size="sm" onClick={() => setSelected({})}>
                    <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Enhanced Table View */}
      {viewMode === "table" && (
        <Card>
          <CardContent className="p-0">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                    <TableHead className="w-12">
                      <Checkbox 
                        checked={Object.keys(selected).length === filtered.length && filtered.length > 0}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSort("firstName")}
                    >
                      <div className="flex items-center gap-2">
                        Sender
                        {sortBy === "firstName" && (
                          sortOrder === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSort("subject")}
                    >
                      <div className="flex items-center gap-2">
                        Subject
                        {sortBy === "subject" && (
                          sortOrder === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSort("createdAt")}
                    >
                      <div className="flex items-center gap-2">
                        Date
                        {sortBy === "createdAt" && (
                          sortOrder === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSort("priority")}
                    >
                      <div className="flex items-center gap-2">
                        Priority
                        {sortBy === "priority" && (
                          sortOrder === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSort("read")}
                    >
                      <div className="flex items-center gap-2">
                        Status
                        {sortBy === "read" && (
                          sortOrder === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
                        )}
                      </div>
                    </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                      <TableCell colSpan={7} className="py-12 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                          <p className="text-muted-foreground">Loading messages...</p>
                        </div>
                    </TableCell>
                  </TableRow>
                ) : filtered.length === 0 ? (
                  <TableRow>
                      <TableCell colSpan={7} className="py-12 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <MessageSquare className="h-12 w-12 text-muted-foreground" />
                          <p className="text-muted-foreground">No messages found</p>
                          <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
                        </div>
                    </TableCell>
                  </TableRow>
                ) : (
                    filtered.map((message) => {
                      const StatusIcon = getStatusIcon(message.read)
                      const PriorityIcon = getPriorityIcon(message.priority)
                      return (
                        <TableRow key={message._id} className="hover:bg-muted/50">
                          <TableCell>
                            <Checkbox 
                              checked={!!selected[message._id]}
                              onCheckedChange={() => handleSelectMessage(message._id)}
                            />
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-100 to-blue-100 dark:from-cyan-900/30 dark:to-blue-900/30">
                                <MessageSquare className="h-4 w-4 text-cyan-600" />
                              </div>
                              <div>
                                <div className="font-medium">{message.firstName} {message.lastName}</div>
                                <div className="text-xs text-muted-foreground">{message.email}</div>
                                {message.phone && (
                                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Phone className="h-3 w-3" />
                                    {message.phone}
                                  </div>
                                )}
                              </div>
                            </div>
                          </TableCell>
                      <TableCell>
                            <div className="max-w-[300px]">
                              <div className="font-medium truncate">{message.subject}</div>
                              <div className="text-xs text-muted-foreground line-clamp-2">
                                {message.message}
                              </div>
                            </div>
                      </TableCell>
                      <TableCell>
                            <div className="text-sm">
                              {new Date(message.createdAt).toLocaleDateString()}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(message.createdAt).toLocaleTimeString()}
                            </div>
                      </TableCell>
                      <TableCell>
                            {message.priority && (
                              <Badge className={getPriorityColor(message.priority)}>
                                <PriorityIcon className="h-3 w-3 mr-1" />
                                {message.priority}
                              </Badge>
                            )}
                      </TableCell>
                      <TableCell>
                            <div className="flex items-center gap-2">
                              <Badge className={getStatusColor(message.read)}>
                                <StatusIcon className="h-3 w-3 mr-1" />
                                {message.read ? "Read" : "Unread"}
                        </Badge>
                              {message.starred && (
                                <Star className="h-4 w-4 text-yellow-500" />
                              )}
                              {message.archived && (
                                <ArchiveIcon className="h-4 w-4 text-muted-foreground" />
                              )}
                            </div>
                      </TableCell>
                      <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button variant="ghost" size="sm" onClick={() => setViewItem(message)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => markRead(message._id, !message.read)}>
                                {message.read ? <Clock3 className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                              </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => setViewItem(message)}>
                              <Eye className="mr-2 h-4 w-4" />
                                    View Message
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Reply className="mr-2 h-4 w-4" />
                                    Reply
                            </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => markRead(message._id, !message.read)}>
                                    {message.read ? (
                                      <Clock3 className="mr-2 h-4 w-4" />
                                    ) : (
                              <CheckCircle className="mr-2 h-4 w-4" />
                                    )}
                                    Mark as {message.read ? "Unread" : "Read"}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Star className="mr-2 h-4 w-4" />
                                    {message.starred ? "Remove Star" : "Add Star"}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <ArchiveIcon className="mr-2 h-4 w-4" />
                                    Archive
                            </DropdownMenuItem>
                                  <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => remove(message._id)}>
                              <Trash className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                            </div>
                      </TableCell>
                    </TableRow>
                      )
                    })
                )}
              </TableBody>
            </Table>
          </div>
          </CardContent>
        </Card>
      )}

      {/* Enhanced Grid View */}
      {viewMode === "grid" && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                    <div className="h-20 bg-muted rounded"></div>
              </div>
                </CardContent>
              </Card>
            ))
          ) : filtered.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-12">
              <MessageSquare className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No messages found</h3>
              <p className="text-muted-foreground text-center max-w-md">
                Try adjusting your search criteria or check back later for new messages.
              </p>
            </div>
          ) : (
            filtered.map((message) => {
              const StatusIcon = getStatusIcon(message.read)
              const PriorityIcon = getPriorityIcon(message.priority)
              return (
                <Card key={message._id} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-100 to-blue-100 dark:from-cyan-900/30 dark:to-blue-900/30 group-hover:scale-110 transition-transform duration-200">
                            <MessageSquare className="h-4 w-4 text-cyan-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                              {message.subject}
                            </h3>
                            <p className="text-xs text-muted-foreground">{message.firstName} {message.lastName}</p>
                          </div>
                        </div>
                        <Checkbox 
                          checked={!!selected[message._id]}
                          onCheckedChange={() => handleSelectMessage(message._id)}
                        />
                      </div>

                      {/* Message Preview */}
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {message.message}
                      </p>

                      {/* Sender Info */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs">
                              {message.firstName?.charAt(0)}{message.lastName?.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{message.firstName} {message.lastName}</p>
                            <p className="text-xs text-muted-foreground">{message.email}</p>
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(message.createdAt).toLocaleDateString()}
                        </div>
                      </div>

                      {/* Tags & Categories */}
                      {message.tags && message.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {message.tags.slice(0, 3).map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              <Tag className="h-3 w-3 mr-1" />
                              {tag}
                            </Badge>
                          ))}
                          {message.tags.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{message.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}

                      {/* Status & Actions */}
                      <div className="flex items-center justify-between pt-2 border-t">
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(message.read)}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {message.read ? "Read" : "Unread"}
                          </Badge>
                          {message.priority && (
                            <Badge className={getPriorityColor(message.priority)}>
                              <PriorityIcon className="h-3 w-3 mr-1" />
                              {message.priority}
                            </Badge>
                          )}
                          {message.starred && (
                            <Star className="h-4 w-4 text-yellow-500" />
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm" onClick={() => setViewItem(message)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => markRead(message._id, !message.read)}>
                            {message.read ? <Clock3 className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => setViewItem(message)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Message
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Reply className="mr-2 h-4 w-4" />
                                Reply
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => markRead(message._id, !message.read)}>
                                {message.read ? (
                                  <Clock3 className="mr-2 h-4 w-4" />
                                ) : (
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                )}
                                Mark as {message.read ? "Unread" : "Read"}
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Star className="mr-2 h-4 w-4" />
                                {message.starred ? "Remove Star" : "Add Star"}
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <ArchiveIcon className="mr-2 h-4 w-4" />
                                Archive
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => remove(message._id)}>
                                <Trash className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
            </div>
          )}

      {/* Enhanced Pagination */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {filtered.length} of {total || messages.length} messages
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="rounded-full">
                Previous
              </Button>
              <Button variant="outline" size="sm" className="bg-primary text-primary-foreground rounded-full">
                {page}
              </Button>
              <Button variant="outline" size="sm" disabled={total ? page * limit >= total : messages.length < limit} onClick={() => setPage((p) => p + 1)} className="rounded-full">
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Message View Dialog */}
      <Dialog open={!!viewItem} onOpenChange={(o) => !o && setViewItem(null)}>
        <DialogContent className="max-w-2xl">
          {viewItem && (
            <>
              <DialogHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <DialogTitle className="text-xl">{viewItem.subject}</DialogTitle>
                    <DialogDescription className="mt-2">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>
                              {viewItem.firstName?.charAt(0)}{viewItem.lastName?.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{viewItem.firstName} {viewItem.lastName}</p>
                            <p className="text-sm text-muted-foreground">{viewItem.email}</p>
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(viewItem.createdAt).toLocaleString()}
                        </div>
                      </div>
                </DialogDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    {viewItem.priority && (
                      <Badge className={getPriorityColor(viewItem.priority)}>
                        {React.createElement(getPriorityIcon(viewItem.priority), { className: "h-3 w-3 mr-1" })}
                        {viewItem.priority}
                      </Badge>
                    )}
                    <Badge className={getStatusColor(viewItem.read)}>
                      {React.createElement(getStatusIcon(viewItem.read), { className: "h-3 w-3 mr-1" })}
                      {viewItem.read ? "Read" : "Unread"}
                    </Badge>
                  </div>
                </div>
              </DialogHeader>
              <div className="space-y-4">
                <div className="whitespace-pre-wrap text-sm leading-6 text-muted-foreground p-4 bg-muted/30 rounded-lg">
                  {viewItem.message}
                </div>
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Reply className="mr-2 h-4 w-4" />
                      Reply
                    </Button>
                    <Button variant="outline" size="sm">
                      <Forward className="mr-2 h-4 w-4" />
                      Forward
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => markRead(viewItem._id, !viewItem.read)}>
                      {viewItem.read ? (
                        <Clock3 className="mr-2 h-4 w-4" />
                      ) : (
                        <CheckCircle className="mr-2 h-4 w-4" />
                      )}
                      Mark as {viewItem.read ? "Unread" : "Read"}
                    </Button>
                  </div>
                  <Button variant="destructive" size="sm" onClick={() => remove(viewItem._id)}>
                    <Trash className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
