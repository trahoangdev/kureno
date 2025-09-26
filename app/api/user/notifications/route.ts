import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { connectToDatabase } from "@/lib/db"
import mongoose from "mongoose"

// User Notification Schema
const userNotificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    enum: ["order", "wishlist", "product", "system", "promotion"],
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  read: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
  },
})

userNotificationSchema.index({ userId: 1, createdAt: -1 })
userNotificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

const UserNotification = mongoose.models.UserNotification || mongoose.model("UserNotification", userNotificationSchema)

// Helper function to check authentication
async function checkAuth() {
  try {
    // @ts-ignore - NextAuth session type issue
    const session: any = await getServerSession(authOptions as any)
    
    if (!session || !session.user || !session.user.id) {
      return { authenticated: false, userId: null }
    }

    return { authenticated: true, userId: session.user.id }
  } catch (error) {
    console.error("Authentication check failed:", error)
    return { authenticated: false, userId: null }
  }
}

// GET /api/user/notifications - Get user notifications
export async function GET(request: Request) {
  try {
    const { authenticated, userId } = await checkAuth()
    
    if (!authenticated || !userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const limit = Math.min(Math.max(Number.parseInt(searchParams.get("limit") || "10"), 1), 50)
    const page = Math.max(Number.parseInt(searchParams.get("page") || "1"), 1)
    const unreadOnly = searchParams.get("unreadOnly") === "true"
    const skip = (page - 1) * limit

    await connectToDatabase()

    const query: any = { 
      userId: new mongoose.Types.ObjectId(userId),
      expiresAt: { $gt: new Date() }
    }

    if (unreadOnly) {
      query.read = false
    }

    const [notifications, total, unreadCount] = await Promise.all([
      UserNotification.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      UserNotification.countDocuments(query),
      UserNotification.countDocuments({ 
        userId: new mongoose.Types.ObjectId(userId), 
        read: false,
        expiresAt: { $gt: new Date() }
      })
    ])

    return NextResponse.json({
      success: true,
      notifications,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
      unreadCount
    })

  } catch (error) {
    console.error("Error fetching user notifications:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// POST /api/user/notifications - Create user notification (system use)
export async function POST(request: Request) {
  try {
    const { authenticated, userId } = await checkAuth()
    
    if (!authenticated || !userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { type, title, message, data } = body

    if (!type || !title || !message) {
      return NextResponse.json(
        { error: "Type, title, and message are required" },
        { status: 400 }
      )
    }

    if (!["order", "wishlist", "product", "system", "promotion"].includes(type)) {
      return NextResponse.json(
        { error: "Invalid notification type" },
        { status: 400 }
      )
    }

    await connectToDatabase()

    const notification = new UserNotification({
      userId: new mongoose.Types.ObjectId(userId),
      type,
      title: title.trim(),
      message: message.trim(),
      data: data || {},
    })

    await notification.save()

    return NextResponse.json({
      success: true,
      notification
    }, { status: 201 })

  } catch (error) {
    console.error("Error creating user notification:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// PATCH /api/user/notifications - Mark notifications as read
export async function PATCH(request: Request) {
  try {
    const { authenticated, userId } = await checkAuth()
    
    if (!authenticated || !userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { action, notificationIds } = body

    await connectToDatabase()

    if (action === "markAllRead") {
      const result = await UserNotification.updateMany(
        { 
          userId: new mongoose.Types.ObjectId(userId),
          read: false,
          expiresAt: { $gt: new Date() }
        },
        { $set: { read: true } }
      )

      return NextResponse.json({
        success: true,
        message: `Marked ${result.modifiedCount} notifications as read`
      })
    }

    if (action === "markRead" && notificationIds && Array.isArray(notificationIds)) {
      const validIds = notificationIds.filter(id => mongoose.Types.ObjectId.isValid(id))
      
      if (validIds.length === 0) {
        return NextResponse.json(
          { error: "No valid notification IDs provided" },
          { status: 400 }
        )
      }

      const result = await UserNotification.updateMany(
        { 
          _id: { $in: validIds.map(id => new mongoose.Types.ObjectId(id)) },
          userId: new mongoose.Types.ObjectId(userId)
        },
        { $set: { read: true } }
      )

      return NextResponse.json({
        success: true,
        message: `Marked ${result.modifiedCount} notifications as read`
      })
    }

    return NextResponse.json(
      { error: "Invalid action or missing parameters" },
      { status: 400 }
    )

  } catch (error) {
    console.error("Error updating user notifications:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// DELETE /api/user/notifications - Delete notifications
export async function DELETE(request: Request) {
  try {
    const { authenticated, userId } = await checkAuth()
    
    if (!authenticated || !userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const notificationId = searchParams.get("id")

    await connectToDatabase()

    if (notificationId) {
      if (!mongoose.Types.ObjectId.isValid(notificationId)) {
        return NextResponse.json(
          { error: "Invalid notification ID" },
          { status: 400 }
        )
      }

      const result = await UserNotification.deleteOne({
        _id: new mongoose.Types.ObjectId(notificationId),
        userId: new mongoose.Types.ObjectId(userId)
      })

      return NextResponse.json({
        success: true,
        message: result.deletedCount > 0 ? "Notification deleted" : "Notification not found"
      })
    }

    // Delete all read notifications older than 7 days
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    const result = await UserNotification.deleteMany({
      userId: new mongoose.Types.ObjectId(userId),
      read: true,
      createdAt: { $lt: sevenDaysAgo }
    })

    return NextResponse.json({
      success: true,
      message: `Deleted ${result.deletedCount} old notifications`
    })

  } catch (error) {
    console.error("Error deleting user notifications:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
