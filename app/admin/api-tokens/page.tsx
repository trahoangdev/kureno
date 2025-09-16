"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Copy, Key, Loader2 } from "lucide-react"

export default function ApiTokensPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [token, setToken] = useState("")
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
    expiresIn: "1h",
  })
  const { toast } = useToast()

  const expirationOptions = [
    { value: "15m", label: "15 minutes" },
    { value: "30m", label: "30 minutes" },
    { value: "1h", label: "1 hour" },
    { value: "2h", label: "2 hours" },
    { value: "6h", label: "6 hours" },
    { value: "12h", label: "12 hours" },
    { value: "1d", label: "1 day" },
    { value: "7d", label: "7 days" },
    { value: "30d", label: "30 days" },
  ]

  const handleGenerateToken = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      })

      const data = await response.json()

      if (response.ok) {
        setToken(data.token)
        toast({
          title: "Success",
          description: "JWT token generated successfully",
        })
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to generate token",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(token)
      toast({
        title: "Copied",
        description: "Token copied to clipboard",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy token",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold tracking-tight">API Tokens</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Generate JWT Token
            </CardTitle>
            <CardDescription>
              Generate a JWT token for API access. Use this token in the Authorization header as "Bearer {token}".
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleGenerateToken} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Admin Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={credentials.email}
                  onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expiresIn">Token Expiration</Label>
                <Select
                  value={credentials.expiresIn}
                  onValueChange={(value) => setCredentials({ ...credentials, expiresIn: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {expirationOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Token...
                  </>
                ) : (
                  "Generate Token"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>How to Use with Postman</CardTitle>
            <CardDescription>Follow these steps to use the JWT token with Postman for API testing.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">Step 1: Generate Token</h4>
              <p className="text-sm text-muted-foreground">
                Use the form on the left to generate a JWT token with your admin credentials.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Step 2: Configure Postman</h4>
              <p className="text-sm text-muted-foreground">
                In Postman, go to the Authorization tab and select "Bearer Token" from the Type dropdown.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Step 3: Add Token</h4>
              <p className="text-sm text-muted-foreground">Paste the generated JWT token in the Token field.</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Step 4: Make Requests</h4>
              <p className="text-sm text-muted-foreground">
                Your API requests will now include the Authorization header automatically.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {token && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Token</CardTitle>
            <CardDescription>
              Copy this token and use it in your API requests. Keep it secure and don't share it.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="relative">
                <Textarea value={token} readOnly className="min-h-[100px] font-mono text-sm" />
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute top-2 right-2 bg-transparent"
                  onClick={copyToClipboard}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Example Usage:</h4>
                <code className="text-sm">Authorization: Bearer {token.substring(0, 50)}...</code>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
