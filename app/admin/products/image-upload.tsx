"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Upload, 
  X, 
  Plus, 
  Minus, 
  Image as ImageIcon,
  CheckCircle,
  AlertTriangle,
  Loader2
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ImageUploadProps {
  images: string[]
  onImagesChange: (images: string[]) => void
  maxImages?: number
}

export default function ImageUpload({ 
  images, 
  onImagesChange, 
  maxImages = 10 
}: ImageUploadProps) {
  const [dragOver, setDragOver] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    
    const files = Array.from(e.dataTransfer.files)
    const imageFiles = files.filter(file => file.type.startsWith('image/'))
    
    if (imageFiles.length > 0) {
      handleFileUpload(imageFiles)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      handleFileUpload(files)
    }
  }

  const handleFileUpload = async (files: File[]) => {
    if (images.length + files.length > maxImages) {
      toast({
        title: "Too many images",
        description: `Maximum ${maxImages} images allowed.`,
        variant: "destructive"
      })
      return
    }

    setUploading(true)
    setUploadError(null)
    setUploadProgress(0)

    try {
      const uploadPromises = files.map(async (file, index) => {
        // Validate file type
        const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"]
        if (!allowedTypes.includes(file.type)) {
          throw new Error(`Invalid file type: ${file.name}`)
        }

        // Validate file size (10MB max)
        const maxSize = 10 * 1024 * 1024 // 10MB
        if (file.size > maxSize) {
          throw new Error(`File too large: ${file.name}`)
        }

        const formData = new FormData()
        formData.append("file", file)

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        const result = await response.json()

        if (!response.ok || !result.success) {
          throw new Error(result.error || "Upload failed")
        }

        // Update progress
        setUploadProgress(((index + 1) / files.length) * 100)

        return result.url
      })

      const uploadedUrls = await Promise.all(uploadPromises)
      const newImages = [...images, ...uploadedUrls]
      onImagesChange(newImages)

      toast({
        title: "Upload successful",
        description: `${uploadedUrls.length} image(s) uploaded successfully.`,
      })

    } catch (error: any) {
      setUploadError(error.message)
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive"
      })
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    onImagesChange(newImages)
  }

  const addImageField = () => {
    if (images.length < maxImages) {
      onImagesChange([...images, ""])
    }
  }

  const handleImageUrlChange = (index: number, value: string) => {
    const newImages = [...images]
    newImages[index] = value
    onImagesChange(newImages)
  }

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragOver
            ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20"
            : "border-gray-300 dark:border-gray-700"
        } ${uploading ? "pointer-events-none opacity-50" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium mb-2">Upload Product Images</h3>
        <p className="text-muted-foreground mb-4">
          Drag and drop images here, or click to browse
        </p>
        <Button 
          variant="outline" 
          className="mb-2"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          <Upload className="mr-2 h-4 w-4" />
          Choose Files
        </Button>
        <p className="text-xs text-muted-foreground">
          Supports: JPG, PNG, WebP, GIF (Max 10MB each)
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {images.length}/{maxImages} images uploaded
        </p>
        
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Upload Progress */}
      {uploading && (
        <Card>
          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm font-medium">Uploading images...</span>
              </div>
              <Progress value={uploadProgress} className="w-full" />
              <p className="text-xs text-muted-foreground">
                {Math.round(uploadProgress)}% complete
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upload Error */}
      {uploadError && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{uploadError}</AlertDescription>
        </Alert>
      )}

      {/* Image List */}
      {images.length > 0 && (
        <div className="space-y-4">
          <Label className="text-base font-medium">Product Images</Label>
          <div className="grid gap-4">
            {images.map((image, index) => (
              <Card key={index} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="grid gap-4 md:grid-cols-[120px_1fr_auto] items-start">
                    {/* Image Preview */}
                    <div className="overflow-hidden rounded-lg border bg-white dark:bg-slate-800">
                      <Image 
                        src={image || "/placeholder.png"} 
                        alt={`Preview ${index + 1}`} 
                        width={120} 
                        height={90} 
                        className="h-24 w-full object-cover" 
                      />
                    </div>
                    
                    {/* Image URL Input */}
                    <div className="space-y-2">
                      <Input
                        value={image}
                        onChange={(e) => handleImageUrlChange(index, e.target.value)}
                        placeholder="Enter image URL or upload above"
                        className="bg-white/50 dark:bg-slate-800/50"
                        required={index === 0}
                      />
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        {index === 0 && (
                          <div className="flex items-center gap-1">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            <span>Main product image (required)</span>
                          </div>
                        )}
                        {index > 0 && (
                          <span>Additional product image</span>
                        )}
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex gap-2">
                      {index === images.length - 1 && images.length < maxImages && (
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm" 
                          onClick={addImageField}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      )}
                      {index > 0 && (
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm" 
                          onClick={() => removeImage(index)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Add First Image */}
      {images.length === 0 && (
        <Card>
          <CardContent className="p-6 text-center">
            <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium mb-2">No images uploaded</h3>
            <p className="text-muted-foreground mb-4">
              Upload at least one image to get started
            </p>
            <Button onClick={addImageField} variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Add Image URL
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
