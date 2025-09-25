import { NextResponse, type NextRequest } from "next/server"
import { connectToDatabase } from "@/lib/db"
import User from "@/lib/models/user"
import Order from "@/lib/models/order"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"

export async function DELETE(req: NextRequest) {
  try {
    const session = (await getServerSession(authOptions as any)) as any

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()

    // Delete user's orders (or anonymize them)
    await Order.updateMany({ user: session.user?.id }, { $set: { user: null } })

    // Delete user
    await User.findByIdAndDelete(session.user?.id)

    return NextResponse.json({ message: "Account deleted successfully" })
  } catch (error) {
    console.error("Error deleting account:", error)
    return NextResponse.json({ error: "Failed to delete account" }, { status: 500 })
  }
}
