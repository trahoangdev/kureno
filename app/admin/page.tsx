"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  ArrowUpRight,
  Box,
  DollarSign,
  ShoppingCart,
  TrendingUp,
  Users,
  Package,
  CreditCard,
  Calendar,
  AlertCircle,
  Bell,
  Settings,
  Download,
  Eye,
  Star,
  Award,
  Zap,
  Target,
  Activity,
  BarChart3,
  PieChart,
  TrendingDown,
  CheckCircle,
  Clock,
  AlertTriangle,
  Plus,
  Filter,
  Search,
  RefreshCw,
  MoreHorizontal,
  ExternalLink,
} from "lucide-react"
import { ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, AreaChart, Area, BarChart, Bar } from "recharts"

// Mock data for charts
const revenueData = [
  { name: "Jan", total: 1200 },
  { name: "Feb", total: 1900 },
  { name: "Mar", total: 1500 },
  { name: "Apr", total: 2200 },
  { name: "May", total: 2800 },
  { name: "Jun", total: 3200 },
  { name: "Jul", total: 3800 },
  { name: "Aug", total: 4300 },
  { name: "Sep", total: 4900 },
  { name: "Oct", total: 5400 },
  { name: "Nov", total: 5800 },
  { name: "Dec", total: 6300 },
]

const ordersData = [
  { name: "Jan", total: 120 },
  { name: "Feb", total: 190 },
  { name: "Mar", total: 150 },
  { name: "Apr", total: 220 },
  { name: "May", total: 280 },
  { name: "Jun", total: 320 },
  { name: "Jul", total: 380 },
  { name: "Aug", total: 430 },
  { name: "Sep", total: 490 },
  { name: "Oct", total: 540 },
  { name: "Nov", total: 580 },
  { name: "Dec", total: 630 },
]

const customersData = [
  { name: "Jan", new: 20, returning: 40 },
  { name: "Feb", new: 30, returning: 45 },
  { name: "Mar", new: 25, returning: 50 },
  { name: "Apr", new: 40, returning: 55 },
  { name: "May", new: 45, returning: 60 },
  { name: "Jun", new: 50, returning: 65 },
  { name: "Jul", new: 55, returning: 70 },
  { name: "Aug", new: 60, returning: 75 },
  { name: "Sep", new: 65, returning: 80 },
  { name: "Oct", new: 70, returning: 85 },
  { name: "Nov", new: 75, returning: 90 },
  { name: "Dec", new: 80, returning: 95 },
]

