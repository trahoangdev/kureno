import { NextResponse, type NextRequest } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { connectToDatabase } from "@/lib/db"
import User from "@/lib/models/user"
import bcrypt from "bcryptjs"

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = (await getServerSession(authOptions as any)) as any
  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }
  await connectToDatabase()
  const user = await User.findById(params.id, "-password")
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json({ user })
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = (await getServerSession(authOptions as any)) as any
  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }
  await connectToDatabase()
  const body = await req.json()
  const update: any = { ...body }
  if (body.password) {
    const salt = await bcrypt.genSalt(10)
    update.password = await bcrypt.hash(body.password, salt)
  } else {
    delete update.password
  }
  const user = await User.findByIdAndUpdate(params.id, update, { new: true, select: "-password" })
  return NextResponse.json({ user })
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = (await getServerSession(authOptions as any)) as any
  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }
  await connectToDatabase()
  await User.findByIdAndDelete(params.id)
  return NextResponse.json({ ok: true })
}

