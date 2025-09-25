import { useState, useEffect, useCallback } from 'react'

interface ProductReviewStats {
  productId: string
  averageRating: number
  totalReviews: number
  ratingDistribution: Array<{
    rating: number
    count: number
    percentage: number
  }>
}

interface UseProductReviewsOptions {
  productIds: string[]
  autoRefresh?: boolean
  refreshInterval?: number
}

interface UseProductReviewsReturn {
  reviewStats: Record<string, ProductReviewStats>
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
  getProductStats: (productId: string) => ProductReviewStats | null
}

export function useProductReviews(options: UseProductReviewsOptions): UseProductReviewsReturn {
  const {
    productIds,
    autoRefresh = true,
    refreshInterval = 30000 // 30 seconds
  } = options

  const [reviewStats, setReviewStats] = useState<Record<string, ProductReviewStats>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProductReviews = useCallback(async () => {
    if (productIds.length === 0) {
      setReviewStats({})
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      // Fetch review stats for all products in parallel
      const promises = productIds.map(async (productId) => {
        try {
          const response = await fetch(`/api/reviews?productId=${productId}&statsOnly=true`)
          const data = await response.json()
          
          if (response.ok) {
            return {
              productId,
              stats: data.statistics
            }
          } else {
            console.error(`Failed to fetch reviews for product ${productId}:`, data.error)
            return {
              productId,
              stats: {
                averageRating: 0,
                totalReviews: 0,
                ratingDistribution: []
              }
            }
          }
        } catch (err) {
          console.error(`Error fetching reviews for product ${productId}:`, err)
          return {
            productId,
            stats: {
              averageRating: 0,
              totalReviews: 0,
              ratingDistribution: []
            }
          }
        }
      })

      const results = await Promise.all(promises)
      
      // Convert results to object format
      const statsObject: Record<string, ProductReviewStats> = {}
      results.forEach(({ productId, stats }) => {
        statsObject[productId] = {
          productId,
          averageRating: stats.averageRating || 0,
          totalReviews: stats.totalReviews || 0,
          ratingDistribution: stats.ratingDistribution || []
        }
      })

      setReviewStats(statsObject)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }, [productIds])

  const refetch = useCallback(async () => {
    await fetchProductReviews()
  }, [fetchProductReviews])

  const getProductStats = useCallback((productId: string): ProductReviewStats | null => {
    return reviewStats[productId] || null
  }, [reviewStats])

  // Initial fetch
  useEffect(() => {
    fetchProductReviews()
  }, [fetchProductReviews])

  // Auto-refresh
  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      fetchProductReviews()
    }, refreshInterval)

    return () => clearInterval(interval)
  }, [autoRefresh, refreshInterval, fetchProductReviews])

  return {
    reviewStats,
    isLoading,
    error,
    refetch,
    getProductStats
  }
}

// Hook for single product review stats
export function useSingleProductReviews(productId: string, options: {
  autoRefresh?: boolean
  refreshInterval?: number
} = {}) {
  const { reviewStats, isLoading, error, refetch } = useProductReviews({
    productIds: [productId],
    ...options
  })

  const productStats = reviewStats[productId] || null

  return {
    stats: productStats,
    isLoading,
    error,
    refetch
  }
}
