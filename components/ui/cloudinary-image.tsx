"use client"

import React, { useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface CloudinaryImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  quality?: number | 'auto'
  format?: 'auto' | 'webp' | 'jpg' | 'png'
  crop?: 'fill' | 'fit' | 'scale' | 'crop' | 'thumb' | 'pad' | 'lpad' | 'mfit' | 'mpad'
  gravity?: 'auto' | 'face' | 'center' | 'north' | 'south' | 'east' | 'west' | 'north_east' | 'north_west' | 'south_east' | 'south_west'
  blur?: number
  brightness?: number
  contrast?: number
  saturation?: number
  radius?: number | 'max'
  overlay?: string
  watermark?: string
  transformation?: string
  sizes?: string
  priority?: boolean
  loading?: 'lazy' | 'eager'
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
  onLoad?: () => void
  onError?: () => void
  fallback?: string
}

// Helper function to check if URL is from Cloudinary
const isCloudinaryUrl = (url: string): boolean => {
  return url.includes('cloudinary.com') || url.includes('res.cloudinary.com')
}

// Helper function to extract public ID from Cloudinary URL
const extractPublicId = (url: string): string | null => {
  try {
    const urlParts = url.split('/')
    const uploadIndex = urlParts.findIndex(part => part === 'upload')
    if (uploadIndex !== -1 && uploadIndex < urlParts.length - 1) {
      // Skip version if present (v1234567890)
      let startIndex = uploadIndex + 1
      if (urlParts[startIndex] && urlParts[startIndex].startsWith('v')) {
        startIndex += 1
      }
      
      // Get everything after upload (and version) as public ID
      const publicIdParts = urlParts.slice(startIndex)
      const publicIdWithExtension = publicIdParts.join('/')
      
      // Remove file extension
      return publicIdWithExtension.replace(/\.[^/.]+$/, '')
    }
    return null
  } catch {
    return null
  }
}

