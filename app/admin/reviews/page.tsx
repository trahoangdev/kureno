"use client"

import React, { useState, useEffect, useMemo } from "react"
import RefreshButton from "../components/refresh-button"
import ExportImportDialog from "../components/export-import-dialog"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { useAdminReviews } from "@/hooks/use-reviews"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog"
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from "@/components/ui/alert-dialog"
import { 
  Search, 
  Filter, 
  Download, 
  RefreshCw, 
  Eye, 
  Edit, 
  Trash2, 
  Star, 
  ThumbsUp, 
  MessageSquare, 
  User, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  TrendingUp,
  BarChart3,
  Users,
  MessageCircle,
  ThumbsDown,
  MoreHorizontal,
  Plus,
  Settings,
  Archive,
  Flag
} from "lucide-react"

interface ReviewItem {
  _id: string
  productId: string
  productName?: string
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
  totalReviews: number
  averageRating: number
  ratingDistribution: Array<{
    rating: number
    count: number
    percentage: number
  }>
  verifiedReviews: number
  helpfulReviews: number
  recentReviews: number
}

export default function ReviewsPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  
  const [reviews, setReviews] = useState<ReviewItem[]>([])
  const [stats, setStats] = useState<ReviewStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [ratingFilter, setRatingFilter] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [viewMode, setViewMode] = useState<"table" | "grid">("table")
  const [selectedReviews, setSelectedReviews] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [selectedReview, setSelectedReview] = useState<ReviewItem | null>(null)
  const [showReviewDialog, setShowReviewDialog] = useState(false)

  // Check authentication
  useEffect(() => {
    if (!session) {
      router.push("/admin/login")
      return
    }
    if ((session.user as any)?.role !== "admin") {
      router.push("/")
      return
    }
  }, [session, router])

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setIsLoading(true)
        const params = new URLSearchParams({
          page: "1",
          limit: "50",
          sortBy,
          ...(searchQuery && { search: searchQuery }),
          ...(statusFilter !== "all" && { status: statusFilter }),
          ...(ratingFilter !== "all" && { rating: ratingFilter })
        })
        
        const response = await fetch(`/api/admin/reviews?${params}`)
        const data = await response.json()
        
        if (response.ok) {
          setReviews(data.reviews || [])
          setStats(data.statistics || null)
        } else {
          console.error('Failed to fetch reviews:', data.error)
          toast({
            title: "Error",
            description: "Failed to fetch reviews",
            variant: "destructive"
          })
        }
      } catch (error) {
        console.error('Error fetching reviews:', error)
        toast({
          title: "Error",
          description: "Failed to fetch reviews",
          variant: "destructive"
        })
      } finally {
        setIsLoading(false)
      }
    }

    if ((session?.user as any)?.role === "admin") {
      fetchReviews()
    }
  }, [session, searchQuery, statusFilter, ratingFilter, sortBy, toast])

  // Filtered reviews
  const filteredReviews = useMemo(() => {
    let filtered = reviews

    if (searchQuery) {
      filtered = filtered.filter(review => 
        review.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.userEmail.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (statusFilter !== "all") {
      if (statusFilter === "verified") {
        filtered = filtered.filter(review => review.verified)
      } else if (statusFilter === "unverified") {
        filtered = filtered.filter(review => !review.verified)
      }
    }

    if (ratingFilter !== "all") {
      const rating = parseInt(ratingFilter)
      filtered = filtered.filter(review => review.rating === rating)
    }

    return filtered
  }, [reviews, searchQuery, statusFilter, ratingFilter])

  // Handle review actions
  const handleDeleteReview = async (reviewId: string) => {
    try {
      const response = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setReviews(prev => prev.filter(review => review._id !== reviewId))
        toast({
          title: "Success",
          description: "Review deleted successfully"
        })
      } else {
        const data = await response.json()
        toast({
          title: "Error",
          description: data.error || "Failed to delete review",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error deleting review:', error)
      toast({
        title: "Error",
        description: "Failed to delete review",
        variant: "destructive"
      })
    }
  }

  const handleToggleVerification = async (reviewId: string, verified: boolean) => {
    try {
      const response = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ verified: !verified })
      })

      if (response.ok) {
        setReviews(prev => prev.map(review => 
          review._id === reviewId 
            ? { ...review, verified: !verified }
            : review
        ))
        toast({
          title: "Success",
          description: `Review ${!verified ? 'verified' : 'unverified'} successfully`
        })
      } else {
        const data = await response.json()
        toast({
          title: "Error",
          description: data.error || "Failed to update review",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error updating review:', error)
      toast({
        title: "Error",
        description: "Failed to update review",
        variant: "destructive"
      })
    }
  }

  const handleBulkAction = async (action: string) => {
    if (selectedReviews.length === 0) return

    try {
      const response = await fetch('/api/admin/reviews/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action,
          reviewIds: selectedReviews
        })
      })

      if (response.ok) {
        setSelectedReviews([])
        toast({
          title: "Success",
          description: `Bulk ${action} completed successfully`
        })
        // Refresh reviews
        window.location.reload()
      } else {
        const data = await response.json()
        toast({
          title: "Error",
          description: data.error || `Failed to ${action} reviews`,
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error(`Error ${action} reviews:`, error)
      toast({
        title: "Error",
        description: `Failed to ${action} reviews`,
        variant: "destructive"
      })
    }
  }

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return "text-green-600"
    if (rating >= 3) return "text-yellow-600"
    return "text-red-600"
  }

  const getStatusColor = (verified: boolean) => {
    return verified ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
  }

  if (!session || (session.user as any)?.role !== "admin") {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Review Management</h1>
              <p className="text-muted-foreground mt-2">
                Manage and moderate customer reviews across all products
              </p>
            </div>
            <div className="flex items-center gap-3">
              <ExportImportDialog 
                trigger={
                  <Button variant="outline" size="sm" className="rounded-full">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                }
              />
              <RefreshButton variant="outline" size="sm" className="rounded-full" />
              <Button variant="outline" size="sm" className="rounded-full">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8">
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Reviews</p>
                    <p className="text-2xl font-bold">{stats.totalReviews}</p>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <MessageCircle className="h-4 w-4 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Average Rating</p>
                    <p className="text-2xl font-bold">{stats.averageRating.toFixed(1)}</p>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
                    <Star className="h-4 w-4 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Verified Reviews</p>
                    <p className="text-2xl font-bold">{stats.verifiedReviews}</p>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Helpful Reviews</p>
                    <p className="text-2xl font-bold">{stats.helpfulReviews}</p>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                    <ThumbsUp className="h-4 w-4 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search reviews by title, comment, user name, or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="verified">Verified</SelectItem>
                    <SelectItem value="unverified">Unverified</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={ratingFilter} onValueChange={setRatingFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Ratings</SelectItem>
                    <SelectItem value="5">5 Stars</SelectItem>
                    <SelectItem value="4">4 Stars</SelectItem>
                    <SelectItem value="3">3 Stars</SelectItem>
                    <SelectItem value="2">2 Stars</SelectItem>
                    <SelectItem value="1">1 Star</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="oldest">Oldest</SelectItem>
                    <SelectItem value="highest">Highest Rating</SelectItem>
                    <SelectItem value="lowest">Lowest Rating</SelectItem>
                    <SelectItem value="helpful">Most Helpful</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="mr-2 h-4 w-4" />
                  Filters
                </Button>
              </div>
            </div>

            {/* Bulk Actions */}
            {selectedReviews.length > 0 && (
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {selectedReviews.length} review(s) selected
                  </span>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleBulkAction('verify')}
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Verify
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleBulkAction('unverify')}
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Unverify
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleBulkAction('delete')}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Reviews Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Reviews ({filteredReviews.length})</CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setViewMode(viewMode === "table" ? "grid" : "table")}
                >
                  {viewMode === "table" ? "Grid View" : "Table View"}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-16 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            ) : filteredReviews.length > 0 ? (
              <div className="space-y-4">
                {filteredReviews.map((review) => (
                  <div key={review._id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-teal-100 flex items-center justify-center">
                          <User className="h-5 w-5 text-teal-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{review.userName}</span>
                            <Badge className={getStatusColor(review.verified)}>
                              {review.verified ? "Verified" : "Unverified"}
                            </Badge>
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
                      
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedReview(review)
                            setShowReviewDialog(true)
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleToggleVerification(review._id, review.verified)}
                        >
                          {review.verified ? (
                            <XCircle className="h-4 w-4" />
                          ) : (
                            <CheckCircle className="h-4 w-4" />
                          )}
                        </Button>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Review</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this review? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteReview(review._id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="font-medium mb-2">{review.title}</h4>
                      <p className="text-muted-foreground">{review.comment}</p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <ThumbsUp className="h-4 w-4" />
                          {review.helpful} helpful
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="h-4 w-4" />
                          {review.userEmail}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedReviews.includes(review._id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedReviews(prev => [...prev, review._id])
                            } else {
                              setSelectedReviews(prev => prev.filter(id => id !== review._id))
                            }
                          }}
                          className="rounded"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No reviews found</h3>
                <p className="text-muted-foreground">
                  {searchQuery || statusFilter !== "all" || ratingFilter !== "all"
                    ? "Try adjusting your filters to see more results."
                    : "No reviews have been submitted yet."}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Review Detail Dialog */}
      <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Review Details</DialogTitle>
          </DialogHeader>
          {selectedReview && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-teal-100 flex items-center justify-center">
                  <User className="h-6 w-6 text-teal-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{selectedReview.userName}</span>
                    <Badge className={getStatusColor(selectedReview.verified)}>
                      {selectedReview.verified ? "Verified" : "Unverified"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-4 w-4 ${
                            i < selectedReview.rating 
                              ? 'fill-yellow-400 text-yellow-400' 
                              : 'text-gray-300'
                          }`} 
                        />
                      ))}
                    </div>
                    <span>•</span>
                    <span>{new Date(selectedReview.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">{selectedReview.title}</h4>
                <p className="text-muted-foreground">{selectedReview.comment}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Email:</span>
                  <p className="text-muted-foreground">{selectedReview.userEmail}</p>
                </div>
                <div>
                  <span className="font-medium">Helpful Votes:</span>
                  <p className="text-muted-foreground">{selectedReview.helpful}</p>
                </div>
                <div>
                  <span className="font-medium">Created:</span>
                  <p className="text-muted-foreground">
                    {new Date(selectedReview.createdAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <span className="font-medium">Updated:</span>
                  <p className="text-muted-foreground">
                    {new Date(selectedReview.updatedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
