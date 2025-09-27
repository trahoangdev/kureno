import { NextRequest, NextResponse } from 'next/server'
import { CloudinaryUtils, getFolderPath, generatePublicId } from '@/lib/cloudinary'
import fs from 'fs'
import path from 'path'
import os from 'os'

// Configure max file size (10MB for images, 100MB for videos)
const MAX_FILE_SIZE = {
  image: 10 * 1024 * 1024, // 10MB
  video: 100 * 1024 * 1024, // 100MB
}

// Helper function to convert File to Buffer
async function fileToBuffer(file: File): Promise<Buffer> {
  const arrayBuffer = await file.arrayBuffer()
  return Buffer.from(arrayBuffer)
}

// Helper function to get file type
function getFileType(mimeType: string): 'image' | 'video' | 'unknown' {
  if (mimeType.startsWith('image/')) return 'image'
  if (mimeType.startsWith('video/')) return 'video'
  return 'unknown'
}

// POST - Upload file to Cloudinary (unsigned - no authentication required)
export async function POST(req: NextRequest) {
  try {
    console.log('=== Cloudinary Unsigned Upload Debug ===')
    console.log('Environment check:', {
      CLOUDINARY_CLOUD_NAME: !!process.env.CLOUDINARY_CLOUD_NAME,
      CLOUDINARY_API_KEY: !!process.env.CLOUDINARY_API_KEY,
      CLOUDINARY_API_SECRET: !!process.env.CLOUDINARY_API_SECRET,
    })

    // Parse form data
    const formData = await req.formData()
    const file = formData.get('file') as File
    const folder = (formData.get('folder') as string) || 'general'
    const publicIdPrefix = formData.get('publicIdPrefix') as string
    const resourceType = formData.get('resource_type') as string
    const tags = formData.get('tags') as string

    // Validate form data
    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: 'Invalid file provided' },
        { status: 400 }
      )
    }

    console.log('Form data:', {
      hasFile: !!file,
      fileName: file?.name,
      fileSize: file?.size,
      fileType: file?.type,
      folder,
      resourceType
    })

    // Validate file type
    const fileType = getFileType(file.type)
    if (fileType === 'unknown') {
      return NextResponse.json(
        { error: 'Unsupported file type' },
        { status: 400 }
      )
    }

    // Validate file size
    const maxSize = MAX_FILE_SIZE[fileType]
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `File size must be less than ${maxSize / (1024 * 1024)}MB` },
        { status: 400 }
      )
    }

    // Validate file type with Cloudinary utils
    if (fileType === 'image' && !CloudinaryUtils.isValidImageType(file.type)) {
      return NextResponse.json(
        { error: 'Invalid image type' },
        { status: 400 }
      )
    }

    if (fileType === 'video' && !CloudinaryUtils.isValidVideoType(file.type)) {
      return NextResponse.json(
        { error: 'Invalid video type' },
        { status: 400 }
      )
    }

    // Save file temporarily to upload
    
    const tempDir = os.tmpdir()
    const tempFilePath = path.join(tempDir, `temp_${Date.now()}_${file.name}`)
    
    try {
      // Convert file to buffer and save to temp file
      const buffer = await fileToBuffer(file)
      fs.writeFileSync(tempFilePath, buffer)

      // Determine folder path
      let folderPath: string
      try {
        const validFolders = ['products', 'avatars', 'blog', 'general', 'videos'] as const
        if (validFolders.includes(folder as any)) {
          folderPath = getFolderPath(folder as any)
        } else {
          folderPath = folder || 'kureno/general'
        }
      } catch {
        folderPath = folder || 'kureno/general'
      }

      // Generate public ID if prefix provided
      let publicId: string | undefined
      if (publicIdPrefix) {
        try {
          // Validate publicIdPrefix is a valid type
          const validPrefixes = ['products', 'avatars', 'blog'] as const
          if (validPrefixes.includes(publicIdPrefix as any)) {
            publicId = generatePublicId(publicIdPrefix as any, 'unsigned_upload')
          } else {
            publicId = `${publicIdPrefix}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`
          }
        } catch {
          publicId = `${publicIdPrefix}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`
        }
      }

      // Prepare upload options
      const uploadOptions = {
        folder: folderPath,
        publicId,
        resourceType: (resourceType || fileType) as 'image' | 'video',
        tags: tags ? tags.split(',').map(tag => tag.trim()) : ['unsigned_upload']
      }

      console.log('Upload options:', {
        folderPath,
        publicId,
        fileType,
        tags: uploadOptions.tags,
        tempFilePath
      })

      // Upload to Cloudinary using file path
      let result
      try {
        if (fileType === 'image') {
          console.log('Uploading image to Cloudinary...')
          result = await CloudinaryUtils.uploadImage(tempFilePath, {
            folder: folderPath,
            publicId,
            size: 'large',
            tags: uploadOptions.tags
          })
        } else if (fileType === 'video') {
          console.log('Uploading video to Cloudinary...')
          result = await CloudinaryUtils.uploadVideo(tempFilePath, {
            folder: folderPath,
            publicId,
            tags: uploadOptions.tags
          })
        } else {
          console.log('Uploading file to Cloudinary...')
          result = await CloudinaryUtils.uploadFile(tempFilePath, uploadOptions)
        }
        console.log('Upload successful:', result.public_id)
      } catch (uploadError) {
        console.error('Cloudinary upload error:', uploadError)
        throw uploadError
      } finally {
        // Clean up temp file
        try {
          fs.unlinkSync(tempFilePath)
        } catch (cleanupError) {
          console.warn('Failed to cleanup temp file:', cleanupError)
        }
      }

    // Return success response
    return NextResponse.json({
      success: true,
      public_id: result.public_id,
      url: result.url,
      secure_url: result.secure_url,
      format: result.format,
      resource_type: result.resource_type,
      bytes: result.bytes,
      width: result.width,
      height: result.height,
      created_at: result.created_at,
      original_filename: result.original_filename,
      folder: result.folder,
      tags: result.tags
    })

    } catch (error) {
      console.error('Cloudinary upload error:', error)
      
      // Clean up temp file if it exists
      try {
        if (typeof tempFilePath !== 'undefined') {
          fs.unlinkSync(tempFilePath)
        }
      } catch (cleanupError) {
        console.warn('Failed to cleanup temp file:', cleanupError)
      }
      
      return NextResponse.json(
        { 
          error: 'Upload failed',
          details: error instanceof Error ? error.message : 'Unknown error'
        },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Cloudinary upload error:', error)
    
    return NextResponse.json(
      { 
        error: 'Upload failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
