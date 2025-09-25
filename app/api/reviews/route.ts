import { NextResponse, type NextRequest } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"
import { connectToDatabase } from "@/lib/db"
import Review from "@/lib/models/review"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const productId = searchParams.get('productId')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const sortBy = searchParams.get('sortBy') || 'newest'
    const filterBy = searchParams.get('filterBy') || 'all'
    const statsOnly = searchParams.get('statsOnly') === 'true'

    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 })
    }

    await connectToDatabase()

    // Build query
    let query: any = { productId }
    
    // Apply rating filter
    if (filterBy !== 'all' && !isNaN(parseInt(filterBy))) {
      query.rating = parseInt(filterBy)
    }

    // Build sort
    let sort: any = {}
    switch (sortBy) {
      case 'newest':
        sort.createdAt = -1
        break
      case 'oldest':
        sort.createdAt = 1
        break
      case 'highest':
        sort.rating = -1
        break
      case 'lowest':
        sort.rating = 1
        break
      case 'helpful':
        sort.helpful = -1
        break
      default:
        sort.createdAt = -1
    }

    // Get reviews with pagination
    const skip = (page - 1) * limit
    const reviews = await Review.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean()

    // Get total count for pagination
    const totalReviews = await Review.countDocuments(query)

    // Calculate rating statistics
    const ratingStats = await Review.aggregate([
      { $match: { productId } },
      {
        $group: {
          _id: '$rating',
          count: { $sum: 1 }
        }
      }
    ])

    const ratingDistribution = [5, 4, 3, 2, 1].map(rating => {
      const stat = ratingStats.find(s => s._id === rating)
      return {
        rating,
        count: stat ? stat.count : 0,
        percentage: totalReviews > 0 ? ((stat ? stat.count : 0) / totalReviews) * 100 : 0
      }
    })

    // Calculate average rating
    const avgRatingResult = await Review.aggregate([
      { $match: { productId } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 }
        }
      }
    ])

    const averageRating = avgRatingResult.length > 0 ? avgRatingResult[0].averageRating : 0
    const totalCount = avgRatingResult.length > 0 ? avgRatingResult[0].totalReviews : 0

    const statistics = {
      averageRating: Math.round(averageRating * 10) / 10,
      totalReviews: totalCount,
      ratingDistribution
    }

    // If only stats are requested, return early
    if (statsOnly) {
      return NextResponse.json({
        statistics,
        pagination: {
          page,
          limit,
          total: totalReviews,
          pages: Math.ceil(totalReviews / limit)
        }
      })
    }

    return NextResponse.json({
      reviews,
      pagination: {
        page,
        limit,
        total: totalReviews,
        pages: Math.ceil(totalReviews / limit)
      },
      statistics
    })
  } catch (error) {
    console.error("Error fetching reviews:", error)
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = (await getServerSession(authOptions as any)) as any
    
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const body = await req.json()
    const { productId, rating, title, comment, userName, userEmail } = body

    // Validation
    if (!productId || !rating || !title || !comment || !userName || !userEmail) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 })
    }

    await connectToDatabase()

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({ 
      productId, 
      userId: session.user.id 
    })

    if (existingReview) {
      return NextResponse.json({ error: "You have already reviewed this product" }, { status: 400 })
    }

    // Create new review
    const review = new Review({
      productId,
      userId: session.user.id,
      userName,
      userEmail,
      rating,
      title,
      comment,
      verified: true // For now, mark all reviews as verified
    })

    await review.save()

    return NextResponse.json({ review }, { status: 201 })
  } catch (error) {
    console.error("Error creating review:", error)
    return NextResponse.json({ error: "Failed to create review" }, { status: 500 })
  }
}
