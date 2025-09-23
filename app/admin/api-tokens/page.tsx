"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { 
  Copy, 
  Key, 
  Loader2, 
  Shield, 
  Clock, 
  Eye, 
  EyeOff, 
  Trash2, 
  RefreshCw, 
  Download, 
  Upload, 
  Settings, 
  Activity, 
  TrendingUp, 
  Users, 
  BarChart3, 
  Zap, 
  Target, 
  Award, 
  Star, 
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
  Search, 
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
  Turtle,
  Database,
  Server,
  Lock,
  Unlock,
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle,
  Play,
  Pause,
  Package,
  ShoppingCart,
  Mail
} from "lucide-react"

interface TokenItem {
  id: string
  name: string
  token: string
  scopes: string[]
  createdAt: string
  expiresAt: string
  lastUsed?: string
  isActive: boolean
  usage: number
}

export default function ApiTokensPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [token, setToken] = useState("")
  const [showToken, setShowToken] = useState(false)
  const [activeTab, setActiveTab] = useState("generate")
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
    expiresIn: "1h",
    name: "",
    scopes: [] as string[],
  })
  const [tokens, setTokens] = useState<TokenItem[]>([])
  const [selectedToken, setSelectedToken] = useState<TokenItem | null>(null)
  const { toast } = useToast()

  const expirationOptions = [
    { value: "15m", label: "15 minutes" },
    { value: "30m", label: "30 minutes" },
    { value: "1h", label: "1 hour" },
    { value: "2h", label: "2 hours" },
    { value: "6h", label: "6 hours" },
    { value: "12h", label: "12 hours" },
    { value: "1d", label: "1 day" },
    { value: "7d", label: "7 days" },
    { value: "30d", label: "30 days" },
    { value: "90d", label: "90 days" },
    { value: "1y", label: "1 year" },
  ]

  const scopeOptions = [
    { value: "read", label: "Read Access", description: "View data and resources" },
    { value: "write", label: "Write Access", description: "Create and update resources" },
    { value: "delete", label: "Delete Access", description: "Remove resources" },
    { value: "admin", label: "Admin Access", description: "Full administrative privileges" },
    { value: "products", label: "Products", description: "Manage product catalog" },
    { value: "orders", label: "Orders", description: "Handle order management" },
    { value: "users", label: "Users", description: "User management operations" },
    { value: "analytics", label: "Analytics", description: "Access analytics data" },
  ]

  // Mock data for demonstration
  useEffect(() => {
    setTokens([
      {
        id: "1",
        name: "Development Token",
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        scopes: ["read", "write", "products"],
        createdAt: "2024-01-15T10:30:00Z",
        expiresAt: "2024-04-15T10:30:00Z",
        lastUsed: "2024-01-20T14:22:00Z",
        isActive: true,
        usage: 1247,
      },
      {
        id: "2",
        name: "Production API",
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        scopes: ["read", "analytics"],
        createdAt: "2024-01-10T09:15:00Z",
        expiresAt: "2024-02-10T09:15:00Z",
        lastUsed: "2024-01-19T16:45:00Z",
        isActive: true,
        usage: 892,
      },
      {
        id: "3",
        name: "Mobile App",
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        scopes: ["read", "write", "orders"],
        createdAt: "2024-01-05T11:20:00Z",
        expiresAt: "2024-01-25T11:20:00Z",
        isActive: false,
        usage: 0,
      },
    ])
  }, [])

  const handleGenerateToken = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      })

      const data = await response.json()

      if (response.ok) {
        setToken(data.token)
        toast({
          title: "Success",
          description: "JWT token generated successfully",
        })
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to generate token",
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
      setIsLoading(false)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: "Copied",
        description: "Token copied to clipboard",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy token",
        variant: "destructive",
      })
    }
  }

  const handleScopeToggle = (scope: string) => {
    setCredentials(prev => ({
      ...prev,
      scopes: prev.scopes.includes(scope)
        ? prev.scopes.filter(s => s !== scope)
        : [...prev.scopes, scope]
    }))
  }

  const handleDeleteToken = (tokenId: string) => {
    if (confirm("Are you sure you want to delete this token? This action cannot be undone.")) {
      setTokens(prev => prev.filter(t => t.id !== tokenId))
      toast({
        title: "Token deleted",
        description: "The API token has been deleted successfully.",
      })
    }
  }

  const handleToggleToken = (tokenId: string) => {
    setTokens(prev => prev.map(t => 
      t.id === tokenId ? { ...t, isActive: !t.isActive } : t
    ))
    toast({
      title: "Token updated",
      description: "Token status has been updated.",
    })
  }

  const getTokenStatus = (token: TokenItem) => {
    const now = new Date()
    const expiresAt = new Date(token.expiresAt)
    
    if (!token.isActive) return { status: "inactive", color: "bg-gray-500/20 text-gray-600" }
    if (expiresAt < now) return { status: "expired", color: "bg-red-500/20 text-red-600" }
    if (expiresAt.getTime() - now.getTime() < 7 * 24 * 60 * 60 * 1000) {
      return { status: "expiring", color: "bg-yellow-500/20 text-yellow-600" }
    }
    return { status: "active", color: "bg-green-500/20 text-green-600" }
  }

  const getScopeIcon = (scope: string) => {
    switch (scope) {
      case "read": return Eye
      case "write": return Edit
      case "delete": return Trash2
      case "admin": return Shield
      case "products": return Package
      case "orders": return ShoppingCart
      case "users": return Users
      case "analytics": return BarChart3
      default: return Key
    }
  }

  return (
    <div className="space-y-8">
      {/* Enhanced Header Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50 dark:from-violet-950/20 dark:via-purple-950/20 dark:to-indigo-950/20 p-8">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(139,92,246,0.1),transparent_50%),radial-gradient(ellipse_at_bottom_left,rgba(99,102,241,0.1),transparent_50%)] -z-10" />
        
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Badge className="bg-gradient-to-r from-violet-500 to-purple-500 text-white px-3 py-1 text-sm font-medium">
                <Key className="h-3 w-3 mr-1" />
                API Management
              </Badge>
              <Badge variant="outline" className="text-xs">
                <Shield className="h-3 w-3 mr-1" />
                Secure Access
              </Badge>
            </div>
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              API Tokens
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Generate and manage secure API tokens for programmatic access to your platform. Control permissions, monitor usage, and maintain security.
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
            <div className="text-2xl font-bold text-violet-600">{tokens.length}</div>
            <div className="text-xs text-muted-foreground">Total Tokens</div>
            <div className="text-xs text-green-600 flex items-center justify-center gap-1">
              <CheckCircle className="h-3 w-3" />
              Active
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{tokens.filter(t => t.isActive).length}</div>
            <div className="text-xs text-muted-foreground">Active Tokens</div>
            <div className="text-xs text-blue-600 flex items-center justify-center gap-1">
              <Activity className="h-3 w-3" />
              In Use
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-600">{tokens.reduce((sum, t) => sum + t.usage, 0)}</div>
            <div className="text-xs text-muted-foreground">Total Usage</div>
            <div className="text-xs text-green-600 flex items-center justify-center gap-1">
              <TrendingUp className="h-3 w-3" />
              +12%
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{tokens.filter(t => getTokenStatus(t).status === "expiring").length}</div>
            <div className="text-xs text-muted-foreground">Expiring Soon</div>
            <div className="text-xs text-orange-600 flex items-center justify-center gap-1">
              <Clock className="h-3 w-3" />
              Attention
            </div>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="generate" className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            Generate
          </TabsTrigger>
          <TabsTrigger value="manage" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Manage
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="h-5 w-5 text-violet-600" />
                    Generate New Token
                  </CardTitle>
                  <CardDescription>Create a new JWT token with specific permissions and expiration settings</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleGenerateToken} className="space-y-6">
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="flex items-center gap-2">
                          <Type className="h-4 w-4" />
                          Token Name
                        </Label>
                        <Input
                          id="name"
                          value={credentials.name}
                          onChange={(e) => setCredentials({ ...credentials, name: e.target.value })}
                          placeholder="e.g., Development API"
                          required
                          disabled={isLoading}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="expiresIn" className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          Expiration
                        </Label>
                        <Select
                          value={credentials.expiresIn}
                          onValueChange={(value) => setCredentials({ ...credentials, expiresIn: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {expirationOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email" className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Admin Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={credentials.email}
                        onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                        placeholder="admin@yoursite.com"
                        required
                        disabled={isLoading}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="password" className="flex items-center gap-2">
                        <Lock className="h-4 w-4" />
                        Password
                      </Label>
                      <Input
                        id="password"
                        type="password"
                        value={credentials.password}
                        onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                        placeholder="Enter your password"
                        required
                        disabled={isLoading}
                      />
                    </div>

                    <div className="space-y-4">
                      <Label className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Permissions & Scopes
                      </Label>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {scopeOptions.map((scope) => {
                          const ScopeIcon = getScopeIcon(scope.value)
                          return (
                            <div
                              key={scope.value}
                              className={`p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                                credentials.scopes.includes(scope.value)
                                  ? "border-violet-500 bg-violet-50 dark:bg-violet-950/20"
                                  : "border-muted hover:border-violet-300"
                              }`}
                              onClick={() => handleScopeToggle(scope.value)}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${
                                  credentials.scopes.includes(scope.value)
                                    ? "bg-violet-100 dark:bg-violet-900/30"
                                    : "bg-muted"
                                }`}>
                                  <ScopeIcon className={`h-4 w-4 ${
                                    credentials.scopes.includes(scope.value)
                                      ? "text-violet-600"
                                      : "text-muted-foreground"
                                  }`} />
                                </div>
                                <div className="flex-1">
                                  <div className="font-medium text-sm">{scope.label}</div>
                                  <div className="text-xs text-muted-foreground">{scope.description}</div>
                                </div>
                                {credentials.scopes.includes(scope.value) && (
                                  <CheckCircle className="h-4 w-4 text-violet-600" />
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                    
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating Token...
                        </>
                      ) : (
                        <>
                          <Key className="mr-2 h-4 w-4" />
                          Generate Token
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
            
            {/* Token Preview Panel */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5 text-blue-600" />
                    Token Preview
                  </CardTitle>
                  <CardDescription>Preview your token configuration</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg bg-muted/30">
                      <div className="text-sm font-medium mb-2">{credentials.name || "Untitled Token"}</div>
                      <div className="text-xs text-muted-foreground mb-3">
                        Expires: {expirationOptions.find(opt => opt.value === credentials.expiresIn)?.label}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {credentials.scopes.map(scope => {
                          const ScopeIcon = getScopeIcon(scope)
                          return (
                            <Badge key={scope} variant="secondary" className="text-xs">
                              <ScopeIcon className="h-3 w-3 mr-1" />
                              {scope}
                            </Badge>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="h-5 w-5 text-green-600" />
                    Security Tips
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-2">
                      <Shield className="h-4 w-4 text-green-600 mt-0.5" />
                      <span>Store tokens securely and never commit them to version control</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Clock className="h-4 w-4 text-orange-600 mt-0.5" />
                      <span>Use short expiration times for development tokens</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Eye className="h-4 w-4 text-blue-600 mt-0.5" />
                      <span>Grant only the minimum required permissions</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Trash2 className="h-4 w-4 text-red-600 mt-0.5" />
                      <span>Revoke unused or compromised tokens immediately</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="manage" className="space-y-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-purple-600" />
                  Token Management
                </CardTitle>
                <CardDescription>View and manage all your API tokens</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tokens.map((tokenItem) => {
                    const status = getTokenStatus(tokenItem)
                    return (
                      <div key={tokenItem.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="p-2 rounded-lg bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30">
                              <Key className="h-4 w-4 text-violet-600" />
                            </div>
                            <div>
                              <div className="font-medium">{tokenItem.name}</div>
                              <div className="text-sm text-muted-foreground">
                                Created: {new Date(tokenItem.createdAt).toLocaleDateString()}
                                {tokenItem.lastUsed && (
                                  <span> • Last used: {new Date(tokenItem.lastUsed).toLocaleDateString()}</span>
                                )}
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge className={status.color}>
                                  {status.status}
                                </Badge>
                                <Badge variant="secondary" className="text-xs">
                                  {tokenItem.usage} requests
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => copyToClipboard(tokenItem.token)}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleToggleToken(tokenItem.id)}
                            >
                              {tokenItem.isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteToken(tokenItem.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-1">
                          {tokenItem.scopes.map(scope => {
                            const ScopeIcon = getScopeIcon(scope)
                            return (
                              <Badge key={scope} variant="secondary" className="text-xs">
                                <ScopeIcon className="h-3 w-3 mr-1" />
                                {scope}
                              </Badge>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-green-600" />
                  Usage Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Total Requests</span>
                    <Badge variant="secondary">{tokens.reduce((sum, t) => sum + t.usage, 0)}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Active Tokens</span>
                    <Badge variant="secondary">{tokens.filter(t => t.isActive).length}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Avg. Usage</span>
                    <Badge variant="secondary">
                      {Math.round(tokens.reduce((sum, t) => sum + t.usage, 0) / tokens.length)}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  Top Tokens
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {tokens
                    .sort((a, b) => b.usage - a.usage)
                    .slice(0, 3)
                    .map((token, index) => (
                      <div key={token.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-sm">{token.name}</span>
                        </div>
                        <Badge variant="secondary" className="text-xs">{token.usage}</Badge>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {tokens.filter(t => getTokenStatus(t).status === "expiring").length > 0 && (
                    <Alert className="border-orange-200 bg-orange-50 dark:border-orange-900 dark:bg-orange-950/20">
                      <AlertTriangle className="h-4 w-4 text-orange-600" />
                      <AlertDescription className="text-orange-800 dark:text-orange-200">
                        {tokens.filter(t => getTokenStatus(t).status === "expiring").length} token(s) expiring soon
                      </AlertDescription>
                    </Alert>
                  )}
                  {tokens.filter(t => !t.isActive).length > 0 && (
                    <Alert className="border-gray-200 bg-gray-50 dark:border-gray-900 dark:bg-gray-950/20">
                      <Info className="h-4 w-4 text-gray-600" />
                      <AlertDescription className="text-gray-800 dark:text-gray-200">
                        {tokens.filter(t => !t.isActive).length} inactive token(s)
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {token && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Generated Token
            </CardTitle>
            <CardDescription>
              Your new API token has been generated. Copy it securely and use it in your API requests.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="relative">
                <Textarea 
                  value={showToken ? token : "••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••"} 
                  readOnly 
                  className="min-h-[100px] font-mono text-sm" 
                />
                <div className="absolute top-2 right-2 flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowToken(!showToken)}
                    className="bg-transparent"
                  >
                    {showToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(token)}
                    className="bg-transparent"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Example Usage:</h4>
                <code className="text-sm">Authorization: Bearer {token.substring(0, 50)}...</code>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
