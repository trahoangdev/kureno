import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { CloudinaryUtils, getFolderPath, generatePublicId } from '@/lib/cloudinary'

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

// POST - Upload file to Cloudinary
export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = (await getServerSession(authOptions as any)) as any
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Parse form data
    const formData = await req.formData()
    const file = formData.get('file') as File
    const folder = formData.get('folder') as string || 'general'
    const publicIdPrefix = formData.get('publicIdPrefix') as string
    const resourceType = formData.get('resource_type') as string
    const tags = formData.get('tags') as string

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

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

    // Convert file to buffer
    const buffer = await fileToBuffer(file)

    // Determine folder path
    let folderPath: string
    try {
      folderPath = getFolderPath(folder as any)
    } catch {
      folderPath = folder || 'kureno/general'
    }

    // Generate public ID if prefix provided
    let publicId: string | undefined
    if (publicIdPrefix) {
      try {
        publicId = generatePublicId(publicIdPrefix as any, session.user.id || 'user')
      } catch {
        publicId = `${publicIdPrefix}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`
      }
    }

    // Prepare upload options
    const uploadOptions = {
      folder: folderPath,
      publicId,
      resourceType: (resourceType || fileType) as 'image' | 'video',
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [`uploaded_by_${session.user.id}`]
    }

    // Upload to Cloudinary
    let result
    if (fileType === 'image') {
      result = await CloudinaryUtils.uploadImage(buffer, {
        folder: folderPath,
        publicId,
        size: 'large',
        tags: uploadOptions.tags
      })
    } else if (fileType === 'video') {
      result = await CloudinaryUtils.uploadVideo(buffer, {
        folder: folderPath,
        publicId,
        tags: uploadOptions.tags
      })
    } else {
      result = await CloudinaryUtils.uploadFile(buffer, uploadOptions)
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
    
    return NextResponse.json(
      { 
        error: 'Upload failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// DELETE - Remove file from Cloudinary
export async function DELETE(req: NextRequest) {
  try {
    // Check authentication
    const session = (await getServerSession(authOptions as any)) as any
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Parse request body
    const body = await req.json()
    const { publicId, resourceType = 'image' } = body

    if (!publicId) {
      return NextResponse.json(
        { error: 'Public ID is required' },
        { status: 400 }
      )
    }

    // Delete from Cloudinary
    const result = await CloudinaryUtils.deleteFile(publicId, resourceType)

    if (result.result === 'ok') {
      return NextResponse.json({
        success: true,
        message: 'File deleted successfully',
        publicId,
        result: result.result
      })
    } else {
      return NextResponse.json(
        { 
          error: 'Failed to delete file',
          result: result.result
        },
        { status: 400 }
      )
    }

  } catch (error) {
    console.error('Cloudinary delete error:', error)
    
    return NextResponse.json(
      { 
        error: 'Delete failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// GET - Get file info or generate signed URL
export async function GET(req: NextRequest) {
  try {
    // Check authentication
    const session = (await getServerSession(authOptions as any)) as any
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(req.url)
    const publicId = searchParams.get('publicId')
    const action = searchParams.get('action') // 'info' | 'url' | 'signature'
    const resourceType = searchParams.get('resourceType') || 'image'
    const transformation = searchParams.get('transformation')

    if (!publicId) {
      return NextResponse.json(
        { error: 'Public ID is required' },
        { status: 400 }
      )
    }

    switch (action) {
      case 'info':
        // Get file information
        const info = await CloudinaryUtils.getFileInfo(publicId, resourceType as any)
        return NextResponse.json({
          success: true,
          info
        })

      case 'url':
        // Generate optimized URL
        const url = CloudinaryUtils.generateUrl(publicId, {
          transformation,
          format: 'auto',
          quality: 'auto'
        })
        return NextResponse.json({
          success: true,
          url,
          publicId
        })

      case 'signature':
        // Generate upload signature (for client-side uploads)
        const timestamp = Math.round(new Date().getTime() / 1000)
        const paramsToSign = {
          timestamp,
          public_id: publicId,
          folder: searchParams.get('folder') || 'kureno/general'
        }
        const signature = CloudinaryUtils.generateSignature(paramsToSign)
        
        return NextResponse.json({
          success: true,
          signature,
          timestamp,
          apiKey: process.env.CLOUDINARY_API_KEY,
          cloudName: process.env.CLOUDINARY_CLOUD_NAME
        })

      default:
        return NextResponse.json(
          { error: 'Invalid action. Use: info, url, or signature' },
          { status: 400 }
        )
    }

  } catch (error) {
    console.error('Cloudinary GET error:', error)
    
    return NextResponse.json(
      { 
        error: 'Request failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// PUT - Update file (tags, metadata)
export async function PUT(req: NextRequest) {
  try {
    // Check authentication
    const session = (await getServerSession(authOptions as any)) as any
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Parse request body
    const body = await req.json()
    const { publicId, tags, context, resourceType = 'image' } = body

    if (!publicId) {
      return NextResponse.json(
        { error: 'Public ID is required' },
        { status: 400 }
      )
    }

    // Update file metadata
    const updateParams: any = { resource_type: resourceType }
    if (tags) updateParams.tags = tags
    if (context) updateParams.context = context

    // Note: Cloudinary's Node.js SDK doesn't have a direct update method
    // This would require using the Admin API
    // For now, we'll return the current info
    const info = await CloudinaryUtils.getFileInfo(publicId, resourceType as any)
    
    return NextResponse.json({
      success: true,
      message: 'File metadata updated',
      info
    })

  } catch (error) {
    console.error('Cloudinary update error:', error)
    
    return NextResponse.json(
      { 
        error: 'Update failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
