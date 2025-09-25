import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import BlogPost from "@/lib/models/blog-post"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../../auth/[...nextauth]/route"

export const dynamic = 'force-dynamic'

// Get blog interactions (likes, bookmarks, views)
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase()
    
    const post = await BlogPost.findById(params.id).lean()
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    const session = (await getServerSession(authOptions as any)) as any
    const userId = session?.user?.id

    // Get user's interaction status
    let userInteractions = {
      liked: false,
      bookmarked: false
    }

    if (userId) {
      userInteractions.liked = post.likedBy?.includes(userId) || false
      userInteractions.bookmarked = post.bookmarkedBy?.includes(userId) || false
    }

    return NextResponse.json({
      interactions: {
        likes: post.likes || 0,
        bookmarks: post.bookmarks || 0,
        views: post.views || 0,
        userInteractions
      }
    })
  } catch (error) {
    console.error("Error fetching blog interactions:", error)
    return NextResponse.json({ error: "Failed to fetch interactions" }, { status: 500 })
  }
}

// Update blog interactions
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = (await getServerSession(authOptions as any)) as any
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { action } = await req.json() // 'like', 'unlike', 'bookmark', 'unbookmark', 'view'
    const userId = session.user.id

    await connectToDatabase()
    
    const post = await BlogPost.findById(params.id)
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    // Initialize arrays if they don't exist
    if (!post.likedBy) post.likedBy = []
    if (!post.bookmarkedBy) post.bookmarkedBy = []

    switch (action) {
      case 'like':
        if (!post.likedBy.includes(userId)) {
          post.likedBy.push(userId)
          post.likes = (post.likes || 0) + 1
        }
        break
      
      case 'unlike':
        const likeIndex = post.likedBy.indexOf(userId)
        if (likeIndex > -1) {
          post.likedBy.splice(likeIndex, 1)
          post.likes = Math.max((post.likes || 0) - 1, 0)
        }
        break
      
      case 'bookmark':
        if (!post.bookmarkedBy.includes(userId)) {
          post.bookmarkedBy.push(userId)
          post.bookmarks = (post.bookmarks || 0) + 1
        }
        break
      
      case 'unbookmark':
        const bookmarkIndex = post.bookmarkedBy.indexOf(userId)
        if (bookmarkIndex > -1) {
          post.bookmarkedBy.splice(bookmarkIndex, 1)
          post.bookmarks = Math.max((post.bookmarks || 0) - 1, 0)
        }
        break
      
      case 'view':
        post.views = (post.views || 0) + 1
        break
      
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }

    await post.save()

    // Return updated interactions
    const userInteractions = {
      liked: post.likedBy.includes(userId),
      bookmarked: post.bookmarkedBy.includes(userId)
    }

    return NextResponse.json({
      success: true,
      interactions: {
        likes: post.likes || 0,
        bookmarks: post.bookmarks || 0,
        views: post.views || 0,
        userInteractions
      }
    })
  } catch (error) {
    console.error("Error updating blog interactions:", error)
    return NextResponse.json({ error: "Failed to update interactions" }, { status: 500 })
  }
}
