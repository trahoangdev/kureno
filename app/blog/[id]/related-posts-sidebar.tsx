"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { User, Eye } from "lucide-react"

interface RelatedPost {
  _id: string
  title: string
  excerpt: string
  slug: string
  coverImage: string
  tags: string[]
  publishedAt: string
  createdAt: string
  views: number
  author: {
    _id: string
    name: string
  } | null
}

interface RelatedPostsSidebarProps {
  currentPostId: string
  limit?: number
}

export default function RelatedPostsSidebar({ currentPostId, limit = 3 }: RelatedPostsSidebarProps) {
  const [posts, setPosts] = useState<RelatedPost[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchRelatedPosts = async () => {
      try {
        setIsLoading(true)
        const res = await fetch(`/api/blog/${currentPostId}/related?limit=${limit}`)
        if (res.ok) {
          const data = await res.json()
          setPosts(data.posts || [])
        }
      } catch (error) {
        console.error('Error fetching related posts:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRelatedPosts()
  }, [currentPostId, limit])

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="flex gap-3">
              <div className="w-16 h-16 bg-muted rounded-lg" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-1/2" />
                <div className="h-3 bg-muted rounded w-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-sm text-muted-foreground">No related posts found.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <Link key={post._id} href={`/blog/${post._id}`}>
          <div className="group flex gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
            {/* Image */}
            <div className="relative w-16 h-16 overflow-hidden rounded-lg bg-muted flex-shrink-0">
              <Image 
                src={post.coverImage || "/placeholder.png"} 
                alt={post.title} 
                fill 
                className="object-cover transition-transform group-hover:scale-105" 
              />
            </div>
            
            {/* Content */}
            <div className="flex-1 min-w-0 space-y-2">
              {/* Tags */}
              <div className="flex flex-wrap gap-1">
                {post.tags.slice(0, 2).map((tag, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary" 
                    className="text-xs bg-muted text-muted-foreground hover:bg-muted/80 px-1.5 py-0.5"
                  >
                    {tag.length > 6 ? tag.substring(0, 6) + "..." : tag}
                  </Badge>
                ))}
              </div>

              {/* View Count */}
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Eye className="h-3 w-3" />
                {post.views || 0}
              </div>
              
              {/* Title */}
              <h4 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
                {post.title.length > 40 ? post.title.substring(0, 40) + "..." : post.title}
              </h4>
              
              {/* Description */}
              <p className="text-xs text-muted-foreground line-clamp-2">
                {post.excerpt.length > 60 ? post.excerpt.substring(0, 60) + "..." : post.excerpt}
              </p>

              {/* Author */}
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <User className="h-3 w-3" />
                {post.author?.name || "Admin User"}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
