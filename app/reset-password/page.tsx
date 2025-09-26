"use client"

import type React from "react"

import { useState, useEffect, Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, AlertCircle, Check, ArrowLeft, Shield } from "lucide-react"

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isValidatingToken, setIsValidatingToken] = useState(true)
  const [isTokenValid, setIsTokenValid] = useState(false)

  useEffect(() => {
    if (!token) {
      setError("Invalid or missing reset token")
      setIsValidatingToken(false)
      return
    }

    // Validate token on page load
    const validateToken = async () => {
      try {
        const response = await fetch("/api/auth/validate-reset-token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        })

        if (response.ok) {
          setIsTokenValid(true)
        } else {
          const data = await response.json()
          setError(data.error || "Invalid or expired reset token")
        }
      } catch (error) {
        setError("Failed to validate reset token")
      } finally {
        setIsValidatingToken(false)
      }
    }

    validateToken()
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          password,
        }),
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

  if (isValidatingToken) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">Validating reset token...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!isTokenValid) {
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
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-400/20 to-orange-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
                    
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

              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold">Invalid Reset Link</h2>
              <p className="text-muted-foreground text-center">
                {error || "This password reset link is invalid or has expired."}
              </p>
              <div className="flex flex-col gap-2 w-full mt-4">
                <Button asChild className="w-full">
                  <Link href="/forgot-password">
                    Request New Reset Link
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
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
              <h2 className="text-2xl font-bold">Password Updated!</h2>
              <p className="text-muted-foreground text-center">
                Your password has been successfully updated. You can now log in with your new password.
              </p>
              <Button asChild className="w-full mt-4">
                <Link href="/login">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Go to login
                </Link>
              </Button>
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
          
          <CardTitle className="text-2xl font-bold text-center">Set New Password</CardTitle>
          <CardDescription className="text-center">
            Enter your new password below
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
              <Label htmlFor="password">New Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                autoComplete="new-password"
              />
              <p className="text-xs text-muted-foreground">Password must be at least 8 characters long</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...
                </>
              ) : (
                <>
                  <Shield className="mr-2 h-4 w-4" />
                  Update Password
                </>
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <Button asChild variant="ghost" className="w-full">
            <Link href="/login">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to login
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  )
}