// Helper function to build Cloudinary transformation URL
const buildCloudinaryUrl = (
  publicId: string,
  cloudName: string,
  options: Partial<CloudinaryImageProps>
): string => {
  const transformations: string[] = []
  
  // Basic transformations
  if (options.width && options.height) {
    transformations.push(`w_${options.width},h_${options.height}`)
  } else if (options.width) {
    transformations.push(`w_${options.width}`)
  } else if (options.height) {
    transformations.push(`h_${options.height}`)
  }
  
  if (options.crop && options.crop !== 'fill') {
    transformations.push(`c_${options.crop}`)
  } else {
    transformations.push('c_fill')
  }
  
  if (options.gravity && options.gravity !== 'auto') {
    transformations.push(`g_${options.gravity}`)
  }
  
  if (options.quality) {
    transformations.push(`q_${options.quality}`)
  } else {
    transformations.push('q_auto')
  }
  
  if (options.format) {
    transformations.push(`f_${options.format}`)
  } else {
    transformations.push('f_auto')
  }
  
  // Effects
  if (options.blur) {
    transformations.push(`e_blur:${options.blur}`)
  }
  
  if (options.brightness) {
    transformations.push(`e_brightness:${options.brightness}`)
  }
  
  if (options.contrast) {
    transformations.push(`e_contrast:${options.contrast}`)
  }
  
  if (options.saturation) {
    transformations.push(`e_saturation:${options.saturation}`)
  }
  
  if (options.radius) {
    transformations.push(`r_${options.radius}`)
  }
  
  // Overlays
  if (options.overlay) {
    transformations.push(`l_${options.overlay}`)
  }
  
  if (options.watermark) {
    transformations.push(`l_text:Arial_20:${encodeURIComponent(options.watermark)},g_south_east,x_10,y_10,o_50`)
  }
  
  // Custom transformation
  if (options.transformation) {
    transformations.push(options.transformation)
  }
  
  const transformationString = transformations.join(',')
  
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformationString}/${publicId}`
}

export default function CloudinaryImage({
  src,
  alt,
  width,
  height,
  className,
  quality = 'auto',
  format = 'auto',
  crop = 'fill',
  gravity = 'auto',
  blur,
  brightness,
  contrast,
  saturation,
  radius,
  overlay,
  watermark,
  transformation,
  sizes,
  priority = false,
  loading = 'lazy',
  placeholder = 'blur',
  blurDataURL,
  onLoad,
  onError,
  fallback = '/placeholder.png',
  ...props
}: CloudinaryImageProps) {
  const [imageError, setImageError] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  // Handle image error
  const handleError = () => {
    setImageError(true)
    onError?.()
  }

  // Handle image load
  const handleLoad = () => {
    setImageLoaded(true)
    onLoad?.()
  }

  // If image failed to load, show fallback
  if (imageError) {
    return (
      <Image
        src={fallback}
        alt={alt}
        width={width}
        height={height}
        className={cn(className, "opacity-50")}
        priority={priority}
        {...props}
      />
    )
  }

  // Check if it's a Cloudinary URL and optimize it
  if (isCloudinaryUrl(src)) {
    const publicId = extractPublicId(src)
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
    
    if (publicId && cloudName) {
      const optimizedUrl = buildCloudinaryUrl(publicId, cloudName, {
        width,
        height,
        quality,
        format,
        crop,
        gravity,
        blur,
        brightness,
        contrast,
        saturation,
        radius,
        overlay,
        watermark,
        transformation
      })

      return (
        <div className={cn("relative", className)}>
          <Image
            src={optimizedUrl}
            alt={alt}
            width={width}
            height={height}
            className={cn(
              "transition-opacity duration-300",
              !imageLoaded && "opacity-0",
              imageLoaded && "opacity-100"
            )}
            sizes={sizes}
            priority={priority}
            loading={loading}
            placeholder={placeholder}
            blurDataURL={blurDataURL || (placeholder === 'blur' ? 
              `data:image/svg+xml;base64,${Buffer.from(
                `<svg width="${width || 400}" height="${height || 300}" xmlns="http://www.w3.org/2000/svg">
                  <rect width="100%" height="100%" fill="#f3f4f6"/>
                  <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#9ca3af" font-size="14">
                    Loading...
                  </text>
                </svg>`
              ).toString('base64')}` : undefined
            )}
            onLoad={handleLoad}
            onError={handleError}
            {...props}
          />
          
          {/* Loading overlay */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-muted animate-pulse rounded-md flex items-center justify-center">
              <div className="text-muted-foreground text-sm">Loading...</div>
            </div>
          )}
        </div>
      )
    }
  }

  // For non-Cloudinary URLs, use regular Next.js Image
  return (
    <div className={cn("relative", className)}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={cn(
          "transition-opacity duration-300",
          !imageLoaded && "opacity-0",
          imageLoaded && "opacity-100"
        )}
        sizes={sizes}
        priority={priority}
        loading={loading}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />
      
      {/* Loading overlay */}
      {!imageLoaded && (
        <div className="absolute inset-0 bg-muted animate-pulse rounded-md flex items-center justify-center">
          <div className="text-muted-foreground text-sm">Loading...</div>
        </div>
      )}
    </div>
  )
}

// Preset components for common use cases
export const CloudinaryProductImage = ({
  src,
  alt,
  size = 'medium',
  ...props
}: Omit<CloudinaryImageProps, 'width' | 'height'> & {
  size?: 'small' | 'medium' | 'large' | 'xl'
}) => {
  const dimensions = {
    small: { width: 200, height: 200 },
    medium: { width: 400, height: 400 },
    large: { width: 600, height: 600 },
    xl: { width: 800, height: 800 }
  }

  return (
    <CloudinaryImage
      src={src}
      alt={alt}
      {...dimensions[size]}
      crop="fill"
      gravity="center"
      quality="auto"
      format="auto"
      {...props}
    />
  )
}

export const CloudinaryAvatar = ({
  src,
  alt,
  size = 40,
  ...props
}: Omit<CloudinaryImageProps, 'width' | 'height' | 'crop' | 'gravity'> & {
  size?: number
}) => {
  return (
    <CloudinaryImage
      src={src}
      alt={alt}
      width={size}
      height={size}
      crop="thumb"
      gravity="face"
      radius="max"
      quality="auto"
      format="auto"
      className={cn("rounded-full", props.className)}
      {...props}
    />
  )
}

export const CloudinaryBlogImage = ({
  src,
  alt,
  ...props
}: CloudinaryImageProps) => {
  return (
    <CloudinaryImage
      src={src}
      alt={alt}
      width={800}
      height={400}
      crop="fill"
      gravity="center"
      quality="auto"
      format="auto"
      className={cn("rounded-lg", props.className)}
      {...props}
    />
  )
}
