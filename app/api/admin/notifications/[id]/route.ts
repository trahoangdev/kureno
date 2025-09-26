import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import AdminNotification from "@/lib/models/admin-notification"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import mongoose from "mongoose"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || (session.user as any).role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 401 }
      )
    }

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { error: "Invalid notification ID" },
        { status: 400 }
      )
    }

    await connectToDatabase()

    const notification = await AdminNotification.findOne({
      _id: params.id,
      $or: [
        { userId: (session.user as any).id },
        { userId: null }
      ],
    }).populate("relatedEntity.id", "name title _id")

    if (!notification) {
      return NextResponse.json(
        { error: "Notification not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      notification,
      success: true,
    })

  } catch (error) {
    console.error("Notification fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch notification" },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || (session.user as any).role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 401 }
      )
    }

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { error: "Invalid notification ID" },
        { status: 400 }
      )
    }

    await connectToDatabase()

    const body = await request.json()
    const { isRead } = body

    const notification = await AdminNotification.findOne({
      _id: params.id,
      $or: [
        { userId: (session.user as any).id },
        { userId: null }
      ],
    })

    if (!notification) {
      return NextResponse.json(
        { error: "Notification not found" },
        { status: 404 }
      )
    }

    // Update read status
    if (typeof isRead === "boolean") {
      notification.isRead = isRead
      notification.readAt = isRead ? new Date() : undefined
      await notification.save()
    }

    return NextResponse.json({
      notification,
      success: true,
      message: `Notification marked as ${isRead ? 'read' : 'unread'}`,
    })

  } catch (error) {
    console.error("Notification update error:", error)
    return NextResponse.json(
      { error: "Failed to update notification" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || (session.user as any).role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 401 }
      )
    }

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { error: "Invalid notification ID" },
        { status: 400 }
      )
    }

    await connectToDatabase()

    const notification = await AdminNotification.findOneAndDelete({
      _id: params.id,
      $or: [
        { userId: (session.user as any).id },
        { userId: null }
      ],
    })

    if (!notification) {
      return NextResponse.json(
        { error: "Notification not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Notification deleted successfully",
    })

  } catch (error) {
    console.error("Notification deletion error:", error)
    return NextResponse.json(
      { error: "Failed to delete notification" },
      { status: 500 }
    )
  }
}
