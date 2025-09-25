import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import Comment from "@/lib/models/comment"
import BlogPost from "@/lib/models/blog-post"

export const dynamic = 'force-dynamic'

// Get all comments for admin
export async function GET(req: NextRequest) {
  try {
    const session = (await getServerSession(authOptions as any)) as any
    if (!session?.user?.role || session.user.role !== 'admin') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""
    const status = searchParams.get("status") || "all" // all, pending, approved
    const sortBy = searchParams.get("sortBy") || "createdAt"
    const sortOrder = searchParams.get("sortOrder") || "desc"

    await connectToDatabase()

    // Build filter query
    const filter: any = {}
    
    if (search) {
      filter.$or = [
        { content: { $regex: search, $options: 'i' } }
      ]
    }

    // Get total count
    const total = await Comment.countDocuments(filter)

    // Get comments with pagination
    const comments = await Comment.find(filter)
      .populate('author', 'name email')
      .populate('postId', 'title slug')
      .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean()

    // Process comments to include post info and format data
    const processedComments = comments.map((comment: any) => ({
      ...comment,
      _id: comment._id.toString(),
      author: comment.author ? {
        ...comment.author,
        _id: comment.author._id.toString()
      } : null,
      post: comment.postId ? {
        ...comment.postId,
        _id: comment.postId._id.toString()
      } : null
    }))

    // Get statistics
    const stats = {
      total,
      totalLikes: await Comment.aggregate([
        { $group: { _id: null, total: { $sum: "$likes" } } }
      ]).then(result => result[0]?.total || 0),
      totalReplies: await Comment.countDocuments({ parentId: { $ne: null } }),
      recentComments: await Comment.countDocuments({
        createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
      })
    }

    return NextResponse.json({
      comments: processedComments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      statistics: stats
    })
  } catch (error) {
    console.error("Error fetching admin comments:", error)
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 })
  }
}

// Bulk operations on comments
export async function POST(req: NextRequest) {
  try {
    const session = (await getServerSession(authOptions as any)) as any
    if (!session?.user?.role || session.user.role !== 'admin') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { action, commentIds } = await req.json()

    if (!action || !commentIds || !Array.isArray(commentIds)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 })
    }

    await connectToDatabase()

    let result
    switch (action) {
      case 'delete':
        // Also delete all replies
        const commentsToDelete = await Comment.find({
          $or: [
            { _id: { $in: commentIds } },
            { parentId: { $in: commentIds } }
          ]
        })
        
        result = await Comment.deleteMany({
          _id: { $in: commentsToDelete.map(c => c._id) }
        })
        break

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: `Successfully ${action}d ${result.deletedCount || commentIds.length} comment(s)`,
      affected: result.deletedCount || commentIds.length
    })
  } catch (error) {
    console.error("Error in bulk comment operation:", error)
    return NextResponse.json({ error: "Failed to perform bulk operation" }, { status: 500 })
  }
}
