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
  Settings,
  ShoppingBag,
  Users,
  User,
  Globe,
  Key,
  BookOpen,
  Shield,
  Tags,
  Search,
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
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
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
    ]
  },
  {
    category: "Content Management",
    items: [
  {
    href: "/admin/products",
    label: "Products",
    icon: ShoppingBag,
        badge: "12",
        description: "Manage product catalog"
  },
  {
    href: "/admin/categories",
    label: "Categories",
    icon: Tags,
        badge: "5",
        description: "Product categories"
      },
      {
        href: "/admin/blog",
        label: "Blog Posts",
        icon: FileText,
        badge: "8",
        description: "Content management"
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
        badge: "24",
        description: "Order processing"
  },
  {
    href: "/admin/customers",
    label: "Customers",
    icon: Users,
        badge: "156",
        description: "Customer database"
      },
      {
        href: "/admin/messages",
        label: "Messages",
        icon: MessageSquare,
        badge: "3",
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
        badge: null,
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
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedCategories, setExpandedCategories] = useState<string[]>([
    "Overview",
    "Content Management",
    "Customer Management",
    "System Administration",
    "API & Settings"
  ])
  const { data: session } = useSession()

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }

  const filteredRoutes = adminRoutes.map(category => ({
    ...category,
    items: category.items.filter(item => 
      item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.items.length > 0)

  // Render minimal shell on admin login page
  if (pathname === "/admin/login") {
    return <main className="min-h-screen">{children}</main>
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar - Fixed Position with Toggle */}
      <div className={`fixed left-0 top-0 z-40 h-screen border-r border-border/50 bg-gradient-to-b from-slate-50/95 to-gray-50/95 dark:from-slate-950/95 dark:to-gray-950/95 backdrop-blur-md transition-all duration-300 ease-in-out flex flex-col ${
        sidebarOpen ? 'w-64' : 'w-0 overflow-hidden'
      }`}>
        {/* Enhanced Header */}
        <div className="border-b border-border/50 bg-gradient-to-r from-slate-100/95 to-gray-100/95 dark:from-slate-900/95 dark:to-gray-900/95 backdrop-blur-sm p-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-teal-500 to-emerald-600 rounded-lg blur opacity-20 group-hover:opacity-30 transition duration-1000 group-hover:duration-200"></div>
              <Link href="/admin" className="relative flex items-center gap-3 p-2 rounded-lg bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border border-white/30 dark:border-slate-700/30 shadow-sm">
                <img src="/logo.svg" alt="Kureno" className="h-8 w-8" />
                <div>
                  <span className="font-bold text-lg bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">Admin</span>
                  <div className="text-xs text-muted-foreground">Control Panel</div>
                </div>
              </Link>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="text-center p-2 rounded-lg bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-white/40 dark:border-slate-700/40 shadow-sm">
              <div className="text-lg font-bold text-slate-600 dark:text-slate-300">24</div>
              <div className="text-xs text-muted-foreground">Orders</div>
            </div>
            <div className="text-center p-2 rounded-lg bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-white/40 dark:border-slate-700/40 shadow-sm">
              <div className="text-lg font-bold text-green-600 dark:text-green-400">156</div>
              <div className="text-xs text-muted-foreground">Users</div>
            </div>
          </div>
        </div>

        <div className="p-2 flex-1 overflow-y-auto">
          {/* Search Bar */}
          <div className="mb-6 px-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search admin..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-white/40 dark:border-slate-700/40 focus:bg-white dark:focus:bg-slate-800 shadow-sm"
              />
            </div>
          </div>

          {/* Back to Site Button */}
          <div className="mb-6 px-2">
            <Link href="/" className="flex items-center gap-3 w-full p-2 rounded-lg bg-gradient-to-r from-blue-500/15 to-indigo-500/15 hover:from-blue-500/25 hover:to-indigo-500/25 border border-blue-200/60 dark:border-blue-800/60 transition-all duration-200 shadow-sm">
              <div className="p-1 rounded-md bg-blue-500/20">
                <Home className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="text-left">
                <div className="font-medium text-blue-700 dark:text-blue-300">Back to Site</div>
                <div className="text-xs text-blue-600/70 dark:text-blue-400/70">Return to main website</div>
              </div>
            </Link>
          </div>

          {/* Navigation Categories */}
          <div className="space-y-4">
            {filteredRoutes.map((category) => (
              <div key={category.category} className="space-y-2">
                <Collapsible
                  open={expandedCategories.includes(category.category)}
                  onOpenChange={() => toggleCategory(category.category)}
                >
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-between p-2 h-auto bg-white/80 dark:bg-slate-800/80 hover:bg-white/90 dark:hover:bg-slate-800/90 border border-white/40 dark:border-slate-700/40 shadow-sm"
                    >
                      <div className="flex items-center gap-2">
                        <div className="p-1 rounded-md bg-slate-500/20">
                          {category.category === "Overview" && <LayoutDashboard className="h-4 w-4 text-slate-600 dark:text-slate-400" />}
                          {category.category === "Content Management" && <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />}
                          {category.category === "Customer Management" && <Users className="h-4 w-4 text-green-600 dark:text-green-400" />}
                          {category.category === "System Administration" && <Shield className="h-4 w-4 text-purple-600 dark:text-purple-400" />}
                          {category.category === "API & Settings" && <Settings className="h-4 w-4 text-orange-600 dark:text-orange-400" />}
                        </div>
                        <span className="font-medium text-sm">{category.category}</span>
                      </div>
                      {expandedCategories.includes(category.category) ? (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-2 ml-4 mt-2">
                    {category.items.map((item) => (
                      <div key={item.href}>
                        <Link 
                          href={item.href} 
                          className={`flex items-center gap-3 w-full p-2 rounded-lg transition-all duration-200 ${
                            pathname === item.href
                              ? 'bg-gradient-to-r from-teal-500/25 to-emerald-500/25 border border-teal-200/60 dark:border-teal-800/60 shadow-sm'
                              : 'bg-white/70 dark:bg-slate-800/70 hover:bg-white/85 dark:hover:bg-slate-800/85 border border-white/30 dark:border-slate-700/30 shadow-sm'
                          }`}
                        >
                          <div className={`p-1.5 rounded-md ${
                            pathname === item.href 
                              ? 'bg-teal-500/30' 
                              : 'bg-slate-500/20'
                          }`}>
                            <item.icon className={`h-4 w-4 ${
                              pathname === item.href 
                                ? 'text-teal-600 dark:text-teal-400' 
                                : 'text-slate-600 dark:text-slate-400'
                            }`} />
                          </div>
                          <div className="flex-1 text-left">
                            <div className="flex items-center gap-2">
                              <span className={`font-medium text-sm ${
                                pathname === item.href 
                                  ? 'text-teal-700 dark:text-teal-300' 
                                  : 'text-slate-700 dark:text-slate-300'
                              }`}>
                                {item.label}
                              </span>
                              {item.badge && (
                                <Badge variant="secondary" className="text-xs px-1.5 py-0.5 bg-slate-200/80 dark:bg-slate-700/80 text-slate-700 dark:text-slate-300">
                                  {item.badge}
                                </Badge>
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {item.description}
                            </div>
                          </div>
                  </Link>
                      </div>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="mt-8 px-2">
            <Separator className="mb-4 bg-border/50" />
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2">Quick Actions</h4>
              <div className="grid grid-cols-2 gap-3">
                <Button size="sm" variant="outline" className="h-8 text-xs bg-white/80 dark:bg-slate-800/80 border-white/40 dark:border-slate-700/40 shadow-sm">
                  <Plus className="h-3 w-3 mr-1" />
                  New
                </Button>
                <Button size="sm" variant="outline" className="h-8 text-xs bg-white/80 dark:bg-slate-800/80 border-white/40 dark:border-slate-700/40 shadow-sm">
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Refresh
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Footer */}
        <div className="border-t border-border/50 bg-gradient-to-r from-slate-100/95 to-gray-100/95 dark:from-slate-900/95 dark:to-gray-900/95 backdrop-blur-sm p-4 mt-auto">
          <div className="space-y-4">
            {/* User Profile */}
            <div className="flex items-center gap-3 p-2 rounded-lg bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-white/40 dark:border-slate-700/40 shadow-sm">
              <Avatar className="h-8 w-8">
                <AvatarImage src={session?.user?.image || undefined} />
                <AvatarFallback className="bg-gradient-to-r from-teal-500 to-emerald-600 text-white text-sm font-semibold">
                  {(session?.user?.name?.[0] || session?.user?.email?.[0] || "A").toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm truncate">
                  {session?.user?.name || "Admin User"}
                </div>
                <div className="text-xs text-muted-foreground truncate">
                  {session?.user?.email || "admin@kureno.com"}
                </div>
              </div>
              <Badge variant="secondary" className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                Online
              </Badge>
            </div>

            {/* Logout Button */}
            <button 
              onClick={() => signOut({ callbackUrl: "/" })} 
              className="flex items-center gap-3 w-full p-2 rounded-lg bg-red-500/15 hover:bg-red-500/25 border border-red-200/60 dark:border-red-800/60 transition-all duration-200 shadow-sm"
            >
              <div className="p-1 rounded-md bg-red-500/20">
                <LogOut className="h-4 w-4 text-red-600 dark:text-red-400" />
              </div>
              <div className="text-left">
                <div className="font-medium text-sm text-red-700 dark:text-red-300">Sign Out</div>
                <div className="text-xs text-red-600/70 dark:text-red-400/70">End current session</div>
              </div>
                  </button>
          </div>
        </div>
      </div>

      {/* Main Content Area - Independent from Sidebar */}
      <div className="min-h-screen">
        {/* Enhanced Fixed Header */}
        <header className={`fixed top-0 right-0 z-50 h-16 bg-gradient-to-r from-slate-50/95 via-gray-50/95 to-zinc-50/95 dark:from-slate-950/95 dark:via-gray-950/95 dark:to-zinc-950/95 backdrop-blur-md border-b border-border/50 shadow-sm transition-all duration-300 ease-in-out ${
          sidebarOpen ? 'left-64' : 'left-0'
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

            {/* Center Section - Search Bar */}
            <div className="hidden lg:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search admin panel..."
                  className="pl-10 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-white/20 dark:border-slate-700/20 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-teal-500/20"
                />
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-2">
              {/* Quick Actions */}
              <div className="hidden sm:flex items-center gap-1">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg bg-white/40 dark:bg-slate-800/40 hover:bg-white/60 dark:hover:bg-slate-800/60 border border-white/20 dark:border-slate-700/20">
                  <Bell className="h-4 w-4" />
                  <span className="sr-only">Notifications</span>
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg bg-white/40 dark:bg-slate-800/40 hover:bg-white/60 dark:hover:bg-slate-800/60 border border-white/20 dark:border-slate-700/20">
                  <RefreshCw className="h-4 w-4" />
                  <span className="sr-only">Refresh</span>
                </Button>
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
