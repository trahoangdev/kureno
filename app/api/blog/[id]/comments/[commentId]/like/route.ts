import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import Comment from "@/lib/models/comment"

export const dynamic = 'force-dynamic'

// Toggle like on a comment
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string, commentId: string } }
) {
  try {
    const session = (await getServerSession(authOptions as any)) as any
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id

    await connectToDatabase()
    
    const comment = await Comment.findById(params.commentId)
    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 })
    }

    // Initialize arrays if they don't exist
    if (!comment.likedBy) comment.likedBy = []

    const isLiked = comment.likedBy.includes(userId)

    if (isLiked) {
      // Unlike
      comment.likedBy = comment.likedBy.filter((id: string) => id.toString() !== userId)
      comment.likes = Math.max((comment.likes || 0) - 1, 0)
    } else {
      // Like
      comment.likedBy.push(userId)
      comment.likes = (comment.likes || 0) + 1
    }

    comment.updatedAt = new Date()
    await comment.save()

    return NextResponse.json({
      success: true,
      liked: !isLiked,
      likes: comment.likes
    })
  } catch (error) {
    console.error("Error toggling comment like:", error)
    return NextResponse.json({ error: "Failed to update like" }, { status: 500 })
  }
}
