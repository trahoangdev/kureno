import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const envCheck = {
      CLOUDINARY_CLOUD_NAME: !!process.env.CLOUDINARY_CLOUD_NAME,
      CLOUDINARY_API_KEY: !!process.env.CLOUDINARY_API_KEY,
      CLOUDINARY_API_SECRET: !!process.env.CLOUDINARY_API_SECRET,
      CLOUDINARY_SECURE: process.env.CLOUDINARY_SECURE,
      CLOUDINARY_FOLDER_PRODUCTS: process.env.CLOUDINARY_FOLDER_PRODUCTS,
      CLOUDINARY_FOLDER_VIDEOS: process.env.CLOUDINARY_FOLDER_VIDEOS,
      CLOUDINARY_FOLDER_BLOG: process.env.CLOUDINARY_FOLDER_BLOG,
      CLOUDINARY_FOLDER_GENERAL: process.env.CLOUDINARY_FOLDER_GENERAL,
      CLOUDINARY_FOLDER_AVATARS: process.env.CLOUDINARY_FOLDER_AVATARS,
    }
    
    return NextResponse.json({
      success: true,
      environment: envCheck,
      message: 'Environment variables check'
    })
  } catch (error) {
    return NextResponse.json(
      { 
        error: 'Failed to check environment',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
