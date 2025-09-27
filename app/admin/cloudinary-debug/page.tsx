"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { CheckCircle, XCircle, AlertTriangle, Loader2, Settings, Cloud } from 'lucide-react'

interface CloudinaryConfig {
  configured: boolean
  config: {
    cloud_name: boolean
    api_key: boolean
    api_secret: string
    public_cloud_name: string
    folders: Record<string, string>
    upload_presets: Record<string, string>
  }
  message: string
}

export default function CloudinaryDebugPage() {
  const [config, setConfig] = useState<CloudinaryConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const checkConfig = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/cloudinary/config')
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to check configuration')
      }
      
      setConfig(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkConfig()
  }, [])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cloudinary Debug</h1>
          <p className="text-muted-foreground">
            Check Cloudinary configuration and troubleshoot upload issues
          </p>
        </div>
        <Button onClick={checkConfig} disabled={loading}>
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Settings className="h-4 w-4 mr-2" />
          )}
          Refresh Config
        </Button>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Loading State */}
      {loading && (
        <Card>
          <CardContent className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin mr-3" />
            <span>Checking Cloudinary configuration...</span>
          </CardContent>
        </Card>
      )}

      {/* Configuration Status */}
      {config && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cloud className="h-5 w-5" />
                Configuration Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                {config.configured ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
                <span className="font-medium">
                  {config.configured ? 'Properly Configured' : 'Configuration Incomplete'}
                </span>
                <Badge variant={config.configured ? 'default' : 'destructive'}>
                  {config.configured ? 'Ready' : 'Error'}
                </Badge>
              </div>
              
              <p className="text-sm text-muted-foreground">
                {config.message}
              </p>

              {!config.configured && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Please copy the values from <code>cloud.env</code> to your <code>.env.local</code> file:
                    <br />
                    <code>CLOUDINARY_CLOUD_NAME=dvnm6el2s</code><br />
                    <code>CLOUDINARY_API_KEY=236579275844762</code><br />
                    <code>CLOUDINARY_API_SECRET=QJEJBUr13O16r0wp2ztXnP9dwCg</code>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Environment Variables */}
          <Card>
            <CardHeader>
              <CardTitle>Environment Variables</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <h4 className="font-medium">Core Configuration</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">CLOUDINARY_CLOUD_NAME</span>
                      {config.config.cloud_name ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">CLOUDINARY_API_KEY</span>
                      {config.config.api_key ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">CLOUDINARY_API_SECRET</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          {config.config.api_secret}
                        </span>
                        {config.config.api_secret === '[CONFIGURED]' ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">Public Configuration</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME</span>
                      {config.config.public_cloud_name ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-orange-500" />
                      )}
                    </div>
                    {config.config.public_cloud_name && (
                      <p className="text-xs text-muted-foreground">
                        Value: {config.config.public_cloud_name}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Folder Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>Folder Structure</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 md:grid-cols-2">
                {Object.entries(config.config.folders).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-2 rounded bg-muted/50">
                    <span className="text-sm font-medium capitalize">{key}</span>
                    <code className="text-xs">{value}</code>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upload Presets */}
          <Card>
            <CardHeader>
              <CardTitle>Upload Presets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.entries(config.config.upload_presets).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-2 rounded bg-muted/50">
                    <span className="text-sm font-medium capitalize">{key}</span>
                    <div className="flex items-center gap-2">
                      {value ? (
                        <>
                          <code className="text-xs">{value}</code>
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        </>
                      ) : (
                        <>
                          <span className="text-xs text-muted-foreground">Not configured</span>
                          <AlertTriangle className="h-4 w-4 text-orange-500" />
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              {(!config.config.upload_presets.images || !config.config.upload_presets.videos) && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Upload presets are optional but recommended. Create them in your Cloudinary dashboard for better control.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>Setup Instructions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">1. Create .env.local file</h4>
                <p className="text-sm text-muted-foreground">
                  Copy the environment variables from <code>cloud.env</code> to your <code>.env.local</code> file.
                </p>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <h4 className="font-medium">2. Restart Development Server</h4>
                <p className="text-sm text-muted-foreground">
                  After adding the environment variables, restart your development server:
                </p>
                <code className="block p-2 bg-muted rounded text-sm">
                  npm run dev
                </code>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <h4 className="font-medium">3. Create Upload Presets (Optional)</h4>
                <p className="text-sm text-muted-foreground">
                  Go to your Cloudinary dashboard and create upload presets named:
                </p>
                <ul className="text-sm text-muted-foreground list-disc list-inside ml-4">
                  <li><code>kureno_images</code> - For image uploads</li>
                  <li><code>kureno_videos</code> - For video uploads</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
