import { NextResponse, type NextRequest } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"
import { connectToDatabase } from "@/lib/db"
import BlogPost from "@/lib/models/blog-post"

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase()
    const post = await BlogPost.findById(params.id).populate("author", "name")
    if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json({ post })
  } catch (e) {
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = (await getServerSession(authOptions as any)) as any
  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    const body = await req.json()
    const { published, title, slug, excerpt, content, coverImage, tags } = body as any
    await connectToDatabase()
    const update: any = {}
    if (typeof published === "boolean") {
      update.published = published
      update.publishedAt = published ? new Date() : null
    }
    if (title) update.title = title
    if (slug) update.slug = slug
    if (excerpt) update.excerpt = excerpt
    if (content) update.content = content
    if (coverImage) update.coverImage = coverImage
    if (Array.isArray(tags)) update.tags = tags
    const post = await BlogPost.findByIdAndUpdate(params.id, update, { new: true })
    return NextResponse.json({ post })
  } catch (e) {
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}


