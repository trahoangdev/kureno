import { NextResponse } from "next/server"

export async function GET() {
  try {
    const mongoUri = process.env.MONGODB_URI

    if (!mongoUri) {
      return NextResponse.json({
        success: false,
        message: "MONGODB_URI environment variable is not defined",
        value: null,
      })
    }

    // Mask the password in the URI for security
    const maskedUri = mongoUri.replace(/:([^@]+)@/, ":********@")

    return NextResponse.json({
      success: true,
      message: "MONGODB_URI environment variable is defined",
      value: maskedUri,
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
      value: null,
    })
  }
}
