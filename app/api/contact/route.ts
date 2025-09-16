import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import Message from "@/lib/models/message"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { firstName, lastName, email, subject, message } = body

    if (!firstName || !lastName || !email || !subject || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    await connectToDatabase()

    const newMessage = new Message({
      firstName,
      lastName,
      email,
      subject,
      message,
    })

    await newMessage.save()

    // Here you would typically send an email notification
    // using a service like Nodemailer, SendGrid, etc.

    return NextResponse.json({ message: "Message sent successfully" }, { status: 201 })
  } catch (error) {
    console.error("Error sending message:", error)
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 })
  }
}
