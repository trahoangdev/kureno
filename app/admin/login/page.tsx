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
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
      <div className="relative hidden bg-gradient-to-br from-teal-600 to-emerald-700 md:block">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.15),transparent_40%),radial-gradient(ellipse_at_bottom_right,rgba(255,255,255,0.15),transparent_40%)]" />
        <div className="relative flex h-full flex-col justify-between p-10 text-white">
          <div className="flex items-center gap-3">
            {/* Logo Container */}
            <div className="relative group">
              <div className="relative p-2 rounded-lg bg-white/10 backdrop-blur-sm group-hover:bg-white/20 transition-all duration-300">
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-white/10 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <img 
                  src="/logo.svg" 
                  alt="Kureno Logo" 
                  className="w-8 h-8 relative z-10 filter brightness-0 invert"
                />
              </div>
            </div>
            
            {/* Brand Text */}
            <div className="text-2xl font-bold">
              <span className="text-white">Kureno</span>
              <span className="opacity-90 ml-2">Admin</span>
            </div>
          </div>
          <div className="max-w-md">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/15">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h1 className="mb-3 text-3xl font-semibold leading-tight">Secure access to your admin dashboard</h1>
            <p className="opacity-90">Manage products, orders, customers and site settings with enterprise‑grade controls.</p>
          </div>
          <div className="text-sm opacity-80">© {new Date().getFullYear()} Kureno. All rights reserved.</div>
        </div>
      </div>

      <div className="flex items-center justify-center px-6 py-12">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="space-y-1">
            {/* Logo Section */}
            <div className="flex justify-center mb-6">
              <div className="relative group">
                {/* Logo Container */}
                <div className="relative p-3 rounded-xl bg-gradient-to-br from-white to-gray-50 shadow-lg border border-gray-200/50 group-hover:shadow-xl group-hover:scale-105 transition-all duration-300">
                  {/* Glow Effect */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-teal-400/20 to-emerald-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
                  
                  {/* Logo */}
                  <img 
                    src="/logo.svg" 
                    alt="Kureno Logo" 
                    className="w-12 h-12 relative z-10"
                  />
                </div>
                
                {/* Brand Text */}
                <div className="text-center mt-3">
                  <h1 className="text-xl font-bold text-gray-900">Kureno Admin</h1>
                  <p className="text-xs text-teal-600 font-medium">Admin Portal</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-2 text-muted-foreground mb-2">
              <Lock className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wide">Secure Access</span>
            </div>
            <CardTitle className="text-2xl font-bold text-center">Admin Login</CardTitle>
            <CardDescription className="text-center">Sign in with an administrator account</CardDescription>
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
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@kureno.dev"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="username"
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
                  minLength={8}
                  autoComplete="current-password"
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing in
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col">
            <div className="mt-2 text-center text-sm">
              Back to site? <Link href="/login" className="text-primary hover:underline">User Login</Link>
            </div>
          </CardFooter>
        </Card>
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


