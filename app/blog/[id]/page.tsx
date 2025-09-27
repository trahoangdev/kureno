import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Clock, User, Calendar, Tag, BookOpen } from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeHighlight from "rehype-highlight"
import BlogInteractions from "./blog-interactions"
import RelatedPosts from "./related-posts"
import RelatedPostsSidebar from "./related-posts-sidebar"
import TableOfContents from "./table-of-contents"
import ReadingProgress from "./reading-progress"
import CommentsSystem from "./comments-system"

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
      <ReadingProgress />
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
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
                components={{
                  h1: ({ children }) => {
                    const id = children?.toString().toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim() || ''
                    return <h1 id={id} className="text-3xl font-bold mb-6 mt-8 first:mt-0 scroll-mt-20">{children}</h1>
                  },
                  h2: ({ children }) => {
                    const id = children?.toString().toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim() || ''
                    return <h2 id={id} className="text-2xl font-bold mb-4 mt-6 scroll-mt-20">{children}</h2>
                  },
                  h3: ({ children }) => {
                    const id = children?.toString().toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim() || ''
                    return <h3 id={id} className="text-xl font-semibold mb-3 mt-5 scroll-mt-20">{children}</h3>
                  },
                  h4: ({ children }) => {
                    const id = children?.toString().toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim() || ''
                    return <h4 id={id} className="text-lg font-semibold mb-2 mt-4 scroll-mt-20">{children}</h4>
                  },
                  p: ({ children }) => <p className="mb-4 leading-relaxed">{children}</p>,
                  ul: ({ children }) => <ul className="mb-4 ml-6 list-disc space-y-2">{children}</ul>,
                  ol: ({ children }) => <ol className="mb-4 ml-6 list-decimal space-y-2">{children}</ol>,
                  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-primary pl-4 italic my-4 text-muted-foreground">
                      {children}
                    </blockquote>
                  ),
                  code: ({ children, className }) => {
                    const isInline = !className
                    if (isInline) {
                      return <code className="bg-muted px-1 py-0.5 rounded text-sm font-mono">{children}</code>
                    }
                    return (
                      <pre className="bg-muted p-4 rounded-lg overflow-x-auto my-4">
                        <code className={className}>{children}</code>
                      </pre>
                    )
                  },
                  a: ({ href, children }) => (
                    <a 
                      href={href} 
                      className="text-primary hover:underline" 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      {children}
                    </a>
                  ),
                  img: ({ src, alt }) => (
                    <div className="my-6">
                      <Image 
                        src={src || "/placeholder.png"} 
                        alt={alt || ""} 
                        width={800} 
                        height={400} 
                        className="rounded-lg w-full h-auto"
                      />
                    </div>
                  ),
                  table: ({ children }) => (
                    <div className="overflow-x-auto my-6">
                      <table className="min-w-full border-collapse border border-border">
                        {children}
                      </table>
                    </div>
                  ),
                  th: ({ children }) => (
                    <th className="border border-border px-4 py-2 bg-muted font-semibold text-left">
                      {children}
                    </th>
                  ),
                  td: ({ children }) => (
                    <td className="border border-border px-4 py-2">
                      {children}
                    </td>
                  ),
                }}
              >
                {post.content}
              </ReactMarkdown>
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
              <TableOfContents content={post.content} />

              {/* Related Posts Sidebar */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Related Posts</h3>
                  <RelatedPostsSidebar currentPostId={post._id} limit={3} />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Related Articles Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-8">Related Posts</h2>
          <RelatedPosts currentPostId={post._id} limit={6} />
        </div>

        {/* Comments Section */}
        <CommentsSystem postId={post._id} />
      </div>
    </div>
  )
}


