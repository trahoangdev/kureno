import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { connectToDatabase } from "@/lib/db"
import Wishlist from "@/models/wishlist"
import Product from "@/lib/models/product"

// Helper function to check authentication
async function checkAuth() {
  try {
    // @ts-ignore - NextAuth session type issue
    const session: any = await getServerSession(authOptions as any)
    
    // Check if session exists and has the expected structure
    // @ts-expect-error - NextAuth session type issue
    if (!session || !session.user || !session.user.id) {
      return { authenticated: false, userId: null }
    }

    // @ts-expect-error - NextAuth session type issue
    return { authenticated: true, userId: session.user.id }
  } catch (error) {
    console.error("Authentication check failed:", error)
    return { authenticated: false, userId: null }
  }
}

// GET /api/user/wishlist - Get user's wishlist
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

    const wishlistItems = await Wishlist.find({ userId: userId })
      .populate({
        path: 'productId',
        populate: {
          path: 'category',
          select: 'name'
        }
      })
      .sort({ addedAt: -1 })
      .lean()

    return NextResponse.json({
      success: true,
      wishlist: wishlistItems
    })

  } catch (error) {
    console.error("Error fetching wishlist:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// POST /api/user/wishlist - Add item to wishlist
export async function POST(request: Request) {
  try {
    const { authenticated, userId } = await checkAuth()
    
    if (!authenticated || !userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { productId } = await request.json()

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      )
    }

    await connectToDatabase()

    // Check if product exists
    const product = await Product.findById(productId)
    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      )
    }

    // Check if item already in wishlist
    const existingItem = await Wishlist.findOne({
      userId: userId,
      productId
    })

    if (existingItem) {
      return NextResponse.json(
        { error: "Item already in wishlist" },
        { status: 409 }
      )
    }

    // Add to wishlist
    const wishlistItem = new Wishlist({
      userId: userId,
      productId,
      addedAt: new Date()
    })

    await wishlistItem.save()

    // Populate the item for response
    const populatedItem = await Wishlist.findById(wishlistItem._id)
      .populate({
        path: 'productId',
        populate: {
          path: 'category',
          select: 'name'
        }
      })
      .lean()

    return NextResponse.json({
      success: true,
      message: "Item added to wishlist",
      item: populatedItem
    })

  } catch (error) {
    console.error("Error adding to wishlist:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// DELETE /api/user/wishlist - Clear entire wishlist
export async function DELETE() {
  try {
    const { authenticated, userId } = await checkAuth()
    
    if (!authenticated || !userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    await connectToDatabase()

    const result = await Wishlist.deleteMany({ userId: userId })

    return NextResponse.json({
      success: true,
      message: "Wishlist cleared",
      deletedCount: result.deletedCount
    })

  } catch (error) {
    console.error("Error clearing wishlist:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
