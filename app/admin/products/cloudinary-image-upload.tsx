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
  Image as ImageIcon,
  CheckCircle,
  AlertTriangle,
  Cloud,
  Link as LinkIcon,
  Info
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import CloudinaryUpload, { CloudinaryFile } from '@/components/ui/cloudinary-upload'
import Image from 'next/image'

interface CloudinaryImageUploadProps {
  images: string[]
  onImagesChange: (images: string[]) => void
  maxImages?: number
  folder?: string
}

export default function CloudinaryImageUpload({ 
  images, 
  onImagesChange, 
  maxImages = 10,
  folder = 'products'
}: CloudinaryImageUploadProps) {
  const [activeTab, setActiveTab] = useState<'upload' | 'url'>('upload')
  const [manualUrls, setManualUrls] = useState<string[]>([])
  const { toast } = useToast()

  // Convert Cloudinary files to image URLs
  const handleCloudinaryUpload = useCallback((files: CloudinaryFile[]) => {
    const urls = files.map(file => file.secureUrl)
    onImagesChange(urls)
  }, [onImagesChange])

  // Handle manual URL addition
  const addManualUrl = useCallback(() => {
    if (images.length < maxImages) {
      const newImages = [...images, '']
      onImagesChange(newImages)
    }
  }, [images, maxImages, onImagesChange])

  // Handle manual URL change
  const handleUrlChange = useCallback((index: number, value: string) => {
    const newImages = [...images]
    newImages[index] = value
    onImagesChange(newImages)
  }, [images, onImagesChange])

  // Remove image by index
  const removeImage = useCallback((index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    onImagesChange(newImages)
  }, [images, onImagesChange])

  // Handle Cloudinary file removal
  const handleCloudinaryRemove = useCallback(async (publicId: string) => {
    try {
      const response = await fetch('/api/upload/cloudinary', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publicId, resourceType: 'image' })
      })

      if (!response.ok) {
        throw new Error('Failed to delete image')
      }

      toast({
        title: "Image removed",
        description: "Image has been successfully removed from Cloudinary.",
      })
    } catch (error) {
      console.error('Remove error:', error)
      toast({
        title: "Remove failed",
        description: "Failed to remove image from Cloudinary.",
        variant: "destructive",
      })
    }
  }, [toast])

  // Convert current images to CloudinaryFile format for initial display
  const currentCloudinaryFiles: CloudinaryFile[] = images
    .filter(url => url.includes('cloudinary.com') || url.includes('res.cloudinary.com'))
    .map((url, index) => {
      // Extract public ID from Cloudinary URL (basic extraction)
      const urlParts = url.split('/')
      const publicIdWithExtension = urlParts[urlParts.length - 1]
      const publicId = publicIdWithExtension.split('.')[0]
      
      return {
        publicId: publicId || `image_${index}`,
        url: url,
        secureUrl: url,
        format: url.split('.').pop() || 'jpg',
        resourceType: 'image' as const,
        bytes: 0,
        originalFilename: `image_${index + 1}`,
        width: undefined,
        height: undefined
      }
    })

  return (
    <div className="space-y-6">
      {/* Header with Info */}
      <div className="space-y-2">
        <Label className="text-base font-medium flex items-center gap-2">
          <ImageIcon className="h-4 w-4" />
          Product Images
          <Badge variant="outline">
            {images.length}/{maxImages}
          </Badge>
        </Label>
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Upload images to Cloudinary for better performance and automatic optimization, or add image URLs manually.
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
          <CloudinaryUpload
            onUpload={handleCloudinaryUpload}
            onRemove={handleCloudinaryRemove}
            maxFiles={maxImages}
            maxFileSize={10} // 10MB
            acceptedTypes={['image']}
            folder={folder}
            multiple={true}
            showPreview={true}
            initialFiles={currentCloudinaryFiles}
            uploadPreset="kureno_images"
            className="border rounded-lg p-4"
          />
        </TabsContent>

        {/* Manual URL Tab */}
        <TabsContent value="url" className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Image URLs</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addManualUrl}
                    disabled={images.length >= maxImages}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add URL
                  </Button>
                </div>

                {images.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No images added yet</p>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addManualUrl}
                      className="mt-4"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add First Image
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {images.map((image, index) => (
                      <Card key={index} className="overflow-hidden">
                        <CardContent className="p-3">
                          <div className="grid gap-3 md:grid-cols-[100px_1fr_auto] items-center">
                            {/* Image Preview */}
                            <div className="relative overflow-hidden rounded-md border bg-muted">
                              <Image
                                src={image || "/placeholder.png"}
                                alt={`Preview ${index + 1}`}
                                width={100}
                                height={75}
                                className="h-20 w-full object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement
                                  target.src = "/placeholder.png"
                                }}
                              />
                              {index === 0 && (
                                <Badge
                                  className="absolute top-1 right-1 text-xs"
                                  variant="secondary"
                                >
                                  Main
                                </Badge>
                              )}
                            </div>

                            {/* URL Input */}
                            <div className="space-y-1">
                              <Input
                                value={image}
                                onChange={(e) => handleUrlChange(index, e.target.value)}
                                placeholder="Enter image URL (https://...)"
                                className="text-sm"
                                required={index === 0}
                              />
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                {index === 0 ? (
                                  <div className="flex items-center gap-1">
                                    <CheckCircle className="h-3 w-3 text-green-500" />
                                    <span>Main product image (required)</span>
                                  </div>
                                ) : (
                                  <span>Additional image #{index + 1}</span>
                                )}
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-1">
                              {index > 0 && (
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => removeImage(index)}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                              )}
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
              <strong>Tips for image URLs:</strong>
              <ul className="mt-2 space-y-1 text-xs">
                <li>• Use HTTPS URLs for security</li>
                <li>• Supported formats: JPG, PNG, WebP, GIF</li>
                <li>• Recommended size: 800x800px or larger</li>
                <li>• First image will be used as the main product image</li>
              </ul>
            </AlertDescription>
          </Alert>
        </TabsContent>
      </Tabs>

      {/* Current Images Summary */}
      {images.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="space-y-3">
              <Label className="text-sm font-medium">Current Images ({images.length})</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                {images.map((image, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square overflow-hidden rounded-md border bg-muted">
                      <Image
                        src={image || "/placeholder.png"}
                        alt={`Image ${index + 1}`}
                        width={120}
                        height={120}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = "/placeholder.png"
                        }}
                      />
                      {index === 0 && (
                        <Badge className="absolute top-1 left-1 text-xs" variant="default">
                          Main
                        </Badge>
                      )}
                      <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeImage(index)}
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

      {/* Validation Messages */}
      {images.length === 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            At least one product image is required.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
