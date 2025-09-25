import { NextResponse, type NextRequest } from "next/server"
import { connectToDatabase } from "@/lib/db"
import User from "@/lib/models/user"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"

export async function PUT(req: NextRequest) {
  try {
    const session = (await getServerSession(authOptions as any)) as any

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { emailNotifications, marketingEmails } = body

    await connectToDatabase()

    const user = await User.findById(session.user?.id)

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Update user preferences
    // Note: We need to add these fields to the user model
    user.preferences = {
      emailNotifications: emailNotifications ?? true,
      marketingEmails: marketingEmails ?? false,
    }

    await user.save()

    return NextResponse.json({ message: "Preferences updated successfully" })
  } catch (error) {
    console.error("Error updating preferences:", error)
    return NextResponse.json({ error: "Failed to update preferences" }, { status: 500 })
  }
}
