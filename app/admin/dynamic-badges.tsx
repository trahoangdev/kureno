"use client"

import { useState, useEffect } from "react"

interface BadgeData {
  products: number
  categories: number
  blogPosts: number
  reviews: number
  comments: number
  orders: number
  customers: number
  messages: number
  users: number
  notifications: number
}

export function useDynamicBadges() {
  const [badgeData, setBadgeData] = useState<BadgeData>({
    products: 0,
    categories: 0,
    blogPosts: 0,
    reviews: 0,
    comments: 0,
    orders: 0,
    customers: 0,
    messages: 0,
    users: 0,
    notifications: 0
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchBadgeData = async () => {
      try {
        setIsLoading(true)
        
        // Fetch all data in parallel
        const [
          productsRes,
          categoriesRes,
          blogRes,
          reviewsRes,
          commentsRes,
          ordersRes,
          customersRes,
          messagesRes,
          usersRes,
          notificationsRes
        ] = await Promise.all([
          fetch('/api/products').catch(err => ({ ok: false, error: err.message })),
          fetch('/api/categories').catch(err => ({ ok: false, error: err.message })),
          fetch('/api/blog').catch(err => ({ ok: false, error: err.message })),
          fetch('/api/reviews').catch(err => ({ ok: false, error: err.message })),
          fetch('/api/admin/comments').catch(err => ({ ok: false, error: err.message })),
          fetch('/api/orders').catch(err => ({ ok: false, error: err.message })),
          fetch('/api/admin/customers').catch(err => ({ ok: false, error: err.message })),
          fetch('/api/admin/messages').catch(err => ({ ok: false, error: err.message })),
          fetch('/api/admin/users').catch(err => ({ ok: false, error: err.message })),
          fetch('/api/admin/notifications?limit=1').catch(err => ({ ok: false, error: err.message }))
        ])

        const [
          productsData,
          categoriesData,
          blogData,
          reviewsData,
          commentsData,
          ordersData,
          customersData,
          messagesData,
          usersData,
          notificationsData
        ] = await Promise.all([
          productsRes.ok ? (productsRes as Response).json() : { products: [] },
          categoriesRes.ok ? (categoriesRes as Response).json() : { categories: [] },
          blogRes.ok ? (blogRes as Response).json() : { posts: [] },
          reviewsRes.ok ? (reviewsRes as Response).json() : { statistics: { totalReviews: 0 } },
          commentsRes.ok ? (commentsRes as Response).json() : { statistics: { total: 0 } },
          ordersRes.ok ? (ordersRes as Response).json() : { orders: [] },
          customersRes.ok ? (customersRes as Response).json() : { customers: [] },
          messagesRes.ok ? (messagesRes as Response).json() : { messages: [] },
          usersRes.ok ? (usersRes as Response).json() : { users: [] },
          notificationsRes.ok ? (notificationsRes as Response).json() : { unreadCount: 0 }
        ])

        console.log('API Responses:', {
          products: productsData,
          categories: categoriesData,
          blog: blogData,
          reviews: reviewsData,
          comments: commentsData,
          orders: ordersData,
          customers: customersData,
          messages: messagesData,
          users: usersData,
          notifications: notificationsData
        })

        const newBadgeData = {
          products: productsData.products?.length || 0,
          categories: categoriesData.categories?.length || 0,
          blogPosts: blogData.posts?.length || 0,
          reviews: reviewsData.statistics?.totalReviews || 0,
          comments: commentsData.statistics?.total || 0,
          orders: ordersData.orders?.length || 0,
          customers: customersData.customers?.length || 0,
          messages: messagesData.messages?.length || 0,
          users: usersData.users?.length || 0,
          notifications: notificationsData.unreadCount || 0
        }
        
        console.log('Badge data calculated:', newBadgeData)
        setBadgeData(newBadgeData)
      } catch (error) {
        console.error('Error fetching badge data:', error)
        // Keep default values (0) on error
      } finally {
        setIsLoading(false)
      }
    }

    fetchBadgeData()
  }, [])

  return { badgeData, isLoading }
}
