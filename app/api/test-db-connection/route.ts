import { NextResponse } from "next/server"
import mongoose from "mongoose"

export async function GET() {
  try {
    const mongoUri = process.env.MONGODB_URI

    if (!mongoUri) {
      return NextResponse.json({
        success: false,
        error: "MONGODB_URI environment variable is not defined",
      })
    }

    // Try to connect with a timeout
    const connectPromise = mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000, // 5 seconds timeout
    })

    await connectPromise

    // If we get here, connection was successful
    // Close the connection to clean up
    await mongoose.disconnect()

    return NextResponse.json({
      success: true,
      message: "Successfully connected to MongoDB",
    })
  } catch (error) {
    // Close connection if it was opened
    try {
      await mongoose.disconnect()
    } catch (e) {
      // Ignore errors during disconnect
    }

    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    })
  }
}
