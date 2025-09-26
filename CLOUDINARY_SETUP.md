# Cloudinary Integration Setup Guide

This guide will help you set up Cloudinary integration for the Kureno website to handle image and video uploads with automatic optimization.

## 🚀 Quick Start

### 1. Environment Variables Setup

Copy the values from `cloud.env` to your `.env.local` file:

```bash
# Basic Cloudinary Settings
CLOUDINARY_CLOUD_NAME=dvnm6el2s
CLOUDINARY_API_KEY=236579275844762
CLOUDINARY_API_SECRET=QJEJBUr13O16r0wp2ztXnP9dwCg

# Upload Presets (Create these in your Cloudinary dashboard)
CLOUDINARY_UPLOAD_PRESET_IMAGES=kureno_images
CLOUDINARY_UPLOAD_PRESET_VIDEOS=kureno_videos

# Folder Structure for Organization
CLOUDINARY_FOLDER_PRODUCTS=kureno/products
CLOUDINARY_FOLDER_AVATARS=kureno/avatars
CLOUDINARY_FOLDER_BLOG=kureno/blog
CLOUDINARY_FOLDER_GENERAL=kureno/general
CLOUDINARY_FOLDER_VIDEOS=kureno/videos

# Public ID Prefixes
CLOUDINARY_PREFIX_PRODUCTS=product_
CLOUDINARY_PREFIX_AVATARS=avatar_
CLOUDINARY_PREFIX_BLOG=blog_

# Image Transformation Presets
CLOUDINARY_TRANSFORM_THUMBNAIL=c_thumb,w_150,h_150,g_face
CLOUDINARY_TRANSFORM_MEDIUM=c_fill,w_500,h_500,q_auto,f_auto
CLOUDINARY_TRANSFORM_LARGE=c_fill,w_1200,h_800,q_auto,f_auto

# Video Settings
CLOUDINARY_VIDEO_QUALITY=auto
CLOUDINARY_VIDEO_FORMAT=auto

# Security Settings
CLOUDINARY_SECURE=true
CLOUDINARY_SIGNED_UPLOADS=true

# Optional: CDN Settings
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dvnm6el2s
```

### 2. Cloudinary Dashboard Setup

