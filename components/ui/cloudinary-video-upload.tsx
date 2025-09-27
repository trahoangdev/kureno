"use client"

import React, { useState, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Upload, 
  X, 
  Video, 
  Play, 
  Loader2, 
  Check, 
  AlertCircle,
  Eye,
  Trash2,
  RotateCcw,
  FileVideo,
  Clock,
  HardDrive
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'

export interface CloudinaryVideo {
  publicId: string
  url: string
  secureUrl: string
  format: string
  resourceType: 'video'
  bytes: number
  width?: number
  height?: number
  duration?: number
  originalFilename: string
  playbackUrl?: string
}

interface CloudinaryVideoUploadProps {
  onUpload: (videos: CloudinaryVideo[]) => void
  onRemove?: (publicId: string) => void
  maxFiles?: number
  maxFileSize?: number // in MB
  folder?: string
  className?: string
  disabled?: boolean
  initialVideos?: CloudinaryVideo[]
  multiple?: boolean
  showPreview?: boolean
  uploadPreset?: string
}

interface UploadingVideo {
  id: string
  file: File
  progress: number
  status: 'uploading' | 'success' | 'error'
  error?: string
  result?: CloudinaryVideo
}

export default function CloudinaryVideoUpload({
  onUpload,
  onRemove,
  maxFiles = 5,
  maxFileSize = 100, // 100MB default
  folder = 'videos',
  className,
  disabled = false,
  initialVideos = [],
  multiple = true,
  showPreview = true,
  uploadPreset
}: CloudinaryVideoUploadProps) {
  const [uploadingVideos, setUploadingVideos] = useState<UploadingVideo[]>([])
  const [uploadedVideos, setUploadedVideos] = useState<CloudinaryVideo[]>(initialVideos)
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  // Supported video formats
  const acceptedMimeTypes = [
    'video/mp4',
    'video/webm',
    'video/ogg',
    'video/avi',
    'video/mov',
    'video/wmv',
    'video/flv',
    'video/mkv'
  ].join(',')

  // Validate video file
  const validateFile = useCallback((file: File): string | null => {
    // Check file size
    const fileSizeMB = file.size / (1024 * 1024)
    if (fileSizeMB > maxFileSize) {
      return `File size must be less than ${maxFileSize}MB`
    }

    // Check file type
    const isValidType = file.type.startsWith('video/')
    if (!isValidType) {
      return 'File must be a video'
    }

    // Check max files
    const totalFiles = uploadedVideos.length + uploadingVideos.length + 1
    if (totalFiles > maxFiles) {
      return `Maximum ${maxFiles} videos allowed`
    }

    return null
  }, [maxFileSize, maxFiles, uploadedVideos.length, uploadingVideos.length])

  // Upload video to Cloudinary
  const uploadToCloudinary = useCallback(async (file: File, uploadingVideoId: string) => {
    let progressInterval: NodeJS.Timeout | null = null
    
    try {
      // Simulate progress since fetch doesn't support onUploadProgress
      progressInterval = setInterval(() => {
        setUploadingVideos(prev => prev.map(v => {
          if (v.id === uploadingVideoId && v.progress < 90) {
            return { ...v, progress: v.progress + Math.random() * 10 }
          }
          return v
        }))
      }, 200)

      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', folder)
      formData.append('resource_type', 'video')
      
      if (uploadPreset) {
        formData.append('upload_preset', uploadPreset)
      }

      const response = await fetch('/api/upload/cloudinary/unsigned', {
        method: 'POST',
        body: formData
      })

      // Clear progress interval
      if (progressInterval) {
        clearInterval(progressInterval)
      }

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Upload failed')
      }

      const result = await response.json()
      const cloudinaryVideo: CloudinaryVideo = {
        publicId: result.public_id,
        url: result.url,
        secureUrl: result.secure_url,
        format: result.format,
        resourceType: 'video',
        bytes: result.bytes,
        width: result.width,
        height: result.height,
        duration: result.duration,
        originalFilename: result.original_filename || file.name,
        playbackUrl: result.playback_url
      }

      // Update uploading video status
      setUploadingVideos(prev => prev.map(v => 
        v.id === uploadingVideoId 
          ? { ...v, status: 'success', progress: 100, result: cloudinaryVideo }
          : v
      ))

      // Add to uploaded videos
      setUploadedVideos(prev => {
        const newVideos = [...prev, cloudinaryVideo]
        // Use setTimeout to avoid setState during render
        setTimeout(() => onUpload(newVideos), 0)
        return newVideos
      })

      toast({
        title: "Video uploaded successfully",
        description: `${file.name} has been uploaded to Cloudinary.`,
      })

    } catch (error) {
      console.error('Upload error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Upload failed'
      
      // Clear progress interval on error
      if (progressInterval) {
        clearInterval(progressInterval)
      }
      
      setUploadingVideos(prev => prev.map(v => 
        v.id === uploadingVideoId 
          ? { ...v, status: 'error', error: errorMessage }
          : v
      ))

      toast({
        title: "Video upload failed",
        description: errorMessage,
        variant: "destructive",
      })
    }
  }, [folder, uploadPreset, onUpload, toast])

  // Handle file selection
  const handleFiles = useCallback(async (files: FileList | File[]) => {
    const fileArray = Array.from(files)
    const validFiles: File[] = []
    const errors: string[] = []

    // Validate each file
    fileArray.forEach(file => {
      const error = validateFile(file)
      if (error) {
        errors.push(`${file.name}: ${error}`)
      } else {
        validFiles.push(file)
      }
    })

    // Show validation errors
    if (errors.length > 0) {
      toast({
        title: "Some videos were rejected",
        description: errors.join(', '),
        variant: "destructive",
      })
    }

    // Process valid files
    if (validFiles.length > 0) {
      const newUploadingVideos: UploadingVideo[] = validFiles.map(file => ({
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        file,
        progress: 0,
        status: 'uploading'
      }))

      setUploadingVideos(prev => [...prev, ...newUploadingVideos])

      // Start uploads
      newUploadingVideos.forEach(uploadingVideo => {
        uploadToCloudinary(uploadingVideo.file, uploadingVideo.id)
      })
    }
  }, [validateFile, uploadToCloudinary, toast])

  // Handle file input change
  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files)
      e.target.value = '' // Reset input
    }
  }, [handleFiles])

  // Handle drag and drop
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    if (disabled) return
    
    const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('video/'))
    if (files.length > 0) {
      handleFiles(files)
    }
  }, [handleFiles, disabled])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    if (!disabled) {
      setIsDragOver(true)
    }
  }, [disabled])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  // Remove uploaded video
  const removeVideo = useCallback(async (publicId: string) => {
    try {
      // Call API to delete from Cloudinary
      if (onRemove) {
        await onRemove(publicId)
      } else {
        await fetch('/api/upload/cloudinary', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ publicId, resourceType: 'video' })
        })
      }

      // Remove from state
      setUploadedVideos(prev => {
        const newVideos = prev.filter(v => v.publicId !== publicId)
        // Use setTimeout to avoid setState during render
        setTimeout(() => onUpload(newVideos), 0)
        return newVideos
      })

      toast({
        title: "Video removed",
        description: "Video has been successfully removed.",
      })
    } catch (error) {
      console.error('Remove error:', error)
      toast({
        title: "Remove failed",
        description: "Failed to remove video. Please try again.",
        variant: "destructive",
      })
    }
  }, [onRemove, onUpload, toast])

  // Retry failed upload
  const retryUpload = useCallback((uploadingVideoId: string) => {
    const uploadingVideo = uploadingVideos.find(v => v.id === uploadingVideoId)
    if (uploadingVideo && uploadingVideo.status === 'error') {
      setUploadingVideos(prev => prev.map(v => 
        v.id === uploadingVideoId 
          ? { ...v, status: 'uploading', progress: 0, error: undefined }
          : v
      ))
      uploadToCloudinary(uploadingVideo.file, uploadingVideoId)
    }
  }, [uploadingVideos, uploadToCloudinary])

  // Clear completed uploads
  const clearCompletedUploads = useCallback(() => {
    setUploadingVideos(prev => prev.filter(v => v.status === 'uploading'))
  }, [])

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // Format duration
  const formatDuration = (seconds?: number): string => {
    if (!seconds) return 'Unknown'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Upload Area */}
      <Card 
        className={cn(
          "border-2 border-dashed transition-colors duration-200",
          isDragOver && !disabled && "border-primary bg-primary/5",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <CardContent className="p-8 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className={cn(
              "rounded-full p-4",
              isDragOver ? "bg-primary/10" : "bg-muted"
            )}>
              <Video className={cn(
                "h-8 w-8",
                isDragOver ? "text-primary" : "text-muted-foreground"
              )} />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">
                {isDragOver ? "Drop videos here" : "Upload videos"}
              </h3>
              <p className="text-sm text-muted-foreground">
                Drag and drop video files here or click to browse
              </p>
              <div className="flex flex-wrap gap-2 justify-center text-xs text-muted-foreground">
                <Badge variant="outline">
                  Max {maxFiles} videos
                </Badge>
                <Badge variant="outline">
                  Up to {maxFileSize}MB each
                </Badge>
                <Badge variant="outline">
                  MP4, WebM, AVI, MOV
                </Badge>
              </div>
            </div>
            
            <Button
              type="button"
              variant="outline"
              disabled={disabled}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-4 w-4 mr-2" />
              Choose Videos
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedMimeTypes}
        multiple={multiple}
        onChange={handleFileInputChange}
        className="hidden"
        disabled={disabled}
      />

      {/* Uploading Videos */}
      {uploadingVideos.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Uploading Videos</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearCompletedUploads}
              >
                Clear Completed
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {uploadingVideos.map(uploadingVideo => (
              <div key={uploadingVideo.id} className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    {uploadingVideo.status === 'uploading' && (
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    )}
                    {uploadingVideo.status === 'success' && (
                      <Check className="h-4 w-4 text-green-500" />
                    )}
                    {uploadingVideo.status === 'error' && (
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {uploadingVideo.file.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(uploadingVideo.file.size)}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {uploadingVideo.status === 'error' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => retryUpload(uploadingVideo.id)}
                      >
                        <RotateCcw className="h-3 w-3" />
                      </Button>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {uploadingVideo.progress}%
                    </span>
                  </div>
                </div>
                
                {uploadingVideo.status === 'uploading' && (
                  <Progress value={uploadingVideo.progress} className="h-1" />
                )}
                
                {uploadingVideo.status === 'error' && uploadingVideo.error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-xs">
                      {uploadingVideo.error}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Uploaded Videos */}
      {uploadedVideos.length > 0 && showPreview && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Uploaded Videos ({uploadedVideos.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {uploadedVideos.map(video => (
                <div key={video.publicId} className="group relative">
                  <Card className="overflow-hidden">
                    <div className="aspect-video relative bg-muted">
                      <video
                        src={video.secureUrl}
                        className="w-full h-full object-cover"
                        controls={false}
                        muted
                        preload="metadata"
                      />
                      
                      {/* Video overlay */}
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <Play className="h-8 w-8 text-white" />
                      </div>
                      
                      {/* Overlay actions */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => window.open(video.secureUrl, '_blank')}
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => removeVideo(video.publicId)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    
                    <CardContent className="p-3">
                      <p className="text-sm font-medium truncate" title={video.originalFilename}>
                        {video.originalFilename}
                      </p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
                        <div className="flex items-center gap-1">
                          <HardDrive className="h-3 w-3" />
                          <span>{formatFileSize(video.bytes)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{formatDuration(video.duration)}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{video.format?.toUpperCase()}</span>
                        {video.width && video.height && (
                          <span>{video.width}×{video.height}</span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
