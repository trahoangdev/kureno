"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Package, Settings, LogOut, CreditCard, Heart, Bell, Shield, Crown, Star } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

const accountLinks = [
  {
    href: "/account",
    label: "Profile",
    icon: User,
    description: "Manage your personal information",
  },
  {
    href: "/account/orders",
    label: "Orders",
    icon: Package,
    description: "View your order history",
    badge: "3",
  },
  {
    href: "/account/wishlist",
    label: "Wishlist",
    icon: Heart,
    description: "Your saved items",
    badge: "12",
  },
  {
    href: "/account/payment",
    label: "Payment Methods",
    icon: CreditCard,
    description: "Manage payment options",
  },
  {
    href: "/account/notifications",
    label: "Notifications",
    icon: Bell,
    description: "Email and push preferences",
    badge: "2",
  },
  {
    href: "/account/settings",
    label: "Settings",
    icon: Settings,
    description: "Account preferences",
  },
]

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { data: session, status } = useSession()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && status === "unauthenticated") {
      router.push(`/login?callbackUrl=${encodeURIComponent(pathname || "/account")}`)
    }
  }, [mounted, status, router, pathname])

  if (!mounted || status === "loading") {
    return (
      <div className="container py-8 md:py-12">
        <div className="flex flex-col gap-8 md:flex-row">
          <aside className="md:w-64">
            <Card className="p-4">
              <div className="mb-6 flex flex-col items-center">
                <Skeleton className="h-20 w-20 rounded-full" />
                <Skeleton className="mt-4 h-6 w-32" />
                <Skeleton className="mt-2 h-4 w-48" />
              </div>
              <Separator className="mb-6" />
              <div className="space-y-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            </Card>
          </aside>
          <div className="flex-1">
            <Card>
              <div className="p-6">
                <Skeleton className="h-8 w-64 mb-6" />
                <div className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (status === "unauthenticated") {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container py-8 md:py-12">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Enhanced Sidebar */}
          <aside className="lg:w-80">
            <div className="space-y-6">
              {/* User Profile Card */}
              <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900">
                <CardHeader className="pb-4">
                  <div className="flex flex-col items-center text-center">
                    <div className="relative mb-4">
                      <Avatar className="h-20 w-20 border-4 border-white shadow-lg">
                        <AvatarImage src={session?.user?.image || "/placeholder-user.jpg"} />
                        <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-teal-500 to-emerald-600 text-white">
                          {session?.user?.name ? session.user.name.charAt(0).toUpperCase() : "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-green-500 border-2 border-white flex items-center justify-center">
                        <div className="h-2 w-2 rounded-full bg-white"></div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <h2 className="text-xl font-bold">{session?.user?.name || "User"}</h2>
                      <p className="text-sm text-muted-foreground">{session?.user?.email}</p>
                      <div className="flex items-center justify-center gap-2 mt-2">
                        <Badge variant="secondary" className="bg-gradient-to-r from-teal-500 to-emerald-600 text-white">
                          <Crown className="h-3 w-3 mr-1" />
                          Premium Member
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="space-y-1">
                      <p className="text-2xl font-bold text-teal-600">3</p>
                      <p className="text-xs text-muted-foreground">Orders</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-2xl font-bold text-emerald-600">12</p>
                      <p className="text-xs text-muted-foreground">Wishlist</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-2xl font-bold text-blue-600">4.8</p>
                      <p className="text-xs text-muted-foreground">Rating</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Navigation Menu */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">Account</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <nav className="space-y-1">
                    {accountLinks.map((link) => (
                      <Link key={link.href} href={link.href}>
                        <div
                          className={`flex items-center gap-3 rounded-lg p-3 transition-all duration-200 hover:bg-muted/50 ${
                            pathname === link.href 
                              ? "bg-gradient-to-r from-teal-500 to-emerald-600 text-white shadow-md" 
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <link.icon className={`h-5 w-5 ${pathname === link.href ? "text-white" : ""}`} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="font-medium truncate">{link.label}</p>
                              {link.badge && (
                                <Badge 
                                  variant={pathname === link.href ? "secondary" : "default"}
                                  className={`text-xs ${
                                    pathname === link.href 
                                      ? "bg-white/20 text-white" 
                                      : "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300"
                                  }`}
                                >
                                  {link.badge}
                                </Badge>
                              )}
                            </div>
                            <p className={`text-xs truncate ${
                              pathname === link.href ? "text-white/80" : "text-muted-foreground"
                            }`}>
                              {link.description}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </nav>
                  
                  <Separator className="my-4" />
                  
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20" 
                    asChild
                  >
                    <Link href="/api/auth/signout">
                      <LogOut className="mr-2 h-5 w-5" />
                      Sign Out
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            <div className="space-y-6">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
