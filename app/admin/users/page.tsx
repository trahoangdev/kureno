"use client"

import type React from "react"

import { useState, useEffect, useMemo } from "react"
import RefreshButton from "../components/refresh-button"
import ExportImportDialog from "../components/export-import-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { 
  Loader2, 
  Plus, 
  Edit, 
  Trash2, 
  Shield, 
  Settings,
  Search, 
  MoreHorizontal, 
  Eye, 
  Download,
  Users,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Grid3X3,
  List,
  Upload,
  RefreshCw,
  Star,
  Award,
  Zap,
  BarChart3,
  SortAsc,
  SortDesc,
  Calendar,
  DollarSign,
  ShoppingCart,
  Target,
  Activity,
  Clock,
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  X,
  Check,
  Copy,
  ExternalLink,
  Filter,
  Package,
  Hash,
  FileText,
  Globe,
  Link as LinkIcon,
  Bookmark,
  Archive,
  Folder,
  FolderOpen,
  Truck,
  CreditCard,
  MapPin,
  Phone,
  Mail,
  User,
  ShoppingBag,
  Receipt,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Clock3,
  TruckIcon,
  Package2,
  ArrowRight,
  ArrowLeft,
  FilterX,
  MoreVertical,
  Printer,
  Send,
  MessageSquare,
  Bell,
  Flag,
  Tag,
  Layers,
  Database,
  Server,
  Wifi,
  WifiOff,
  Signal,
  SignalZero,
  SignalLow,
  SignalMedium,
  SignalHigh,
  UserCheck,
  UserX,
  Crown,
  Heart,
  ThumbsUp,
  MessageCircle,
  Mail as MailIcon,
  Phone as PhoneIcon,
  MapPin as MapPinIcon,
  CreditCard as CreditCardIcon,
  Calendar as CalendarIcon,
  TrendingDown,
  Minus,
  Edit3,
  Save,
  Trash,
  Ban,
  Unlock,
  Lock,
  Key,
  EyeOff,
  Eye as EyeIcon
} from "lucide-react"

