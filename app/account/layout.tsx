"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { User, Package, Settings, LogOut, CreditCard, Heart, Bell } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

const accountLinks = [
  {
    href: "/account",
    label: "Profile",
    icon: User,
  },
  {
    href: "/account/orders",
    label: "Orders",
    icon: Package,
  },
  {
    href: "/account/wishlist",
    label: "Wishlist",
    icon: Heart,
  },
  {
    href: "/account/payment",
    label: "Payment Methods",
    icon: CreditCard,
  },
  {
    href: "/account/notifications",
    label: "Notifications",
    icon: Bell,
  },
  {
    href: "/account/settings",
    label: "Settings",
    icon: Settings,
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
      <div className="container py-24 md:py-32">
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
    <div className="container py-24 md:py-32">
      <div className="flex flex-col gap-8 md:flex-row">
        <aside className="md:w-64">
          <Card className="p-4 sticky top-24">
            <div className="mb-6 flex flex-col items-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                <span className="text-2xl font-medium">
                  {session?.user?.name ? session.user.name.charAt(0).toUpperCase() : "U"}
                </span>
              </div>
              <h2 className="mt-4 text-xl font-bold">{session?.user?.name || "User"}</h2>
              <p className="text-sm text-muted-foreground">{session?.user?.email}</p>
            </div>

            <Separator className="mb-6" />

            <nav className="space-y-2">
              {accountLinks.map((link) => (
                <Button
                  key={link.href}
                  variant={pathname === link.href ? "default" : "ghost"}
                  className="w-full justify-start"
                  asChild
                >
                  <Link href={link.href}>
                    <link.icon className="mr-2 h-5 w-5" />
                    {link.label}
                  </Link>
                </Button>
              ))}
              <Separator className="my-2" />
              <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive" asChild>
                <Link href="/api/auth/signout">
                  <LogOut className="mr-2 h-5 w-5" />
                  Sign Out
                </Link>
              </Button>
            </nav>
          </Card>
        </aside>

        <div className="flex-1">{children}</div>
      </div>
    </div>
  )
}
