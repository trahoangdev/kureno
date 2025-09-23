"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"
import { 
  Code, 
  Database, 
  Key, 
  Shield, 
  Users, 
  Package, 
  ShoppingCart,
  Search,
  Copy,
  Play,
  CheckCircle,
  AlertTriangle,
  Info,
  Activity,
  TrendingUp,
  BarChart3,
  Zap,
  Target,
  Award,
  Star,
  Clock,
  Calendar,
  MapPin,
  Phone,
  MessageSquare,
  FileText,
  Image,
  Link,
  ExternalLink,
  Edit,
  Save,
  Plus,
  Minus,
  X,
  Check,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  MoreVertical,
  Filter,
  Bell,
  Bookmark,
  Heart,
  Share,
  Send,
  Archive,
  Tag,
  Layers,
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
  Link as LinkIcon,
  Unlink,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  ListOrdered,
  Quote,
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
  Turtle,
  Lock,
  Unlock,
  XCircle,
  Pause,
  Loader2,
  Download,
  Upload,
  Settings,
  RefreshCw,
  Eye,
  EyeOff,
  Trash2
} from "lucide-react"

export default function ApiDocsPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedMethod, setSelectedMethod] = useState("all")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isTesting, setIsTesting] = useState(false)
  const [testResult, setTestResult] = useState<any>(null)
  const { toast } = useToast()

  const endpoints = [
    {
      method: "GET",
      path: "/api/products",
      description: "Get all products",
      auth: false,
      category: "products",
      params: "?page=1&limit=10&category=electronics",
      response: `{
  "products": [...],
  "total": 100,
  "page": 1,
  "totalPages": 10
}`,
    },
    {
      method: "POST",
      path: "/api/products",
      description: "Create a new product",
      auth: true,
      category: "products",
      permissions: "canManageProducts",
      body: `{
  "name": "Product Name",
  "description": "Product description",
  "price": 99.99,
  "category": "electronics",
  "stock": 50,
  "images": ["image1.jpg", "image2.jpg"]
}`,
      response: `{
  "message": "Product created successfully",
  "product": {...}
}`,
    },
    {
      method: "PUT",
      path: "/api/products/{id}",
      description: "Update a product",
      auth: true,
      category: "products",
      permissions: "canManageProducts",
      body: `{
  "name": "Updated Product Name",
  "price": 89.99,
  "stock": 45
}`,
      response: `{
  "message": "Product updated successfully",
  "product": {...}
}`,
    },
    {
      method: "DELETE",
      path: "/api/products/{id}",
      description: "Delete a product",
      auth: true,
      category: "products",
      permissions: "canManageProducts",
      response: `{
  "message": "Product deleted successfully"
}`,
    },
    {
      method: "GET",
      path: "/api/orders",
      description: "Get all orders",
      auth: true,
      category: "orders",
      permissions: "canManageOrders",
      params: "?status=pending&page=1&limit=10",
      response: `{
  "orders": [...],
  "total": 50,
  "page": 1,
  "totalPages": 5
}`,
    },
    {
      method: "POST",
      path: "/api/orders",
      description: "Create a new order",
      auth: true,
      category: "orders",
      body: `{
  "items": [
    {
      "productId": "product_id",
      "quantity": 2,
      "price": 99.99
    }
  ],
  "shippingAddress": {...},
  "paymentMethod": "credit_card"
}`,
      response: `{
  "message": "Order created successfully",
  "order": {...}
}`,
    },
    {
      method: "PUT",
      path: "/api/orders/{id}",
      description: "Update order status",
      auth: true,
      category: "orders",
      permissions: "canManageOrders",
      body: `{
  "status": "shipped",
  "trackingNumber": "TRACK123"
}`,
      response: `{
  "message": "Order updated successfully",
  "order": {...}
}`,
    },
    {
      method: "GET",
      path: "/api/admin/users",
      description: "Get all users",
      auth: true,
      category: "users",
      permissions: "canManageUsers",
      params: "?role=admin&page=1&limit=10",
      response: `{
  "users": [...],
  "total": 25,
  "page": 1,
  "totalPages": 3
}`,
    },
    {
      method: "POST",
      path: "/api/admin/users",
      description: "Create a new user",
      auth: true,
      category: "users",
      permissions: "canManageUsers",
      body: `{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "manager",
  "permissions": {...}
}`,
      response: `{
  "message": "User created successfully",
  "user": {...}
}`,
    },
    {
      method: "PUT",
      path: "/api/admin/users/{id}",
      description: "Update a user",
      auth: true,
      category: "users",
      permissions: "canManageUsers",
      body: `{
  "name": "John Smith",
  "role": "admin",
  "isActive": true
}`,
      response: `{
  "message": "User updated successfully",
  "user": {...}
}`,
    },
    {
      method: "DELETE",
      path: "/api/admin/users/{id}",
      description: "Delete a user",
      auth: true,
      category: "users",
      permissions: "canManageUsers",
      response: `{
  "message": "User deleted successfully"
}`,
    },
    {
      method: "POST",
      path: "/api/auth/token",
      description: "Generate JWT token",
      auth: false,
      category: "auth",
      body: `{
  "email": "admin@example.com",
  "password": "password123",
  "expiresIn": "1h"
}`,
      response: `{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": "1h",
  "user": {...}
}`,
    },
  ]

  const getMethodColor = (method: string) => {
    switch (method) {
      case "GET":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
      case "POST":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
      case "PUT":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
      case "DELETE":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "products": return Package
      case "orders": return ShoppingCart
      case "users": return Users
      case "auth": return Key
      default: return Code
    }
  }

  const filteredEndpoints = endpoints.filter(endpoint => {
    const matchesSearch = endpoint.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         endpoint.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesMethod = selectedMethod === "all" || endpoint.method === selectedMethod
    const matchesCategory = selectedCategory === "all" || endpoint.category === selectedCategory
    return matchesSearch && matchesMethod && matchesCategory
  })

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: "Copied",
        description: "Code copied to clipboard",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy code",
        variant: "destructive",
      })
    }
  }

  const testEndpoint = async (endpoint: any) => {
    setIsTesting(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setTestResult({
        status: 200,
        data: JSON.parse(endpoint.response),
        time: "245ms"
      })
      toast({
        title: "Test successful",
        description: `Endpoint ${endpoint.method} ${endpoint.path} responded successfully`,
      })
    } catch (error) {
      setTestResult({
        status: 500,
        error: "Internal server error",
        time: "1.2s"
      })
      toast({
        title: "Test failed",
        description: "Endpoint test failed",
        variant: "destructive",
      })
    } finally {
      setIsTesting(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Enhanced Header Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/20 dark:via-indigo-950/20 dark:to-purple-950/20 p-8">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.1),transparent_50%),radial-gradient(ellipse_at_bottom_left,rgba(99,102,241,0.1),transparent_50%)] -z-10" />
        
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Badge className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-3 py-1 text-sm font-medium">
                <Code className="h-3 w-3 mr-1" />
                API Documentation
              </Badge>
              <Badge variant="outline" className="text-xs">
                <Shield className="h-3 w-3 mr-1" />
                Developer Hub
              </Badge>
            </div>
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              API Documentation
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Comprehensive API documentation with interactive testing, code examples, and real-time monitoring. Build powerful integrations with our RESTful API.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="rounded-full">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button variant="outline" size="sm" className="rounded-full">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Button variant="outline" size="sm" className="rounded-full">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </div>
        </div>
        
        {/* Quick Stats Preview */}
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{endpoints.length}</div>
            <div className="text-xs text-muted-foreground">Total Endpoints</div>
            <div className="text-xs text-green-600 flex items-center justify-center gap-1">
              <CheckCircle className="h-3 w-3" />
              Active
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-600">{new Set(endpoints.map(e => e.category)).size}</div>
            <div className="text-xs text-muted-foreground">Categories</div>
            <div className="text-xs text-blue-600 flex items-center justify-center gap-1">
              <Layers className="h-3 w-3" />
              Organized
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{endpoints.filter(e => e.auth).length}</div>
            <div className="text-xs text-muted-foreground">Protected</div>
            <div className="text-xs text-green-600 flex items-center justify-center gap-1">
              <Shield className="h-3 w-3" />
              Secure
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-cyan-600">99.9%</div>
            <div className="text-xs text-muted-foreground">Uptime</div>
            <div className="text-xs text-green-600 flex items-center justify-center gap-1">
              <Activity className="h-3 w-3" />
              Reliable
            </div>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full max-w-lg grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="authentication" className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            Auth
          </TabsTrigger>
          <TabsTrigger value="endpoints" className="flex items-center gap-2">
            <Code className="h-4 w-4" />
            Endpoints
          </TabsTrigger>
          <TabsTrigger value="examples" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Examples
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-blue-600" />
                  Base URL
                </CardTitle>
                <CardDescription>Your API base endpoint</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <code className="text-sm bg-muted p-3 rounded-lg block font-mono">https://your-domain.com/api</code>
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute top-2 right-2 bg-transparent"
                    onClick={() => copyToClipboard("https://your-domain.com/api")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5 text-green-600" />
                  Content Type
                </CardTitle>
                <CardDescription>Request/Response format</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <code className="text-sm bg-muted p-3 rounded-lg block font-mono">application/json</code>
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute top-2 right-2 bg-transparent"
                    onClick={() => copyToClipboard("application/json")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-purple-600" />
                  Authentication
                </CardTitle>
                <CardDescription>Security requirements</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Most endpoints require JWT authentication. Include the token in the Authorization header.
                </p>
                <div className="mt-3 p-2 bg-muted rounded text-xs font-mono">
                  Authorization: Bearer {"{token}"}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5 text-orange-600" />
                  Permissions
                </CardTitle>
                <CardDescription>Access control</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Different endpoints require different permissions based on user role and capabilities.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-blue-500" />
                    <span className="text-xs">canManageProducts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4 text-green-500" />
                    <span className="text-xs">canManageOrders</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-purple-500" />
                    <span className="text-xs">canManageUsers</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-green-600" />
                  API Status
                </CardTitle>
                <CardDescription>Current system status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">All systems operational</span>
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  Last updated: {new Date().toLocaleTimeString()}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  Rate Limits
                </CardTitle>
                <CardDescription>Usage restrictions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Free tier:</span>
                    <span className="font-mono">1000/hour</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pro tier:</span>
                    <span className="font-mono">10000/hour</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Enterprise:</span>
                    <span className="font-mono">Unlimited</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="authentication">
          <Card>
            <CardHeader>
              <CardTitle>JWT Authentication</CardTitle>
              <CardDescription>Learn how to authenticate with the API using JWT tokens</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">1. Generate a Token</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Use the token generation endpoint to get a JWT token:
                </p>
                <div className="bg-muted p-4 rounded-lg">
                  <code className="text-sm">
                    POST /api/auth/token
                    <br />
                    Content-Type: application/json
                    <br />
                    <br />
                    {`{
  "email": "admin@example.com",
  "password": "your-password",
  "expiresIn": "1h"
}`}
                  </code>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">2. Use the Token</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Include the token in the Authorization header of your requests:
                </p>
                <div className="bg-muted p-4 rounded-lg">
                  <code className="text-sm">Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...</code>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">3. Token Expiration</h3>
                <p className="text-sm text-muted-foreground">
                  Tokens have configurable expiration times. Available options: 15m, 30m, 1h, 2h, 6h, 12h, 1d, 7d, 30d
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">4. Permissions</h3>
                <p className="text-sm text-muted-foreground mb-4">Different endpoints require different permissions:</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    <span className="text-sm">canManageProducts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4" />
                    <span className="text-sm">canManageOrders</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span className="text-sm">canManageUsers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Code className="h-4 w-4" />
                    <span className="text-sm">canManageContent</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="endpoints" className="space-y-6">
          {/* Search and Filter Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5 text-blue-600" />
                Search & Filter
              </CardTitle>
              <CardDescription>Find specific endpoints and filter by method or category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Search endpoints</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by path or description..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">HTTP Method</label>
                  <select
                    value={selectedMethod}
                    onChange={(e) => setSelectedMethod(e.target.value)}
                    className="w-full p-2 border rounded-md bg-background"
                  >
                    <option value="all">All Methods</option>
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                    <option value="DELETE">DELETE</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full p-2 border rounded-md bg-background"
                  >
                    <option value="all">All Categories</option>
                    <option value="products">Products</option>
                    <option value="orders">Orders</option>
                    <option value="users">Users</option>
                    <option value="auth">Authentication</option>
                  </select>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                <Filter className="h-4 w-4" />
                Showing {filteredEndpoints.length} of {endpoints.length} endpoints
              </div>
            </CardContent>
          </Card>

          {/* Endpoints List */}
          <div className="space-y-4">
            {filteredEndpoints.map((endpoint, index) => {
              const CategoryIcon = getCategoryIcon(endpoint.category)
              return (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge className={getMethodColor(endpoint.method)}>{endpoint.method}</Badge>
                        <code className="text-sm font-mono">{endpoint.path}</code>
                        <Badge variant="outline" className="flex items-center gap-1">
                          <CategoryIcon className="h-3 w-3" />
                          {endpoint.category}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        {endpoint.auth && (
                          <Badge variant="outline">
                            <Shield className="h-3 w-3 mr-1" />
                            Auth Required
                          </Badge>
                        )}
                        {endpoint.permissions && <Badge variant="secondary">{endpoint.permissions}</Badge>}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => testEndpoint(endpoint)}
                          disabled={isTesting}
                        >
                          {isTesting ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Play className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                    <CardDescription>{endpoint.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {endpoint.params && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">Query Parameters</h4>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard(endpoint.params)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="bg-muted p-3 rounded-lg">
                          <code className="text-sm">{endpoint.params}</code>
                        </div>
                      </div>
                    )}
                    {endpoint.body && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">Request Body</h4>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard(endpoint.body)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="bg-muted p-3 rounded-lg">
                          <pre className="text-sm overflow-x-auto">{endpoint.body}</pre>
                        </div>
                      </div>
                    )}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">Response</h4>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(endpoint.response)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="bg-muted p-3 rounded-lg">
                        <pre className="text-sm overflow-x-auto">{endpoint.response}</pre>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {filteredEndpoints.length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Search className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No endpoints found</h3>
                <p className="text-muted-foreground text-center">
                  Try adjusting your search criteria or filters to find what you're looking for.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="examples" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5 text-blue-600" />
                  JavaScript/Fetch
                </CardTitle>
                <CardDescription>Example of making authenticated API requests using JavaScript fetch</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <div className="bg-muted p-4 rounded-lg">
                    <pre className="text-sm overflow-x-auto">{`// Generate token
const tokenResponse = await fetch('/api/auth/token', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'admin@example.com',
    password: 'password123',
    expiresIn: '1h'
  }),
});

const { token } = await tokenResponse.json();

// Use token for authenticated requests
const response = await fetch('/api/products', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': \`Bearer \${token}\`,
  },
  body: JSON.stringify({
    name: 'New Product',
    price: 99.99,
    category: 'electronics',
    stock: 50
  }),
});

const result = await response.json();
console.log(result);`}</pre>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute top-2 right-2 bg-transparent"
                    onClick={() => copyToClipboard(`// Generate token
const tokenResponse = await fetch('/api/auth/token', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'admin@example.com',
    password: 'password123',
    expiresIn: '1h'
  }),
});

const { token } = await tokenResponse.json();

// Use token for authenticated requests
const response = await fetch('/api/products', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': \`Bearer \${token}\`,
  },
  body: JSON.stringify({
    name: 'New Product',
    price: 99.99,
    category: 'electronics',
    stock: 50
  }),
});

const result = await response.json();
console.log(result);`)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Terminal className="h-5 w-5 text-green-600" />
                  cURL
                </CardTitle>
                <CardDescription>Example of making API requests using cURL</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <div className="bg-muted p-4 rounded-lg">
                    <pre className="text-sm overflow-x-auto">{`# Generate token
curl -X POST https://your-domain.com/api/auth/token \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "admin@example.com",
    "password": "password123",
    "expiresIn": "1h"
  }'

# Use token for authenticated requests
curl -X GET https://your-domain.com/api/products \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \\
  -H "Content-Type: application/json"

# Create a new product
curl -X POST https://your-domain.com/api/products \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "New Product",
    "description": "Product description",
    "price": 99.99,
    "category": "electronics",
    "stock": 50
  }'`}</pre>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute top-2 right-2 bg-transparent"
                    onClick={() => copyToClipboard(`# Generate token
curl -X POST https://your-domain.com/api/auth/token \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "admin@example.com",
    "password": "password123",
    "expiresIn": "1h"
  }'

# Use token for authenticated requests
curl -X GET https://your-domain.com/api/products \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \\
  -H "Content-Type: application/json"

# Create a new product
curl -X POST https://your-domain.com/api/products \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "New Product",
    "description": "Product description",
    "price": 99.99,
    "category": "electronics",
    "stock": 50
  }'`)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileCode className="h-5 w-5 text-yellow-600" />
                  Python
                </CardTitle>
                <CardDescription>Example of making API requests using Python requests library</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <div className="bg-muted p-4 rounded-lg">
                    <pre className="text-sm overflow-x-auto">{`import requests
import json

# Generate token
token_response = requests.post('https://your-domain.com/api/auth/token', 
    json={
        'email': 'admin@example.com',
        'password': 'password123',
        'expiresIn': '1h'
    }
)

token = token_response.json()['token']

# Use token for authenticated requests
headers = {
    'Authorization': f'Bearer {token}',
    'Content-Type': 'application/json'
}

# Get products
products_response = requests.get('https://your-domain.com/api/products', 
    headers=headers
)

products = products_response.json()
print(products)

# Create a new product
new_product = {
    'name': 'New Product',
    'description': 'Product description',
    'price': 99.99,
    'category': 'electronics',
    'stock': 50
}

create_response = requests.post('https://your-domain.com/api/products',
    headers=headers,
    json=new_product
)

result = create_response.json()
print(result)`}</pre>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute top-2 right-2 bg-transparent"
                    onClick={() => copyToClipboard(`import requests
import json

# Generate token
token_response = requests.post('https://your-domain.com/api/auth/token', 
    json={
        'email': 'admin@example.com',
        'password': 'password123',
        'expiresIn': '1h'
    }
)

token = token_response.json()['token']

# Use token for authenticated requests
headers = {
    'Authorization': f'Bearer {token}',
    'Content-Type': 'application/json'
}

# Get products
products_response = requests.get('https://your-domain.com/api/products', 
    headers=headers
)

products = products_response.json()
print(products)

# Create a new product
new_product = {
    'name': 'New Product',
    'description': 'Product description',
    'price': 99.99,
    'category': 'electronics',
    'stock': 50
}

create_response = requests.post('https://your-domain.com/api/products',
    headers=headers,
    json=new_product
)

result = create_response.json()
print(result)`)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Github className="h-5 w-5 text-gray-600" />
                  Node.js
                </CardTitle>
                <CardDescription>Example of making API requests using Node.js with axios</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <div className="bg-muted p-4 rounded-lg">
                    <pre className="text-sm overflow-x-auto">{`const axios = require('axios');

// Generate token
const tokenResponse = await axios.post('https://your-domain.com/api/auth/token', {
  email: 'admin@example.com',
  password: 'password123',
  expiresIn: '1h'
});

const { token } = tokenResponse.data;

// Use token for authenticated requests
const headers = {
  'Authorization': \`Bearer \${token}\`,
  'Content-Type': 'application/json'
};

// Get products
const productsResponse = await axios.get('https://your-domain.com/api/products', {
  headers
});

console.log(productsResponse.data);

// Create a new product
const newProduct = {
  name: 'New Product',
  description: 'Product description',
  price: 99.99,
  category: 'electronics',
  stock: 50
};

const createResponse = await axios.post('https://your-domain.com/api/products', 
  newProduct, 
  { headers }
);

console.log(createResponse.data);`}</pre>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute top-2 right-2 bg-transparent"
                    onClick={() => copyToClipboard(`const axios = require('axios');

// Generate token
const tokenResponse = await axios.post('https://your-domain.com/api/auth/token', {
  email: 'admin@example.com',
  password: 'password123',
  expiresIn: '1h'
});

const { token } = tokenResponse.data;

// Use token for authenticated requests
const headers = {
  'Authorization': \`Bearer \${token}\`,
  'Content-Type': 'application/json'
};

// Get products
const productsResponse = await axios.get('https://your-domain.com/api/products', {
  headers
});

console.log(productsResponse.data);

// Create a new product
const newProduct = {
  name: 'New Product',
  description: 'Product description',
  price: 99.99,
  category: 'electronics',
  stock: 50
};

const createResponse = await axios.post('https://your-domain.com/api/products', 
  newProduct, 
  { headers }
);

console.log(createResponse.data);`)}
                  >
                    <Copy className="h-4 w-4" />
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
