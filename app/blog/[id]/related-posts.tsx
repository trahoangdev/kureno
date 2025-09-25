"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, User, Eye } from "lucide-react"

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

interface RelatedPostsProps {
  currentPostId: string
  limit?: number
}

export default function RelatedPosts({ currentPostId, limit = 6 }: RelatedPostsProps) {
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

  const calculateReadTime = (excerpt: string) => {
    // Estimate based on excerpt length (rough approximation)
    const words = excerpt.split(' ').length
    return Math.max(1, Math.ceil(words / 50)) // Assume 50 words per minute for excerpt
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <div className="relative aspect-video bg-muted" />
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-4 bg-muted rounded w-1/2" />
                <div className="h-3 bg-muted rounded w-full" />
                <div className="h-3 bg-muted rounded w-2/3" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No related posts found.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <Link key={post._id} href={`/blog/${post._id}`}>
          <Card className="group overflow-hidden transition-all hover:shadow-lg">
            <div className="relative aspect-video overflow-hidden">
              <Image 
                src={post.coverImage || "/placeholder.png"} 
                alt={post.title} 
                fill 
                className="object-cover transition-transform group-hover:scale-105" 
              />
            </div>
            <CardContent className="p-4">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {post.tags.slice(0, 2).map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                <div className="flex items-center gap-1 text-xs text-muted-foreground ml-auto">
                  <Eye className="h-3 w-3" />
                  {post.views || 0}
                </div>
              </div>
              
              <h3 className="font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                {post.title}
              </h3>
              
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                {post.excerpt}
              </p>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {post.author?.name || "Admin"}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {calculateReadTime(post.excerpt)} min
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
