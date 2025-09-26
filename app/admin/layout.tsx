"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { signOut, useSession } from "next-auth/react"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  Box,
  FileText,
  Home,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  MessageCircle,
  Settings,
  ShoppingBag,
  Users,
  User,
  Globe,
  Key,
  BookOpen,
  Shield,
  Tags,
  Bell,
  ChevronRight,
  ChevronDown,
  Plus,
  Minus,
  Star,
  Activity,
  TrendingUp,
  Zap,
  Target,
  Award,
  Clock,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Eye,
  EyeOff,
  Copy,
  Edit,
  Trash2,
  X,
  Check,
  ArrowRight,
  ArrowLeft,
  MoreHorizontal,
  MoreVertical,
  Filter,
  Download,
  Upload,
  RefreshCw,
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle,
  Loader2,
  Smartphone,
  Monitor,
  Database,
  Server,
  Lock,
  Unlock,
  Palette,
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
  Turtle
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { useDynamicBadges } from "./dynamic-badges"
import NotificationsDropdown from "./components/notifications-dropdown"
import RefreshButton from "./components/refresh-button"
import ExportImportDialog from "./components/export-import-dialog"
// Removed Sidebar components - using custom implementation

const adminRoutes = [
  {
    category: "Overview",
    items: [
  {
    href: "/admin",
    label: "Dashboard",
    icon: LayoutDashboard,
        badge: null,
        description: "Overview and analytics"
      },
      {
        href: "/admin/notifications",
        label: "Notifications",
        icon: Bell,
        badge: null, // Will be updated by dynamic badges
        description: "Manage system notifications"
      },
    ]
  },
  {
    category: "Content Management",
    items: [
  {
    href: "/admin/products",
    label: "Products",
    icon: ShoppingBag,
        badge: "0",
        description: "Manage product catalog"
  },
  {
    href: "/admin/categories",
    label: "Categories",
    icon: Tags,
        badge: "0",
        description: "Product categories"
      },
      {
        href: "/admin/blog",
        label: "Blog Posts",
        icon: FileText,
        badge: "0",
        description: "Content management"
      },
      {
        href: "/admin/reviews",
        label: "Reviews",
        icon: MessageSquare,
        badge: "0",
        description: "Customer reviews"
      },
      {
        href: "/admin/comments",
        label: "Comments",
        icon: MessageCircle,
        badge: "0",
        description: "Blog post comments"
      },
    ]
  },
  {
    category: "Customer Management",
    items: [
  {
    href: "/admin/orders",
    label: "Orders",
    icon: Box,
        badge: "0",
        description: "Order processing"
  },
  {
    href: "/admin/customers",
    label: "Customers",
    icon: Users,
        badge: "0",
        description: "Customer database"
      },
      {
        href: "/admin/messages",
        label: "Messages",
        icon: MessageSquare,
        badge: "0",
        description: "Customer support"
      },
    ]
  },
  {
    category: "System Administration",
    items: [
  {
    href: "/admin/users",
    label: "User Management",
    icon: Shield,
        badge: "0",
        description: "Admin users"
  },
  {
    href: "/admin/analytics",
    label: "Analytics",
    icon: BarChart3,
        badge: null,
        description: "Reports and insights"
      },
    ]
  },
  {
    category: "API & Settings",
    items: [
  {
    href: "/admin/settings",
    label: "Site Settings",
    icon: Globe,
        badge: null,
        description: "Global configuration"
  },
  {
    href: "/admin/api-tokens",
    label: "API Tokens",
    icon: Key,
        badge: "3",
        description: "API access management"
  },
  {
    href: "/admin/api-docs",
    label: "API Documentation",
    icon: BookOpen,
        badge: null,
        description: "Developer resources"
  },
  {
    href: "/admin/settings/account",
    label: "Account Settings",
    icon: Settings,
        badge: null,
        description: "Personal preferences"
      },
    ]
  },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [expandedCategories, setExpandedCategories] = useState<string[]>([
    "Overview",
    "Content Management",
    "Customer Management",
    "System Administration",
    "API & Settings"
  ])
  const { badgeData, isLoading: badgesLoading } = useDynamicBadges()
  const { data: session } = useSession()

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }

  const filteredRoutes = adminRoutes.map(route => ({
    ...route,
    items: route.items.map(item => {
      if (item.badge === null) return item
      
      const routeKey = item.href.split('/').pop()
      let dynamicBadge = "0"
      
      if (routeKey === "products") dynamicBadge = badgesLoading ? "..." : badgeData.products.toString()
      else if (routeKey === "categories") dynamicBadge = badgesLoading ? "..." : badgeData.categories.toString()
      else if (routeKey === "blog") dynamicBadge = badgesLoading ? "..." : badgeData.blogPosts.toString()
      else if (routeKey === "reviews") dynamicBadge = badgesLoading ? "..." : badgeData.reviews.toString()
      else if (routeKey === "comments") dynamicBadge = badgesLoading ? "..." : badgeData.comments.toString()
      else if (routeKey === "orders") dynamicBadge = badgesLoading ? "..." : badgeData.orders.toString()
      else if (routeKey === "customers") dynamicBadge = badgesLoading ? "..." : badgeData.customers.toString()
      else if (routeKey === "messages") dynamicBadge = badgesLoading ? "..." : badgeData.messages.toString()
      else if (routeKey === "users") dynamicBadge = badgesLoading ? "..." : badgeData.users.toString()
      
      return {
        ...item,
        badge: dynamicBadge
      }
    })
  }))

  // Render minimal shell on admin login page
  if (pathname === "/admin/login") {
    return <main className="min-h-screen">{children}</main>
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar - Fixed Position with Toggle */}
      <div className={`fixed left-0 top-0 z-40 h-screen border-r border-border/50 bg-gradient-to-b from-slate-50/95 to-gray-50/95 dark:from-slate-950/95 dark:to-gray-950/95 backdrop-blur-md transition-all duration-300 ease-in-out flex flex-col ${
        sidebarOpen ? 'w-80' : 'w-0 overflow-hidden'
      }`}>
        {/* Enhanced Admin Header */}
        <div className="border-b border-border/50 bg-gradient-to-r from-slate-100/95 to-gray-100/95 dark:from-slate-900/95 dark:to-gray-900/95 backdrop-blur-sm p-6">
          <Link href="/admin" className="group flex items-center gap-3">
            <div className="relative w-14 h-14 rounded-xl bg-white dark:bg-gray-900 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105 border border-border/20 overflow-hidden">
              <div className="absolute -inset-1 bg-gradient-to-r from-teal-500 to-emerald-600 rounded-xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              <img 
                src="/logo.svg" 
                alt="Kureno Admin" 
                className="w-9 h-9 transition-transform duration-300 group-hover:scale-110 relative z-10"
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold bg-gradient-to-r from-teal-500 to-emerald-600 bg-clip-text text-transparent leading-none">
                  Kureno
                </span>
                <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs px-2 py-0.5 font-medium">
                  ADMIN
                </Badge>
              </div>
              <span className="text-sm text-muted-foreground font-medium tracking-wide leading-none">
                Control Panel
              </span>
            </div>
            </Link>
        </div>

        {/* Enhanced Navigation - Mobile Menu Style */}
        <div className="flex-1 overflow-y-auto">
          {/* Back to Site Button - Enhanced */}
          <div className="p-8 border-b border-border/50">
            <Link href="/" className="group flex items-center gap-4 px-4 py-3 rounded-xl font-medium transition-all duration-300 hover:translate-x-1 bg-gradient-to-r from-blue-500/10 to-indigo-600/10 text-primary border border-blue-200/30 hover:border-blue-300/50 shadow-sm">
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg" />
              <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 to-indigo-600/20">
                <Home className="h-4 w-4 text-blue-600 dark:text-blue-400 transition-all duration-300" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="truncate text-blue-700 dark:text-blue-300">Back to Site</span>
                </div>
                <div className="text-xs text-blue-600/70 dark:text-blue-400/70 mt-0.5 truncate">
                  Return to main website
                </div>
              </div>
              <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 animate-pulse" />
                  </Link>
          </div>

          {/* Enhanced Navigation Categories - Mobile Menu Style */}
          <nav className="p-8 space-y-6">
            {filteredRoutes.map((category, categoryIndex) => (
              <div key={category.category} className="space-y-3">
                {/* Category Header */}
                <div className="flex items-center gap-2 px-2">
                  <div className={`w-1 h-4 rounded-full ${
                    category.category === "Overview" ? "bg-gradient-to-b from-gray-500 to-slate-600" :
                    category.category === "Content Management" ? "bg-gradient-to-b from-blue-500 to-blue-600" :
                    category.category === "Customer Management" ? "bg-gradient-to-b from-green-500 to-emerald-600" :
                    category.category === "System Administration" ? "bg-gradient-to-b from-purple-500 to-purple-600" :
                    "bg-gradient-to-b from-orange-500 to-orange-600"
                  }`} />
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {category.category}
                  </h3>
                </div>
                
                {/* Category Items */}
                <div className="space-y-2">
                  {category.items.map((item, itemIndex) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "group flex items-center gap-4 px-4 py-3 rounded-xl font-medium transition-all duration-300 hover:translate-x-1",
                        pathname === item.href
                          ? "bg-gradient-to-r from-teal-500/10 to-emerald-600/10 text-primary border border-primary/20 shadow-sm"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      )}
                      style={{
                        animationDelay: `${(categoryIndex * 50) + (itemIndex * 25)}ms`
                      }}
                    >
                      {/* Active Indicator */}
                      <div className={cn(
                        "w-2 h-2 rounded-full transition-all duration-300",
                        pathname === item.href
                          ? "bg-gradient-to-r from-teal-500 to-emerald-600 shadow-lg"
                          : "bg-muted-foreground/30 group-hover:bg-primary/50"
                      )} />
                      
                      {/* Icon */}
                      <div className={cn(
                        "p-2 rounded-lg transition-all duration-300",
                        pathname === item.href
                          ? "bg-gradient-to-br from-teal-500/20 to-emerald-600/20"
                          : "bg-muted/30 group-hover:bg-muted/50"
                      )}>
                        <item.icon className={cn(
                          "h-4 w-4 transition-all duration-300",
                          pathname === item.href
                            ? "text-teal-600 dark:text-teal-400"
                            : "text-muted-foreground group-hover:text-primary"
                        )} />
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="truncate">{item.label}</span>
                          {item.badge && (
                            <Badge 
                              variant="secondary" 
                              className={cn(
                                "text-xs px-1.5 py-0.5 transition-all duration-300",
                                pathname === item.href
                                  ? "bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300"
                                  : "bg-muted text-muted-foreground"
                              )}
                            >
                              {item.badge}
                            </Badge>
                          )}
                        </div>
                        {item.description && (
                          <div className="text-xs text-muted-foreground mt-0.5 truncate">
                            {item.description}
                          </div>
                        )}
                      </div>
                      
                      {/* Active Pulse */}
                      {pathname === item.href && (
                        <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-teal-500 to-emerald-600 animate-pulse" />
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </nav>

          {/* Enhanced Quick Actions - Mobile Menu Style */}
          <div className="px-8 py-4 border-t border-border/50">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-1 h-4 bg-gradient-to-b from-purple-500 to-pink-600 rounded-full" />
                <span className="text-sm font-medium text-muted-foreground">Quick Actions</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <ExportImportDialog
                  trigger={
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-12 w-full relative group rounded-xl hover:bg-muted/50 transition-all duration-300 hover:scale-105 border-border/50"
                    >
                      <div className="flex flex-col items-center gap-1">
                        <Plus className="h-4 w-4 group-hover:text-primary transition-colors" />
                        <span className="text-xs">Export/Import</span>
                      </div>
                    </Button>
                  }
                />
                
                <RefreshButton
                  variant="outline"
                  size="sm" 
                  className="h-12 w-full relative group rounded-xl hover:bg-muted/50 transition-all duration-300 hover:scale-105 border-border/50"
                >
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-xs">Refresh</span>
                  </div>
                </RefreshButton>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced User Section - Mobile Menu Style */}
        <div className="border-t border-border/50 bg-gradient-to-b from-background/50 to-muted/20 mt-auto">
          <div className="p-8">
            <div className="space-y-4">
              {/* User Profile Card */}
              <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-muted/30 to-muted/10 border border-border/50">
                <Avatar className="h-12 w-12 ring-2 ring-primary/20 ring-offset-2 ring-offset-background">
                  <AvatarImage src={session?.user?.image || undefined} />
                  <AvatarFallback className="bg-gradient-to-br from-teal-500 to-emerald-600 text-white font-semibold">
                    {(session?.user?.name?.[0] || session?.user?.email?.[0] || "A").toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground truncate">
                    {session?.user?.name || "Admin User"}
                  </p>
                  <p className="text-sm text-muted-foreground truncate">
                    {session?.user?.email || "admin@kureno.com"}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-xs text-green-600 dark:text-green-400 font-medium">Online</span>
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="space-y-3">
                <Link href="/admin/settings/account">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start h-12 rounded-xl border-border/50 hover:bg-muted/50 hover:border-primary/30 transition-all duration-300 group"
                  >
                    <User className="mr-3 h-4 w-4 group-hover:text-primary transition-colors" />
                    Account Settings
                  </Button>
                </Link>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start h-12 rounded-xl text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 dark:border-red-800 dark:hover:bg-red-950 transition-all duration-300 group"
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  <LogOut className="mr-3 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area - Independent from Sidebar */}
      <div className="min-h-screen">
        {/* Enhanced Fixed Header */}
        <header className={`fixed top-0 right-0 z-50 h-16 bg-gradient-to-r from-slate-50/95 via-gray-50/95 to-zinc-50/95 dark:from-slate-950/95 dark:via-gray-950/95 dark:to-zinc-950/95 backdrop-blur-md border-b border-border/50 shadow-sm transition-all duration-300 ease-in-out ${
          sidebarOpen ? 'left-80' : 'left-0'
        }`}>
          <div className="flex h-full items-center justify-between px-4 sm:px-6 lg:px-8">
            {/* Left Section */}
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="h-9 w-9 rounded-lg bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white/20 dark:border-slate-700/20 hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all duration-200"
              >
                <div className="h-4 w-4">
                  <div className={`h-0.5 w-4 bg-current transition-all duration-200 ${sidebarOpen ? 'rotate-45 translate-y-1.5' : ''}`}></div>
                  <div className={`h-0.5 w-4 bg-current transition-all duration-200 my-1 ${sidebarOpen ? 'opacity-0' : ''}`}></div>
                  <div className={`h-0.5 w-4 bg-current transition-all duration-200 ${sidebarOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></div>
                </div>
              </Button>
              
              {/* Breadcrumb Navigation */}
              <div className="hidden md:flex items-center gap-2 text-sm">
                <Link href="/admin" className="text-muted-foreground hover:text-foreground transition-colors">
                  Admin
                </Link>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium text-foreground">
                  {pathname === "/admin" && "Dashboard"}
                  {pathname === "/admin/notifications" && "Notifications"}
                  {pathname === "/admin/products" && "Products"}
                  {pathname === "/admin/categories" && "Categories"}
                  {pathname === "/admin/orders" && "Orders"}
                  {pathname === "/admin/customers" && "Customers"}
                  {pathname === "/admin/users" && "User Management"}
                  {pathname === "/admin/analytics" && "Analytics"}
                  {pathname === "/admin/blog" && "Blog Posts"}
                  {pathname === "/admin/messages" && "Messages"}
                  {pathname === "/admin/settings" && "Site Settings"}
                  {pathname === "/admin/api-tokens" && "API Tokens"}
                  {pathname === "/admin/api-docs" && "API Documentation"}
                  {pathname === "/admin/settings/account" && "Account Settings"}
                </span>
              </div>
            </div>


            {/* Right Section */}
            <div className="flex items-center gap-2">
              {/* Quick Actions */}
              <div className="hidden sm:flex items-center gap-1">
                <NotificationsDropdown />
                <RefreshButton />
                <Button variant="ghost" size="sm" asChild className="h-8 w-8 p-0 rounded-lg bg-white/40 dark:bg-slate-800/40 hover:bg-white/60 dark:hover:bg-slate-800/60 border border-white/20 dark:border-slate-700/20">
                <Link href="/admin/settings">
                    <Settings className="h-4 w-4" />
                  <span className="sr-only">Settings</span>
                </Link>
              </Button>
              </div>

              {/* Status Indicator */}
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-100/80 dark:bg-green-900/30 border border-green-200/50 dark:border-green-800/50">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-medium text-green-700 dark:text-green-400">Online</span>
              </div>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-3 p-2 rounded-lg bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white/20 dark:border-slate-700/20 hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all duration-200">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={session?.user?.image || undefined} />
                      <AvatarFallback className="bg-gradient-to-r from-teal-500 to-emerald-600 text-white text-sm font-semibold">
                        {(session?.user?.name?.[0] || session?.user?.email?.[0] || "A").toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden sm:block text-left">
                      <div className="text-sm font-medium text-foreground">
                        {session?.user?.name || "Admin User"}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {session?.user?.email || "admin@kureno.com"}
                      </div>
                    </div>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-white/20 dark:border-slate-700/20 shadow-xl">
                  {/* User Info Header */}
                  <div className="px-3 py-2 border-b border-border/50">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={session?.user?.image || undefined} />
                        <AvatarFallback className="bg-gradient-to-r from-teal-500 to-emerald-600 text-white font-semibold">
                          {(session?.user?.name?.[0] || session?.user?.email?.[0] || "A").toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-foreground">
                          {session?.user?.name || "Admin User"}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {session?.user?.email || "admin@kureno.com"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-1">
                    <DropdownMenuItem asChild className="px-3 py-2">
                      <Link href="/admin" className="flex items-center gap-3">
                        <LayoutDashboard className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                        <span>Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="px-3 py-2">
                      <Link href="/admin/settings/account" className="flex items-center gap-3">
                        <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        <span>Account Settings</span>
                      </Link>
                  </DropdownMenuItem>
                    <DropdownMenuItem asChild className="px-3 py-2">
                      <Link href="/admin/settings" className="flex items-center gap-3">
                        <Settings className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                        <span>Admin Settings</span>
                      </Link>
                  </DropdownMenuItem>
                  </div>

                  <div className="border-t border-border/50 py-1">
                    <DropdownMenuItem asChild className="px-3 py-2">
                      <Link href="/" className="flex items-center gap-3">
                        <Home className="h-4 w-4 text-green-600 dark:text-green-400" />
                        <span>Back to Site</span>
                      </Link>
                  </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })} className="px-3 py-2 text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400">
                      <LogOut className="h-4 w-4 mr-3" />
                      <span>Sign Out</span>
                  </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            </div>
          </header>

        {/* Main Content with Top Padding */}
        <main className="pt-16 min-h-screen">
          <div className="p-4 sm:p-6 md:p-8">{children}</div>
        </main>
        </div>
      </div>
  )
}
