import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import BlogPost from "@/lib/models/blog-post"

export const dynamic = 'force-dynamic'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase()
    
    // First, get the current post to find its tags
    const currentPost = await BlogPost.findById(params.id).lean()
    if (!currentPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    const { searchParams } = new URL(req.url)
    const limit = parseInt(searchParams.get("limit") || "6")

    // Find related posts based on shared tags
    let relatedPosts = []

    if (currentPost.tags && currentPost.tags.length > 0) {
      // Find posts with matching tags
      relatedPosts = await BlogPost.find({
        _id: { $ne: params.id }, // Exclude current post
        published: true,
        tags: { $in: currentPost.tags }
      })
      .populate('author', 'name')
      .sort({ publishedAt: -1, createdAt: -1 })
      .limit(limit)
      .lean()
    }

    // If we don't have enough related posts, fill with recent posts
    if (relatedPosts.length < limit) {
      const additionalPosts = await BlogPost.find({
        _id: { 
          $ne: params.id,
          $nin: relatedPosts.map(post => post._id)
        },
        published: true
      })
      .populate('author', 'name')
      .sort({ publishedAt: -1, createdAt: -1 })
      .limit(limit - relatedPosts.length)
      .lean()

      relatedPosts = [...relatedPosts, ...additionalPosts]
    }

    // Convert ObjectIds to strings
    const processedPosts = relatedPosts.map(post => ({
      ...post,
      _id: post._id.toString(),
      author: post.author ? {
        ...post.author,
        _id: post.author._id.toString()
      } : null
    }))

    return NextResponse.json({
      posts: processedPosts,
      total: processedPosts.length
    })
  } catch (error) {
    console.error("Error fetching related posts:", error)
    return NextResponse.json({ error: "Failed to fetch related posts" }, { status: 500 })
  }
}
