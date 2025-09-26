"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import RefreshButton from "../components/refresh-button"
import ExportImportDialog from "../components/export-import-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { 
  Search, 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Trash2, 
  UserPlus, 
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
  Settings,
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
  Shield,
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
  Plus,
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

interface Customer {
  _id: string
  name: string
  email: string
  role: "admin" | "manager" | "user"
  isActive: boolean
  createdAt: string
  updatedAt?: string
  lastLogin?: string
  totalOrders?: number
  totalSpent?: number
  avatar?: string
  phone?: string
  address?: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<"table" | "grid">("table")
  const [sortBy, setSortBy] = useState("createdAt")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

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
        setCustomers(data.users || [])
        setTotal(data.pagination?.total || 0)
      } catch (error) {
        console.error("Error fetching customers:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [page, limit, roleFilter, statusFilter])

  const handleSelectCustomer = (id: string) => {
    setSelectedCustomers(prev => 
      prev.includes(id) 
        ? prev.filter(c => c !== id)
        : [...prev, id]
    )
  }

  const handleSelectAll = () => {
    if (selectedCustomers.length === filtered.length) {
      setSelectedCustomers([])
    } else {
      setSelectedCustomers(filtered.map(c => c._id))
    }
  }

  const handleBulkStatusUpdate = async (isActive: boolean) => {
    if (selectedCustomers.length === 0) return
    
    try {
      for (const id of selectedCustomers) {
        await fetch(`/api/admin/users/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isActive })
        })
      }
      
      // Refresh data
      setCustomers(prev => prev.map(customer => 
        selectedCustomers.includes(customer._id) 
          ? { ...customer, isActive }
          : customer
      ))
      setSelectedCustomers([])
    } catch (error) {
      console.error("Error updating customers:", error)
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
    let result = customers
    
    // Apply search filter
    if (search) {
      result = result.filter((customer) => 
        [
          customer.name,
          customer.email,
          customer.role,
          customer.phone
        ].some((v) => v?.toLowerCase().includes(search.toLowerCase()))
      )
    }
    
    // Apply sorting
    result = [...result].sort((a, b) => {
      let aValue: any = a[sortBy as keyof Customer]
      let bValue: any = b[sortBy as keyof Customer]
      
      if (sortBy === "totalSpent" || sortBy === "totalOrders") {
        aValue = Number(aValue || 0)
        bValue = Number(bValue || 0)
      } else if (sortBy === "createdAt" || sortBy === "updatedAt" || sortBy === "lastLogin") {
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
  }, [customers, search, sortBy, sortOrder])

  // Calculate statistics
  const stats = useMemo(() => {
    const totalCustomers = customers.length
    const activeCustomers = customers.filter(c => c.isActive).length
    const inactiveCustomers = customers.filter(c => !c.isActive).length
    const adminUsers = customers.filter(c => c.role === "admin").length
    const managerUsers = customers.filter(c => c.role === "manager").length
    const regularUsers = customers.filter(c => c.role === "user").length
    const totalRevenue = customers.reduce((sum, c) => sum + (c.totalSpent || 0), 0)
    const totalOrders = customers.reduce((sum, c) => sum + (c.totalOrders || 0), 0)
    const newThisMonth = customers.filter(c => {
      const created = new Date(c.createdAt)
      const now = new Date()
      return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear()
    }).length
    
    return { 
      totalCustomers, 
      activeCustomers, 
      inactiveCustomers, 
      adminUsers, 
      managerUsers, 
      regularUsers,
      totalRevenue,
      totalOrders,
      newThisMonth
    }
  }, [customers])

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

  return (
    <div className="space-y-8">
      {/* Enhanced Header Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-950/20 dark:via-teal-950/20 dark:to-cyan-950/20 p-8">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(16,185,129,0.1),transparent_50%),radial-gradient(ellipse_at_bottom_left,rgba(20,184,166,0.1),transparent_50%)] -z-10" />
        
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-3 py-1 text-sm font-medium">
                <Users className="h-3 w-3 mr-1" />
                Customer Management
              </Badge>
              <Badge variant="outline" className="text-xs">
                <Activity className="h-3 w-3 mr-1" />
                {stats.totalCustomers} Customers
              </Badge>
            </div>
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
              Manage Customers
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              View, manage, and analyze your customer base with comprehensive customer management tools and insights.
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
          </div>
        </div>
        
        {/* Quick Stats Preview */}
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-5">
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-600">{stats.totalCustomers}</div>
            <div className="text-xs text-muted-foreground">Total Customers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{stats.activeCustomers}</div>
            <div className="text-xs text-muted-foreground">Active</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.adminUsers}</div>
            <div className="text-xs text-muted-foreground">Admins</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.newThisMonth}</div>
            <div className="text-xs text-muted-foreground">New This Month</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-teal-600">${stats.totalRevenue.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">Total Revenue</div>
          </div>
        </div>
      </div>

      {/* Enhanced Search and Filter Section */}
      <Card className="group hover:shadow-lg transition-all duration-300">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5 text-emerald-600" />
                Search & Filter Customers
              </CardTitle>
              <CardDescription>Find and organize your customers with advanced filtering options</CardDescription>
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
                  placeholder="Search customers by name, email, role, or phone..."
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
                    <option value="totalSpent">Total Spent</option>
                    <option value="totalOrders">Total Orders</option>
                    <option value="lastLogin">Last Login</option>
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
            {selectedCustomers.length > 0 && (
              <div className="flex items-center gap-4 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800 dark:text-blue-300">
                    {selectedCustomers.length} customer{selectedCustomers.length > 1 ? 's' : ''} selected
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
                    onClick={() => setSelectedCustomers([])}
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

      {/* Enhanced Customers Table/Grid */}
      <Card className="group hover:shadow-lg transition-all duration-300">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-emerald-600" />
                Customers List
              </CardTitle>
              <CardDescription>
                {filtered.length} of {total} customers
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
                        checked={selectedCustomers.length === filtered.length && filtered.length > 0}
                        onChange={handleSelectAll}
                        className="rounded border-gray-300"
                      />
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/70 transition-colors"
                      onClick={() => handleSort("name")}
                    >
                      <div className="flex items-center gap-2">
                        Customer
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
                      onClick={() => handleSort("totalSpent")}
                    >
                      <div className="flex items-center gap-2">
                        Total Spent
                        {sortBy === "totalSpent" && (
                          sortOrder === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/70 transition-colors"
                      onClick={() => handleSort("createdAt")}
                    >
                      <div className="flex items-center gap-2">
                        Joined
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
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                          <div className="text-muted-foreground">Loading customers...</div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filtered.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="py-12 text-center">
                        <div className="flex flex-col items-center gap-4">
                          <Users className="h-12 w-12 text-muted-foreground" />
                          <div>
                            <div className="text-lg font-medium">No customers found</div>
                            <div className="text-muted-foreground">
                              {search ? `No customers match "${search}"` : "No customers have been registered yet"}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filtered.map((customer) => (
                      <TableRow key={customer._id} className="group hover:bg-muted/50 transition-colors">
                        <TableCell>
                          <input
                            type="checkbox"
                            checked={selectedCustomers.includes(customer._id)}
                            onChange={() => handleSelectCustomer(customer._id)}
                            className="rounded border-gray-300"
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30">
                              <User className="h-4 w-4 text-emerald-600" />
                            </div>
                            <div>
                              <div className="font-medium group-hover:text-emerald-600 transition-colors">
                                {customer.name}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                ID: {customer._id.slice(-8)}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Mail className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm">{customer.email}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${getRoleColor(customer.role)}`}
                          >
                            <div className="flex items-center gap-1">
                              {getRoleIcon(customer.role)}
                              {customer.role}
                            </div>
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${customer.isActive ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200" : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200"}`}
                          >
                            <div className="flex items-center gap-1">
                              {customer.isActive ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                            {customer.isActive ? "Active" : "Inactive"}
                            </div>
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="font-semibold text-emerald-600">
                            ${(customer.totalSpent || 0).toFixed(2)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {customer.totalOrders || 0} orders
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {new Date(customer.createdAt).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(customer.createdAt).toLocaleTimeString()}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="sm" asChild>
                              <Link href={`/admin/customers/${customer._id}`}>
                                <Eye className="h-4 w-4" />
                              </Link>
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                  <Link href={`/admin/customers/${customer._id}`}> 
                                    <Eye className="mr-2 h-4 w-4" /> View Details
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                  <Link href={`/admin/customers/${customer._id}/edit`}>
                                    <Edit className="mr-2 h-4 w-4" /> Edit Customer
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Mail className="mr-2 h-4 w-4" /> Send Email
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <MessageSquare className="mr-2 h-4 w-4" /> Add Note
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive focus:text-destructive">
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
              {filtered.map((customer) => (
                <Card key={customer._id} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 group-hover:scale-110 transition-transform duration-200">
                          <User className="h-6 w-6 text-emerald-600" />
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={selectedCustomers.includes(customer._id)}
                            onChange={() => handleSelectCustomer(customer._id)}
                            className="rounded border-gray-300"
                          />
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link href={`/admin/customers/${customer._id}`}>
                                  <Eye className="mr-2 h-4 w-4" /> View
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/admin/customers/${customer._id}/edit`}>
                                  <Edit className="mr-2 h-4 w-4" /> Edit
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Mail className="mr-2 h-4 w-4" /> Email
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <h3 className="font-semibold group-hover:text-emerald-600 transition-colors">
                            {customer.name}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Mail className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">{customer.email}</span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Role:</span>
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${getRoleColor(customer.role)}`}
                            >
                              <div className="flex items-center gap-1">
                                {getRoleIcon(customer.role)}
                                {customer.role}
                              </div>
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Total Spent:</span>
                            <span className="font-semibold text-emerald-600">${(customer.totalSpent || 0).toFixed(2)}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Orders:</span>
                            <span className="text-sm font-medium">{customer.totalOrders || 0}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${customer.isActive ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200" : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200"}`}
                          >
                            <div className="flex items-center gap-1">
                              {customer.isActive ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                              {customer.isActive ? "Active" : "Inactive"}
                            </div>
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(customer.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="flex-1" asChild>
                          <Link href={`/admin/customers/${customer._id}`}>
                            <Eye className="mr-2 h-3 w-3" />
                            View
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1" asChild>
                          <Link href={`/admin/customers/${customer._id}/edit`}>
                            <Edit className="mr-2 h-3 w-3" />
                            Edit
                          </Link>
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
              Showing {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total} customers
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
    </div>
  )
}
