import { NextRequest, NextResponse } from 'next/server'
import { CloudinaryUtils } from '@/lib/cloudinary'

// POST - Generate signed upload parameters
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { folder = 'general', publicIdPrefix } = body

    // Generate timestamp
    const timestamp = Math.round(new Date().getTime() / 1000)
    
    // Generate public ID if prefix provided
    let publicId: string | undefined
    if (publicIdPrefix) {
      const validPrefixes = ['products', 'avatars', 'blog'] as const
      if (validPrefixes.includes(publicIdPrefix as any)) {
        publicId = `${publicIdPrefix}_${timestamp}_${Math.random().toString(36).substring(2, 8)}`
      } else {
        publicId = `${publicIdPrefix}_${timestamp}_${Math.random().toString(36).substring(2, 8)}`
      }
    }

    // Prepare parameters to sign
    const paramsToSign = {
      timestamp,
      folder: folder || 'kureno/general',
      ...(publicId && { public_id: publicId })
    }

    // Generate signature
    const signature = CloudinaryUtils.generateSignature(paramsToSign)

    return NextResponse.json({
      success: true,
      signature,
      timestamp,
      apiKey: process.env.CLOUDINARY_API_KEY,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      folder: paramsToSign.folder,
      publicId: paramsToSign.public_id
    })

  } catch (error) {
    console.error('Signed upload error:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to generate signed upload parameters',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
