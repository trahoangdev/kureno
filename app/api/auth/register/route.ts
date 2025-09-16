import { NextResponse, type NextRequest } from "next/server"
import { connectToDatabase } from "@/lib/db"
import User from "@/lib/models/user"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, password } = body

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    await connectToDatabase()

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 })
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
      role: "user", // Default role
    })

    await user.save()

    // Don't return the password
    const userWithoutPassword = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    }

    return NextResponse.json(userWithoutPassword, { status: 201 })
  } catch (error) {
    console.error("Error registering user:", error)
    return NextResponse.json({ error: "Failed to register user" }, { status: 500 })
  }
}
