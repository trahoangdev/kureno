"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, AlertCircle, Check, ArrowLeft, Mail } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong")
      }

      setSuccess(true)
    } catch (error: any) {
      setError(error.message || "Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              {/* Logo Section */}
              <div className="flex justify-center mb-4">
                <div className="relative group">
                  {/* Logo Container */}
                  <div className="relative p-3 rounded-xl bg-gradient-to-br from-white to-gray-50 shadow-lg border border-gray-200/50 group-hover:shadow-xl group-hover:scale-105 transition-all duration-300">
                    {/* Glow Effect */}
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-400/20 to-teal-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
                    
                    {/* Logo */}
                    <img 
                      src="/logo.svg" 
                      alt="Kureno Logo" 
                      className="w-12 h-12 relative z-10"
                    />
                  </div>
                  
                  {/* Brand Text */}
                  <div className="text-center mt-3">
                    <h1 className="text-xl font-bold text-gray-900">Kureno</h1>
                    <p className="text-xs text-emerald-600 font-medium">Crafting Heritage</p>
                  </div>
                </div>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <Check className="h-6 w-6 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold">Check your email</h2>
              <p className="text-muted-foreground text-center">
                We&apos;ve sent a password reset link to <strong>{email}</strong>
              </p>
              <p className="text-sm text-muted-foreground text-center">
                Didn&apos;t receive the email? Check your spam folder or try again.
              </p>
              <div className="flex flex-col gap-2 w-full mt-4">
                <Button 
                  onClick={() => {
                    setSuccess(false)
                    setEmail("")
                  }} 
                  variant="outline" 
                  className="w-full"
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Try another email
                </Button>
                <Button asChild className="w-full">
                  <Link href="/login">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to login
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          {/* Logo Section */}
          <div className="flex justify-center mb-6">
            <div className="relative group">
              {/* Logo Container */}
              <div className="relative p-3 rounded-xl bg-gradient-to-br from-white to-gray-50 shadow-lg border border-gray-200/50 group-hover:shadow-xl group-hover:scale-105 transition-all duration-300">
                {/* Glow Effect */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-400/20 to-teal-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
                
                {/* Logo */}
                <img 
                  src="/logo.svg" 
                  alt="Kureno Logo" 
                  className="w-12 h-12 relative z-10"
                />
              </div>
              
              {/* Brand Text */}
              <div className="text-center mt-3">
                <h1 className="text-xl font-bold text-gray-900">Kureno</h1>
                <p className="text-xs text-emerald-600 font-medium">Crafting Heritage</p>
              </div>
            </div>
          </div>
          
          <CardTitle className="text-2xl font-bold text-center">Forgot Password?</CardTitle>
          <CardDescription className="text-center">
            Enter your email address and we&apos;ll send you a link to reset your password
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Send Reset Link
                </>
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button asChild variant="ghost" className="w-full">
            <Link href="/login">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to login
            </Link>
          </Button>
          <div className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-primary hover:underline">
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
