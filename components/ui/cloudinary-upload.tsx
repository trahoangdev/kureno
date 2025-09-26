"use client"

import React, { useState, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { 
  Upload, 
  X, 
  Image as ImageIcon, 
  Video, 
  FileText, 
  Loader2, 
  Check, 
  AlertCircle,
  Eye,
  Trash2,
  RotateCcw
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'

export interface CloudinaryFile {
  publicId: string
  url: string
  secureUrl: string
  format: string
  resourceType: 'image' | 'video' | 'raw'
  bytes: number
  width?: number
  height?: number
  originalFilename: string
}

interface CloudinaryUploadProps {
  onUpload: (files: CloudinaryFile[]) => void
  onRemove?: (publicId: string) => void
  maxFiles?: number
  maxFileSize?: number // in MB
  acceptedTypes?: ('image' | 'video')[]
  folder?: string
  className?: string
  disabled?: boolean
  initialFiles?: CloudinaryFile[]
  multiple?: boolean
  showPreview?: boolean
  uploadPreset?: string
}

interface UploadingFile {
  id: string
  file: File
  progress: number
  status: 'uploading' | 'success' | 'error'
  error?: string
  result?: CloudinaryFile
}

export default function CloudinaryUpload({
  onUpload,
  onRemove,
  maxFiles = 10,
  maxFileSize = 10, // 10MB default
  acceptedTypes = ['image'],
  folder = 'general',
  className,
  disabled = false,
  initialFiles = [],
  multiple = true,
  showPreview = true,
  uploadPreset
}: CloudinaryUploadProps) {
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([])
  const [uploadedFiles, setUploadedFiles] = useState<CloudinaryFile[]>(initialFiles)
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  // Generate accepted file types for input
  const acceptedMimeTypes = acceptedTypes.flatMap(type => {
    if (type === 'image') return ['image/*']
    if (type === 'video') return ['video/*']
    return []
  }).join(',')

  // Validate file
  const validateFile = useCallback((file: File): string | null => {
    // Check file size
    const fileSizeMB = file.size / (1024 * 1024)
    if (fileSizeMB > maxFileSize) {
      return `File size must be less than ${maxFileSize}MB`
    }

    // Check file type
    const isValidType = acceptedTypes.some(type => {
      if (type === 'image') return file.type.startsWith('image/')
      if (type === 'video') return file.type.startsWith('video/')
      return false
    })

    if (!isValidType) {
      return `File type not supported. Accepted types: ${acceptedTypes.join(', ')}`
    }

    // Check max files
    const totalFiles = uploadedFiles.length + uploadingFiles.length + 1
    if (totalFiles > maxFiles) {
      return `Maximum ${maxFiles} files allowed`
    }

    return null
  }, [maxFileSize, acceptedTypes, maxFiles, uploadedFiles.length, uploadingFiles.length])

  // Upload file to Cloudinary
  const uploadToCloudinary = useCallback(async (file: File, uploadingFileId: string) => {
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', folder)
      
      if (uploadPreset) {
        formData.append('upload_preset', uploadPreset)
      }

      // Add resource type
      const resourceType = file.type.startsWith('image/') ? 'image' : 'video'
      formData.append('resource_type', resourceType)

      const response = await fetch('/api/upload/cloudinary', {
        method: 'POST',
        body: formData,
        onUploadProgress: (progressEvent: any) => {
          if (progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            setUploadingFiles(prev => prev.map(f => 
              f.id === uploadingFileId ? { ...f, progress } : f
            ))
          }
        }
      } as any)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Upload failed')
      }

      const result = await response.json()
      const cloudinaryFile: CloudinaryFile = {
        publicId: result.public_id,
        url: result.url,
        secureUrl: result.secure_url,
        format: result.format,
        resourceType: result.resource_type,
        bytes: result.bytes,
        width: result.width,
        height: result.height,
        originalFilename: result.original_filename || file.name
      }

      // Update uploading file status
      setUploadingFiles(prev => prev.map(f => 
        f.id === uploadingFileId 
          ? { ...f, status: 'success', progress: 100, result: cloudinaryFile }
          : f
      ))

      // Add to uploaded files
      setUploadedFiles(prev => {
        const newFiles = [...prev, cloudinaryFile]
        onUpload(newFiles)
        return newFiles
      })

      toast({
        title: "Upload successful",
        description: `${file.name} has been uploaded successfully.`,
      })

    } catch (error) {
      console.error('Upload error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Upload failed'
      
      setUploadingFiles(prev => prev.map(f => 
        f.id === uploadingFileId 
          ? { ...f, status: 'error', error: errorMessage }
          : f
      ))

      toast({
        title: "Upload failed",
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
        title: "Some files were rejected",
        description: errors.join(', '),
        variant: "destructive",
      })
    }

    // Process valid files
    if (validFiles.length > 0) {
      const newUploadingFiles: UploadingFile[] = validFiles.map(file => ({
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        file,
        progress: 0,
        status: 'uploading'
      }))

      setUploadingFiles(prev => [...prev, ...newUploadingFiles])

      // Start uploads
      newUploadingFiles.forEach(uploadingFile => {
        uploadToCloudinary(uploadingFile.file, uploadingFile.id)
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
    
    const files = Array.from(e.dataTransfer.files)
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

  // Remove uploaded file
  const removeFile = useCallback(async (publicId: string) => {
    try {
      // Call API to delete from Cloudinary
      if (onRemove) {
        await onRemove(publicId)
      } else {
        await fetch('/api/upload/cloudinary', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ publicId })
        })
      }

      // Remove from state
      setUploadedFiles(prev => {
        const newFiles = prev.filter(f => f.publicId !== publicId)
        onUpload(newFiles)
        return newFiles
      })

      toast({
        title: "File removed",
        description: "File has been successfully removed.",
      })
    } catch (error) {
      console.error('Remove error:', error)
      toast({
        title: "Remove failed",
        description: "Failed to remove file. Please try again.",
        variant: "destructive",
      })
    }
  }, [onRemove, onUpload, toast])

  // Retry failed upload
  const retryUpload = useCallback((uploadingFileId: string) => {
    const uploadingFile = uploadingFiles.find(f => f.id === uploadingFileId)
    if (uploadingFile && uploadingFile.status === 'error') {
      setUploadingFiles(prev => prev.map(f => 
        f.id === uploadingFileId 
          ? { ...f, status: 'uploading', progress: 0, error: undefined }
          : f
      ))
      uploadToCloudinary(uploadingFile.file, uploadingFileId)
    }
  }, [uploadingFiles, uploadToCloudinary])

  // Clear completed uploads
  const clearCompletedUploads = useCallback(() => {
    setUploadingFiles(prev => prev.filter(f => f.status === 'uploading'))
  }, [])

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // Get file icon
  const getFileIcon = (resourceType: string, format?: string) => {
    if (resourceType === 'video') return <Video className="h-4 w-4" />
    if (resourceType === 'image') return <ImageIcon className="h-4 w-4" />
    return <FileText className="h-4 w-4" />
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
              <Upload className={cn(
                "h-8 w-8",
                isDragOver ? "text-primary" : "text-muted-foreground"
              )} />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">
                {isDragOver ? "Drop files here" : "Upload files"}
              </h3>
              <p className="text-sm text-muted-foreground">
                Drag and drop files here or click to browse
              </p>
              <div className="flex flex-wrap gap-2 justify-center text-xs text-muted-foreground">
                <Badge variant="outline">
                  Max {maxFiles} files
                </Badge>
                <Badge variant="outline">
                  Up to {maxFileSize}MB each
                </Badge>
                <Badge variant="outline">
                  {acceptedTypes.join(', ')}
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
              Choose Files
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

      {/* Uploading Files */}
      {uploadingFiles.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold">Uploading Files</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearCompletedUploads}
              >
                Clear Completed
              </Button>
            </div>
            
            <div className="space-y-3">
              {uploadingFiles.map(uploadingFile => (
                <div key={uploadingFile.id} className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      {uploadingFile.status === 'uploading' && (
                        <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      )}
                      {uploadingFile.status === 'success' && (
                        <Check className="h-4 w-4 text-green-500" />
                      )}
                      {uploadingFile.status === 'error' && (
                        <AlertCircle className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {uploadingFile.file.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(uploadingFile.file.size)}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {uploadingFile.status === 'error' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => retryUpload(uploadingFile.id)}
                        >
                          <RotateCcw className="h-3 w-3" />
                        </Button>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {uploadingFile.progress}%
                      </span>
                    </div>
                  </div>
                  
                  {uploadingFile.status === 'uploading' && (
                    <Progress value={uploadingFile.progress} className="h-1" />
                  )}
                  
                  {uploadingFile.status === 'error' && uploadingFile.error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription className="text-xs">
                        {uploadingFile.error}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && showPreview && (
        <Card>
          <CardContent className="p-4">
            <h4 className="font-semibold mb-4">Uploaded Files ({uploadedFiles.length})</h4>
            
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {uploadedFiles.map(file => (
                <div key={file.publicId} className="group relative">
                  <Card className="overflow-hidden">
                    <div className="aspect-video relative bg-muted">
                      {file.resourceType === 'image' ? (
                        <img
                          src={file.secureUrl}
                          alt={file.originalFilename}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          {getFileIcon(file.resourceType, file.format)}
                          <span className="ml-2 text-sm font-medium">
                            {file.format?.toUpperCase()}
                          </span>
                        </div>
                      )}
                      
                      {/* Overlay actions */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => window.open(file.secureUrl, '_blank')}
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => removeFile(file.publicId)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    
                    <CardContent className="p-3">
                      <p className="text-sm font-medium truncate" title={file.originalFilename}>
                        {file.originalFilename}
                      </p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
                        <span>{formatFileSize(file.bytes)}</span>
                        <span>{file.format?.toUpperCase()}</span>
                        {file.width && file.height && (
                          <span>{file.width}×{file.height}</span>
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
