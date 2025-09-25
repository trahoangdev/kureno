import { NextResponse, type NextRequest } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"
import { connectToDatabase } from "@/lib/db"
import Review from "@/lib/models/review"

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase()
    const review = await Review.findById(params.id)
    
    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 })
    }

    return NextResponse.json({ review })
  } catch (error) {
    console.error("Error fetching review:", error)
    return NextResponse.json({ error: "Failed to fetch review" }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = (await getServerSession(authOptions as any)) as any
    
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const body = await req.json()
    const { rating, title, comment } = body

    await connectToDatabase()
    
    const review = await Review.findById(params.id)
    
    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 })
    }

    // Check if user owns this review
    if (review.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Update review
    const updateData: any = {}
    if (rating !== undefined) updateData.rating = rating
    if (title !== undefined) updateData.title = title
    if (comment !== undefined) updateData.comment = comment

    const updatedReview = await Review.findByIdAndUpdate(
      params.id,
      updateData,
      { new: true }
    )

    return NextResponse.json({ review: updatedReview })
  } catch (error) {
    console.error("Error updating review:", error)
    return NextResponse.json({ error: "Failed to update review" }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = (await getServerSession(authOptions as any)) as any
    
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    await connectToDatabase()
    
    const review = await Review.findById(params.id)
    
    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 })
    }

    // Check if user owns this review
    if (review.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    await Review.findByIdAndDelete(params.id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting review:", error)
    return NextResponse.json({ error: "Failed to delete review" }, { status: 500 })
  }
}
