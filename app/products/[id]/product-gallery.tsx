"use client"

import { useState } from "react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ZoomIn, X, ChevronLeft, ChevronRight } from "lucide-react"

interface ProductGalleryProps {
  images: string[]
  name: string
  featured?: boolean
}

export default function ProductGallery({ images, name, featured }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square w-full overflow-hidden rounded-xl border bg-muted group">
        <Image 
          src={images[selectedImage] || "/placeholder.jpg"} 
          alt={name} 
          fill 
          className="object-cover transition-transform duration-300 group-hover:scale-105" 
          priority
        />
        
        {/* Featured Badge */}
        {featured && (
          <Badge className="absolute left-4 top-4 bg-teal-500 hover:bg-teal-600">
            Featured
          </Badge>
        )}

        {/* Zoom Button */}
        <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
          <DialogTrigger asChild>
            <Button
              variant="secondary"
              size="sm"
              className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] p-0">
            <DialogHeader className="p-6 pb-0">
              <DialogTitle>{name}</DialogTitle>
            </DialogHeader>
            <div className="relative aspect-square w-full overflow-hidden">
              <Image 
                src={images[selectedImage] || "/placeholder.jpg"} 
                alt={name} 
                fill 
                className="object-contain" 
              />
              
              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="absolute left-4 top-1/2 transform -translate-y-1/2"
                    onClick={prevImage}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2"
                    onClick={nextImage}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Navigation Arrows for Main Image */}
        {images.length > 1 && (
          <>
            <Button
              variant="secondary"
              size="sm"
              className="absolute left-4 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              onClick={prevImage}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              onClick={nextImage}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-4 right-4 bg-black/50 text-white px-2 py-1 rounded text-sm">
            {selectedImage + 1} / {images.length}
          </div>
        )}
      </div>
      
      {/* Thumbnail Images */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {images.slice(0, 4).map((src, i) => (
            <div 
              key={i} 
              className={`relative aspect-square overflow-hidden rounded-lg border bg-muted cursor-pointer transition-all duration-200 ${
                selectedImage === i 
                  ? 'ring-2 ring-teal-500 border-teal-500' 
                  : 'hover:border-teal-300'
              }`}
              onClick={() => setSelectedImage(i)}
            >
              <Image 
                src={src} 
                alt={`${name} ${i + 1}`} 
                fill 
                className="object-cover transition-transform hover:scale-105" 
              />
              {selectedImage === i && (
                <div className="absolute inset-0 bg-teal-500/20" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
