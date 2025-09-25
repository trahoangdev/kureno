import { NextResponse, type NextRequest } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../../auth/[...nextauth]/route"
import { connectToDatabase } from "@/lib/db"
import Review from "@/lib/models/review"

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = (await getServerSession(authOptions as any)) as any
    
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const body = await req.json()
    const { helpful } = body // true for helpful, false for not helpful

    if (typeof helpful !== 'boolean') {
      return NextResponse.json({ error: "Helpful must be a boolean" }, { status: 400 })
    }

    await connectToDatabase()
    
    const review = await Review.findById(params.id)
    
    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 })
    }

    const userId = (session.user as any).id

    // Check if user already voted
    const hasVoted = review.helpfulUsers.includes(userId)

    if (hasVoted) {
      // Remove existing vote
      review.helpfulUsers = review.helpfulUsers.filter((id: string) => id !== userId)
      review.helpful = Math.max(0, review.helpful - 1)
    } else {
      // Add new vote
      review.helpfulUsers.push(userId)
      if (helpful) {
        review.helpful += 1
      }
    }

    await review.save()

    return NextResponse.json({ 
      review,
      message: hasVoted ? "Vote removed" : "Vote added"
    })
  } catch (error) {
    console.error("Error updating helpful vote:", error)
    return NextResponse.json({ error: "Failed to update vote" }, { status: 500 })
  }
}
