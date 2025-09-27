"use client"

import React from 'react'
import { CloudinaryImage, CloudinaryProductImage, CloudinaryAvatar, CloudinaryBlogImage } from './cloudinary-image'
import Image from 'next/image'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  type?: 'product' | 'avatar' | 'blog' | 'general'
  size?: 'small' | 'medium' | 'large' | 'xl' | number
  priority?: boolean
  loading?: 'lazy' | 'eager'
  quality?: number | 'auto'
  format?: 'auto' | 'webp' | 'jpg' | 'png'
  crop?: 'fill' | 'fit' | 'scale' | 'crop' | 'thumb' | 'pad' | 'lpad' | 'mfit' | 'mpad'
  gravity?: 'auto' | 'face' | 'center' | 'north' | 'south' | 'east' | 'west'
  fallback?: string
  onLoad?: () => void
  onError?: () => void
}

// Helper function to check if URL is from Cloudinary
const isCloudinaryUrl = (url: string): boolean => {
  return url.includes('cloudinary.com') || url.includes('res.cloudinary.com')
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  type = 'general',
  size = 'medium',
  priority = false,
  loading = 'lazy',
  quality = 'auto',
  format = 'auto',
  crop = 'fill',
  gravity = 'auto',
  fallback = '/placeholder.png',
  onLoad,
  onError,
  ...props
}: OptimizedImageProps) {
  // If it's a Cloudinary URL, use our optimized components
  if (isCloudinaryUrl(src)) {
    switch (type) {
      case 'product':
        return (
          <CloudinaryProductImage
            src={src}
            alt={alt}
            size={typeof size === 'number' ? 'medium' : size}
            className={className}
            priority={priority}
            loading={loading}
            quality={quality}
            format={format}
            crop={crop}
            gravity={gravity}
            fallback={fallback}
            onLoad={onLoad}
            onError={onError}
            {...props}
          />
        )
      
      case 'avatar':
        return (
          <CloudinaryAvatar
            src={src}
            alt={alt}
            size={typeof size === 'number' ? size : 40}
            className={className}
            priority={priority}
            loading={loading}
            quality={quality}
            format={format}
            fallback={fallback}
            onLoad={onLoad}
            onError={onError}
            {...props}
          />
        )
      
      case 'blog':
        return (
          <CloudinaryBlogImage
            src={src}
            alt={alt}
            className={className}
            priority={priority}
            loading={loading}
            quality={quality}
            format={format}
            crop={crop}
            gravity={gravity}
            fallback={fallback}
            onLoad={onLoad}
            onError={onError}
            {...props}
          />
        )
      
      default:
        return (
          <CloudinaryImage
            src={src}
            alt={alt}
            width={width}
            height={height}
            className={className}
            priority={priority}
            loading={loading}
            quality={quality}
            format={format}
            crop={crop}
            gravity={gravity}
            fallback={fallback}
            onLoad={onLoad}
            onError={onError}
            {...props}
          />
        )
    }
  }

  // For non-Cloudinary URLs, use regular Next.js Image
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      loading={loading}
      onLoad={onLoad}
      onError={onError}
      {...props}
    />
  )
}

// Export specific variants for convenience
export const ProductImage = (props: Omit<OptimizedImageProps, 'type'>) => (
  <OptimizedImage {...props} type="product" />
)

export const AvatarImage = (props: Omit<OptimizedImageProps, 'type'>) => (
  <OptimizedImage {...props} type="avatar" />
)

export const BlogImage = (props: Omit<OptimizedImageProps, 'type'>) => (
  <OptimizedImage {...props} type="blog" />
)

// Hook to get optimized image URL
export const useOptimizedImageUrl = (
  src: string,
  options: {
    width?: number
    height?: number
    quality?: number | 'auto'
    format?: 'auto' | 'webp' | 'jpg' | 'png'
    crop?: string
    gravity?: string
  } = {}
): string => {
  if (!isCloudinaryUrl(src)) {
    return src
  }

  // Extract public ID and build optimized URL
  try {
    const urlParts = src.split('/')
    const uploadIndex = urlParts.findIndex(part => part === 'upload')
    
    if (uploadIndex !== -1 && uploadIndex < urlParts.length - 1) {
      let startIndex = uploadIndex + 1
      if (urlParts[startIndex] && urlParts[startIndex].startsWith('v')) {
        startIndex += 1
      }
      
      const publicIdParts = urlParts.slice(startIndex)
      const publicIdWithExtension = publicIdParts.join('/')
      const publicId = publicIdWithExtension.replace(/\.[^/.]+$/, '')
      
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
      if (!cloudName) return src
      
      const transformations: string[] = []
      
      if (options.width && options.height) {
        transformations.push(`w_${options.width},h_${options.height}`)
      } else if (options.width) {
        transformations.push(`w_${options.width}`)
      } else if (options.height) {
        transformations.push(`h_${options.height}`)
      }
      
      transformations.push(`c_${options.crop || 'fill'}`)
      transformations.push(`g_${options.gravity || 'auto'}`)
      transformations.push(`q_${options.quality || 'auto'}`)
      transformations.push(`f_${options.format || 'auto'}`)
      
      const transformationString = transformations.join(',')
      return `https://res.cloudinary.com/${cloudName}/image/upload/${transformationString}/${publicId}`
    }
  } catch (error) {
    console.error('Error optimizing Cloudinary URL:', error)
  }
  
  return src
}
