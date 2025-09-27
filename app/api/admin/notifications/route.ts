import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import AdminNotification from "@/lib/models/admin-notification"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import mongoose from "mongoose"

// Types
interface ExtendedSession {
  user?: {
    id?: string
    role?: string
    email?: string
    name?: string
  }
}

interface AdminAccessResult {
  isAdmin: boolean
  session: ExtendedSession | null
  userId: string | null
  response: NextResponse | null
}

// Helper function to check admin access
async function checkAdminAccess(): Promise<AdminAccessResult> {
  try {
    const session = await getServerSession(authOptions as any) as ExtendedSession
    
    if (!session?.user?.id || !session?.user?.role || session.user.role !== "admin") {
      return {
        isAdmin: false,
        session: null,
        userId: null,
        response: NextResponse.json(
          { error: "Unauthorized - Admin access required" },
          { status: 401 }
        )
      }
    }
    
    return {
      isAdmin: true,
      session,
      userId: session.user.id,
      response: null
    }
  } catch (error) {
    console.error("Admin access check error:", error)
    return {
      isAdmin: false,
      session: null,
      userId: null,
      response: NextResponse.json(
        { error: "Authentication error" },
        { status: 500 }
      )
    }
  }
}

export async function GET(request: NextRequest) {
  try {
    const { isAdmin, session, userId, response } = await checkAdminAccess()
    if (!isAdmin) return response

    await connectToDatabase()

    const { searchParams } = new URL(request.url)
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"))
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20")))
    const category = searchParams.get("category")
    const priority = searchParams.get("priority")
    const type = searchParams.get("type")
    const search = searchParams.get("search")?.trim()
    const unreadOnly = searchParams.get("unreadOnly") === "true"
    const skip = (page - 1) * limit

    // Build optimized query
    const baseQuery: mongoose.FilterQuery<any> = {
      $or: [
        { userId: new mongoose.Types.ObjectId(userId!) },
        { userId: null } // Global notifications
      ]
    }

    // Add expiration filter
    const expirationFilter = {
      $or: [
        { expiresAt: null },
        { expiresAt: { $gt: new Date() } }
      ]
    }

    // Combine filters efficiently
    const filters: mongoose.FilterQuery<any>[] = [expirationFilter]
    
    if (category) filters.push({ category })
    if (priority) filters.push({ priority })
    if (type) filters.push({ type })
    if (unreadOnly) filters.push({ isRead: false })
    
    if (search && search.length > 0) {
      filters.push({
        $or: [
          { title: { $regex: search, $options: "i" } },
          { message: { $regex: search, $options: "i" } }
        ]
      })
    }

    const query: mongoose.FilterQuery<any> = {
      ...baseQuery,
      $and: filters
    }

    // Execute queries in parallel for better performance
    const [notifications, total, unreadCount] = await Promise.all([
      AdminNotification.find(query)
        .sort({ priority: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(), // Use lean() for better performance when we don't need mongoose documents
      
      AdminNotification.countDocuments(query),
      
      AdminNotification.countDocuments({
        $or: [
          { userId: new mongoose.Types.ObjectId(userId!) },
          { userId: null }
        ],
        isRead: false,
        $and: [expirationFilter]
      })
    ])

    return NextResponse.json({
      notifications,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      unreadCount,
      success: true,
    })

  } catch (error) {
    console.error("Notifications fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { isAdmin, session, userId, response } = await checkAdminAccess()
    if (!isAdmin) return response

    await connectToDatabase()

    const body = await request.json()
    const {
      title,
      message,
      type = "info",
      category,
      priority = "medium",
      userId: targetUserId,
      relatedEntity,
      actionUrl,
      expiresAt,
    } = body

    // Enhanced validation
    if (!title?.trim() || !message?.trim() || !category?.trim()) {
      return NextResponse.json(
        { error: "Title, message, and category are required and cannot be empty" },
        { status: 400 }
      )
    }

    // Validate enums
    const validTypes = ["info", "success", "warning", "error"]
    const validPriorities = ["low", "medium", "high", "urgent"]
    
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: `Invalid type. Must be one of: ${validTypes.join(", ")}` },
        { status: 400 }
      )
    }
    
    if (!validPriorities.includes(priority)) {
      return NextResponse.json(
        { error: `Invalid priority. Must be one of: ${validPriorities.join(", ")}` },
        { status: 400 }
      )
    }

    // Prepare notification data
    const notificationData: any = {
      title: title.trim(),
      message: message.trim(),
      type,
      category: category.trim(),
      priority,
      createdBy: new mongoose.Types.ObjectId(userId!)
    }

    // Add optional fields
    if (targetUserId) {
      notificationData.userId = new mongoose.Types.ObjectId(targetUserId)
    }
    
    if (relatedEntity) {
      notificationData.relatedEntity = relatedEntity
    }
    
    if (actionUrl?.trim()) {
      notificationData.actionUrl = actionUrl.trim()
    }
    
    if (expiresAt) {
      const expDate = new Date(expiresAt)
      if (expDate > new Date()) {
        notificationData.expiresAt = expDate
      }
    }

    // Create notification
    const notification = await AdminNotification.create(notificationData)

    return NextResponse.json({
      notification,
      success: true,
      message: "Notification created successfully",
    })

  } catch (error) {
    console.error("Notification creation error:", error)
    return NextResponse.json(
      { error: "Failed to create notification" },
      { status: 500 }
    )
  }
}

