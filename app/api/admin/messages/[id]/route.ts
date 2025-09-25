import { NextResponse, type NextRequest } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../../auth/[...nextauth]/route"
import { connectToDatabase } from "@/lib/db"
import Message from "@/lib/models/message"

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = (await getServerSession(authOptions as any)) as any
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()
    const message = await Message.findById(params.id)
    if (!message) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 })
    }
    return NextResponse.json({ message })
  } catch (error) {
    console.error("Error fetching message:", error)
    return NextResponse.json({ error: "Failed to fetch message" }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = (await getServerSession(authOptions as any)) as any
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { read, priority, subject, message: messageContent } = body

    await connectToDatabase()

    const update: any = {}
    if (typeof read === "boolean") update.read = read
    if (priority) update.priority = priority
    if (subject) update.subject = subject
    if (messageContent) update.message = messageContent

    const updatedMessage = await Message.findByIdAndUpdate(params.id, update, { new: true })

    if (!updatedMessage) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 })
    }

    return NextResponse.json({ message: updatedMessage })
  } catch (error) {
    console.error("Error updating message:", error)
    return NextResponse.json({ error: "Failed to update message" }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = (await getServerSession(authOptions as any)) as any
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()

    const message = await Message.findById(params.id)
    if (!message) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 })
    }

    await Message.findByIdAndDelete(params.id)

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("Error deleting message:", error)
    return NextResponse.json({ error: "Failed to delete message" }, { status: 500 })
  }
}
