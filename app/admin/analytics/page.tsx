"use client"

import React, { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { Badge } from "../../../components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select"
import { 
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  Eye,
  Download,
  Filter,
  Calendar,
  RefreshCw,
  Activity,
  Target,
  Zap,
  Award,
  Star,
  Clock,
  AlertTriangle,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  MapPin,
  CreditCard,
  Mail,
  Phone,
  MessageSquare,
  Bell,
  Settings,
  MoreHorizontal,
  ExternalLink,
  Plus,
  Minus,
  X,
  Check,
  Copy,
  Edit,
  Trash2,
  Save,
  Upload,
  FileText,
  Image,
  Video,
  Music,
  Archive,
  Bookmark,
  Heart,
  ThumbsUp,
  Share,
  Send,
  Search,
  Grid3X3,
  List,
  Layout,
  Maximize,
  Minimize,
  RotateCcw,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Move,
  MousePointer,
  Hand,
  Type,
  Bold,
  Italic,
  Underline,
  Link,
  Unlink,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  ListOrdered,
  Quote,
  Code,
  Terminal,
  FileCode,
  GitBranch,
  GitCommit,
  GitMerge,
  GitPullRequest,
  GitCompare,
  GitFork,
  Github,
  Gitlab,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
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
  Turtle
} from "lucide-react"
import { ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart as RechartsPieChart, Pie, Cell, RadarChart as RechartsRadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ScatterChart as RechartsScatterChart, Scatter } from "recharts"

// Mock data for analytics
const revenueData = [
  { name: "Jan", total: 1200, previous: 1000 },
  { name: "Feb", total: 1900, previous: 1200 },
  { name: "Mar", total: 1500, previous: 1900 },
  { name: "Apr", total: 2200, previous: 1500 },
  { name: "May", total: 2800, previous: 2200 },
  { name: "Jun", total: 3200, previous: 2800 },
  { name: "Jul", total: 3800, previous: 3200 },
  { name: "Aug", total: 4300, previous: 3800 },
  { name: "Sep", total: 4900, previous: 4300 },
  { name: "Oct", total: 5400, previous: 4900 },
  { name: "Nov", total: 5800, previous: 5400 },
  { name: "Dec", total: 6300, previous: 5800 },
]

const ordersData = [
  { name: "Jan", total: 120, previous: 100 },
  { name: "Feb", total: 190, previous: 120 },
  { name: "Mar", total: 150, previous: 190 },
  { name: "Apr", total: 220, previous: 150 },
  { name: "May", total: 280, previous: 220 },
  { name: "Jun", total: 320, previous: 280 },
  { name: "Jul", total: 380, previous: 320 },
  { name: "Aug", total: 430, previous: 380 },
  { name: "Sep", total: 490, previous: 430 },
  { name: "Oct", total: 540, previous: 490 },
  { name: "Nov", total: 580, previous: 540 },
  { name: "Dec", total: 630, previous: 580 },
]

const customersData = [
  { name: "Jan", new: 20, returning: 40, total: 60 },
  { name: "Feb", new: 25, returning: 45, total: 70 },
  { name: "Mar", new: 30, returning: 50, total: 80 },
  { name: "Apr", new: 35, returning: 55, total: 90 },
  { name: "May", new: 40, returning: 60, total: 100 },
  { name: "Jun", new: 45, returning: 65, total: 110 },
  { name: "Jul", new: 50, returning: 70, total: 120 },
  { name: "Aug", new: 55, returning: 75, total: 130 },
  { name: "Sep", new: 60, returning: 80, total: 140 },
  { name: "Oct", new: 65, returning: 85, total: 150 },
  { name: "Nov", new: 70, returning: 90, total: 160 },
  { name: "Dec", new: 75, returning: 95, total: 170 },
]

const topProductsData = [
  { name: "Artisan Ceramic Bowl Set", sales: 245, revenue: 12250, growth: 12.5 },
  { name: "Handwoven Textile Collection", sales: 189, revenue: 9450, growth: 8.3 },
  { name: "Wooden Kitchen Utensils", sales: 156, revenue: 4680, growth: 15.2 },
  { name: "Handmade Jewelry Set", sales: 134, revenue: 6700, growth: 6.7 },
  { name: "Leather Crafted Wallet", sales: 98, revenue: 2940, growth: 9.1 },
]

const trafficSourcesData = [
  { name: "Direct", value: 35, color: "#8884d8" },
  { name: "Google", value: 28, color: "#82ca9d" },
  { name: "Social Media", value: 20, color: "#ffc658" },
  { name: "Email", value: 12, color: "#ff7300" },
  { name: "Referral", value: 5, color: "#00ff00" },
]

const deviceData = [
  { name: "Desktop", value: 45, color: "#8884d8" },
  { name: "Mobile", value: 40, color: "#82ca9d" },
  { name: "Tablet", value: 15, color: "#ffc658" },
]

const performanceData = [
  { metric: "Page Load Speed", score: 85, target: 90 },
  { metric: "Conversion Rate", score: 3.2, target: 4.0 },
  { metric: "Bounce Rate", score: 35, target: 30 },
  { metric: "User Engagement", score: 78, target: 80 },
  { metric: "Mobile Performance", score: 82, target: 85 },
]

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("12m")
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

  // Calculate key metrics
  const metrics = useMemo(() => {
    const currentRevenue = revenueData[revenueData.length - 1]?.total || 0
    const previousRevenue = revenueData[revenueData.length - 2]?.total || 0
    const revenueGrowth = ((currentRevenue - previousRevenue) / previousRevenue) * 100

    const currentOrders = ordersData[ordersData.length - 1]?.total || 0
    const previousOrders = ordersData[ordersData.length - 2]?.total || 0
    const ordersGrowth = ((currentOrders - previousOrders) / previousOrders) * 100

    const currentCustomers = customersData[customersData.length - 1]?.total || 0
    const previousCustomers = customersData[customersData.length - 2]?.total || 0
    const customersGrowth = ((currentCustomers - previousCustomers) / previousCustomers) * 100

    const totalProducts = topProductsData.reduce((sum, product) => sum + product.sales, 0)
    const totalRevenue = topProductsData.reduce((sum, product) => sum + product.revenue, 0)

    return {
      revenue: { current: currentRevenue, growth: revenueGrowth },
      orders: { current: currentOrders, growth: ordersGrowth },
      customers: { current: currentCustomers, growth: customersGrowth },
      products: { current: totalProducts, growth: 8.5 },
      totalRevenue,
      averageOrderValue: totalRevenue / currentOrders,
      conversionRate: 3.2,
      bounceRate: 35.2
    }
  }, [])

  return (
    <div className="space-y-8">
      {/* Enhanced Header Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/20 dark:via-indigo-950/20 dark:to-purple-950/20 p-8">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.1),transparent_50%),radial-gradient(ellipse_at_bottom_left,rgba(147,51,234,0.1),transparent_50%)] -z-10" />
        
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Badge className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-3 py-1 text-sm font-medium">
                <BarChart3 className="h-3 w-3 mr-1" />
                Analytics Dashboard
              </Badge>
              <Badge variant="outline" className="text-xs">
                <Activity className="h-3 w-3 mr-1" />
                Real-time Data
              </Badge>
            </div>
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Analytics & Insights
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Comprehensive analytics dashboard with real-time insights, performance metrics, and actionable data to drive your business growth.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32 rounded-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="3m">Last 3 months</SelectItem>
                <SelectItem value="6m">Last 6 months</SelectItem>
                <SelectItem value="12m">Last 12 months</SelectItem>
                <SelectItem value="all">All time</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" className="rounded-full">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button variant="outline" size="sm" className="rounded-full">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>
        
        {/* Quick Stats Preview */}
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">${metrics.revenue.current.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">Total Revenue</div>
            <div className={`text-xs flex items-center justify-center gap-1 ${metrics.revenue.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {metrics.revenue.growth >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {Math.abs(metrics.revenue.growth).toFixed(1)}%
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-600">{metrics.orders.current}</div>
            <div className="text-xs text-muted-foreground">Total Orders</div>
            <div className={`text-xs flex items-center justify-center gap-1 ${metrics.orders.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {metrics.orders.growth >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {Math.abs(metrics.orders.growth).toFixed(1)}%
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{metrics.customers.current}</div>
            <div className="text-xs text-muted-foreground">Total Customers</div>
            <div className={`text-xs flex items-center justify-center gap-1 ${metrics.customers.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {metrics.customers.growth >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {Math.abs(metrics.customers.growth).toFixed(1)}%
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{metrics.conversionRate}%</div>
            <div className="text-xs text-muted-foreground">Conversion Rate</div>
            <div className="text-xs text-green-600 flex items-center justify-center gap-1">
              <TrendingUp className="h-3 w-3" />
              +0.3%
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                <p className="text-3xl font-bold text-blue-600">${metrics.revenue.current.toLocaleString()}</p>
                <div className={`flex items-center gap-1 text-sm ${metrics.revenue.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {metrics.revenue.growth >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  {Math.abs(metrics.revenue.growth).toFixed(1)}% from last month
                </div>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 group-hover:scale-110 transition-transform duration-200">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                <p className="text-3xl font-bold text-indigo-600">{metrics.orders.current}</p>
                <div className={`flex items-center gap-1 text-sm ${metrics.orders.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {metrics.orders.growth >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  {Math.abs(metrics.orders.growth).toFixed(1)}% from last month
                </div>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 group-hover:scale-110 transition-transform duration-200">
                <ShoppingCart className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Customers</p>
                <p className="text-3xl font-bold text-purple-600">{metrics.customers.current}</p>
                <div className={`flex items-center gap-1 text-sm ${metrics.customers.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {metrics.customers.growth >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  {Math.abs(metrics.customers.growth).toFixed(1)}% from last month
                </div>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 group-hover:scale-110 transition-transform duration-200">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Average Order Value</p>
                <p className="text-3xl font-bold text-green-600">${metrics.averageOrderValue.toFixed(2)}</p>
                <div className="flex items-center gap-1 text-sm text-green-600">
                  <TrendingUp className="h-4 w-4" />
                  +5.2% from last month
                </div>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 group-hover:scale-110 transition-transform duration-200">
                <Target className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="performance" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Performance
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Insights
            </TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="rounded-full">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button variant="outline" size="sm" className="rounded-full">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        <TabsContent value="overview" className="space-y-6">
          {/* Revenue & Orders Charts */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="group hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  Revenue Overview
                </CardTitle>
                <CardDescription>Monthly revenue trends and growth</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueData}>
                      <defs>
                        <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                      <YAxis stroke="#64748b" fontSize={12} />
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--background))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }} 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="total" 
                        stroke="#3b82f6" 
                        strokeWidth={2}
                        fillOpacity={1} 
                        fill="url(#revenueGradient)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-indigo-600" />
                  Orders Overview
                </CardTitle>
                <CardDescription>Monthly order volume and trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={ordersData}>
                      <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                      <YAxis stroke="#64748b" fontSize={12} />
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--background))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }} 
                      />
                      <Bar dataKey="total" fill="#6366f1" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Customer Growth & Top Products */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="group hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-600" />
                  Customer Growth
                </CardTitle>
                <CardDescription>New vs returning customer trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={customersData}>
                      <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                      <YAxis stroke="#64748b" fontSize={12} />
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--background))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }} 
                      />
                      <Line type="monotone" dataKey="new" stroke="#8b5cf6" strokeWidth={2} />
                      <Line type="monotone" dataKey="returning" stroke="#06b6d4" strokeWidth={2} />
                      <Line type="monotone" dataKey="total" stroke="#10b981" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-green-600" />
                  Top Products
                </CardTitle>
                <CardDescription>Best performing products this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topProductsData.map((product, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30">
                          <Package className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{product.name}</p>
                          <p className="text-xs text-muted-foreground">{product.sales} sales</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-600">${product.revenue.toLocaleString()}</p>
                        <div className="flex items-center gap-1 text-xs text-green-600">
                          <TrendingUp className="h-3 w-3" />
                          {product.growth}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          {/* Performance Metrics */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="group hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-orange-600" />
                  Performance Metrics
                </CardTitle>
                <CardDescription>Key performance indicators and targets</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {performanceData.map((metric, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{metric.metric}</span>
                        <span className="text-sm font-semibold">{metric.score}{metric.metric === 'Conversion Rate' ? '%' : metric.metric === 'Bounce Rate' ? '%' : ''}</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-500 ${
                            metric.score >= metric.target ? 'bg-green-500' : 
                            metric.score >= metric.target * 0.8 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${Math.min((metric.score / metric.target) * 100, 100)}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Target: {metric.target}{metric.metric === 'Conversion Rate' ? '%' : metric.metric === 'Bounce Rate' ? '%' : ''}</span>
                        <span className={metric.score >= metric.target ? 'text-green-600' : 'text-red-600'}>
                          {metric.score >= metric.target ? '✓ Achieved' : '⚠ Needs improvement'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-cyan-600" />
                  Traffic Sources
                </CardTitle>
                <CardDescription>Where your visitors come from</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={trafficSourcesData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {trafficSourcesData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Device Analytics & Geographic Data */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="group hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5 text-blue-600" />
                  Device Analytics
                </CardTitle>
                <CardDescription>Traffic by device type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {deviceData.map((device, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30">
                          {device.name === 'Desktop' ? <Monitor className="h-4 w-4 text-blue-600" /> :
                           device.name === 'Mobile' ? <Smartphone className="h-4 w-4 text-blue-600" /> :
                           <Tablet className="h-4 w-4 text-blue-600" />}
                        </div>
                        <span className="font-medium">{device.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-muted rounded-full h-2">
                          <div 
                            className="h-2 rounded-full"
                            style={{ width: `${device.value}%`, backgroundColor: device.color }}
                          />
                        </div>
                        <span className="text-sm font-semibold w-8">{device.value}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-red-600" />
                  Geographic Distribution
                </CardTitle>
                <CardDescription>Top countries and regions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { country: "United States", visitors: 45, revenue: "$12,450" },
                    { country: "Canada", visitors: 23, revenue: "$6,780" },
                    { country: "United Kingdom", visitors: 18, revenue: "$5,230" },
                    { country: "Germany", visitors: 12, revenue: "$3,890" },
                    { country: "Australia", visitors: 8, revenue: "$2,340" },
                  ].map((location, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-red-100 to-pink-100 dark:from-red-900/30 dark:to-pink-900/30">
                          <MapPin className="h-4 w-4 text-red-600" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{location.country}</p>
                          <p className="text-xs text-muted-foreground">{location.visitors}% of visitors</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-600">{location.revenue}</p>
                        <p className="text-xs text-muted-foreground">Revenue</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          {/* AI Insights & Recommendations */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="group hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-600" />
                  AI Insights
                </CardTitle>
                <CardDescription>Automated insights and trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      type: "success",
                      title: "Revenue Growth Trend",
                      description: "Your revenue has increased by 8.6% this month, driven primarily by the Artisan Ceramic Bowl Set.",
                      icon: TrendingUp,
                      color: "text-green-600"
                    },
                    {
                      type: "warning",
                      title: "Mobile Conversion Rate",
                      description: "Mobile conversion rate is 15% lower than desktop. Consider optimizing mobile checkout flow.",
                      icon: AlertTriangle,
                      color: "text-yellow-600"
                    },
                    {
                      type: "info",
                      title: "Customer Retention",
                      description: "Returning customers generate 3x more revenue than new customers. Focus on retention strategies.",
                      icon: Users,
                      color: "text-blue-600"
                    },
                    {
                      type: "success",
                      title: "Peak Shopping Hours",
                      description: "Most conversions happen between 2-4 PM. Consider scheduling promotions during this time.",
                      icon: Clock,
                      color: "text-green-600"
                    }
                  ].map((insight, index) => (
                    <div key={index} className="p-4 rounded-lg border border-border/50 hover:border-border transition-colors">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg bg-muted/50 ${insight.color}`}>
                          <insight.icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm mb-1">{insight.title}</h4>
                          <p className="text-xs text-muted-foreground">{insight.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-purple-600" />
                  Recommendations
                </CardTitle>
                <CardDescription>Actionable recommendations to improve performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      priority: "high",
                      title: "Optimize Mobile Experience",
                      description: "Improve mobile checkout flow to increase conversion rate by 15-20%",
                      impact: "High Impact",
                      effort: "Medium Effort",
                      icon: Smartphone,
                      color: "text-red-600"
                    },
                    {
                      priority: "medium",
                      title: "Email Marketing Campaign",
                      description: "Launch targeted email campaigns to increase customer retention",
                      impact: "Medium Impact",
                      effort: "Low Effort",
                      icon: Mail,
                      color: "text-yellow-600"
                    },
                    {
                      priority: "high",
                      title: "Product Bundle Strategy",
                      description: "Create product bundles to increase average order value",
                      impact: "High Impact",
                      effort: "Low Effort",
                      icon: Package,
                      color: "text-red-600"
                    },
                    {
                      priority: "low",
                      title: "Social Media Integration",
                      description: "Add social sharing buttons to product pages",
                      impact: "Low Impact",
                      effort: "Low Effort",
                      icon: Share,
                      color: "text-green-600"
                    }
                  ].map((recommendation, index) => (
                    <div key={index} className="p-4 rounded-lg border border-border/50 hover:border-border transition-colors">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg bg-muted/50 ${recommendation.color}`}>
                          <recommendation.icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-sm">{recommendation.title}</h4>
                            <Badge variant={recommendation.priority === 'high' ? 'destructive' : recommendation.priority === 'medium' ? 'default' : 'secondary'} className="text-xs">
                              {recommendation.priority}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">{recommendation.description}</p>
                          <div className="flex items-center gap-4 text-xs">
                            <span className="text-green-600">📈 {recommendation.impact}</span>
                            <span className="text-blue-600">⚡ {recommendation.effort}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Real-time Activity & Quick Actions */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="group hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-green-600" />
                  Real-time Activity
                </CardTitle>
                <CardDescription>Live updates and recent activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { action: "New order received", time: "2 minutes ago", amount: "$89.99", icon: ShoppingCart, color: "text-green-600" },
                    { action: "Customer registered", time: "5 minutes ago", amount: null, icon: Users, color: "text-blue-600" },
                    { action: "Product viewed", time: "8 minutes ago", amount: "Artisan Bowl Set", icon: Eye, color: "text-purple-600" },
                    { action: "Payment processed", time: "12 minutes ago", amount: "$156.50", icon: CreditCard, color: "text-green-600" },
                    { action: "Email opened", time: "15 minutes ago", amount: "Newsletter", icon: Mail, color: "text-orange-600" },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                      <div className={`p-2 rounded-lg bg-muted/50 ${activity.color}`}>
                        <activity.icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.action}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                      {activity.amount && (
                        <div className="text-right">
                          <p className="text-sm font-semibold text-green-600">{activity.amount}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-gray-600" />
                  Quick Actions
                </CardTitle>
                <CardDescription>Common analytics tasks and shortcuts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  <Button variant="outline" className="justify-start h-auto p-4">
                    <div className="flex items-center gap-3">
                      <Download className="h-4 w-4 text-blue-600" />
                      <div className="text-left">
                        <p className="font-medium">Export Report</p>
                        <p className="text-xs text-muted-foreground">Download analytics data</p>
                      </div>
                    </div>
                  </Button>
                  <Button variant="outline" className="justify-start h-auto p-4">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-green-600" />
                      <div className="text-left">
                        <p className="font-medium">Schedule Report</p>
                        <p className="text-xs text-muted-foreground">Set up automated reports</p>
                      </div>
                    </div>
                  </Button>
                  <Button variant="outline" className="justify-start h-auto p-4">
                    <div className="flex items-center gap-3">
                      <Filter className="h-4 w-4 text-purple-600" />
                      <div className="text-left">
                        <p className="font-medium">Custom Filter</p>
                        <p className="text-xs text-muted-foreground">Create custom analytics view</p>
                      </div>
                    </div>
                  </Button>
                  <Button variant="outline" className="justify-start h-auto p-4">
                    <div className="flex items-center gap-3">
                      <Bell className="h-4 w-4 text-orange-600" />
                      <div className="text-left">
                        <p className="font-medium">Set Alerts</p>
                        <p className="text-xs text-muted-foreground">Configure performance alerts</p>
                      </div>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
