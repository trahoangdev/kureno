import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'

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

    // Check Cloudinary configuration
    const config = {
      cloud_name: !!process.env.CLOUDINARY_CLOUD_NAME,
      api_key: !!process.env.CLOUDINARY_API_KEY,
      api_secret: !!process.env.CLOUDINARY_API_SECRET,
      public_cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      folders: {
        products: process.env.CLOUDINARY_FOLDER_PRODUCTS || 'kureno/products',
        blog: process.env.CLOUDINARY_FOLDER_BLOG || 'kureno/blog',
        avatars: process.env.CLOUDINARY_FOLDER_AVATARS || 'kureno/avatars',
        general: process.env.CLOUDINARY_FOLDER_GENERAL || 'kureno/general',
        videos: process.env.CLOUDINARY_FOLDER_VIDEOS || 'kureno/videos',
      },
      upload_presets: {
        images: process.env.CLOUDINARY_UPLOAD_PRESET_IMAGES,
        videos: process.env.CLOUDINARY_UPLOAD_PRESET_VIDEOS,
      }
    }

    const isConfigured = config.cloud_name && config.api_key && config.api_secret

    return NextResponse.json({
      configured: isConfigured,
      config: {
        ...config,
        // Don't expose sensitive data
        api_secret: config.api_secret ? '[CONFIGURED]' : '[MISSING]'
      },
      message: isConfigured 
        ? 'Cloudinary is properly configured' 
        : 'Cloudinary configuration is incomplete. Please check your environment variables.'
    })

  } catch (error) {
    console.error('Config check error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to check configuration',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
