import { NextResponse, type NextRequest } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"
import { connectToDatabase } from "@/lib/db"
import Category from "@/lib/models/category"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get("q") || ""
  await connectToDatabase()
  const filter: any = q ? { name: { $regex: q, $options: "i" } } : {}
  const categories = await Category.find(filter).sort({ name: 1 })
  return NextResponse.json({ categories })
}

export async function POST(req: NextRequest) {
  const session = (await getServerSession(authOptions as any)) as any
  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const body = await req.json()
  const { name, slug, description } = body
  if (!name || !slug) return NextResponse.json({ error: "name and slug are required" }, { status: 400 })
  await connectToDatabase()
  const cat = await Category.create({ name, slug: slug.toLowerCase(), description })
  return NextResponse.json({ category: cat }, { status: 201 })
}


