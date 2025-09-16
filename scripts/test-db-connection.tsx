"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"

export default function TestDbConnection() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")
  const [envVarValue, setEnvVarValue] = useState("")

  const checkConnection = async () => {
    try {
      setStatus("loading")
      setMessage("")

      // First, check if we can access the environment variable
      const envResponse = await fetch("/api/check-env")
      const envData = await envResponse.json()

      if (!envData.success) {
        setStatus("error")
        setMessage(`Environment variable issue: ${envData.message}`)
        setEnvVarValue(envData.value || "Not found")
        return
      }

      setEnvVarValue(envData.value)

      // Now test the actual database connection
      const dbResponse = await fetch("/api/test-db-connection")
      const dbData = await dbResponse.json()

      if (dbData.success) {
        setStatus("success")
        setMessage("Successfully connected to MongoDB!")
      } else {
        setStatus("error")
        setMessage(`Connection failed: ${dbData.error}`)
      }
    } catch (error) {
      setStatus("error")
      setMessage(`Error: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>MongoDB Connection Test</CardTitle>
        <CardDescription>Test your MongoDB connection and environment variables</CardDescription>
      </CardHeader>
      <CardContent>
        {status === "success" && (
          <Alert className="mb-4 bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-300">
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        {status === "error" && (
          <Alert variant="destructive" className="mb-4">
            <XCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        {envVarValue && (
          <div className="mt-4">
            <h3 className="text-sm font-medium mb-1">MONGODB_URI Value:</h3>
            <div className="p-2 bg-muted rounded-md text-xs overflow-x-auto">
              <code>{envVarValue}</code>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={checkConnection} disabled={status === "loading"} className="w-full">
          {status === "loading" ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Testing Connection...
            </>
          ) : (
            "Test Connection"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
