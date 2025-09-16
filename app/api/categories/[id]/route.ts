import { NextResponse, type NextRequest } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"
import { connectToDatabase } from "@/lib/db"
import Category from "@/lib/models/category"

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  await connectToDatabase()
  const category = await Category.findById(params.id)
  if (!category) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json({ category })
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = (await getServerSession(authOptions as any)) as any
  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const body = await req.json()
  const update: any = {}
  if (body.name) update.name = body.name
  if (body.slug) update.slug = String(body.slug).toLowerCase()
  if (body.description !== undefined) update.description = body.description
  await connectToDatabase()
  const category = await Category.findByIdAndUpdate(params.id, update, { new: true })
  return NextResponse.json({ category })
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = (await getServerSession(authOptions as any)) as any
  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  await connectToDatabase()
  await Category.findByIdAndDelete(params.id)
  return NextResponse.json({ ok: true })
}


