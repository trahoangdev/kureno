"use server"

import { connectToDatabase } from "@/lib/db"
import Message from "@/lib/models/message"
import { z } from "zod"
import nodemailer from "nodemailer"

// Define validation schema
const contactSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
})

export async function submitContactForm(formData: FormData) {
  try {
    // Extract form data
    const data = {
      firstName: formData.get("first-name") as string,
      lastName: formData.get("last-name") as string,
      email: formData.get("email") as string,
      subject: formData.get("subject") as string,
      message: formData.get("message") as string,
    }

    // Validate form data
    const validationResult = contactSchema.safeParse(data)
    if (!validationResult.success) {
      return {
        success: false,
        message: "Validation failed",
        errors: validationResult.error.flatten().fieldErrors,
      }
    }

    // Connect to database
    await connectToDatabase()

    // Save message to database
    const newMessage = new Message({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      subject: data.subject,
      message: data.message,
    })

    await newMessage.save()

    // Send email notification
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST,
      port: Number(process.env.EMAIL_SERVER_PORT),
      secure: Number(process.env.EMAIL_SERVER_PORT) === 465, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    })

    await transporter.sendMail({
      from: `"Kureno Contact" <${process.env.EMAIL_FROM}>`,
      to: process.env.CONTACT_EMAIL_RECIPIENT,
      subject: `New Contact Form Submission: ${data.subject}`,
      text: `
        Name: ${data.firstName} ${data.lastName}
        Email: ${data.email}
        Subject: ${data.subject}
        
        Message:
        ${data.message}
      `,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h2 style="color: #10b981; margin-top: 0;">New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${data.firstName} ${data.lastName}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Subject:</strong> ${data.subject}</p>
          <div style="margin-top: 20px;">
            <p><strong>Message:</strong></p>
            <p style="background-color: #f9f9f9; padding: 15px; border-radius: 5px;">${data.message.replace(/\n/g, "<br>")}</p>
          </div>
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 12px; color: #666;">
            <p>This email was sent from the Kureno website contact form.</p>
          </div>
        </div>
      `,
    })

    // Send confirmation email to the user
    await transporter.sendMail({
      from: `"Kureno" <${process.env.EMAIL_FROM}>`,
      to: data.email,
      subject: `Thank you for contacting Kureno`,
      text: `
        Dear ${data.firstName},
        
        Thank you for reaching out to us. We have received your message and will get back to you as soon as possible.
        
        For your reference, here's a copy of your message:
        
        Subject: ${data.subject}
        Message:
        ${data.message}
        
        Best regards,
        The Kureno Team
      `,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h2 style="color: #10b981; margin-top: 0;">Thank You for Contacting Kureno</h2>
          <p>Dear ${data.firstName},</p>
          <p>Thank you for reaching out to us. We have received your message and will get back to you as soon as possible.</p>
          <p>For your reference, here's a copy of your message:</p>
          <div style="margin-top: 20px;">
            <p><strong>Subject:</strong> ${data.subject}</p>
            <p><strong>Message:</strong></p>
            <p style="background-color: #f9f9f9; padding: 15px; border-radius: 5px;">${data.message.replace(/\n/g, "<br>")}</p>
          </div>
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
            <p>Best regards,<br>The Kureno Team</p>
          </div>
        </div>
      `,
    })

    return {
      success: true,
      message: "Your message has been sent successfully. We'll get back to you soon!",
    }
  } catch (error) {
    console.error("Error submitting contact form:", error)
    return {
      success: false,
      message: "There was an error sending your message. Please try again later.",
    }
  }
}
