import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { connectToDatabase } from "@/lib/db"
import Wishlist from "@/models/wishlist"
import mongoose from "mongoose"

// Helper function to check authentication
async function checkAuth() {
  try {
    // @ts-ignore - NextAuth session type issue
    const session: any = await getServerSession(authOptions as any)
    
    // Check if session exists and has the expected structure
    // @ts-ignore - NextAuth session type issue
    if (!session || !session.user || !session.user.id) {
      return { authenticated: false, userId: null }
    }

    // @ts-ignore - NextAuth session type issue
    return { authenticated: true, userId: session.user.id }
  } catch (error) {
    console.error("Authentication check failed:", error)
    return { authenticated: false, userId: null }
  }
}

// DELETE /api/user/wishlist/[id] - Remove specific item from wishlist
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { authenticated, userId } = await checkAuth()
    
    if (!authenticated || !userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { id } = params

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid wishlist item ID" },
        { status: 400 }
      )
    }

    await connectToDatabase()

    // Find and delete the wishlist item (ensuring it belongs to the user)
    const deletedItem = await Wishlist.findOneAndDelete({
      _id: id,
      userId: userId
    })

    if (!deletedItem) {
      return NextResponse.json(
        { error: "Wishlist item not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Item removed from wishlist"
    })

  } catch (error) {
    console.error("Error removing from wishlist:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
