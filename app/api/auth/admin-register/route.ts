import { NextResponse, type NextRequest } from "next/server"
import bcrypt from "bcryptjs"
import { connectToDatabase } from "@/lib/db"
import User from "@/lib/models/user"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, password, adminSecretKey } = body

    // Validate required fields
    if (!name || !email || !password || !adminSecretKey) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    // Verify admin secret key
    if (adminSecretKey !== process.env.ADMIN_SECRET_KEY) {
      return NextResponse.json({ error: "Invalid admin secret key" }, { status: 403 })
    }

    // Connect to database
    await connectToDatabase()

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create admin user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: "admin",
    })

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user.toObject()

    return NextResponse.json(
      {
        message: "Admin account created successfully",
        user: userWithoutPassword,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Admin registration error:", error)
    return NextResponse.json({ error: "Failed to create admin account" }, { status: 500 })
  }
}
