import { NextResponse, type NextRequest } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../../auth/[...nextauth]/route"
import { connectToDatabase } from "@/lib/db"
import Review from "@/lib/models/review"

export async function POST(req: NextRequest) {
  try {
    const session = (await getServerSession(authOptions as any)) as any
    
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { action, reviewIds } = body

    if (!action || !reviewIds || !Array.isArray(reviewIds) || reviewIds.length === 0) {
      return NextResponse.json({ error: "Invalid request data" }, { status: 400 })
    }

    await connectToDatabase()

    let result
    switch (action) {
      case 'verify':
        result = await Review.updateMany(
          { _id: { $in: reviewIds } },
          { $set: { verified: true } }
        )
        break
      
      case 'unverify':
        result = await Review.updateMany(
          { _id: { $in: reviewIds } },
          { $set: { verified: false } }
        )
        break
      
      case 'delete':
        result = await Review.deleteMany({ _id: { $in: reviewIds } })
        break
      
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }

    const count = (result as any).modifiedCount || (result as any).deletedCount || 0
    return NextResponse.json({ 
      success: true, 
      modifiedCount: count,
      message: `Successfully ${action}ed ${count} review(s)`
    })
  } catch (error) {
    console.error("Error performing bulk action:", error)
    return NextResponse.json({ error: "Failed to perform bulk action" }, { status: 500 })
  }
}
