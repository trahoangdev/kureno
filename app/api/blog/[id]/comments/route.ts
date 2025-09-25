import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import Comment from "@/lib/models/comment"

export const dynamic = 'force-dynamic'

// Get comments for a blog post
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase()

    // Get all comments for this post
    const allComments = await Comment.find({ postId: params.id })
      .populate('author', 'name email')
      .sort({ createdAt: -1 })
      .lean()

    // Organize comments with replies
    const commentMap = new Map()
    const rootComments: any[] = []

    // First, create all comment objects
    allComments.forEach((comment: any) => {
      const commentObj = {
        ...comment,
        _id: comment._id.toString(),
        author: comment.author ? {
          ...comment.author,
          _id: comment.author._id.toString()
        } : null,
        replies: []
      }
      commentMap.set(comment._id.toString(), commentObj)
    })

    // Then organize into tree structure
    allComments.forEach((comment: any) => {
      const commentObj = commentMap.get(comment._id.toString())
      
      if (comment.parentId) {
        const parent = commentMap.get(comment.parentId.toString())
        if (parent) {
          parent.replies.push(commentObj)
        }
      } else {
        rootComments.push(commentObj)
      }
    })

    return NextResponse.json({
      comments: rootComments,
      total: allComments.length
    })
  } catch (error) {
    console.error("Error fetching comments:", error)
    console.error("Error stack:", error instanceof Error ? error.stack : 'No stack trace')
    return NextResponse.json({ 
      error: "Failed to fetch comments",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}

// Create a new comment
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = (await getServerSession(authOptions as any)) as any
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { content, parentId } = await req.json()
    
    if (!content?.trim()) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 })
    }

    await connectToDatabase()

    const comment = new Comment({
      content: content.trim(),
      author: session.user.id,
      postId: params.id,
      parentId: parentId || null
    })

    await comment.save()
    
    // Populate author info for response
    await comment.populate('author', 'name email')

    const commentResponse = {
      ...comment.toObject(),
      _id: comment._id.toString(),
      author: comment.author ? {
        ...comment.author.toObject(),
        _id: comment.author._id.toString()
      } : null,
      replies: []
    }

    return NextResponse.json({
      success: true,
      comment: commentResponse
    })
  } catch (error) {
    console.error("Error creating comment:", error)
    return NextResponse.json({ 
      error: "Failed to create comment", 
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}
