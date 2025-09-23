"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Search, 
  MoreHorizontal, 
  Edit, 
  Trash, 
  Plus,
  Box,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Grid3X3,
  List,
  Download,
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
  Users,
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
  Eye,
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
  SignalHigh
} from "lucide-react"

interface OrderItem {
  productId: string
  name: string
  price: number
  quantity: number
  image: string
}

interface ShippingAddress {
  firstName: string
  lastName: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
}

interface Order {
  _id: string
  user: {
    _id: string
    name: string
    email: string
  }
  items: OrderItem[]
  subtotal: number
  shipping: number
  total: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  paymentStatus: "pending" | "paid" | "failed"
  paymentMethod: string
  shippingAddress: ShippingAddress
  createdAt: string
  updatedAt: string
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<"table" | "grid">("table")
  const [sortBy, setSortBy] = useState("createdAt")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [selectedOrders, setSelectedOrders] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [statusFilter, setStatusFilter] = useState("all")
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("all")

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const params = new URLSearchParams({ 
        limit: String(limit), 
        page: String(page) 
      })
      if (statusFilter !== "all") params.set("status", statusFilter)
      if (paymentStatusFilter !== "all") params.set("paymentStatus", paymentStatusFilter)
      
      try {
        const res = await fetch(`/api/orders?${params.toString()}`)
        const data = await res.json()
        setOrders(data.orders || [])
        setTotal(data.pagination?.total || 0)
      } catch (error) {
        console.error("Error fetching orders:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [page, limit, statusFilter, paymentStatusFilter])

  const filtered = useMemo(() => {
    let result = orders
    
    // Apply search filter
    if (search) {
      result = result.filter((order) => 
        [
          order._id,
          order.user?.name,
          order.user?.email,
          order.shippingAddress?.firstName,
          order.shippingAddress?.lastName,
          order.status,
          order.paymentStatus
        ].some((v) => v?.toLowerCase().includes(search.toLowerCase()))
      )
    }
    
    // Apply sorting
    result = [...result].sort((a, b) => {
      let aValue: any = a[sortBy as keyof Order]
      let bValue: any = b[sortBy as keyof Order]
      
      if (sortBy === "total" || sortBy === "subtotal" || sortBy === "shipping") {
        aValue = Number(aValue)
        bValue = Number(bValue)
      } else if (sortBy === "createdAt" || sortBy === "updatedAt") {
        aValue = new Date(aValue).getTime()
        bValue = new Date(bValue).getTime()
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
  }, [orders, search, sortBy, sortOrder])

  const handleSelectOrder = (id: string) => {
    setSelectedOrders(prev => 
      prev.includes(id) 
        ? prev.filter(o => o !== id)
        : [...prev, id]
    )
  }

  const handleSelectAll = () => {
    if (selectedOrders.length === filtered.length) {
      setSelectedOrders([])
    } else {
      setSelectedOrders(filtered.map(o => o._id))
    }
  }

  const handleBulkStatusUpdate = async (status: string) => {
    if (selectedOrders.length === 0) return
    
    try {
      for (const id of selectedOrders) {
        await fetch(`/api/orders/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status })
        })
      }
      
      // Refresh data
      setOrders(prev => prev.map(order => 
        selectedOrders.includes(order._id) 
          ? { ...order, status: status as any }
          : order
      ))
      setSelectedOrders([])
    } catch (error) {
      console.error("Error updating orders:", error)
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

  // Calculate statistics
  const stats = useMemo(() => {
    const totalOrders = orders.length
    const pendingOrders = orders.filter(o => o.status === "pending").length
    const processingOrders = orders.filter(o => o.status === "processing").length
    const shippedOrders = orders.filter(o => o.status === "shipped").length
    const deliveredOrders = orders.filter(o => o.status === "delivered").length
    const cancelledOrders = orders.filter(o => o.status === "cancelled").length
    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0)
    const paidOrders = orders.filter(o => o.paymentStatus === "paid").length
    const pendingPayments = orders.filter(o => o.paymentStatus === "pending").length
    
    return { 
      totalOrders, 
      pendingOrders, 
      processingOrders, 
      shippedOrders, 
      deliveredOrders, 
      cancelledOrders,
      totalRevenue,
      paidOrders,
      pendingPayments
    }
  }, [orders])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border-yellow-200"
      case "processing": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200"
      case "shipped": return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200"
      case "delivered": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200"
      case "cancelled": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200"
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300 border-gray-200"
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200"
      case "pending": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border-yellow-200"
      case "failed": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200"
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending": return <Clock className="h-3 w-3" />
      case "processing": return <Package className="h-3 w-3" />
      case "shipped": return <Truck className="h-3 w-3" />
      case "delivered": return <CheckCircle2 className="h-3 w-3" />
      case "cancelled": return <XCircle className="h-3 w-3" />
      default: return <AlertCircle className="h-3 w-3" />
    }
  }

  return (
    <div className="space-y-8">
      {/* Enhanced Header Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 dark:from-orange-950/20 dark:via-red-950/20 dark:to-pink-950/20 p-8">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(251,146,60,0.1),transparent_50%),radial-gradient(ellipse_at_bottom_left,rgba(239,68,68,0.1),transparent_50%)] -z-10" />
        
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 text-sm font-medium">
                <Box className="h-3 w-3 mr-1" />
                Order Management
              </Badge>
              <Badge variant="outline" className="text-xs">
                <Activity className="h-3 w-3 mr-1" />
                {stats.totalOrders} Orders
              </Badge>
            </div>
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent">
              Manage Orders
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Track, process, and fulfill customer orders efficiently with comprehensive order management tools.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="rounded-full">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button variant="outline" size="sm" className="rounded-full">
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
            <Button variant="outline" size="sm" className="rounded-full">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>
        
        {/* Quick Stats Preview */}
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-5">
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{stats.totalOrders}</div>
            <div className="text-xs text-muted-foreground">Total Orders</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.pendingOrders}</div>
            <div className="text-xs text-muted-foreground">Pending</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.processingOrders}</div>
            <div className="text-xs text-muted-foreground">Processing</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{stats.deliveredOrders}</div>
            <div className="text-xs text-muted-foreground">Delivered</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">${stats.totalRevenue.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">Revenue</div>
          </div>
        </div>
      </div>

      {/* Enhanced Search and Filter Section */}
      <Card className="group hover:shadow-lg transition-all duration-300">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5 text-orange-600" />
                Search & Filter Orders
              </CardTitle>
              <CardDescription>Find and organize your orders with advanced filtering options</CardDescription>
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
                  placeholder="Search orders by ID, customer name, email, or status..."
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
                    <option value="total">Total Amount</option>
                    <option value="status">Status</option>
                    <option value="paymentStatus">Payment Status</option>
                    <option value="updatedAt">Last Updated</option>
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
                  <label className="text-sm font-medium mb-2 block">Order Status</label>
                  <select 
                    value={statusFilter} 
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="all">All statuses</option>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Payment Status</label>
                  <select 
                    value={paymentStatusFilter} 
                    onChange={(e) => setPaymentStatusFilter(e.target.value)}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="all">All payments</option>
                    <option value="paid">Paid</option>
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>
              </div>
            )}

            {/* Bulk Actions */}
            {selectedOrders.length > 0 && (
              <div className="flex items-center gap-4 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800 dark:text-blue-300">
                    {selectedOrders.length} order{selectedOrders.length > 1 ? 's' : ''} selected
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="rounded-full"
                    onClick={() => handleBulkStatusUpdate("processing")}
                  >
                    <Package className="mr-2 h-3 w-3" />
                    Mark Processing
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="rounded-full"
                    onClick={() => handleBulkStatusUpdate("shipped")}
                  >
                    <Truck className="mr-2 h-3 w-3" />
                    Mark Shipped
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="rounded-full"
                    onClick={() => handleBulkStatusUpdate("delivered")}
                  >
                    <CheckCircle2 className="mr-2 h-3 w-3" />
                    Mark Delivered
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setSelectedOrders([])}
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

      {/* Enhanced Orders Table/Grid */}
      <Card className="group hover:shadow-lg transition-all duration-300">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Box className="h-5 w-5 text-red-600" />
                Orders List
              </CardTitle>
              <CardDescription>
                {filtered.length} of {total} orders
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
                        checked={selectedOrders.length === filtered.length && filtered.length > 0}
                        onChange={handleSelectAll}
                        className="rounded border-gray-300"
                      />
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/70 transition-colors"
                      onClick={() => handleSort("_id")}
                    >
                      <div className="flex items-center gap-2">
                        Order ID
                        {sortBy === "_id" && (
                          sortOrder === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/70 transition-colors"
                      onClick={() => handleSort("user.name")}
                    >
                      <div className="flex items-center gap-2">
                        Customer
                        {sortBy === "user.name" && (
                          sortOrder === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/70 transition-colors"
                      onClick={() => handleSort("total")}
                    >
                      <div className="flex items-center gap-2">
                        Total
                        {sortBy === "total" && (
                          sortOrder === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/70 transition-colors"
                      onClick={() => handleSort("createdAt")}
                    >
                      <div className="flex items-center gap-2">
                        Date
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
                      <TableCell colSpan={9} className="py-12 text-center">
                        <div className="flex flex-col items-center gap-4">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
                          <div className="text-muted-foreground">Loading orders...</div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filtered.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="py-12 text-center">
                        <div className="flex flex-col items-center gap-4">
                          <Box className="h-12 w-12 text-muted-foreground" />
                          <div>
                            <div className="text-lg font-medium">No orders found</div>
                            <div className="text-muted-foreground">
                              {search ? `No orders match "${search}"` : "No orders have been placed yet"}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filtered.map((order) => (
                      <TableRow key={order._id} className="group hover:bg-muted/50 transition-colors">
                        <TableCell>
                          <input
                            type="checkbox"
                            checked={selectedOrders.includes(order._id)}
                            onChange={() => handleSelectOrder(order._id)}
                            className="rounded border-gray-300"
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30">
                              <Receipt className="h-4 w-4 text-orange-600" />
                            </div>
                            <div>
                              <div className="font-medium group-hover:text-orange-600 transition-colors">
                                #{order._id.slice(-8)}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {order.paymentMethod}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="text-xs">
                                {order.user?.name?.charAt(0) || "U"}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{order.user?.name || "Unknown"}</div>
                              <div className="text-xs text-muted-foreground">{order.user?.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{order.items.length} items</span>
                            <div className="flex -space-x-1">
                              {order.items.slice(0, 3).map((item, index) => (
                                <div key={index} className="h-6 w-6 rounded-full border-2 border-background overflow-hidden">
                                  <Image
                                    src={item.image || "/placeholder.jpg"}
                                    alt={item.name}
                                    width={24}
                                    height={24}
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                              ))}
                              {order.items.length > 3 && (
                                <div className="h-6 w-6 rounded-full border-2 border-background bg-muted flex items-center justify-center">
                                  <span className="text-xs">+{order.items.length - 3}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-semibold text-orange-600">${order.total.toFixed(2)}</div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${getStatusColor(order.status)}`}
                          >
                            <div className="flex items-center gap-1">
                              {getStatusIcon(order.status)}
                              {order.status}
                            </div>
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${getPaymentStatusColor(order.paymentStatus)}`}
                          >
                            {order.paymentStatus}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(order.createdAt).toLocaleTimeString()}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="sm" asChild>
                              <Link href={`/admin/orders/${order._id}`}>
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
                                  <Link href={`/admin/orders/${order._id}`}> 
                                    <Eye className="mr-2 h-4 w-4" /> View Details
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Printer className="mr-2 h-4 w-4" /> Print Invoice
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Send className="mr-2 h-4 w-4" /> Send Email
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <MessageSquare className="mr-2 h-4 w-4" /> Add Note
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
              {filtered.map((order) => (
                <Card key={order._id} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 group-hover:scale-110 transition-transform duration-200">
                          <Receipt className="h-6 w-6 text-orange-600" />
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={selectedOrders.includes(order._id)}
                            onChange={() => handleSelectOrder(order._id)}
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
                                <Link href={`/admin/orders/${order._id}`}>
                                  <Eye className="mr-2 h-4 w-4" /> View
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Printer className="mr-2 h-4 w-4" /> Print
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Send className="mr-2 h-4 w-4" /> Email
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <h3 className="font-semibold group-hover:text-orange-600 transition-colors">
                            Order #{order._id.slice(-8)}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <User className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">{order.user?.name}</span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Items:</span>
                            <span className="text-sm font-medium">{order.items.length}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Total:</span>
                            <span className="font-semibold text-orange-600">${order.total.toFixed(2)}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${getStatusColor(order.status)}`}
                          >
                            <div className="flex items-center gap-1">
                              {getStatusIcon(order.status)}
                              {order.status}
                            </div>
                          </Badge>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${getPaymentStatusColor(order.paymentStatus)}`}
                          >
                            {order.paymentStatus}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="flex-1" asChild>
                          <Link href={`/admin/orders/${order._id}`}>
                            <Eye className="mr-2 h-3 w-3" />
                            View
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Printer className="mr-2 h-3 w-3" />
                          Print
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
              Showing {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total} orders
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
