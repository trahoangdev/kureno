import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import Comment from "@/lib/models/comment"

export const dynamic = 'force-dynamic'

// Get single comment
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = (await getServerSession(authOptions as any)) as any
    if (!session?.user?.role || session.user.role !== 'admin') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()

    const comment = await Comment.findById(params.id)
      .populate('author', 'name email')
      .populate('postId', 'title slug')
      .lean()

    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 })
    }

    // Get replies if this is a parent comment
    const replies = await Comment.find({ parentId: params.id })
      .populate('author', 'name email')
      .sort({ createdAt: 1 })
      .lean()

    const processedComment = {
      ...comment,
      _id: comment._id.toString(),
      author: comment.author ? {
        ...comment.author,
        _id: comment.author._id.toString()
      } : null,
      post: comment.postId ? {
        ...comment.postId,
        _id: comment.postId._id.toString()
      } : null,
      replies: replies.map((reply: any) => ({
        ...reply,
        _id: reply._id.toString(),
        author: reply.author ? {
          ...reply.author,
          _id: reply.author._id.toString()
        } : null
      }))
    }

    return NextResponse.json({ comment: processedComment })
  } catch (error) {
    console.error("Error fetching admin comment:", error)
    return NextResponse.json({ error: "Failed to fetch comment" }, { status: 500 })
  }
}

// Update comment
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = (await getServerSession(authOptions as any)) as any
    if (!session?.user?.role || session.user.role !== 'admin') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { content } = await req.json()

    if (!content?.trim()) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 })
    }

    await connectToDatabase()

    const comment = await Comment.findByIdAndUpdate(
      params.id,
      { 
        content: content.trim(),
        updatedAt: new Date()
      },
      { new: true }
    ).populate('author', 'name email')

    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      comment: {
        ...comment.toObject(),
        _id: comment._id.toString(),
        author: {
          ...comment.author.toObject(),
          _id: comment.author._id.toString()
        }
      }
    })
  } catch (error) {
    console.error("Error updating admin comment:", error)
    return NextResponse.json({ error: "Failed to update comment" }, { status: 500 })
  }
}

// Delete comment
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = (await getServerSession(authOptions as any)) as any
    if (!session?.user?.role || session.user.role !== 'admin') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()

    // Also delete all replies
    const repliesToDelete = await Comment.find({ parentId: params.id })
    await Comment.deleteMany({ parentId: params.id })
    
    const deletedComment = await Comment.findByIdAndDelete(params.id)
    
    if (!deletedComment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: `Comment and ${repliesToDelete.length} replies deleted successfully`
    })
  } catch (error) {
    console.error("Error deleting admin comment:", error)
    return NextResponse.json({ error: "Failed to delete comment" }, { status: 500 })
  }
}