interface AdminUser {
  _id: string
  name: string
  email: string
  role: "admin" | "manager" | "user"
  permissions: {
    canManageProducts: boolean
    canManageOrders: boolean
    canManageUsers: boolean
    canManageContent: boolean
    canViewAnalytics: boolean
    canManageSettings: boolean
  }
  isActive: boolean
  lastLogin?: string
  createdAt: string
  updatedAt?: string
  avatar?: string
  phone?: string
  totalActions?: number
  lastActivity?: string
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<"table" | "grid">("table")
  const [sortBy, setSortBy] = useState("createdAt")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user" as "admin" | "manager" | "user",
    permissions: {
      canManageProducts: false,
      canManageOrders: false,
      canManageUsers: false,
      canManageContent: false,
      canViewAnalytics: false,
      canManageSettings: false,
    },
    isActive: true,
  })
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const params = new URLSearchParams({ 
        limit: String(limit), 
        page: String(page) 
      })
      if (roleFilter !== "all") params.set("role", roleFilter)
      if (statusFilter !== "all") params.set("isActive", statusFilter)
      
      try {
        const res = await fetch(`/api/admin/users?${params.toString()}`)
        const data = await res.json()
        setUsers(data.users || [])
        setTotal(data.pagination?.total || 0)
    } catch (error) {
        console.error("Error fetching users:", error)
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      })
    } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [page, limit, roleFilter, statusFilter])

  const handleSelectUser = (id: string) => {
    setSelectedUsers(prev => 
      prev.includes(id) 
        ? prev.filter(u => u !== id)
        : [...prev, id]
    )
  }

  const handleSelectAll = () => {
    if (selectedUsers.length === filtered.length) {
      setSelectedUsers([])
    } else {
      setSelectedUsers(filtered.map(u => u._id))
    }
  }

  const handleBulkStatusUpdate = async (isActive: boolean) => {
    if (selectedUsers.length === 0) return
    
    try {
      for (const id of selectedUsers) {
        await fetch(`/api/admin/users/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isActive })
        })
      }
      
      // Refresh data
      setUsers(prev => prev.map(user => 
        selectedUsers.includes(user._id) 
          ? { ...user, isActive }
          : user
      ))
      setSelectedUsers([])
    } catch (error) {
      console.error("Error updating users:", error)
    }
  }

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(field)
      setSortOrder("asc")
    }
  }

  const filtered = useMemo(() => {
    let result = users
    
    // Apply search filter
    if (search) {
      result = result.filter((user) => 
        [
          user.name,
          user.email,
          user.role,
          user.phone
        ].some((v) => v?.toLowerCase().includes(search.toLowerCase()))
      )
    }
    
    // Apply sorting
    result = [...result].sort((a, b) => {
      let aValue: any = a[sortBy as keyof AdminUser]
      let bValue: any = b[sortBy as keyof AdminUser]
      
      if (sortBy === "totalActions") {
        aValue = Number(aValue || 0)
        bValue = Number(bValue || 0)
      } else if (sortBy === "createdAt" || sortBy === "updatedAt" || sortBy === "lastLogin" || sortBy === "lastActivity") {
        aValue = new Date(aValue || 0).getTime()
        bValue = new Date(bValue || 0).getTime()
      } else {
        aValue = String(aValue || "").toLowerCase()
        bValue = String(bValue || "").toLowerCase()
      }
      
      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })
    
    return result
  }, [users, search, sortBy, sortOrder])

  // Calculate statistics
  const stats = useMemo(() => {
    const totalUsers = users.length
    const activeUsers = users.filter(u => u.isActive).length
    const inactiveUsers = users.filter(u => !u.isActive).length
    const adminUsers = users.filter(u => u.role === "admin").length
    const managerUsers = users.filter(u => u.role === "manager").length
    const regularUsers = users.filter(u => u.role === "user").length
    const totalActions = users.reduce((sum, u) => sum + (u.totalActions || 0), 0)
    const newThisMonth = users.filter(u => {
      const created = new Date(u.createdAt)
      const now = new Date()
      return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear()
    }).length
    
    return { 
      totalUsers, 
      activeUsers, 
      inactiveUsers, 
      adminUsers, 
      managerUsers, 
      regularUsers,
      totalActions,
      newThisMonth
    }
  }, [users])

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200"
      case "manager": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200"
      case "user": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200"
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300 border-gray-200"
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin": return <Crown className="h-3 w-3" />
      case "manager": return <Shield className="h-3 w-3" />
      case "user": return <User className="h-3 w-3" />
      default: return <User className="h-3 w-3" />
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = editingUser ? `/api/admin/users/${editingUser._id}` : "/api/admin/users"
      const method = editingUser ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: `User ${editingUser ? "updated" : "created"} successfully`,
        })
        setIsDialogOpen(false)
        setEditingUser(null)
        resetForm()
        // Refresh data
        const res = await fetch(`/api/admin/users?limit=${limit}&page=${page}`)
        const data = await res.json()
        setUsers(data.users || [])
        setTotal(data.pagination?.total || 0)
      } else {
        const data = await response.json()
        toast({
          title: "Error",
          description: data.error || "Failed to save user",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (user: AdminUser) => {
    setEditingUser(user)
    setFormData({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
      permissions: user.permissions,
      isActive: user.isActive,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "User deleted successfully",
        })
        // Refresh data
        const res = await fetch(`/api/admin/users?limit=${limit}&page=${page}`)
        const data = await res.json()
        setUsers(data.users || [])
        setTotal(data.pagination?.total || 0)
      } else {
        toast({
          title: "Error",
          description: "Failed to delete user",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "user",
      permissions: {
        canManageProducts: false,
        canManageOrders: false,
        canManageUsers: false,
        canManageContent: false,
        canViewAnalytics: false,
        canManageSettings: false,
      },
      isActive: true,
    })
  }

  const handleRoleChange = (role: "admin" | "manager" | "user") => {
    let permissions = { ...formData.permissions }

    if (role === "admin") {
      permissions = {
        canManageProducts: true,
        canManageOrders: true,
        canManageUsers: true,
        canManageContent: true,
        canViewAnalytics: true,
        canManageSettings: true,
      }
    } else if (role === "manager") {
      permissions = {
        canManageProducts: true,
        canManageOrders: true,
        canManageUsers: false,
        canManageContent: true,
        canViewAnalytics: true,
        canManageSettings: false,
      }
    } else {
      permissions = {
        canManageProducts: false,
        canManageOrders: false,
        canManageUsers: false,
        canManageContent: false,
        canViewAnalytics: false,
        canManageSettings: false,
      }
    }

    setFormData({ ...formData, role, permissions })
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin":
        return "destructive"
      case "manager":
        return "default"
      default:
        return "secondary"
    }
  }

  if (loading && users.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Enhanced Header Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 dark:from-purple-950/20 dark:via-indigo-950/20 dark:to-blue-950/20 p-8">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(147,51,234,0.1),transparent_50%),radial-gradient(ellipse_at_bottom_left,rgba(59,130,246,0.1),transparent_50%)] -z-10" />
        
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Badge className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-3 py-1 text-sm font-medium">
                <Shield className="h-3 w-3 mr-1" />
                User Management
              </Badge>
              <Badge variant="outline" className="text-xs">
                <Activity className="h-3 w-3 mr-1" />
                {stats.totalUsers} Users
              </Badge>
            </div>
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent">
              Manage Users
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Control user access, permissions, and roles with comprehensive user management tools and security features.
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
            <Button variant="outline" size="sm" className="rounded-full">
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
            <RefreshButton variant="outline" size="sm" className="rounded-full" />
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                resetForm()
                setEditingUser(null)
              }}
                  className="rounded-full"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </DialogTrigger>
            </Dialog>
          </div>
        </div>
        
        {/* Quick Stats Preview */}
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-5">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.totalUsers}</div>
            <div className="text-xs text-muted-foreground">Total Users</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{stats.activeUsers}</div>
            <div className="text-xs text-muted-foreground">Active</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{stats.adminUsers}</div>
            <div className="text-xs text-muted-foreground">Admins</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.managerUsers}</div>
            <div className="text-xs text-muted-foreground">Managers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-600">{stats.newThisMonth}</div>
            <div className="text-xs text-muted-foreground">New This Month</div>
          </div>
        </div>
      </div>

      {/* Enhanced Search and Filter Section */}
      <Card className="group hover:shadow-lg transition-all duration-300">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5 text-purple-600" />
                Search & Filter Users
              </CardTitle>
              <CardDescription>Find and organize your users with advanced filtering options</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="rounded-full"
              >
                <Filter className="mr-2 h-4 w-4" />
                {showFilters ? "Hide Filters" : "Show Filters"}
              </Button>
              <div className="flex items-center border rounded-lg">
                <Button
                  variant={viewMode === "table" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("table")}
                  className="rounded-r-none"
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-l-none"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Main Search Bar */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search users by name, email, role, or phone..."
                  className="pl-10 rounded-full"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="rounded-full">
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="grid gap-4 md:grid-cols-4 p-4 bg-muted/30 rounded-lg">
                <div>
                  <label className="text-sm font-medium mb-2 block">Sort By</label>
                  <select 
                    value={sortBy} 
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="createdAt">Date Created</option>
                    <option value="name">Name</option>
                    <option value="email">Email</option>
                    <option value="role">Role</option>
                    <option value="lastLogin">Last Login</option>
                    <option value="totalActions">Total Actions</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Order</label>
                  <select 
                    value={sortOrder} 
                    onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="desc">Newest First</option>
                    <option value="asc">Oldest First</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Role</label>
                  <select 
                    value={roleFilter} 
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="all">All roles</option>
                    <option value="admin">Admin</option>
                    <option value="manager">Manager</option>
                    <option value="user">User</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Status</label>
                  <select 
                    value={statusFilter} 
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="all">All statuses</option>
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
              </div>
            )}

            {/* Bulk Actions */}
            {selectedUsers.length > 0 && (
              <div className="flex items-center gap-4 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800 dark:text-blue-300">
                    {selectedUsers.length} user{selectedUsers.length > 1 ? 's' : ''} selected
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="rounded-full"
                    onClick={() => handleBulkStatusUpdate(true)}
                  >
                    <UserCheck className="mr-2 h-3 w-3" />
                    Activate
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="rounded-full"
                    onClick={() => handleBulkStatusUpdate(false)}
                  >
                    <UserX className="mr-2 h-3 w-3" />
                    Deactivate
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setSelectedUsers([])}
                    className="rounded-full"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Users Table/Grid */}
      <Card className="group hover:shadow-lg transition-all duration-300">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-purple-600" />
                Users List
              </CardTitle>
              <CardDescription>
                {filtered.length} of {total} users
                {search && ` matching "${search}"`}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                <Clock className="h-3 w-3 mr-1" />
                Updated {new Date().toLocaleTimeString()}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {viewMode === "table" ? (
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-12">
                      <input
                        type="checkbox"
                        checked={selectedUsers.length === filtered.length && filtered.length > 0}
                        onChange={handleSelectAll}
                        className="rounded border-gray-300"
                      />
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/70 transition-colors"
                      onClick={() => handleSort("name")}
                    >
                      <div className="flex items-center gap-2">
                        User
                        {sortBy === "name" && (
                          sortOrder === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/70 transition-colors"
                      onClick={() => handleSort("email")}
                    >
                      <div className="flex items-center gap-2">
                        Email
                        {sortBy === "email" && (
                          sortOrder === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/70 transition-colors"
                      onClick={() => handleSort("role")}
                    >
                      <div className="flex items-center gap-2">
                        Role
                        {sortBy === "role" && (
                          sortOrder === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/70 transition-colors"
                      onClick={() => handleSort("lastLogin")}
                    >
                      <div className="flex items-center gap-2">
                        Last Login
                        {sortBy === "lastLogin" && (
                          sortOrder === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/70 transition-colors"
                      onClick={() => handleSort("createdAt")}
                    >
                      <div className="flex items-center gap-2">
                        Created
                        {sortBy === "createdAt" && (
                          sortOrder === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={8} className="py-12 text-center">
                        <div className="flex flex-col items-center gap-4">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                          <div className="text-muted-foreground">Loading users...</div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filtered.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="py-12 text-center">
                        <div className="flex flex-col items-center gap-4">
                          <Shield className="h-12 w-12 text-muted-foreground" />
                          <div>
                            <div className="text-lg font-medium">No users found</div>
                            <div className="text-muted-foreground">
                              {search ? `No users match "${search}"` : "No users have been created yet"}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filtered.map((user) => (
                      <TableRow key={user._id} className="group hover:bg-muted/50 transition-colors">
                        <TableCell>
                          <input
                            type="checkbox"
                            checked={selectedUsers.includes(user._id)}
                            onChange={() => handleSelectUser(user._id)}
                            className="rounded border-gray-300"
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30">
                              <User className="h-4 w-4 text-purple-600" />
                            </div>
                            <div>
                              <div className="font-medium group-hover:text-purple-600 transition-colors">
                                {user.name}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                ID: {user._id.slice(-8)}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Mail className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm">{user.email}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${getRoleColor(user.role)}`}
                          >
                            <div className="flex items-center gap-1">
                              {getRoleIcon(user.role)}
                              {user.role}
                            </div>
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${user.isActive ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200" : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200"}`}
                          >
                            <div className="flex items-center gap-1">
                              {user.isActive ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                              {user.isActive ? "Active" : "Inactive"}
                            </div>
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : "Never"}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {user.lastLogin ? new Date(user.lastLogin).toLocaleTimeString() : "No login"}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(user.createdAt).toLocaleTimeString()}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="sm" onClick={() => handleEdit(user)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleEdit(user)}>
                                  <Edit className="mr-2 h-4 w-4" /> Edit User
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Mail className="mr-2 h-4 w-4" /> Send Email
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <MessageSquare className="mr-2 h-4 w-4" /> Add Note
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => handleDelete(user._id)}>
                                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          ) : (
            // Grid View
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((user) => (
                <Card key={user._id} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 group-hover:scale-110 transition-transform duration-200">
                          <User className="h-6 w-6 text-purple-600" />
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={selectedUsers.includes(user._id)}
                            onChange={() => handleSelectUser(user._id)}
                            className="rounded border-gray-300"
                          />
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEdit(user)}>
                                <Edit className="mr-2 h-4 w-4" /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Mail className="mr-2 h-4 w-4" /> Email
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => handleDelete(user._id)}>
                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <h3 className="font-semibold group-hover:text-purple-600 transition-colors">
                            {user.name}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Mail className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">{user.email}</span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Role:</span>
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${getRoleColor(user.role)}`}
                            >
                              <div className="flex items-center gap-1">
                                {getRoleIcon(user.role)}
                                {user.role}
                              </div>
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Last Login:</span>
                            <span className="text-sm font-medium">
                              {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : "Never"}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Actions:</span>
                            <span className="text-sm font-medium">{user.totalActions || 0}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${user.isActive ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200" : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200"}`}
                          >
                            <div className="flex items-center gap-1">
                              {user.isActive ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                              {user.isActive ? "Active" : "Inactive"}
                            </div>
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEdit(user)}>
                          <Edit className="mr-2 h-3 w-3" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Mail className="mr-2 h-3 w-3" />
                          Email
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Enhanced Pagination */}
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total} users
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                disabled={page === 1} 
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="rounded-full"
              >
                <ArrowLeft className="mr-2 h-3 w-3" />
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, Math.ceil(total / limit)) }, (_, i) => {
                  const pageNum = i + 1
                  return (
                    <Button
                      key={pageNum}
                      variant={page === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPage(pageNum)}
                      className="rounded-full w-8 h-8 p-0"
                    >
                      {pageNum}
                    </Button>
                  )
                })}
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                disabled={page * limit >= total} 
                onClick={() => setPage((p) => p + 1)}
                className="rounded-full"
              >
                Next
                <ArrowRight className="ml-2 h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced User Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-purple-600" />
              {editingUser ? "Edit User" : "Add New User"}
            </DialogTitle>
              <DialogDescription>
              {editingUser ? "Update user information and permissions" : "Create a new user account with custom permissions"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="permissions">Permissions</TabsTrigger>
                </TabsList>
                <TabsContent value="basic" className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Name
                    </Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      className="rounded-lg"
                      />
                    </div>
                    <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email
                    </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      className="rounded-lg"
                      />
                    </div>
                    <div className="space-y-2">
                    <Label htmlFor="password" className="flex items-center gap-2">
                      <Key className="h-4 w-4" />
                        {editingUser ? "New Password (leave blank to keep current)" : "Password"}
                      </Label>
                      <Input
                        id="password"
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required={!editingUser}
                        minLength={6}
                      className="rounded-lg"
                      />
                    </div>
                    <div className="space-y-2">
                    <Label htmlFor="role" className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Role
                    </Label>
                      <Select value={formData.role} onValueChange={handleRoleChange}>
                      <SelectTrigger className="rounded-lg">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">User</SelectItem>
                          <SelectItem value="manager">Manager</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center space-x-2 sm:col-span-2">
                      <Switch
                        id="isActive"
                        checked={formData.isActive}
                        onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                      />
                    <Label htmlFor="isActive" className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Active Account
                    </Label>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="permissions" className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="canManageProducts"
                        checked={formData.permissions.canManageProducts}
                        onCheckedChange={(checked) =>
                          setFormData({
                            ...formData,
                            permissions: { ...formData.permissions, canManageProducts: checked },
                          })
                        }
                      />
                    <Label htmlFor="canManageProducts" className="flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      Manage Products
                    </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="canManageOrders"
                        checked={formData.permissions.canManageOrders}
                        onCheckedChange={(checked) =>
                          setFormData({
                            ...formData,
                            permissions: { ...formData.permissions, canManageOrders: checked },
                          })
                        }
                      />
                    <Label htmlFor="canManageOrders" className="flex items-center gap-2">
                      <ShoppingCart className="h-4 w-4" />
                      Manage Orders
                    </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="canManageUsers"
                        checked={formData.permissions.canManageUsers}
                        onCheckedChange={(checked) =>
                          setFormData({
                            ...formData,
                            permissions: { ...formData.permissions, canManageUsers: checked },
                          })
                        }
                      />
                    <Label htmlFor="canManageUsers" className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Manage Users
                    </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="canManageContent"
                        checked={formData.permissions.canManageContent}
                        onCheckedChange={(checked) =>
                          setFormData({
                            ...formData,
                            permissions: { ...formData.permissions, canManageContent: checked },
                          })
                        }
                      />
                    <Label htmlFor="canManageContent" className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Manage Content
                    </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="canViewAnalytics"
                        checked={formData.permissions.canViewAnalytics}
                        onCheckedChange={(checked) =>
                          setFormData({
                            ...formData,
                            permissions: { ...formData.permissions, canViewAnalytics: checked },
                          })
                        }
                      />
                    <Label htmlFor="canViewAnalytics" className="flex items-center gap-2">
                      <BarChart3 className="h-4 w-4" />
                      View Analytics
                    </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="canManageSettings"
                        checked={formData.permissions.canManageSettings}
                        onCheckedChange={(checked) =>
                          setFormData({
                            ...formData,
                            permissions: { ...formData.permissions, canManageSettings: checked },
                          })
                        }
                      />
                    <Label htmlFor="canManageSettings" className="flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      Manage Settings
                    </Label>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="rounded-full">
                  Cancel
                </Button>
              <Button type="submit" disabled={loading} className="rounded-full">
                {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {editingUser ? "Updating..." : "Creating..."}
                    </>
                  ) : editingUser ? (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Update User
                  </>
                  ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Create User
                  </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
    </div>
  )
}
