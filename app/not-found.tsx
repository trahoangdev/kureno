"use client"

import React from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { 
  Home, 
  ArrowLeft, 
  Search, 
  ShoppingBag, 
  BookOpen, 
  Mail,
  Phone,
  MapPin,
  AlertTriangle,
  MessageSquare
} from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Enhanced Header Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/80 via-blue-50/80 to-indigo-50/80 dark:from-slate-900/80 dark:via-blue-900/80 dark:to-indigo-900/80 p-8 mb-8 shadow-xl border border-white/20 dark:border-slate-700/20">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.1),transparent_50%),radial-gradient(ellipse_at_bottom_left,rgba(147,51,234,0.1),transparent_50%)] -z-10" />
          
          <div className="text-center space-y-6">
            {/* Logo Section */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-teal-500 to-emerald-600 rounded-full blur-2xl opacity-20 animate-pulse"></div>
                <div className="relative p-6 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-white/20 dark:border-slate-700/20 shadow-lg">
                  <Image
                    src="/logo.svg"
                    alt="Kureno Logo"
                    width={80}
                    height={80}
                    className="w-20 h-20"
                  />
                </div>
              </div>
            </div>

            {/* Error Code */}
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-3">
                <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 text-lg font-bold">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  404 Error
                </Badge>
                <Badge variant="outline" className="text-sm">
                  <Search className="h-4 w-4 mr-1" />
                  Page Not Found
                </Badge>
              </div>
              
              <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
                404
              </h1>
              
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-200">
                Oops! Page Not Found
              </h2>
              
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                The page you're looking for seems to have wandered off into the digital void. 
                Don't worry, even the best explorers sometimes take a wrong turn!
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-white/20 dark:border-slate-700/20 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="mx-auto p-3 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 group-hover:scale-110 transition-transform duration-200">
                <Home className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-xl">Go Home</CardTitle>
              <CardDescription>Return to our homepage and start fresh</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button asChild className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white">
                <Link href="/" className="flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  Take Me Home
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-white/20 dark:border-slate-700/20 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="mx-auto p-3 rounded-xl bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 group-hover:scale-110 transition-transform duration-200">
                <ShoppingBag className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-xl">Browse Products</CardTitle>
              <CardDescription>Discover our amazing collection of products</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button asChild variant="outline" className="w-full border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 hover:bg-green-50 dark:hover:bg-green-950">
                <Link href="/products" className="flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4" />
                  Shop Now
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-white/20 dark:border-slate-700/20 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm md:col-span-2 lg:col-span-1">
            <CardHeader className="text-center">
              <div className="mx-auto p-3 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 group-hover:scale-110 transition-transform duration-200">
                <BookOpen className="h-8 w-8 text-purple-600" />
              </div>
              <CardTitle className="text-xl">Read Our Blog</CardTitle>
              <CardDescription>Check out our latest articles and insights</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button asChild variant="outline" className="w-full border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950">
                <Link href="/blog" className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Read Blog
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Help Section */}
        <Card className="border-white/20 dark:border-slate-700/20 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-2xl">
              <MessageSquare className="h-6 w-6 text-blue-600" />
              Need Help?
            </CardTitle>
            <CardDescription className="text-lg">
              Can't find what you're looking for? We're here to help!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center p-4 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
                <div className="mx-auto p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 w-fit mb-3">
                  <Mail className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Email Support</h3>
                <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">Get help via email</p>
                <Button asChild size="sm" variant="outline" className="border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950">
                  <Link href="/contact">Contact Us</Link>
                </Button>
              </div>

              <div className="text-center p-4 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
                <div className="mx-auto p-2 rounded-lg bg-green-100 dark:bg-green-900/30 w-fit mb-3">
                  <Phone className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">Phone Support</h3>
                <p className="text-sm text-green-700 dark:text-green-300 mb-3">Call us directly</p>
                <Button asChild size="sm" variant="outline" className="border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 hover:bg-green-50 dark:hover:bg-green-950">
                  <Link href="/contact">Call Now</Link>
                </Button>
              </div>

              <div className="text-center p-4 rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
                <div className="mx-auto p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30 w-fit mb-3">
                  <MapPin className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">Visit Us</h3>
                <p className="text-sm text-purple-700 dark:text-purple-300 mb-3">Come to our store</p>
                <Button asChild size="sm" variant="outline" className="border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950">
                  <Link href="/about">Find Us</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Back Button */}
        <div className="text-center mt-8">
          <Button 
            variant="ghost" 
            onClick={() => window.history.back()}
            className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>

        {/* Footer Info */}
        <div className="text-center mt-8 text-sm text-slate-500 dark:text-slate-400">
          <p>© 2025 Kureno. All rights reserved.</p>
          <p className="mt-1">Crafted with ❤️ for amazing experiences</p>
        </div>
      </div>
    </div>
  )
}