// Mark all notifications as read or bulk operations
export async function PATCH(request: NextRequest) {
  try {
    const { isAdmin, session, userId, response } = await checkAdminAccess()
    if (!isAdmin) return response

    await connectToDatabase()

    const { searchParams } = new URL(request.url)
    const action = searchParams.get("action")

    if (action === "markAllRead") {
      const userObjectId = new mongoose.Types.ObjectId(userId!)
      
      const result = await AdminNotification.updateMany(
        {
          $or: [
            { userId: userObjectId },
            { userId: null }
          ],
          isRead: false,
          $and: [{
            $or: [
              { expiresAt: null },
              { expiresAt: { $gt: new Date() } }
            ]
          }]
        },
        {
          $set: {
            isRead: true,
            readAt: new Date(),
            readBy: userObjectId
          },
        }
      )

      return NextResponse.json({
        success: true,
        message: `${result.modifiedCount} notifications marked as read`,
        modifiedCount: result.modifiedCount
      })
    }

    return NextResponse.json(
      { error: "Invalid action. Supported actions: markAllRead" },
      { status: 400 }
    )

  } catch (error) {
    console.error("Notification update error:", error)
    return NextResponse.json(
      { error: "Failed to update notifications" },
      { status: 500 }
    )
  }
}

// Bulk delete notifications
export async function DELETE(request: NextRequest) {
  try {
    const { isAdmin, session, userId, response } = await checkAdminAccess()
    if (!isAdmin) return response

    await connectToDatabase()

    const { searchParams } = new URL(request.url)
    const action = searchParams.get("action")
    
    if (action === "bulkDelete") {
      const body = await request.json()
      const { notificationIds } = body
      
      if (!Array.isArray(notificationIds) || notificationIds.length === 0) {
        return NextResponse.json(
          { error: "Notification IDs array is required" },
          { status: 400 }
        )
      }

      // Validate ObjectIds
      const validIds = notificationIds.filter(id => mongoose.Types.ObjectId.isValid(id))
      if (validIds.length !== notificationIds.length) {
        return NextResponse.json(
          { error: "Invalid notification IDs provided" },
          { status: 400 }
        )
      }

      const userObjectId = new mongoose.Types.ObjectId(userId!)
      
      // Only delete notifications that belong to the user or are global
      const result = await AdminNotification.deleteMany({
        _id: { $in: validIds.map(id => new mongoose.Types.ObjectId(id)) },
        $or: [
          { userId: userObjectId },
          { userId: null }
        ]
      })

      return NextResponse.json({
        success: true,
        message: `${result.deletedCount} notifications deleted`,
        deletedCount: result.deletedCount
      })
    }

    return NextResponse.json(
      { error: "Invalid action. Supported actions: bulkDelete" },
      { status: 400 }
    )

  } catch (error) {
    console.error("Notification deletion error:", error)
    return NextResponse.json(
      { error: "Failed to delete notifications" },
      { status: 500 }
    )
  }
}
