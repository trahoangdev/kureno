"use client"

import React, { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Upload, 
  Plus, 
  Minus, 
  Video,
  CheckCircle,
  AlertTriangle,
  Cloud,
  Link as LinkIcon,
  Info
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import CloudinaryVideoUpload, { CloudinaryVideo } from '@/components/ui/cloudinary-video-upload'

interface CloudinaryVideoUploadProps {
  videos: string[]
  onVideosChange: (videos: string[]) => void
  maxVideos?: number
  folder?: string
}

export default function CloudinaryVideoUploadComponent({ 
  videos, 
  onVideosChange, 
  maxVideos = 5,
  folder = 'products/videos'
}: CloudinaryVideoUploadProps) {
  const [activeTab, setActiveTab] = useState<'upload' | 'url'>('upload')
  const { toast } = useToast()

  // Convert Cloudinary videos to video URLs
  const handleCloudinaryUpload = useCallback((files: CloudinaryVideo[]) => {
    const urls = files.map(file => file.secureUrl)
    onVideosChange(urls)
  }, [onVideosChange])

  // Handle manual URL addition
  const addManualUrl = useCallback(() => {
    if (videos.length < maxVideos) {
      const newVideos = [...videos, '']
      onVideosChange(newVideos)
    }
  }, [videos, maxVideos, onVideosChange])

  // Handle manual URL change
  const handleUrlChange = useCallback((index: number, value: string) => {
    const newVideos = [...videos]
    newVideos[index] = value
    onVideosChange(newVideos)
  }, [videos, onVideosChange])

  // Remove video by index
  const removeVideo = useCallback((index: number) => {
    const newVideos = videos.filter((_, i) => i !== index)
    onVideosChange(newVideos)
  }, [videos, onVideosChange])

  // Handle Cloudinary video removal
  const handleCloudinaryRemove = useCallback(async (publicId: string) => {
    try {
      const response = await fetch('/api/upload/cloudinary', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publicId, resourceType: 'video' })
      })

      if (!response.ok) {
        throw new Error('Failed to delete video')
      }

      toast({
        title: "Video removed",
        description: "Video has been successfully removed from Cloudinary.",
      })
    } catch (error) {
      console.error('Remove error:', error)
      toast({
        title: "Remove failed",
        description: "Failed to remove video from Cloudinary.",
        variant: "destructive",
      })
    }
  }, [toast])

  // Convert current videos to CloudinaryVideo format for initial display
  const currentCloudinaryVideos: CloudinaryVideo[] = videos
    .filter(url => url.includes('cloudinary.com') || url.includes('res.cloudinary.com'))
    .map((url, index) => {
      // Extract public ID from Cloudinary URL (basic extraction)
      const urlParts = url.split('/')
      const publicIdWithExtension = urlParts[urlParts.length - 1]
      const publicId = publicIdWithExtension.split('.')[0]
      
      return {
        publicId: publicId || `video_${index}`,
        url: url,
        secureUrl: url,
        format: url.split('.').pop() || 'mp4',
        resourceType: 'video' as const,
        bytes: 0,
        originalFilename: `video_${index + 1}`,
        width: undefined,
        height: undefined,
        duration: undefined
      }
    })

  return (
    <div className="space-y-6">
      {/* Header with Info */}
      <div className="space-y-2">
        <Label className="text-base font-medium flex items-center gap-2">
          <Video className="h-4 w-4" />
          Product Videos
          <Badge variant="outline">
            {videos.length}/{maxVideos}
          </Badge>
        </Label>
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Upload videos to Cloudinary for better performance and automatic optimization, or add video URLs manually.
          </AlertDescription>
        </Alert>
      </div>

      {/* Upload Methods Tabs */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'upload' | 'url')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Cloud className="h-4 w-4" />
            Cloudinary Upload
          </TabsTrigger>
          <TabsTrigger value="url" className="flex items-center gap-2">
            <LinkIcon className="h-4 w-4" />
            Manual URLs
          </TabsTrigger>
        </TabsList>

        {/* Cloudinary Upload Tab */}
        <TabsContent value="upload" className="space-y-4">
          <CloudinaryVideoUpload
            onUpload={handleCloudinaryUpload}
            onRemove={handleCloudinaryRemove}
            maxFiles={maxVideos}
            maxFileSize={100} // 100MB
            folder={folder}
            multiple={true}
            showPreview={true}
            uploadPreset="kureno_videos"
            className="border rounded-lg p-4"
          />
        </TabsContent>

        {/* Manual URL Tab */}
        <TabsContent value="url" className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Video URLs</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addManualUrl}
                    disabled={videos.length >= maxVideos}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add URL
                  </Button>
                </div>

                {videos.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Video className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No videos added yet</p>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addManualUrl}
                      className="mt-4"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add First Video
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {videos.map((video, index) => (
                      <Card key={index} className="overflow-hidden">
                        <CardContent className="p-3">
                          <div className="grid gap-3 md:grid-cols-[100px_1fr_auto] items-center">
                            {/* Video Preview */}
                            <div className="relative overflow-hidden rounded-md border bg-muted">
                              <div className="h-20 w-full bg-muted flex items-center justify-center">
                                <Video className="h-8 w-8 text-muted-foreground" />
                              </div>
                              <Badge
                                className="absolute top-1 right-1 text-xs"
                                variant="secondary"
                              >
                                Video
                              </Badge>
                            </div>

                            {/* URL Input */}
                            <div className="space-y-1">
                              <Input
                                value={video}
                                onChange={(e) => handleUrlChange(index, e.target.value)}
                                placeholder="Enter video URL (https://...)"
                                className="text-sm"
                              />
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span>Video #{index + 1}</span>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-1">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => removeVideo(index)}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* URL Input Tips */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription className="text-sm">
              <strong>Tips for video URLs:</strong>
              <ul className="mt-2 space-y-1 text-xs">
                <li>• Use HTTPS URLs for security</li>
                <li>• Supported formats: MP4, WebM, MOV, AVI</li>
                <li>• Recommended size: Under 100MB</li>
                <li>• Videos will be displayed in product gallery</li>
              </ul>
            </AlertDescription>
          </Alert>
        </TabsContent>
      </Tabs>

      {/* Current Videos Summary */}
      {videos.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="space-y-3">
              <Label className="text-sm font-medium">Current Videos ({videos.length})</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                {videos.map((video, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square overflow-hidden rounded-md border bg-muted">
                      <div className="h-full w-full bg-muted flex items-center justify-center">
                        <Video className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <Badge className="absolute top-1 left-1 text-xs" variant="default">
                        Video
                      </Badge>
                      <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeVideo(index)}
                          className="h-6 w-6 p-0"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-xs text-center mt-1 text-muted-foreground truncate">
                      #{index + 1}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
