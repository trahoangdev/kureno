"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { signIn, useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, AlertCircle, Check } from "lucide-react"
import { Separator } from "@/components/ui/separator"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/"
  const registered = searchParams.get("registered") === "true"
  const adminRegistered = false
  const { status } = useSession()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(registered || adminRegistered)

  useEffect(() => {
    // If user is already authenticated, redirect to callback URL
    if (status === "authenticated") {
      router.push(callbackUrl)
    }
  }, [status, router, callbackUrl])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      })

      if (result?.error) {
        setError("Invalid email or password")
        setIsLoading(false)
        return
      }

      router.push(callbackUrl)
      router.refresh()
    } catch (error) {
      setError("Something went wrong. Please try again.")
      setIsLoading(false)
    }
  }

  if (status === "authenticated") {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Check className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">Already logged in</h2>
              <p className="text-muted-foreground">You are already logged in. Redirecting...</p>
              <Button asChild className="mt-2">
                <Link href={callbackUrl}>Continue</Link>
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
          
          <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
          <CardDescription className="text-center">Enter your email and password to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {registered && showSuccess && (
            <Alert className="mb-4 bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-300">
              <Check className="h-4 w-4" />
              <AlertDescription>Registration successful! You can now log in.</AlertDescription>
            </Alert>
          )}

          {/* Admin registration notice removed */}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <div className="grid gap-2">
            <Button variant="outline" type="button" disabled={isLoading} className="w-full">
              Continue with Google
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col">
          <div className="mt-2 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-primary hover:underline">
              Sign up
            </Link>
          </div>
          {/* Admin registration link removed */}
        </CardFooter>
      </Card>
    </div>
  )
}
