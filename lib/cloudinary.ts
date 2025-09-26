import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: process.env.CLOUDINARY_SECURE === 'true',
})

// Types for upload options
export interface CloudinaryUploadOptions {
  folder?: string
  publicId?: string
  transformation?: string
  resourceType?: 'image' | 'video' | 'raw' | 'auto'
  format?: string
  quality?: string | number
  width?: number
  height?: number
  crop?: string
  gravity?: string
  tags?: string[]
}

// Upload result interface
export interface CloudinaryUploadResult {
  public_id: string
  version: number
  signature: string
  width: number
  height: number
  format: string
  resource_type: string
  created_at: string
  tags: string[]
  bytes: number
  type: string
  etag: string
  placeholder: boolean
  url: string
  secure_url: string
  folder: string
  access_mode: string
  original_filename: string
}

// Error interface
export interface CloudinaryError {
  message: string
  name: string
  http_code: number
}

// Utility functions
export const CloudinaryUtils = {
  // Upload file from buffer or file path
  async uploadFile(
    file: Buffer | string,
    options: CloudinaryUploadOptions = {}
  ): Promise<CloudinaryUploadResult> {
    try {
      const uploadOptions = {
        folder: options.folder || process.env.CLOUDINARY_FOLDER_GENERAL,
        public_id: options.publicId,
        resource_type: options.resourceType || 'auto',
        transformation: options.transformation,
        format: options.format,
        quality: options.quality || 'auto',
        width: options.width,
        height: options.height,
        crop: options.crop,
        gravity: options.gravity,
        tags: options.tags,
        use_filename: true,
        unique_filename: false,
        overwrite: true,
      }

      const result = await cloudinary.uploader.upload(file as string, uploadOptions)
      return result as CloudinaryUploadResult
    } catch (error) {
      console.error('Cloudinary upload error:', error)
      throw error as CloudinaryError
    }
  },

  // Upload image with optimizations
  async uploadImage(
    file: Buffer | string,
    options: {
      folder?: string
      publicId?: string
      size?: 'thumbnail' | 'medium' | 'large' | 'original'
      tags?: string[]
    } = {}
  ): Promise<CloudinaryUploadResult> {
    const transformations = {
      thumbnail: process.env.CLOUDINARY_TRANSFORM_THUMBNAIL || 'c_thumb,w_150,h_150',
      medium: process.env.CLOUDINARY_TRANSFORM_MEDIUM || 'c_fill,w_500,h_500,q_auto,f_auto',
      large: process.env.CLOUDINARY_TRANSFORM_LARGE || 'c_fill,w_1200,h_800,q_auto,f_auto',
      original: 'q_auto,f_auto'
    }

    return this.uploadFile(file, {
      ...options,
      resourceType: 'image',
      transformation: transformations[options.size || 'medium'],
      format: 'auto',
      quality: 'auto'
    })
  },

  // Upload video with optimizations
  async uploadVideo(
    file: Buffer | string,
    options: {
      folder?: string
      publicId?: string
      tags?: string[]
    } = {}
  ): Promise<CloudinaryUploadResult> {
    return this.uploadFile(file, {
      ...options,
      resourceType: 'video',
      format: process.env.CLOUDINARY_VIDEO_FORMAT || 'auto',
      quality: process.env.CLOUDINARY_VIDEO_QUALITY || 'auto'
    })
  },

  // Delete file from Cloudinary
  async deleteFile(publicId: string, resourceType: 'image' | 'video' | 'raw' = 'image'): Promise<any> {
    try {
      const result = await cloudinary.uploader.destroy(publicId, { resource_type: resourceType })
      return result
    } catch (error) {
      console.error('Cloudinary delete error:', error)
      throw error
    }
  },

  // Generate optimized URL
  generateUrl(
    publicId: string,
    options: {
      width?: number
      height?: number
      crop?: string
      quality?: string | number
      format?: string
      transformation?: string
    } = {}
  ): string {
    return cloudinary.url(publicId, {
      secure: true,
      quality: options.quality || 'auto',
      format: options.format || 'auto',
      width: options.width,
      height: options.height,
      crop: options.crop || 'fill',
      transformation: options.transformation
    })
  },

  // Generate video URL
  generateVideoUrl(
    publicId: string,
    options: {
      width?: number
      height?: number
      quality?: string
      format?: string
    } = {}
  ): string {
    return cloudinary.url(publicId, {
      secure: true,
      resource_type: 'video',
      quality: options.quality || 'auto',
      format: options.format || 'auto',
      width: options.width,
      height: options.height
    })
  },

  // Get file info
  async getFileInfo(publicId: string, resourceType: 'image' | 'video' | 'raw' = 'image'): Promise<any> {
    try {
      const result = await cloudinary.api.resource(publicId, { resource_type: resourceType })
      return result
    } catch (error) {
      console.error('Cloudinary get info error:', error)
      throw error
    }
  },

  // List files in folder
  async listFiles(
    folder: string,
    options: {
      resourceType?: 'image' | 'video' | 'raw'
      maxResults?: number
      nextCursor?: string
    } = {}
  ): Promise<any> {
    try {
      const result = await cloudinary.api.resources({
        type: 'upload',
        prefix: folder,
        resource_type: options.resourceType || 'image',
        max_results: options.maxResults || 50,
        next_cursor: options.nextCursor
      })
      return result
    } catch (error) {
      console.error('Cloudinary list files error:', error)
      throw error
    }
  },

  // Create upload signature for client-side uploads
  generateSignature(paramsToSign: Record<string, any>): string {
    return cloudinary.utils.api_sign_request(paramsToSign, process.env.CLOUDINARY_API_SECRET!)
  },

  // Validate file type
  isValidImageType(mimeType: string): boolean {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
    return validTypes.includes(mimeType.toLowerCase())
  },

  // Validate video type
  isValidVideoType(mimeType: string): boolean {
    const validTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/flv', 'video/webm', 'video/mkv']
    return validTypes.includes(mimeType.toLowerCase())
  },

  // Get file size limit (in bytes)
  getMaxFileSize(type: 'image' | 'video'): number {
    return type === 'image' ? 10 * 1024 * 1024 : 100 * 1024 * 1024 // 10MB for images, 100MB for videos
  }
}

// Default export
export default cloudinary

// Helper function to get folder path
export const getFolderPath = (type: 'products' | 'avatars' | 'blog' | 'general' | 'videos'): string => {
  const folders = {
    products: process.env.CLOUDINARY_FOLDER_PRODUCTS || 'kureno/products',
    avatars: process.env.CLOUDINARY_FOLDER_AVATARS || 'kureno/avatars',
    blog: process.env.CLOUDINARY_FOLDER_BLOG || 'kureno/blog',
    general: process.env.CLOUDINARY_FOLDER_GENERAL || 'kureno/general',
    videos: process.env.CLOUDINARY_FOLDER_VIDEOS || 'kureno/videos'
  }
  return folders[type]
}

// Helper function to generate public ID
export const generatePublicId = (
  type: 'products' | 'avatars' | 'blog',
  identifier: string
): string => {
  const prefixes = {
    products: process.env.CLOUDINARY_PREFIX_PRODUCTS || 'product_',
    avatars: process.env.CLOUDINARY_PREFIX_AVATARS || 'avatar_',
    blog: process.env.CLOUDINARY_PREFIX_BLOG || 'blog_'
  }
  
  const timestamp = Date.now()
  const randomString = Math.random().toString(36).substring(2, 8)
  
  return `${prefixes[type]}${identifier}_${timestamp}_${randomString}`
}
