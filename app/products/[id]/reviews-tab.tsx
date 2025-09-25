"use client"

import { useReviews } from "@/hooks/use-reviews"

interface ReviewsTabProps {
  productId: string
}

export default function ReviewsTab({ productId }: ReviewsTabProps) {
  const { stats, isLoading } = useReviews({
    productId,
    autoRefresh: true,
    refreshInterval: 30000 // 30 seconds
  })

  if (isLoading) {
    return <span>Reviews</span>
  }

  return <span>Reviews ({stats?.totalReviews || 0})</span>
}
