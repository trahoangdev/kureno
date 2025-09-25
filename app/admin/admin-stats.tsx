"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  ShoppingBag, 
  Users, 
  MessageSquare, 
  FileText, 
  Package,
  Mail,
  TrendingUp
} from "lucide-react"

interface AdminStats {
  totalOrders: number
  totalUsers: number
  totalReviews: number
  totalProducts: number
  totalCategories: number
  totalBlogPosts: number
  totalMessages: number
  recentOrders: number
}

export default function AdminStats() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true)
        
        // Fetch all stats in parallel
        const [
          ordersRes,
          usersRes,
          reviewsRes,
          productsRes,
          categoriesRes,
          blogRes,
          messagesRes
        ] = await Promise.all([
          fetch('/api/orders'),
          fetch('/api/admin/users'),
          fetch('/api/reviews'),
          fetch('/api/products'),
          fetch('/api/categories'),
          fetch('/api/blog'),
          fetch('/api/admin/messages')
        ])

        const [
          ordersData,
          usersData,
          reviewsData,
          productsData,
          categoriesData,
          blogData,
          messagesData
        ] = await Promise.all([
          ordersRes.json(),
          usersRes.json(),
          blogRes.json(),
          productsRes.json(),
          categoriesRes.json(),
          blogRes.json(),
          messagesRes.json()
        ])

        // Calculate recent orders (last 7 days)
        const recentOrders = ordersData.orders?.filter((order: any) => {
          const orderDate = new Date(order.createdAt)
          const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          return orderDate >= sevenDaysAgo
        }).length || 0

        setStats({
          totalOrders: ordersData.orders?.length || 0,
          totalUsers: usersData.users?.length || 0,
          totalReviews: reviewsData.statistics?.totalReviews || 0,
          totalProducts: productsData.products?.length || 0,
          totalCategories: categoriesData.categories?.length || 0,
          totalBlogPosts: blogData.posts?.length || 0,
          totalMessages: messagesData.messages?.length || 0,
          recentOrders
        })
      } catch (error) {
        console.error('Error fetching admin stats:', error)
        // Set fallback stats
        setStats({
          totalOrders: 0,
          totalUsers: 0,
          totalReviews: 0,
          totalProducts: 0,
          totalCategories: 0,
          totalBlogPosts: 0,
          totalMessages: 0,
          recentOrders: 0
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-16 bg-gray-200 rounded-lg"></div>
          </div>
        ))}
      </div>
    )
  }

  if (!stats) {
    return null
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/50 border-blue-200 dark:border-blue-800">
        <CardContent className="p-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                {stats.totalOrders}
              </div>
              <div className="text-xs text-blue-600/70 dark:text-blue-400/70">Orders</div>
            </div>
            <ShoppingBag className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          {stats.recentOrders > 0 && (
            <div className="mt-1">
              <Badge variant="secondary" className="text-xs bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300">
                +{stats.recentOrders} this week
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/50 border-green-200 dark:border-green-800">
        <CardContent className="p-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg font-bold text-green-600 dark:text-green-400">
                {stats.totalUsers}
              </div>
              <div className="text-xs text-green-600/70 dark:text-green-400/70">Users</div>
            </div>
            <Users className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/50 border-purple-200 dark:border-purple-800">
        <CardContent className="p-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                {stats.totalReviews}
              </div>
              <div className="text-xs text-purple-600/70 dark:text-purple-400/70">Reviews</div>
            </div>
            <MessageSquare className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/50 dark:to-orange-900/50 border-orange-200 dark:border-orange-800">
        <CardContent className="p-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg font-bold text-orange-600 dark:text-orange-400">
                {stats.totalProducts}
              </div>
              <div className="text-xs text-orange-600/70 dark:text-orange-400/70">Products</div>
            </div>
            <Package className="h-5 w-5 text-orange-600 dark:text-orange-400" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
