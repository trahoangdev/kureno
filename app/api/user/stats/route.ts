import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { connectToDatabase } from "@/lib/db"
import Order from "@/lib/models/order"
import Wishlist from "@/models/wishlist"
import Review from "@/lib/models/review"

// Helper function to check authentication
async function checkAuth() {
  try {
    // @ts-ignore - NextAuth session type issue
    const session: any = await getServerSession(authOptions as any)
    
    // Check if session exists and has the expected structure
    if (!session || !session.user || !session.user.id) {
      return { authenticated: false, userId: null }
    }

    return { authenticated: true, userId: session.user.id }
  } catch (error) {
    console.error("Authentication check failed:", error)
    return { authenticated: false, userId: null }
  }
}

// GET /api/user/stats - Get user statistics
export async function GET() {
  try {
    const { authenticated, userId } = await checkAuth()
    
    if (!authenticated || !userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    await connectToDatabase()

    // Fetch user statistics concurrently
    const [
      totalOrders,
      wishlistCount,
      userReviews,
      completedOrders
    ] = await Promise.all([
      // Total orders count
      Order.countDocuments({ user: userId }),
      
      // Wishlist items count
      Wishlist.countDocuments({ userId: userId }),
      
      // User reviews with rating calculation
      Review.find({ userId: userId }).lean(),
      
      // Completed orders for additional stats
      Order.find({ 
        user: userId, 
        status: { $in: ['delivered', 'completed'] } 
      }).lean()
    ])

    // Calculate average rating from user reviews
    const averageRating = userReviews.length > 0 
      ? userReviews.reduce((sum, review) => sum + (review.rating || 0), 0) / userReviews.length
      : 0

    // Calculate total spent
    const totalSpent = completedOrders.reduce((sum, order) => sum + (order.total || 0), 0)

    // Calculate additional stats
    const stats = {
      totalOrders,
      wishlistCount,
      reviewsCount: userReviews.length,
      averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
      totalSpent,
      completedOrders: completedOrders.length,
      memberSince: null, // Will be calculated from user creation date
      lastOrderDate: completedOrders.length > 0 
        ? completedOrders[completedOrders.length - 1].createdAt 
        : null
    }

    return NextResponse.json({
      success: true,
      stats
    })

  } catch (error) {
    console.error("Error fetching user stats:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
