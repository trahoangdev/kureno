"use client"

import { useState, useEffect, Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { signIn, useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, AlertCircle, ShieldCheck, Lock } from "lucide-react"

function AdminLoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/admin"
  const { status } = useSession()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293740_1px,transparent_1px),linear-gradient(to_bottom,#1f293740_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        
        {/* Floating Orbs */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse delay-700" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-teal-500/5 via-transparent to-emerald-500/5" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-8">
        <div className="w-full max-w-md">
          {/* Logo Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center mb-6">
              <div className="relative group">
                {/* Logo Container */}
                <div className="relative p-6 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 group-hover:from-white/15 group-hover:to-white/10 transition-all duration-500 group-hover:scale-105">
                  {/* Inner Glow */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-teal-400/20 to-emerald-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Logo */}
                  <img 
                    src="/logo.svg" 
                    alt="Kureno Logo" 
                    className="w-16 h-16 relative z-10 drop-shadow-2xl"
                  />
                  
                  {/* Outer Glow Ring */}
                  <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-teal-500/20 to-emerald-500/20 opacity-0 group-hover:opacity-100 blur-lg transition-all duration-500" />
                </div>
              </div>
            </div>

            {/* Brand Text */}
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2">
              Kureno
            </h1>
            <p className="text-teal-400 font-medium text-lg mb-6">Admin Portal</p>
            
            {/* Security Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-gray-300 mb-8">
              <ShieldCheck className="h-4 w-4 text-teal-400" />
              <span className="text-sm font-medium">Secure Access</span>
            </div>
          </div>

          {/* Login Form */}
          <div className="relative">
            {/* Form Background Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-teal-500/20 to-emerald-500/20 rounded-2xl blur-lg opacity-75" />
            
            <Card className="relative bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl overflow-hidden">
              {/* Form Header */}
              <CardHeader className="text-center pb-6 pt-8">
                <CardTitle className="text-2xl font-bold text-white mb-2">
                  Welcome Back
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Sign in to access your admin dashboard
                </CardDescription>
              </CardHeader>
              
              <CardContent className="px-8">
                {error && (
                  <Alert variant="destructive" className="mb-6 bg-red-500/10 border-red-500/20 backdrop-blur-sm">
                    <AlertCircle className="h-4 w-4 text-red-400" />
                    <AlertDescription className="text-red-300">{error}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Email Field */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-200">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Input
                        id="email"
                        type="email"
                        placeholder="admin@kureno.dev"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoComplete="username"
                        className="h-14 px-4 bg-white/5 border border-white/20 focus:border-teal-400/50 focus:ring-2 focus:ring-teal-400/20 rounded-xl text-white placeholder:text-gray-400 backdrop-blur-sm transition-all duration-200"
                      />
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-teal-500/5 to-transparent opacity-0 focus-within:opacity-100 transition-opacity duration-200 pointer-events-none" />
                    </div>
                  </div>
                  
                  {/* Password Field */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="text-sm font-medium text-gray-200">
                        Password
                      </Label>
                      <Link 
                        href="/forgot-password" 
                        className="text-sm text-teal-400 hover:text-teal-300 font-medium transition-colors duration-200"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative">
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={8}
                        autoComplete="current-password"
                        className="h-14 px-4 bg-white/5 border border-white/20 focus:border-teal-400/50 focus:ring-2 focus:ring-teal-400/20 rounded-xl text-white backdrop-blur-sm transition-all duration-200"
                      />
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-teal-500/5 to-transparent opacity-0 focus-within:opacity-100 transition-opacity duration-200 pointer-events-none" />
                    </div>
                  </div>
                  
                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    className="w-full h-14 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white font-semibold rounded-xl shadow-lg hover:shadow-teal-500/25 transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      <>
                        <Lock className="mr-3 h-5 w-5" />
                        Sign In to Dashboard
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
              
              {/* Footer */}
              <CardFooter className="px-8 pb-8 pt-6">
                <div className="w-full text-center">
                  <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-6" />
                  <p className="text-sm text-gray-400">
                    Need to access the main site?{" "}
                    <Link 
                      href="/login" 
                      className="text-teal-400 hover:text-teal-300 font-medium transition-colors duration-200 hover:underline"
                    >
                      User Login
                    </Link>
                  </p>
                  <p className="text-xs text-gray-500 mt-4">
                    © {new Date().getFullYear()} Kureno. All rights reserved.
                  </p>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    }>
      <AdminLoginForm />
    </Suspense>
  )
}


