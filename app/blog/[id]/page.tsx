import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Clock, User, Calendar, Tag, BookOpen } from "lucide-react"
import BlogInteractions from "./blog-interactions"

async function fetchPost(id: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/blog/${id}`, { 
      cache: "no-store",
      headers: {
        'Content-Type': 'application/json',
      }
    })
    if (!res.ok) {
      console.error(`Failed to fetch blog post: ${res.status} ${res.statusText}`)
      return null
    }
    const data = await res.json()
    return data.post
  } catch (error) {
    console.error('Error fetching blog post:', error)
    return null
  }
}

export default async function BlogDetail({ params }: { params: { id: string } }) {
  const post = await fetchPost(params.id)
  if (!post) return notFound()

  const publishedDate = new Date(post.publishedAt || post.createdAt)
  const readTime = Math.ceil((post.content?.length || 0) / 500) // Estimate 500 words per minute

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb & Back Button */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/blog">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Link>
            </Button>
            <Separator orientation="vertical" className="h-4" />
            <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-foreground">Home</Link>
              <span>/</span>
              <Link href="/blog" className="hover:text-foreground">Blog</Link>
              <span>/</span>
              <span className="text-foreground line-clamp-1">{post.title}</span>
            </nav>
          </div>
        </div>
      </div>

      <div className="container py-8">
        <div className="grid gap-8 lg:grid-cols-4">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Article Header */}
            <div className="mb-8">
              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="mb-4 flex flex-wrap gap-2">
                  {post.tags.map((tag: string, index: number) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      <Tag className="h-3 w-3" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Title */}
              <h1 className="mb-6 text-4xl font-bold tracking-tight leading-tight">
                {post.title}
              </h1>

              {/* Meta Information */}
              <div className="mb-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
          <div className="relative h-8 w-8 overflow-hidden rounded-full">
            <Image src="/placeholder-user.jpg" alt="Author" fill className="object-cover" />
          </div>
                  <span className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {post.author?.name || "Admin"}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {publishedDate.toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {readTime} min read
                </div>
                <div className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4" />
                  {post.published ? 'Published' : 'Draft'}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mb-8">
                <BlogInteractions postId={post._id} postTitle={post.title} />
              </div>
            </div>

            {/* Featured Image */}
            <div className="relative mb-8 aspect-video w-full overflow-hidden rounded-xl border bg-muted">
              <Image 
                src={post.coverImage || "/placeholder.jpg"} 
                alt={post.title} 
                fill 
                className="object-cover transition-transform hover:scale-105" 
                priority
              />
            </div>

            {/* Article Content */}
            <article className="prose prose-lg dark:prose-invert max-w-none">
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </article>

            {/* Article Footer */}
            <div className="mt-12 pt-8 border-t">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Share this article:</span>
                  <BlogInteractions postId={post._id} postTitle={post.title} />
                </div>
                <div className="text-sm text-muted-foreground">
                  Last updated: {new Date(post.updatedAt || post.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Author Card */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="relative h-12 w-12 overflow-hidden rounded-full">
                      <Image src="/placeholder-user.jpg" alt="Author" fill className="object-cover" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{post.author?.name || "Admin"}</h3>
                      <p className="text-sm text-muted-foreground">Content Writer</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Passionate about sharing knowledge and insights through engaging content.
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    Follow
                  </Button>
                </CardContent>
              </Card>

              {/* Table of Contents */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Table of Contents</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <div className="h-1 w-1 rounded-full bg-muted-foreground" />
                      <span>Introduction</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <div className="h-1 w-1 rounded-full bg-muted-foreground" />
                      <span>Main Content</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <div className="h-1 w-1 rounded-full bg-muted-foreground" />
                      <span>Conclusion</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Related Posts */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Related Posts</h3>
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex gap-3">
                        <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
                          <Image 
                            src="/placeholder.jpg" 
                            alt={`Related post ${i}`} 
                            fill 
                            className="object-cover" 
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium line-clamp-2 mb-1">
                            Related Blog Post {i}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            {new Date().toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Related Articles Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-8">You Might Also Like</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="group overflow-hidden transition-all hover:shadow-lg">
                <div className="relative aspect-video overflow-hidden">
                  <Image 
                    src="/placeholder.jpg" 
                    alt={`Related article ${i}`} 
                    fill 
                    className="object-cover transition-transform group-hover:scale-105" 
                  />
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary">Technology</Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date().toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="font-medium mb-2 line-clamp-2">
                    Related Article {i}: How to Build Better User Experiences
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    Discover the latest trends and best practices in modern web development.
                  </p>
                </CardContent>
              </Card>
            ))}
        </div>
        </div>
      </div>
    </div>
  )
}


