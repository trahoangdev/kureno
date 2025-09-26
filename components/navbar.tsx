"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, X, ShoppingBag, User, Shield, Search, Bell, Heart, Settings, LogOut, ChevronDown } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { useCart } from "@/context/cart-context"
import { Cart } from "@/components/cart"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu"
import AdvancedSearch from "@/components/advanced-search"
import NotificationsDropdown from "@/components/notifications-dropdown"
import SearchModal from "@/components/search-modal"

const routes = [
  {
    href: "/",
    label: "Home",
  },
  {
    href: "/about",
    label: "About",
  },
  {
    href: "/products",
    label: "Products",
  },
  {
    href: "/blog",
    label: "Blog",
  },
  {
    href: "/contact",
    label: "Contact",
  },
]

const searchItems = [
  { title: "Products", href: "/products" },
  { title: "Blog Posts", href: "/blog" },
  { title: "About Us", href: "/about" },
  { title: "Contact", href: "/contact" },
]

export default function Navbar() {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const { itemCount } = useCart()
  const { data: session } = useSession()

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
      <header
        className={cn(
          "fixed top-0 w-full z-50 transition-all duration-300",
          isScrolled 
            ? "bg-background/95 backdrop-blur-md border-b shadow-lg" 
            : "bg-background/80 backdrop-blur-sm",
        )}
      >
        <div className="container flex h-16 items-center justify-between">
          {/* Enhanced Logo */}
          <Link href="/" className="group flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-xl bg-white dark:bg-gray-900 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105 border border-border/20 overflow-hidden">
              <div className="absolute -inset-1 bg-gradient-to-r from-teal-500 to-emerald-600 rounded-xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              <img 
                src="/logo.svg" 
                alt="Kureno Logo" 
                className="w-6 h-6 transition-transform duration-300 group-hover:scale-110 relative z-10"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-gradient-to-r from-teal-500 to-emerald-600 bg-clip-text text-transparent leading-none">
                Kureno
              </span>
              <span className="text-xs text-muted-foreground font-medium tracking-wide leading-none">
                Crafting Heritage
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "relative text-sm font-medium transition-all duration-200 hover:text-primary group",
                  pathname === route.href ? "text-primary" : "text-muted-foreground",
                )}
              >
                {route.label}
                <span
                  className={cn(
                    "absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-teal-500 to-emerald-600 transition-all duration-200",
                    pathname === route.href ? "w-full" : "w-0 group-hover:w-full"
                  )}
                />
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            {/* Search Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen(true)}
              className="hidden md:flex"
            >
              <Search className="h-4 w-4" />
              <span className="sr-only">Search</span>
            </Button>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-2">
              {/* Cart */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative" 
                onClick={() => setIsCartOpen(true)}
              >
                <ShoppingBag className="h-4 w-4" />
                {itemCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-gradient-to-r from-teal-500 to-emerald-600 text-white text-xs font-semibold">
                    {itemCount}
                  </Badge>
                )}
                <span className="sr-only">Shopping cart</span>
              </Button>

              {/* Notifications */}
              <NotificationsDropdown />

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 px-3">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={session?.user?.image || "/placeholder-user.jpg"} />
                      <AvatarFallback>
                        {session?.user?.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden lg:block text-sm font-medium">
                      {session?.user?.name || "Account"}
                    </span>
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  {session ? (
                    <>
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {session.user?.name || "User"}
                          </p>
                          <p className="text-xs leading-none text-muted-foreground">
                            {session.user?.email}
                          </p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuItem asChild>
                          <Link href="/account" className="flex items-center">
                            <User className="mr-2 h-4 w-4" />
                            <span>Profile</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/account/orders" className="flex items-center">
                            <ShoppingBag className="mr-2 h-4 w-4" />
                            <span>Orders</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/account/wishlist" className="flex items-center">
                            <Heart className="mr-2 h-4 w-4" />
                            <span>Wishlist</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/account/settings" className="flex items-center">
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Settings</span>
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="flex items-center text-red-600"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Sign out</span>
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <>
                      <DropdownMenuItem asChild>
                        <Link href="/login" className="flex items-center">
                          <User className="mr-2 h-4 w-4" />
                          <span>Sign In</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/register" className="flex items-center">
                          <User className="mr-2 h-4 w-4" />
                          <span>Register</span>
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Theme Toggle */}
              <ThemeToggle />
            </div>

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="relative transition-all duration-300 hover:scale-105"
                >
                  <div className="relative w-5 h-5 flex flex-col justify-center">
                    <span 
                      className={cn(
                        "block h-0.5 w-5 bg-current transition-all duration-300 ease-out",
                        isOpen ? "rotate-45 translate-y-0.5" : "-translate-y-1"
                      )} 
                    />
                    <span 
                      className={cn(
                        "block h-0.5 w-5 bg-current transition-all duration-300 ease-out",
                        isOpen ? "opacity-0" : "opacity-100"
                      )} 
                    />
                    <span 
                      className={cn(
                        "block h-0.5 w-5 bg-current transition-all duration-300 ease-out",
                        isOpen ? "-rotate-45 -translate-y-0.5" : "translate-y-1"
                      )} 
                    />
                  </div>
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent 
                side="right" 
                className="w-full max-w-sm p-0 bg-background/95 backdrop-blur-xl border-l border-border/50"
              >
                <div className="flex flex-col h-full">
                  {/* Enhanced Mobile Header */}
                  <div className="flex items-center justify-between p-6 border-b border-border/50 bg-gradient-to-r from-background to-background/80">
                    <Link 
                      href="/" 
                      onClick={() => setIsOpen(false)}
                      className="group flex items-center gap-3"
                    >
                      <div className="relative w-12 h-12 rounded-xl bg-white dark:bg-gray-900 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105 border border-border/20 overflow-hidden">
                        <div className="absolute -inset-1 bg-gradient-to-r from-teal-500 to-emerald-600 rounded-xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                        <img 
                          src="/logo.svg" 
                          alt="Kureno Logo" 
                          className="w-8 h-8 transition-transform duration-300 group-hover:scale-110 relative z-10"
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-2xl font-bold bg-gradient-to-r from-teal-500 to-emerald-600 bg-clip-text text-transparent">
                          Kureno
                        </span>
                        <span className="text-xs text-muted-foreground font-medium tracking-wide">
                          Crafting Heritage
                        </span>
                      </div>
                    </Link>
                  </div>

                  {/* Enhanced Mobile Search */}
                  <div className="p-6 border-b border-border/50">
                    <div className="relative group">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      <Input
                        placeholder="Search products, blog posts..."
                        className="pl-12 h-12 rounded-xl border-border/50 bg-muted/30 backdrop-blur-sm transition-all duration-300 focus:bg-background focus:border-primary/50 focus:shadow-lg"
                        onClick={() => {
                          setIsOpen(false)
                          setIsSearchOpen(true)
                        }}
                      />
                    </div>
                  </div>

                  {/* Enhanced Mobile Navigation */}
                  <div className="flex-1 overflow-y-auto">
                    <nav className="p-6 space-y-2">
                      {routes.map((route, index) => (
                        <Link
                          key={route.href}
                          href={route.href}
                          onClick={() => setIsOpen(false)}
                          className={cn(
                            "group flex items-center gap-4 px-4 py-3 rounded-xl font-medium transition-all duration-300 hover:bg-muted/50 hover:translate-x-1",
                            pathname === route.href 
                              ? "bg-gradient-to-r from-teal-500/10 to-emerald-600/10 text-primary border border-primary/20 shadow-sm" 
                              : "text-muted-foreground hover:text-foreground"
                          )}
                          style={{
                            animationDelay: `${index * 50}ms`
                          }}
                        >
                          <div className={cn(
                            "w-2 h-2 rounded-full transition-all duration-300",
                            pathname === route.href 
                              ? "bg-gradient-to-r from-teal-500 to-emerald-600 shadow-lg" 
                              : "bg-muted-foreground/30 group-hover:bg-primary/50"
                          )} />
                          <span className="flex-1">{route.label}</span>
                          {pathname === route.href && (
                            <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-teal-500 to-emerald-600 animate-pulse" />
                          )}
                        </Link>
                      ))}
                    </nav>

                    {/* Enhanced Mobile Actions */}
                    <div className="px-6 py-4 border-t border-border/50">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-muted-foreground">Quick Actions</span>
                      </div>
                      <div className="grid grid-cols-4 gap-3 mt-4">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-12 w-full relative group rounded-xl hover:bg-muted/50 transition-all duration-300 hover:scale-105"
                          onClick={() => {
                            setIsOpen(false)
                            setIsCartOpen(true)
                          }}
                        >
                          <ShoppingBag className="h-5 w-5 group-hover:text-primary transition-colors" />
                          {itemCount > 0 && (
                            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-gradient-to-r from-teal-500 to-emerald-600 text-white text-xs shadow-lg animate-pulse">
                              {itemCount}
                            </Badge>
                          )}
                        </Button>
                        
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-12 w-full group rounded-xl hover:bg-muted/50 transition-all duration-300 hover:scale-105"
                        >
                          <Bell className="h-5 w-5 group-hover:text-primary transition-colors" />
                        </Button>
                        
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-12 w-full group rounded-xl hover:bg-muted/50 transition-all duration-300 hover:scale-105"
                        >
                          <Heart className="h-5 w-5 group-hover:text-primary transition-colors" />
                        </Button>
                        
                        <div className="flex justify-center">
                          <ThemeToggle />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Mobile User Section */}
                  <div className="border-t border-border/50 bg-gradient-to-b from-background/50 to-muted/20">
                    {session ? (
                      <div className="p-6">
                        <div className="flex items-center gap-4 mb-6 p-4 rounded-xl bg-gradient-to-r from-muted/30 to-muted/10 border border-border/50">
                          <Avatar className="h-12 w-12 ring-2 ring-primary/20 ring-offset-2 ring-offset-background">
                            <AvatarImage src={session.user?.image || "/placeholder-user.jpg"} />
                            <AvatarFallback className="bg-gradient-to-br from-teal-500 to-emerald-600 text-white font-semibold">
                              {session.user?.name?.charAt(0) || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-foreground truncate">{session.user?.name || "User"}</p>
                            <p className="text-sm text-muted-foreground truncate">{session.user?.email}</p>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <Link href="/account" onClick={() => setIsOpen(false)}>
                            <Button variant="outline" className="w-full justify-start h-12 rounded-xl border-border/50 hover:bg-muted/50 hover:border-primary/30 transition-all duration-300 group">
                              <User className="mr-3 h-4 w-4 group-hover:text-primary transition-colors" />
                              My Account
                            </Button>
                          </Link>
                          <Button 
                            variant="outline" 
                            className="w-full justify-start h-12 rounded-xl text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 dark:border-red-800 dark:hover:bg-red-950 transition-all duration-300 group"
                            onClick={() => {
                              signOut({ callbackUrl: "/" })
                              setIsOpen(false)
                            }}
                          >
                            <LogOut className="mr-3 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                            Sign Out
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-6">
                        <div className="space-y-3">
                          <Link href="/login" onClick={() => setIsOpen(false)}>
                            <Button 
                              className="w-full h-12 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                            >
                              <span className="font-semibold">Sign In</span>
                            </Button>
                          </Link>
                          <Link href="/register" onClick={() => setIsOpen(false)}>
                            <Button 
                              variant="outline" 
                              className="w-full h-12 rounded-xl border-border/50 hover:bg-muted/50 hover:border-primary/30 transition-all duration-300"
                            >
                              <span className="font-medium">Create Account</span>
                            </Button>
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Cart */}
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  )
}
