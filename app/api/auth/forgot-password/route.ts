import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import User from "@/lib/models/user"
import crypto from "crypto"
import nodemailer from "nodemailer"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      )
    }

    await connectToDatabase()

    // Check if user exists
    const user = await User.findOne({ email: email.toLowerCase() })
    
    // For security, always return success even if user doesn't exist
    // This prevents email enumeration attacks
    if (!user) {
      return NextResponse.json(
        { message: "If an account with that email exists, we've sent a password reset link." },
        { status: 200 }
      )
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hour from now

    // Save reset token to user
    user.resetPasswordToken = resetToken
    user.resetPasswordExpires = resetTokenExpiry
    await user.save()

    // Create reset URL
    const resetUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`

    // Email configuration (you might want to use environment variables for these)
    const transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    // Email content
    const mailOptions = {
      from: process.env.FROM_EMAIL || "noreply@kureno.com",
      to: email,
      subject: "Reset Your Kureno Password",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Your Password</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <img src="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/logo.svg" alt="Kureno Logo" style="width: 60px; height: 60px;">
            <h1 style="color: #059669; margin: 10px 0 5px 0;">Kureno</h1>
            <p style="color: #6b7280; margin: 0; font-size: 14px;">Crafting Heritage, Creating Future</p>
          </div>
          
          <div style="background: #f9fafb; padding: 30px; border-radius: 12px; margin-bottom: 20px;">
            <h2 style="color: #1f2937; margin-top: 0;">Reset Your Password</h2>
            <p style="color: #4b5563; margin-bottom: 20px;">
              We received a request to reset your password for your Kureno account. Click the button below to create a new password:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" 
                 style="background: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">
                Reset Password
              </a>
            </div>
            
            <p style="color: #6b7280; font-size: 14px; margin-bottom: 0;">
              If you didn't request this password reset, you can safely ignore this email. Your password will remain unchanged.
            </p>
          </div>
          
          <div style="text-align: center; color: #9ca3af; font-size: 12px;">
            <p>This link will expire in 1 hour for security reasons.</p>
            <p>If you're having trouble clicking the button, copy and paste this URL into your browser:</p>
            <p style="word-break: break-all;">${resetUrl}</p>
          </div>
        </body>
        </html>
      `,
    }

    // Send email (only if SMTP is configured)
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      try {
        await transporter.sendMail(mailOptions)
      } catch (emailError) {
        console.error("Email sending failed:", emailError)
        // Don't expose email errors to the client
        return NextResponse.json(
          { error: "Failed to send reset email. Please try again later." },
          { status: 500 }
        )
      }
    } else {
      // For development - log the reset URL
      console.log("🔗 Password Reset URL (SMTP not configured):", resetUrl)
    }

    return NextResponse.json(
      { message: "If an account with that email exists, we've sent a password reset link." },
      { status: 200 }
    )

  } catch (error) {
    console.error("Forgot password error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
