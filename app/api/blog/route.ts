import { NextResponse, type NextRequest } from "next/server"
import { connectToDatabase } from "@/lib/db"
import BlogPost from "@/lib/models/blog-post"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const published = searchParams.get("published")
    const tag = searchParams.get("tag")
    const skip = (page - 1) * limit

    await connectToDatabase()

    const query: any = {}

    if (published === "true") {
      query.published = true
    }

    if (tag) {
      query.tags = tag
    }

    const posts = await BlogPost.find(query)
      .populate("author", "name")
      .sort({ publishedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const total = await BlogPost.countDocuments(query)

    return NextResponse.json({
      posts,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching blog posts:", error)
    return NextResponse.json({ error: "Failed to fetch blog posts" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = (await getServerSession(authOptions as any)) as any

    if (!session || !session.user?.id || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { title, slug, content, excerpt, coverImage, tags, published, publishedAt } = body

    if (!title || !slug || !content || !excerpt || !coverImage) {
      return NextResponse.json({ 
        error: "Missing required fields",
        details: { title: !!title, slug: !!slug, content: !!content, excerpt: !!excerpt, coverImage: !!coverImage }
      }, { status: 400 })
    }

    await connectToDatabase()

    // Check if slug already exists
    const existingPost = await BlogPost.findOne({ slug })
    if (existingPost) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 409 })
    }

    const post = new BlogPost({
      title,
      slug,
      content,
      excerpt,
      author: session.user?.id,
      coverImage,
      tags: tags || [],
      published: published || false,
      publishedAt: published ? publishedAt || new Date() : null,
    })

    await post.save()

    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    console.error("Error creating blog post:", error)
    return NextResponse.json({ error: "Failed to create blog post" }, { status: 500 })
  }
}
