import { NextResponse, type NextRequest } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"
import { connectToDatabase } from "@/lib/db"
import Review from "@/lib/models/review"
import Product from "@/lib/models/product"

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const session = (await getServerSession(authOptions as any)) as any
    
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const sortBy = searchParams.get('sortBy') || 'newest'
    const search = searchParams.get('search')
    const status = searchParams.get('status')
    const rating = searchParams.get('rating')

    await connectToDatabase()

    // Build query
    let query: any = {}
    
    // Search filter
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { comment: { $regex: search, $options: 'i' } },
        { userName: { $regex: search, $options: 'i' } },
        { userEmail: { $regex: search, $options: 'i' } }
      ]
    }

    // Status filter
    if (status === 'verified') {
      query.verified = true
    } else if (status === 'unverified') {
      query.verified = false
    }

    // Rating filter
    if (rating && !isNaN(parseInt(rating))) {
      query.rating = parseInt(rating)
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

    // Get product names for reviews
    const productIds = [...new Set(reviews.map(review => review.productId))]
    const products = await Product.find({ _id: { $in: productIds } })
      .select('_id name')
      .lean()
    
    const productMap = products.reduce((acc, product) => {
      acc[product._id.toString()] = product.name
      return acc
    }, {} as Record<string, string>)

    // Add product names to reviews
    const reviewsWithProductNames = reviews.map(review => ({
      ...review,
      productName: productMap[review.productId] || 'Unknown Product'
    }))

    // Get total count for pagination
    const totalReviews = await Review.countDocuments(query)

    // Calculate statistics
    const stats = await Review.aggregate([
      {
        $group: {
          _id: null,
          totalReviews: { $sum: 1 },
          averageRating: { $avg: '$rating' },
          verifiedReviews: {
            $sum: { $cond: ['$verified', 1, 0] }
          },
          helpfulReviews: {
            $sum: { $cond: [{ $gt: ['$helpful', 0] }, 1, 0] }
          }
        }
      }
    ])

    const ratingDistribution = await Review.aggregate([
      {
        $group: {
          _id: '$rating',
          count: { $sum: 1 }
        }
      }
    ])

    const ratingDist = [5, 4, 3, 2, 1].map(rating => {
      const stat = ratingDistribution.find(s => s._id === rating)
      return {
        rating,
        count: stat ? stat.count : 0,
        percentage: stats.length > 0 ? ((stat ? stat.count : 0) / stats[0].totalReviews) * 100 : 0
      }
    })

    const statistics = stats.length > 0 ? {
      totalReviews: stats[0].totalReviews,
      averageRating: Math.round(stats[0].averageRating * 10) / 10,
      verifiedReviews: stats[0].verifiedReviews,
      helpfulReviews: stats[0].helpfulReviews,
      recentReviews: await Review.countDocuments({
        createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
      }),
      ratingDistribution: ratingDist
    } : {
      totalReviews: 0,
      averageRating: 0,
      verifiedReviews: 0,
      helpfulReviews: 0,
      recentReviews: 0,
      ratingDistribution: ratingDist
    }

    return NextResponse.json({
      reviews: reviewsWithProductNames,
      pagination: {
        page,
        limit,
        total: totalReviews,
        pages: Math.ceil(totalReviews / limit)
      },
      statistics
    })
  } catch (error) {
    console.error("Error fetching admin reviews:", error)
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 })
  }
}
