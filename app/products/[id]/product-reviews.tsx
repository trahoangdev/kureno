"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useToast } from "@/hooks/use-toast"
import { useReviews } from "@/hooks/use-reviews"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { 
  Star, 
  ThumbsUp, 
  ThumbsDown, 
  MessageSquare, 
  User,
  Calendar,
  Filter,
  SortAsc,
  RefreshCw,
  Loader2
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ProductReviewsProps {
  productId: string
}

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

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [sortBy, setSortBy] = useState("newest")
  const [filterBy, setFilterBy] = useState("all")
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: "",
    comment: "",
    name: session?.user?.name || "",
    email: session?.user?.email || ""
  })

  // Use the new reviews hook with real-time updates
  const {
    reviews,
    stats,
    isLoading,
    error,
    refetch,
    refreshStats
  } = useReviews({
    productId,
    sortBy: sortBy as any,
    filterBy: filterBy as any,
    autoRefresh: true,
    refreshInterval: 30000 // 30 seconds
  })

  // Handle error display
  useEffect(() => {
    if (error) {
      toast({
        title: "Error loading reviews",
        description: error,
        variant: "destructive"
      })
    }
  }, [error, toast])

  // Update newReview when session changes
  useEffect(() => {
    if (session?.user) {
      setNewReview(prev => ({
        ...prev,
        name: session.user?.name || "",
        email: session.user?.email || ""
      }))
    }
  }, [session])

  const handleSubmitReview = async () => {
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please sign in to write a review",
        variant: "destructive"
      })
      return
    }

    if (!newReview.title.trim() || !newReview.comment.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      })
      return
    }

    try {
      setIsSubmitting(true)
      
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          rating: newReview.rating,
          title: newReview.title,
          comment: newReview.comment,
          userName: newReview.name,
          userEmail: newReview.email
        })
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Review submitted",
          description: "Thank you for your review!"
        })
        setShowReviewForm(false)
        setNewReview({ 
          rating: 5, 
          title: "", 
          comment: "", 
          name: session.user?.name || "",
          email: session.user?.email || ""
        })
        
        // Refresh reviews using the hook
        await refetch()
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to submit review",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error submitting review:', error)
      toast({
        title: "Error",
        description: "Failed to submit review",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleHelpfulVote = async (reviewId: string, helpful: boolean) => {
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please sign in to vote on reviews",
        variant: "destructive"
      })
      return
    }

    try {
      const response = await fetch(`/api/reviews/${reviewId}/helpful`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ helpful })
      })

      const data = await response.json()

      if (response.ok) {
        // Refresh reviews to get updated data
        await refetch()
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to update vote",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error updating helpful vote:', error)
      toast({
        title: "Error",
        description: "Failed to update vote",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Review Summary */}
      {isLoading ? (
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="h-12 bg-gray-200 rounded mb-2"></div>
                  <div className="flex justify-center mb-2">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="h-5 w-5 bg-gray-200 rounded mr-1"></div>
                    ))}
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-32 mx-auto"></div>
                </div>
                <div className="space-y-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="h-4 w-8 bg-gray-200 rounded"></div>
                      <div className="h-4 w-4 bg-gray-200 rounded"></div>
                      <div className="flex-1 h-2 bg-gray-200 rounded"></div>
                      <div className="h-4 w-8 bg-gray-200 rounded"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : stats ? (
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-teal-600 mb-2">
                  {stats.averageRating.toFixed(1)}
                </div>
                <div className="flex justify-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-5 w-5 ${
                        i < Math.floor(stats.averageRating) 
                          ? 'fill-yellow-400 text-yellow-400' 
                          : 'text-gray-300'
                      }`} 
                    />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  Based on {stats.totalReviews} reviews
                </p>
              </div>
              
              <div className="space-y-2">
                {stats.ratingDistribution.map(({ rating, count, percentage }) => (
                  <div key={rating} className="flex items-center gap-2">
                    <span className="text-sm w-8">{rating}</span>
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-yellow-400 h-2 rounded-full" 
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground w-8">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-muted-foreground">
              No reviews yet. Be the first to review this product!
            </div>
          </CardContent>
        </Card>
      )}

      {/* Review Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Select value={filterBy} onValueChange={setFilterBy}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Filter by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Reviews</SelectItem>
              <SelectItem value="5">5 Stars</SelectItem>
              <SelectItem value="4">4 Stars</SelectItem>
              <SelectItem value="3">3 Stars</SelectItem>
              <SelectItem value="2">2 Stars</SelectItem>
              <SelectItem value="1">1 Star</SelectItem>
              <SelectItem value="verified">Verified Only</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="highest">Highest Rating</SelectItem>
              <SelectItem value="lowest">Lowest Rating</SelectItem>
              <SelectItem value="helpful">Most Helpful</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button 
          onClick={() => {
            if (!session) {
              toast({
                title: "Authentication required",
                description: "Please sign in to write a review",
                variant: "destructive"
              })
              return
            }
            setShowReviewForm(!showReviewForm)
          }}
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          Write a Review
        </Button>
      </div>

      {/* Review Form */}
      {showReviewForm && (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Your Name</label>
                <Input 
                  value={newReview.name}
                  onChange={(e) => setNewReview(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter your name"
                  disabled={!!session?.user?.name}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Your Email</label>
                <Input 
                  type="email"
                  value={newReview.email}
                  onChange={(e) => setNewReview(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter your email"
                  disabled={!!session?.user?.email}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Rating</label>
                <div className="flex gap-1 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i}
                      className={`h-6 w-6 cursor-pointer ${
                        i < newReview.rating 
                          ? 'fill-yellow-400 text-yellow-400' 
                          : 'text-gray-300'
                      }`}
                      onClick={() => setNewReview(prev => ({ ...prev, rating: i + 1 }))}
                    />
                  ))}
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Review Title</label>
                <Input 
                  value={newReview.title}
                  onChange={(e) => setNewReview(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Summarize your review"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Your Review</label>
                <Textarea 
                  value={newReview.comment}
                  onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                  placeholder="Tell us about your experience with this product"
                  rows={4}
                />
              </div>
              
              <div className="flex gap-2">
                <Button 
                  onClick={handleSubmitReview}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Review"}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowReviewForm(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reviews List */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-32"></div>
                      <div className="h-3 bg-gray-200 rounded w-24"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                  <div className="h-6 bg-gray-200 rounded w-24"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => {
            const userId = (session?.user as any)?.id
            const hasVoted = userId && review.helpfulUsers.includes(userId)
            const isOwnReview = userId === review.userId
            
            return (
              <Card key={review._id}>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-teal-100 flex items-center justify-center">
                          <User className="h-5 w-5 text-teal-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{review.userName}</span>
                            {review.verified && (
                              <Badge variant="secondary" className="text-xs">
                                Verified Purchase
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`h-4 w-4 ${
                                    i < review.rating 
                                      ? 'fill-yellow-400 text-yellow-400' 
                                      : 'text-gray-300'
                                  }`} 
                                />
                              ))}
                            </div>
                            <span>•</span>
                            <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">{review.title}</h4>
                      <p className="text-muted-foreground">{review.comment}</p>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className={`h-6 px-2 ${hasVoted ? 'text-teal-600' : ''}`}
                          onClick={() => handleHelpfulVote(review._id, true)}
                          disabled={!session || isOwnReview}
                        >
                          <ThumbsUp className="h-3 w-3 mr-1" />
                          Helpful ({review.helpful})
                        </Button>
                        {isOwnReview && (
                          <span className="text-xs text-muted-foreground">Your review</span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No reviews yet. Be the first to review this product!</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
