import { NextResponse, type NextRequest } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"
import { connectToDatabase } from "@/lib/db"
import Message from "@/lib/models/message"

export async function GET(req: NextRequest) {
  const session = (await getServerSession(authOptions as any)) as any
  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const { searchParams } = new URL(req.url)
  const q = searchParams.get("q") || ""
  const status = searchParams.get("status") // read|unread
  const page = Number.parseInt(searchParams.get("page") || "1")
  const limit = Number.parseInt(searchParams.get("limit") || "10")
  const skip = (page - 1) * limit

  await connectToDatabase()
  const filter: any = {}
  if (q) {
    filter.$or = [
      { firstName: { $regex: q, $options: "i" } },
      { lastName: { $regex: q, $options: "i" } },
      { email: { $regex: q, $options: "i" } },
      { subject: { $regex: q, $options: "i" } },
    ]
  }
  if (status === "read") filter.read = true
  if (status === "unread") filter.read = false

  const [messages, total] = await Promise.all([
    Message.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Message.countDocuments(filter),
  ])
  return NextResponse.json({
    messages,
    pagination: { total, page, limit, pages: Math.ceil(total / limit) },
  })
}

export async function PATCH(req: NextRequest) {
  const session = (await getServerSession(authOptions as any)) as any
  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const body = await req.json()
  const { id, read } = body
  await connectToDatabase()
  const updated = await Message.findByIdAndUpdate(id, { read }, { new: true })
  return NextResponse.json({ message: updated })
}

export async function DELETE(req: NextRequest) {
  const session = (await getServerSession(authOptions as any)) as any
  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const { searchParams } = new URL(req.url)
  const idsParam = searchParams.get("ids")
  const id = searchParams.get("id")
  await connectToDatabase()
  if (idsParam) {
    const ids = idsParam.split(",").filter(Boolean)
    if (!ids.length) return NextResponse.json({ error: "Missing ids" }, { status: 400 })
    await Message.deleteMany({ _id: { $in: ids } })
  } else if (id) {
    await Message.findByIdAndDelete(id)
  } else {
    return NextResponse.json({ error: "Missing id(s)" }, { status: 400 })
  }
  return NextResponse.json({ ok: true })
}


