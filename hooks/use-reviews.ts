import { useState, useEffect, useCallback } from 'react'

interface Review {
  _id: string
  productId: string
  userId: string
  userName: string
  userEmail: string
  rating: number
  title: string
  comment: string
  verified: boolean
  helpful: number
  helpfulUsers: string[]
  createdAt: string
  updatedAt: string
}

interface ReviewStats {
  averageRating: number
  totalReviews: number
  ratingDistribution: Array<{
    rating: number
    count: number
    percentage: number
  }>
}

interface UseReviewsOptions {
  productId?: string
  sortBy?: 'newest' | 'oldest' | 'highest' | 'lowest' | 'helpful'
  filterBy?: 'all' | '1' | '2' | '3' | '4' | '5'
  page?: number
  limit?: number
  autoRefresh?: boolean
  refreshInterval?: number
}

interface UseReviewsReturn {
  reviews: Review[]
  stats: ReviewStats | null
  isLoading: boolean
  error: string | null
  totalPages: number
  currentPage: number
  totalReviews: number
  refetch: () => Promise<void>
  refreshStats: () => Promise<void>
}

export function useReviews(options: UseReviewsOptions = {}): UseReviewsReturn {
  const {
    productId,
    sortBy = 'newest',
    filterBy = 'all',
    page = 1,
    limit = 10,
    autoRefresh = false,
    refreshInterval = 30000 // 30 seconds
  } = options

  const [reviews, setReviews] = useState<Review[]>([])
  const [stats, setStats] = useState<ReviewStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalPages, setTotalPages] = useState(0)
  const [currentPage, setCurrentPage] = useState(page)
  const [totalReviews, setTotalReviews] = useState(0)

  const fetchReviews = useCallback(async () => {
    if (!productId) return

    try {
      setIsLoading(true)
      setError(null)

      const params = new URLSearchParams({
        productId,
        sortBy,
        filterBy,
        page: page.toString(),
        limit: limit.toString()
      })

      const response = await fetch(`/api/reviews?${params}`)
      const data = await response.json()

      if (response.ok) {
        setReviews(data.reviews || [])
        setStats(data.statistics || null)
        setTotalPages(Math.ceil((data.pagination?.total || 0) / limit))
        setCurrentPage(page)
        setTotalReviews(data.pagination?.total || 0)
      } else {
        setError(data.error || 'Failed to fetch reviews')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }, [productId, sortBy, filterBy, page, limit])

  const fetchStats = useCallback(async () => {
    if (!productId) return

    try {
      const params = new URLSearchParams({
        productId,
        statsOnly: 'true'
      })

      const response = await fetch(`/api/reviews?${params}`)
      const data = await response.json()

      if (response.ok) {
        setStats(data.statistics || null)
        setTotalReviews(data.pagination?.total || 0)
      }
    } catch (err) {
      console.error('Error fetching review stats:', err)
    }
  }, [productId])

  const refetch = useCallback(async () => {
    await fetchReviews()
  }, [fetchReviews])

  const refreshStats = useCallback(async () => {
    await fetchStats()
  }, [fetchStats])

  // Initial fetch
  useEffect(() => {
    fetchReviews()
  }, [fetchReviews])

  // Auto-refresh
  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      fetchStats() // Only refresh stats to avoid disrupting user interaction
    }, refreshInterval)

    return () => clearInterval(interval)
  }, [autoRefresh, refreshInterval, fetchStats])

  return {
    reviews,
    stats,
    isLoading,
    error,
    totalPages,
    currentPage,
    totalReviews,
    refetch,
    refreshStats
  }
}

// Hook for admin reviews with real-time updates
export function useAdminReviews(options: {
  sortBy?: string
  filterBy?: string
  search?: string
  page?: number
  limit?: number
  autoRefresh?: boolean
  refreshInterval?: number
} = {}) {
  const {
    sortBy = 'newest',
    filterBy = 'all',
    search = '',
    page = 1,
    limit = 10,
    autoRefresh = true,
    refreshInterval = 15000 // 15 seconds for admin
  } = options

  const [reviews, setReviews] = useState<any[]>([])
  const [stats, setStats] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalPages, setTotalPages] = useState(0)
  const [currentPage, setCurrentPage] = useState(page)
  const [totalReviews, setTotalReviews] = useState(0)

  const fetchAdminReviews = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      const params = new URLSearchParams({
        sortBy,
        filterBy,
        search,
        page: page.toString(),
        limit: limit.toString()
      })

      const response = await fetch(`/api/admin/reviews?${params}`)
      const data = await response.json()

      if (response.ok) {
        setReviews(data.reviews || [])
        setStats(data.statistics || null)
        setTotalPages(Math.ceil((data.pagination?.total || 0) / limit))
        setCurrentPage(page)
        setTotalReviews(data.pagination?.total || 0)
      } else {
        setError(data.error || 'Failed to fetch reviews')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }, [sortBy, filterBy, search, page, limit])

  const refetch = useCallback(async () => {
    await fetchAdminReviews()
  }, [fetchAdminReviews])

  // Initial fetch
  useEffect(() => {
    fetchAdminReviews()
  }, [fetchAdminReviews])

  // Auto-refresh for admin
  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      fetchAdminReviews()
    }, refreshInterval)

    return () => clearInterval(interval)
  }, [autoRefresh, refreshInterval, fetchAdminReviews])

  return {
    reviews,
    stats,
    isLoading,
    error,
    totalPages,
    currentPage,
    totalReviews,
    refetch
  }
}