const productCategoriesData = [
  { name: "Wooden Crafts", value: 40 },
  { name: "Ceramics", value: 30 },
  { name: "Textiles", value: 15 },
  { name: "Jewelry", value: 10 },
  { name: "Other", value: 5 },
]

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Enhanced Header Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50 dark:from-teal-950/20 dark:via-emerald-950/20 dark:to-cyan-950/20 p-8">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(20,184,166,0.1),transparent_50%),radial-gradient(ellipse_at_bottom_left,rgba(16,185,129,0.1),transparent_50%)] -z-10" />
        
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Badge className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white px-3 py-1 text-sm font-medium">
                <Activity className="h-3 w-3 mr-1" />
                Admin Dashboard
              </Badge>
              <Badge variant="outline" className="text-xs">
                <Clock className="h-3 w-3 mr-1" />
                Last updated: 2 minutes ago
              </Badge>
            </div>
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-600 bg-clip-text text-transparent">
              Welcome back, Admin
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Here's what's happening with your store today. Monitor performance, manage orders, and track key metrics.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="rounded-full">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Button variant="outline" size="sm" className="rounded-full">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button asChild className="rounded-full">
              <Link href="/admin/orders/new">
                <Plus className="mr-2 h-4 w-4" />
                New Order
              </Link>
            </Button>
          </div>
        </div>
        
        {/* Quick Stats Preview */}
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-teal-600">$45.2K</div>
            <div className="text-xs text-muted-foreground">Total Revenue</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-600">2,350</div>
            <div className="text-xs text-muted-foreground">Orders</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-cyan-600">573</div>
            <div className="text-xs text-muted-foreground">Customers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-teal-600">3.2%</div>
            <div className="text-xs text-muted-foreground">Conversion</div>
          </div>
        </div>
      </div>

      {/* Enhanced Alerts Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-yellow-200 bg-gradient-to-br from-yellow-50 to-amber-50 dark:border-yellow-900 dark:from-yellow-900/20 dark:to-amber-900/20 group hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-full bg-yellow-100 dark:bg-yellow-900/30 group-hover:scale-110 transition-transform duration-300">
                <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-500" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-yellow-800 dark:text-yellow-400 mb-1">
                  Pending Orders
                </h3>
                <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-3">
                  3 orders awaiting processing
                </p>
                <Button variant="outline" size="sm" className="border-yellow-300 dark:border-yellow-800 text-yellow-700 dark:text-yellow-300 hover:bg-yellow-100 dark:hover:bg-yellow-900/30">
                  <Link href="/admin/orders?status=pending" className="flex items-center gap-2">
                    View Orders
                    <ArrowUpRight className="h-3 w-3" />
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-200 bg-gradient-to-br from-red-50 to-rose-50 dark:border-red-900 dark:from-red-900/20 dark:to-rose-900/20 group hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-full bg-red-100 dark:bg-red-900/30 group-hover:scale-110 transition-transform duration-300">
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-500" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-red-800 dark:text-red-400 mb-1">
                  Low Stock Alert
                </h3>
                <p className="text-sm text-red-700 dark:text-red-300 mb-3">
                  2 products running low on inventory
                </p>
                <Button variant="outline" size="sm" className="border-red-300 dark:border-red-800 text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/30">
                  <Link href="/admin/products?filter=low-stock" className="flex items-center gap-2">
                    Manage Stock
                    <ArrowUpRight className="h-3 w-3" />
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 dark:border-blue-900 dark:from-blue-900/20 dark:to-indigo-900/20 group hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30 group-hover:scale-110 transition-transform duration-300">
                <Bell className="h-5 w-5 text-blue-600 dark:text-blue-500" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-blue-800 dark:text-blue-400 mb-1">
                  New Messages
                </h3>
                <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                  5 unread customer messages
                </p>
                <Button variant="outline" size="sm" className="border-blue-300 dark:border-blue-800 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/30">
                  <Link href="/admin/messages" className="flex items-center gap-2">
                    View Messages
                    <ArrowUpRight className="h-3 w-3" />
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-teal-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
            <div className="p-2 rounded-lg bg-teal-100 dark:bg-teal-900/30 group-hover:scale-110 transition-transform duration-300">
              <DollarSign className="h-4 w-4 text-teal-600 dark:text-teal-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-teal-600 dark:text-teal-400 mb-2">$45,231.89</div>
            <div className="flex items-center text-xs">
              <div className="flex items-center bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded-full">
                <TrendingUp className="mr-1 h-3 w-3" />
                <span className="font-medium">+20.1%</span>
              </div>
              <span className="ml-2 text-muted-foreground">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-emerald-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Orders</CardTitle>
            <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 group-hover:scale-110 transition-transform duration-300">
              <Box className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">2,350</div>
            <div className="flex items-center text-xs">
              <div className="flex items-center bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded-full">
                <TrendingUp className="mr-1 h-3 w-3" />
                <span className="font-medium">+12.2%</span>
              </div>
              <span className="ml-2 text-muted-foreground">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-cyan-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Customers</CardTitle>
            <div className="p-2 rounded-lg bg-cyan-100 dark:bg-cyan-900/30 group-hover:scale-110 transition-transform duration-300">
              <Users className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-cyan-600 dark:text-cyan-400 mb-2">573</div>
            <div className="flex items-center text-xs">
              <div className="flex items-center bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded-full">
                <TrendingUp className="mr-1 h-3 w-3" />
                <span className="font-medium">+8.1%</span>
              </div>
              <span className="ml-2 text-muted-foreground">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Conversion Rate</CardTitle>
            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30 group-hover:scale-110 transition-transform duration-300">
              <Target className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">3.2%</div>
            <div className="flex items-center text-xs">
              <div className="flex items-center bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded-full">
                <TrendingUp className="mr-1 h-3 w-3" />
                <span className="font-medium">+1.2%</span>
              </div>
              <span className="ml-2 text-muted-foreground">from last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Quick Actions */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Quick Actions</h2>
            <p className="text-muted-foreground">Manage your store efficiently with these quick access tools</p>
          </div>
          <Badge variant="outline" className="text-xs">
            <Zap className="h-3 w-3 mr-1" />
            Fast Access
          </Badge>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 text-white group-hover:scale-110 transition-transform duration-300">
                  <Package className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold group-hover:text-teal-600 transition-colors">Manage Products</h3>
                  <p className="text-sm text-muted-foreground">Add, edit, or remove products</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Total Products</span>
                  <span className="font-medium">127</span>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Low Stock</span>
                  <span className="font-medium text-red-600">2</span>
                </div>
              </div>
              <Button variant="ghost" className="mt-4 w-full justify-start group-hover:bg-teal-50 dark:group-hover:bg-teal-950/20" asChild>
                <Link href="/admin/products">
                  Go to Products <ArrowUpRight className="ml-auto h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 text-white group-hover:scale-110 transition-transform duration-300">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold group-hover:text-emerald-600 transition-colors">Manage Customers</h3>
                  <p className="text-sm text-muted-foreground">View and manage customer accounts</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Total Customers</span>
                  <span className="font-medium">573</span>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>New This Month</span>
                  <span className="font-medium text-green-600">+47</span>
                </div>
              </div>
              <Button variant="ghost" className="mt-4 w-full justify-start group-hover:bg-emerald-50 dark:group-hover:bg-emerald-950/20" asChild>
                <Link href="/admin/customers">
                  Go to Customers <ArrowUpRight className="ml-auto h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-500 text-white group-hover:scale-110 transition-transform duration-300">
                  <CreditCard className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold group-hover:text-cyan-600 transition-colors">Process Orders</h3>
                  <p className="text-sm text-muted-foreground">View and manage customer orders</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Pending Orders</span>
                  <span className="font-medium text-yellow-600">3</span>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Today's Orders</span>
                  <span className="font-medium">12</span>
                </div>
              </div>
              <Button variant="ghost" className="mt-4 w-full justify-start group-hover:bg-cyan-50 dark:group-hover:bg-cyan-950/20" asChild>
                <Link href="/admin/orders">
                  Go to Orders <ArrowUpRight className="ml-auto h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white group-hover:scale-110 transition-transform duration-300">
                  <Calendar className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold group-hover:text-purple-600 transition-colors">Manage Content</h3>
                  <p className="text-sm text-muted-foreground">Update blog posts and pages</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Published Posts</span>
                  <span className="font-medium">24</span>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Draft Posts</span>
                  <span className="font-medium text-orange-600">3</span>
                </div>
              </div>
              <Button variant="ghost" className="mt-4 w-full justify-start group-hover:bg-purple-50 dark:group-hover:bg-purple-950/20" asChild>
                <Link href="/admin/blog">
                  Go to Content <ArrowUpRight className="ml-auto h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Enhanced Charts Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Analytics & Reports</h2>
            <p className="text-muted-foreground">Track your store's performance with detailed analytics and insights</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="rounded-full">
              <Download className="mr-2 h-4 w-4" />
              Export Data
            </Button>
            <Button variant="outline" size="sm" className="rounded-full">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <PieChart className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Reports
            </TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="group hover:shadow-lg transition-all duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-teal-600" />
                        Revenue Overview
                      </CardTitle>
                      <CardDescription>Monthly revenue for the current year</CardDescription>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      <Eye className="h-3 w-3 mr-1" />
                      Live
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueData}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                      <YAxis stroke="#64748b" fontSize={12} />
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'hsl(var(--background))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="total"
                        stroke="#14b8a6"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorRevenue)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              <Card className="group hover:shadow-lg transition-all duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Box className="h-5 w-5 text-emerald-600" />
                        Orders Overview
                      </CardTitle>
                      <CardDescription>Monthly orders for the current year</CardDescription>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      <Activity className="h-3 w-3 mr-1" />
                      Real-time
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={ordersData}>
                      <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                      <YAxis stroke="#64748b" fontSize={12} />
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'hsl(var(--background))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                        }}
                      />
                      <Bar dataKey="total" fill="#10b981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Customer Growth</CardTitle>
                <CardDescription>New vs returning customers</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={customersData}>
                    <defs>
                      <linearGradient id="colorNew" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorReturning" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--secondary))" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="hsl(var(--secondary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="new"
                      stackId="1"
                      stroke="hsl(var(--primary))"
                      fill="url(#colorNew)"
                    />
                    <Area
                      type="monotone"
                      dataKey="returning"
                      stackId="1"
                      stroke="hsl(var(--secondary))"
                      fill="url(#colorReturning)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Product Categories</CardTitle>
                <CardDescription>Sales distribution by category</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart layout="vertical" data={productCategoriesData}>
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip />
                    <Bar dataKey="value" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reports</CardTitle>
              <CardDescription>Generate and download reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Sales Report</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Detailed sales data including products, revenue, and trends.
                    </p>
                    <Button variant="outline" className="mt-4 w-full">
                      Generate Report
                    </Button>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Inventory Report</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Current stock levels, low stock alerts, and reorder recommendations.
                    </p>
                    <Button variant="outline" className="mt-4 w-full">
                      Generate Report
                    </Button>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Customer Report</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Customer demographics, purchase history, and lifetime value.
                    </p>
                    <Button variant="outline" className="mt-4 w-full">
                      Generate Report
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        </Tabs>
      </div>

      {/* Enhanced Recent Orders & Activity */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4 group hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-teal-600" />
                  Recent Orders
                </CardTitle>
                <CardDescription>Latest customer orders and their status</CardDescription>
              </div>
              <Badge variant="outline" className="text-xs">
                <Clock className="h-3 w-3 mr-1" />
                Last 24h
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-4 text-sm text-muted-foreground font-medium border-b pb-2">
                <div>Order ID</div>
                <div>Customer</div>
                <div>Status</div>
                <div>Total</div>
              </div>
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="grid grid-cols-4 text-sm py-3 hover:bg-muted/50 rounded-lg px-2 transition-colors">
                  <div className="font-medium text-teal-600">#ORD-{1000 + i}</div>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs">CN</AvatarFallback>
                    </Avatar>
                    <span>Customer Name</span>
                  </div>
                  <div>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${
                        i === 0 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                        i === 1 ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                        'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                      }`}
                    >
                      {i === 0 ? 'Pending' : i === 1 ? 'Processing' : 'Completed'}
                    </Badge>
                  </div>
                  <div className="font-semibold">${(99.99 * (i + 1)).toFixed(2)}</div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-center">
              <Button variant="outline" size="sm" className="rounded-full" asChild>
                <Link href="/admin/orders">
                  View All Orders
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-3 group hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-emerald-600" />
                  Recent Activity
                </CardTitle>
                <CardDescription>Latest system activity and updates</CardDescription>
              </div>
              <Badge variant="outline" className="text-xs">
                <Zap className="h-3 w-3 mr-1" />
                Live
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { action: "New order placed", time: "10 minutes ago", icon: ShoppingCart, color: "text-green-600" },
                { action: "Customer registered", time: "1 hour ago", icon: Users, color: "text-blue-600" },
                { action: "Product stock updated", time: "2 hours ago", icon: Package, color: "text-orange-600" },
                { action: "Blog post published", time: "3 hours ago", icon: Calendar, color: "text-purple-600" },
                { action: "Order status changed", time: "5 hours ago", icon: CheckCircle, color: "text-teal-600" },
              ].map((activity, i) => (
                <div key={i} className="flex items-start gap-4 p-3 hover:bg-muted/50 rounded-lg transition-colors">
                  <div className="relative mt-0.5 h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                    <activity.icon className={`h-4 w-4 ${activity.color}`} />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-center">
              <Button variant="outline" size="sm" className="rounded-full">
                View All Activity
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
