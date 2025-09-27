import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export const dynamic = 'force-dynamic'

// Import models
import Product from "@/lib/models/product"
import Category from "@/lib/models/category"
import User from "@/lib/models/user"
import BlogPost from "@/lib/models/blog-post"
import Order from "@/lib/models/order"
import AdminNotification from "@/lib/models/admin-notification"
import Comment from "@/lib/models/comment"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || (session.user as any).role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 401 }
      )
    }

    await connectToDatabase()

    const { searchParams } = new URL(request.url)
    const entity = searchParams.get("entity") || "all"
    const format = searchParams.get("format") || "json"
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    // Build date filter if provided
    const dateFilter: any = {}
    if (startDate) {
      dateFilter.$gte = new Date(startDate)
    }
    if (endDate) {
      dateFilter.$lte = new Date(endDate)
    }

    const hasDateFilter = Object.keys(dateFilter).length > 0

    let exportData: any = {}

    // Helper function to apply date filter
    const getQuery = () => hasDateFilter ? { createdAt: dateFilter } : {}

    switch (entity) {
      case "products":
        exportData.products = await Product.find(getQuery())
          .populate("category", "name")
          .lean()
        break

      case "categories":
        exportData.categories = await Category.find(getQuery()).lean()
        break

      case "users":
        exportData.users = await User.find(getQuery())
          .select("-password -resetPasswordToken -resetPasswordExpires")
          .lean()
        break

      case "blog":
        exportData.blogPosts = await BlogPost.find(getQuery())
          .populate("author", "name email")
          .lean()
        break

      case "orders":
        exportData.orders = await Order.find(getQuery())
          .populate("user", "name email")
          .populate("items.product", "name price")
          .lean()
        break

      case "comments":
        exportData.comments = await Comment.find(getQuery())
          .populate("author", "name email")
          .populate("postId", "title")
          .lean()
        break

      case "notifications":
        exportData.notifications = await AdminNotification.find(getQuery()).lean()
        break

      case "all":
      default:
        // Export all entities
        const [products, categories, users, blogPosts, orders, comments, notifications] = await Promise.all([
          Product.find(getQuery()).populate("category", "name").lean(),
          Category.find(getQuery()).lean(),
          User.find(getQuery()).select("-password -resetPasswordToken -resetPasswordExpires").lean(),
          BlogPost.find(getQuery()).populate("author", "name email").lean(),
          Order.find(getQuery()).populate("user", "name email").populate("items.product", "name price").lean(),
          Comment.find(getQuery()).populate("author", "name email").populate("postId", "title").lean(),
          AdminNotification.find(getQuery()).lean(),
        ])

        exportData = {
          products,
          categories,
          users,
          blogPosts,
          orders,
          comments,
          notifications,
          exportInfo: {
            exportedAt: new Date().toISOString(),
            exportedBy: session.user.email,
            entity,
            format,
            dateRange: hasDateFilter ? { startDate, endDate } : null,
            version: "1.0",
          },
        }
        break
    }

    // Generate filename
    const timestamp = new Date().toISOString().split('T')[0]
    const filename = `kureno-${entity}-export-${timestamp}`

    if (format === "csv" && entity !== "all") {
      // Convert to CSV for single entity
      const data = exportData[Object.keys(exportData)[0]]
      if (!data || data.length === 0) {
        return NextResponse.json(
          { error: "No data found for export" },
          { status: 404 }
        )
      }

      const csv = convertToCSV(data)
      
      return new NextResponse(csv, {
        status: 200,
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="${filename}.csv"`,
        },
      })
    } else {
      // Return JSON
      const jsonData = JSON.stringify(exportData, null, 2)
      
      return new NextResponse(jsonData, {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Content-Disposition": `attachment; filename="${filename}.json"`,
        },
      })
    }

  } catch (error) {
    console.error("Export error:", error)
    return NextResponse.json(
      { error: "Failed to export data" },
      { status: 500 }
    )
  }
}

// Helper function to convert JSON to CSV
function convertToCSV(data: any[]): string {
  if (!data || data.length === 0) return ""

  // Get all unique keys from all objects
  const allKeys = new Set<string>()
  data.forEach(item => {
    Object.keys(flattenObject(item)).forEach(key => allKeys.add(key))
  })

  const headers = Array.from(allKeys)
  const csvRows = [headers.join(",")]

  data.forEach(item => {
    const flattened = flattenObject(item)
    const row = headers.map(header => {
      const value = flattened[header]
      if (value === null || value === undefined) return ""
      
      // Escape and quote values that contain commas, quotes, or newlines
      const stringValue = String(value)
      if (stringValue.includes(",") || stringValue.includes('"') || stringValue.includes("\n")) {
        return `"${stringValue.replace(/"/g, '""')}"`
      }
      return stringValue
    })
    csvRows.push(row.join(","))
  })

  return csvRows.join("\n")
}

// Helper function to flatten nested objects
function flattenObject(obj: any, prefix = ""): any {
  const flattened: any = {}
  
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const newKey = prefix ? `${prefix}.${key}` : key
      
      if (obj[key] === null || obj[key] === undefined) {
        flattened[newKey] = ""
      } else if (typeof obj[key] === "object" && !Array.isArray(obj[key]) && !(obj[key] instanceof Date)) {
        // Recursively flatten nested objects
        Object.assign(flattened, flattenObject(obj[key], newKey))
      } else if (Array.isArray(obj[key])) {
        // Convert arrays to string representation
        flattened[newKey] = JSON.stringify(obj[key])
      } else {
        flattened[newKey] = obj[key]
      }
    }
  }
  
  return flattened
}