1. **Login to Cloudinary**: Go to [cloudinary.com](https://cloudinary.com) and login with your account
2. **Create Upload Presets**:
   - Go to Settings > Upload
   - Create preset `kureno_images` with:
     - Mode: Unsigned
     - Folder: kureno/general
     - Format: Auto
     - Quality: Auto
   - Create preset `kureno_videos` with:
     - Mode: Unsigned
     - Resource Type: Video
     - Folder: kureno/videos
     - Quality: Auto

### 3. Test the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to Admin Panel > Products > Add New Product
3. Go to the "Media" tab
4. Test uploading images using the Cloudinary upload component

## 📁 File Structure

```
├── lib/
│   └── cloudinary.ts                 # Cloudinary utilities and configuration
├── components/ui/
│   ├── cloudinary-upload.tsx         # Image/file upload component
│   ├── cloudinary-video-upload.tsx   # Video upload component
│   ├── cloudinary-image.tsx          # Optimized image display component
│   └── optimized-image.tsx           # Smart image component (auto-detects Cloudinary URLs)
├── app/api/upload/
│   └── cloudinary/
│       └── route.ts                  # API endpoints for Cloudinary operations
├── app/admin/products/
│   ├── cloudinary-image-upload.tsx   # Product-specific image upload
│   └── new/page.tsx                  # Updated to use Cloudinary
└── app/admin/blog/
    └── new/page.tsx                  # Updated to use Cloudinary
```

## 🛠️ Components Usage

### CloudinaryUpload Component

```tsx
import CloudinaryUpload, { CloudinaryFile } from '@/components/ui/cloudinary-upload'

<CloudinaryUpload
  onUpload={(files: CloudinaryFile[]) => {
    // Handle uploaded files
    console.log('Uploaded files:', files)
  }}
  maxFiles={10}
  maxFileSize={10} // MB
  acceptedTypes={['image']}
  folder="products"
  multiple={true}
  showPreview={true}
/>
```

### CloudinaryVideoUpload Component

```tsx
import CloudinaryVideoUpload, { CloudinaryVideo } from '@/components/ui/cloudinary-video-upload'

<CloudinaryVideoUpload
  onUpload={(videos: CloudinaryVideo[]) => {
    // Handle uploaded videos
    console.log('Uploaded videos:', videos)
  }}
  maxFiles={5}
  maxFileSize={100} // MB
  folder="blog"
  multiple={true}
  showPreview={true}
/>
```

### OptimizedImage Component

```tsx
import OptimizedImage from '@/components/ui/optimized-image'

// Automatically optimizes Cloudinary URLs, falls back to regular images
<OptimizedImage
  src="https://res.cloudinary.com/dvnm6el2s/image/upload/v1234567890/products/sample.jpg"
  alt="Product image"
  width={400}
  height={400}
  type="product"
  size="medium"
  quality="auto"
  format="auto"
/>
```

### CloudinaryImage Components

```tsx
import { CloudinaryProductImage, CloudinaryAvatar, CloudinaryBlogImage } from '@/components/ui/cloudinary-image'

// Product images with automatic optimization
<CloudinaryProductImage
  src="cloudinary-url"
  alt="Product"
  size="large"
/>

// User avatars with face detection
<CloudinaryAvatar
  src="cloudinary-url"
  alt="User avatar"
  size={64}
/>

// Blog post images
<CloudinaryBlogImage
  src="cloudinary-url"
  alt="Blog post"
/>
```

## 🔧 API Endpoints

### Upload File
```
POST /api/upload/cloudinary
Content-Type: multipart/form-data

Body:
- file: File to upload
- folder: Target folder (optional)
- resource_type: 'image' | 'video' (optional)
- tags: Comma-separated tags (optional)
```

### Delete File
```
DELETE /api/upload/cloudinary
Content-Type: application/json

Body:
{
  "publicId": "folder/filename",
  "resourceType": "image" | "video"
}
```

### Get File Info
```
GET /api/upload/cloudinary?publicId=folder/filename&action=info
```

### Generate Optimized URL
```
GET /api/upload/cloudinary?publicId=folder/filename&action=url&transformation=w_400,h_400,c_fill
```

## 🎨 Image Transformations

Cloudinary automatically optimizes images with these transformations:

### Preset Sizes
- **Thumbnail**: 150x150px, cropped to face
- **Medium**: 500x500px, auto quality and format
- **Large**: 1200x800px, auto quality and format

### Custom Transformations
```tsx
// Manual transformation
<CloudinaryImage
  src="cloudinary-url"
  width={400}
  height={300}
  crop="fill"
  gravity="face"
  quality={80}
  format="webp"
/>

// With effects
<CloudinaryImage
  src="cloudinary-url"
  width={400}
  height={300}
  blur={5}
  brightness={20}
  contrast={10}
/>
```

## 📊 Folder Organization

```
kureno/
├── products/          # Product images
├── avatars/           # User profile pictures
├── blog/              # Blog post images and videos
├── general/           # General uploads
└── videos/            # Video content
```

## 🔒 Security Features

1. **Signed Uploads**: All uploads are authenticated
2. **File Type Validation**: Only allowed file types are accepted
3. **File Size Limits**: Configurable limits for images (10MB) and videos (100MB)
4. **User Authentication**: Only authenticated users can upload
5. **Folder Isolation**: Files are organized in specific folders

## 🚀 Performance Benefits

1. **Automatic Optimization**: Images are automatically compressed and optimized
2. **Format Selection**: Best format (WebP, AVIF) based on browser support
3. **Responsive Images**: Automatic sizing based on device
4. **CDN Delivery**: Global CDN for fast loading
5. **Lazy Loading**: Built-in lazy loading support

## 🐛 Troubleshooting

### Common Issues

1. **Upload fails with 401 error**
   - Check your API credentials in `.env.local`
   - Ensure CLOUDINARY_API_SECRET is correct

2. **Images not displaying**
   - Verify NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is set
   - Check if the image URL is correct

3. **Upload preset not found**
   - Create upload presets in Cloudinary dashboard
   - Ensure preset names match environment variables

4. **File size too large**
   - Check maxFileSize prop on upload components
   - Verify Cloudinary account limits

### Debug Mode

Enable debug logging by adding to your `.env.local`:
```bash
NEXT_PUBLIC_DEBUG_CLOUDINARY=true
```

## 📈 Monitoring

Monitor your Cloudinary usage:
1. Go to [Cloudinary Dashboard](https://cloudinary.com/console)
2. Check usage statistics
3. Monitor transformation credits
4. Review storage usage

## 🔄 Migration from Local Storage

To migrate existing images:

1. **Backup existing images** in `public/uploads/`
2. **Upload to Cloudinary** using the upload components
3. **Update database** with new Cloudinary URLs
4. **Test thoroughly** before removing local files

## 📚 Additional Resources

- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Next.js Image Optimization](https://nextjs.org/docs/basic-features/image-optimization)
- [Cloudinary React SDK](https://cloudinary.com/documentation/react_integration)

## ✅ Checklist

- [ ] Environment variables configured
- [ ] Upload presets created in Cloudinary dashboard
- [ ] Components integrated in admin panels
- [ ] API endpoints tested
- [ ] Image optimization verified
- [ ] Video upload tested (if needed)
- [ ] Error handling implemented
- [ ] Performance monitoring set up

---

**Note**: This integration is now active in the `cloudinary-integration` branch. Test thoroughly before merging to main branch.
