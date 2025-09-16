import { NextResponse, type NextRequest } from "next/server"
import { sign } from "jsonwebtoken"
import bcrypt from "bcryptjs"
import { connectDB } from "@/lib/db"
import User from "@/lib/models/user"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, password, expiresIn = "1h" } = body

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    await connectDB()

    // Find user and include password for verification
    const user = await User.findOne({ email: email.toLowerCase() }).select("+password")

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Check if user is active
    if (!user.isActive) {
      return NextResponse.json({ error: "Account is inactive" }, { status: 401 })
    }

    // Check if user has admin or manager role
    if (user.role !== "admin" && user.role !== "manager") {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    // Update last login
    user.lastLogin = new Date()
    await user.save()

    // Create a JWT token
    const token = sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
        permissions: user.permissions,
      },
      process.env.NEXTAUTH_SECRET || "fallback-secret",
      { expiresIn },
    )

    return NextResponse.json({
      token,
      expiresIn,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Error generating token:", error)
    return NextResponse.json({ error: "Failed to generate token" }, { status: 500 })
  }
}
