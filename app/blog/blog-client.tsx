"use client"

import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { 
  ArrowRight, 
  Search, 
  Calendar, 
  Clock, 
  User, 
  Eye, 
  Heart, 
  Share2,
  BookOpen,
  TrendingUp,
  Filter,
  Grid3X3,
  List,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  PenTool,
  MessageCircle,
  Tag
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEffect, useState, useMemo } from "react"
import { useToast } from "@/hooks/use-toast"

export default function BlogPageClient() {
  const [posts, setPosts] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [limit] = useState(6)
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showSidebar, setShowSidebar] = useState(false)
  const [categories, setCategories] = useState<string[]>([])
  const [popularPosts, setPopularPosts] = useState<any[]>([])
  const [bookmarks, setBookmarks] = useState<string[]>([])
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/blog?limit=${limit}&page=${page}`)
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`)
        }
        const data = await res.json()
        setPosts(data.posts || [])
        setTotal(data.pagination?.total || 0)
        
        // Extract categories from posts
        const allCategories = new Set<string>()
        data.posts?.forEach((post: any) => {
          if (post.tags) {
            post.tags.forEach((tag: string) => allCategories.add(tag))
          }
        })
        setCategories(Array.from(allCategories))
        
        // Set popular posts (first 3 posts as popular for demo)
        setPopularPosts(data.posts?.slice(0, 3) || [])
      } catch (error) {
        console.error('Error fetching blog posts:', error)
        setPosts([])
        setTotal(0)
      }
    }
    fetchData()
  }, [page, limit])

  const filteredPosts = useMemo(() => {
    let filtered = posts

    // Search filter
    if (search) {
      filtered = filtered.filter((post) => 
        post.title?.toLowerCase().includes(search.toLowerCase()) ||
        post.excerpt?.toLowerCase().includes(search.toLowerCase()) ||
        post.tags?.some((tag: string) => tag.toLowerCase().includes(search.toLowerCase()))
      )
    }

    // Category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter((post) => 
        post.tags?.includes(categoryFilter)
      )
    }

    // Sort posts
    switch (sortBy) {
      case "popular":
        filtered.sort((a, b) => (b.views || 0) - (a.views || 0))
        break
      case "oldest":
        filtered.sort((a, b) => new Date(a.publishedAt || a.createdAt).getTime() - new Date(b.publishedAt || b.createdAt).getTime())
        break
      case "newest":
      default:
        filtered.sort((a, b) => new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime())
        break
    }

    return filtered
  }, [posts, search, categoryFilter, sortBy])

  const toggleBookmark = (postId: string) => {
    setBookmarks(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    )
    toast({
      title: bookmarks.includes(postId) ? "Removed from bookmarks" : "Added to bookmarks",
      description: bookmarks.includes(postId) ? "Post removed from your bookmarks" : "Post added to your bookmarks"
    })
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getReadingTime = (content: string) => {
    const wordsPerMinute = 200
    const wordCount = content?.split(' ').length || 0
    return Math.ceil(wordCount / wordsPerMinute)
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-24 md:pt-32 pb-16 md:pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50 dark:from-teal-950/20 dark:via-emerald-950/20 dark:to-cyan-950/20 -z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(20,184,166,0.1),transparent_50%),radial-gradient(ellipse_at_bottom_left,rgba(16,185,129,0.1),transparent_50%)] -z-10" />
        
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <PenTool className="h-4 w-4" />
              Stories & Insights
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-600 bg-clip-text text-transparent">
              Our Blog
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Discover stories, insights, and updates from the Kureno community. Stay informed with our latest articles and expert content.
            </p>
            
            {/* Enhanced Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search articles, topics, or authors..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-12 pr-4 py-6 text-lg border-2 focus:border-teal-500 rounded-2xl shadow-lg"
                />
                <Button 
                  size="lg" 
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-xl"
                  onClick={() => setShowSidebar(!showSidebar)}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-muted/30">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-teal-600 mb-2">{total}</div>
              <div className="text-sm text-muted-foreground">Total Articles</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600 mb-2">12</div>
              <div className="text-sm text-muted-foreground">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-cyan-600 mb-2">5</div>
              <div className="text-sm text-muted-foreground">Authors</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-teal-600 mb-2">2.5K</div>
              <div className="text-sm text-muted-foreground">Monthly Readers</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      {filteredPosts.length > 0 && (
        <section className="py-16 md:py-20">
          <div className="container">
            <div className="mb-8">
              <Badge className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white px-4 py-2 text-sm font-medium">
                <Sparkles className="h-4 w-4 mr-2" />
                Featured Article
              </Badge>
            </div>
            
            <Card className="overflow-hidden group hover:shadow-2xl transition-all duration-500">
              <div className="grid md:grid-cols-2 gap-0">
                <div className="relative h-[400px] md:h-[500px] overflow-hidden">
                  <Image
                    src={filteredPosts[0].coverImage || "/placeholder.svg?height=500&width=800"}
                    alt={filteredPosts[0].title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  
                  {/* Action Buttons */}
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="h-8 w-8 p-0 rounded-full"
                      onClick={(e) => {
                        e.preventDefault()
                        toggleBookmark(filteredPosts[0]._id)
                      }}
                    >
                      <Heart className={`h-4 w-4 ${bookmarks.includes(filteredPosts[0]._id) ? 'fill-red-500 text-red-500' : ''}`} />
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="h-8 w-8 p-0 rounded-full"
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <CardContent className="p-8 md:p-12 flex flex-col justify-center">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(filteredPosts[0].publishedAt || filteredPosts[0].createdAt)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {getReadingTime(filteredPosts[0].content || "")} min read
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {filteredPosts[0].views || 0} views
                      </div>
                    </div>
                    
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight group-hover:text-teal-600 transition-colors">
                      {filteredPosts[0].title}
                    </h2>
                    
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      {filteredPosts[0].excerpt}
                    </p>
                    
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src="/placeholder-user.jpg" alt="Author" />
                        <AvatarFallback>
                          {filteredPosts[0].author?.name?.charAt(0) || "A"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{filteredPosts[0].author?.name || "Admin"}</p>
                        <p className="text-sm text-muted-foreground">Content Writer</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {filteredPosts[0].tags?.slice(0, 3).map((tag: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <Button asChild size="lg" className="w-fit">
                      <Link href={`/blog/${filteredPosts[0]._id}`}>
                        Read Full Article
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </div>
            </Card>
          </div>
        </section>
      )}

      <section className="py-16 md:py-20">
        <div className="container">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <div className={`lg:w-80 ${showSidebar ? 'block' : 'hidden lg:block'}`}>
              <div className="space-y-6">
                {/* Categories */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      Categories
                    </h3>
                    <div className="space-y-2">
                      <Button
                        variant={categoryFilter === "all" ? "default" : "ghost"}
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => setCategoryFilter("all")}
                      >
                        All Posts
                      </Button>
                      {categories.map((category) => (
                        <Button
                          key={category}
                          variant={categoryFilter === category ? "default" : "ghost"}
                          size="sm"
                          className="w-full justify-start"
                          onClick={() => setCategoryFilter(category)}
                        >
                          {category}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Popular Posts */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Popular Posts
                    </h3>
                    <div className="space-y-4">
                      {popularPosts.map((post, index) => (
                        <Link
                          key={index}
                          href={`/blog/${post._id}`}
                          className="block group"
                        >
                          <div className="flex gap-3">
                            <div className="relative h-16 w-16 rounded-lg overflow-hidden flex-shrink-0">
                              <Image
                                src={post.coverImage || "/placeholder.jpg"}
                                alt={post.title}
                                fill
                                className="object-cover transition-transform group-hover:scale-110"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm line-clamp-2 group-hover:text-teal-600 transition-colors">
                                {post.title}
                              </h4>
                              <p className="text-xs text-muted-foreground mt-1">
                                {formatDate(post.publishedAt || post.createdAt)}
                              </p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Newsletter */}
                <Card className="bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-950/20 dark:to-emerald-950/20">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-2">Stay Updated</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Get the latest articles delivered to your inbox.
                    </p>
                    <div className="space-y-3">
                      <Input 
                        type="email" 
                        placeholder="Enter your email" 
                        className="w-full"
                      />
                      <Button className="w-full">Subscribe</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {/* Header Controls */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">Latest Articles</h2>
                  <p className="text-muted-foreground">
                    Showing {filteredPosts.length} of {total} articles
                  </p>
                </div>
                
                <div className="flex items-center gap-3">
                  {/* Sort */}
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="oldest">Oldest First</SelectItem>
                      <SelectItem value="popular">Most Popular</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* View Mode */}
                  <div className="flex items-center border rounded-lg">
                    <Button
                      variant={viewMode === "grid" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                      className="rounded-r-none"
                    >
                      <Grid3X3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                      className="rounded-l-none"
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Blog Posts */}
              <div className={
                viewMode === "grid" 
                  ? "grid sm:grid-cols-2 gap-6"
                  : "space-y-6"
              }>
                {filteredPosts.slice(1).map((post, index) => (
                  <Card key={index} className="group overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                    <div className={viewMode === "grid" ? "" : "flex"}>
                      <div className={`relative overflow-hidden ${viewMode === "grid" ? "h-[200px]" : "h-[200px] w-[300px] flex-shrink-0"}`}>
                        <Image
                          src={post.coverImage || "/placeholder.jpg"}
                          alt={post.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                        
                        {/* Action Buttons */}
                        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <Button
                            size="sm"
                            variant="secondary"
                            className="h-8 w-8 p-0 rounded-full shadow-lg"
                            onClick={(e) => {
                              e.preventDefault()
                              toggleBookmark(post._id)
                            }}
                          >
                            <Heart className={`h-4 w-4 ${bookmarks.includes(post._id) ? 'fill-red-500 text-red-500' : ''}`} />
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            className="h-8 w-8 p-0 rounded-full shadow-lg"
                          >
                            <Share2 className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Badges */}
                        <div className="absolute top-3 left-3">
                          {post.isNew && (
                            <Badge className="bg-teal-500 hover:bg-teal-600">New</Badge>
                          )}
                        </div>
                      </div>

                      <CardContent className="p-6 flex-1">
                        <div className="space-y-4">
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {formatDate(post.publishedAt || post.createdAt)}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {getReadingTime(post.content || "")} min read
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="h-4 w-4" />
                              {post.views || 0}
                            </div>
                          </div>

                          <div>
                            <h3 className="text-xl font-bold mb-2 group-hover:text-teal-600 transition-colors line-clamp-2">
                              {post.title}
                            </h3>
                            <p className="text-muted-foreground line-clamp-3">
                              {post.excerpt}
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            {post.tags?.slice(0, 2).map((tag: string, tagIndex: number) => (
                              <Badge key={tagIndex} variant="outline" className="text-xs">
                                <Tag className="h-3 w-3 mr-1" />
                                {tag}
                              </Badge>
                            ))}
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src="/placeholder-user.jpg" alt="Author" />
                                <AvatarFallback>
                                  {post.author?.name?.charAt(0) || "A"}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-sm">{post.author?.name || "Admin"}</p>
                                <p className="text-xs text-muted-foreground">Content Writer</p>
                              </div>
                            </div>
                            <Button asChild size="sm" className="rounded-full">
                              <Link href={`/blog/${post._id}`}>
                                Read More
                                <ArrowRight className="ml-1 h-3 w-3" />
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Enhanced Pagination */}
              <div className="flex justify-center mt-12">
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    disabled={page === 1} 
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="rounded-full"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>
                  
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, Math.ceil(total / limit)) }, (_, i) => {
                      const pageNum = i + 1
                      return (
                        <Button
                          key={pageNum}
                          variant={page === pageNum ? "default" : "outline"}
                          size="sm"
                          onClick={() => setPage(pageNum)}
                          className="w-10 h-10 rounded-full"
                        >
                          {pageNum}
                        </Button>
                      )
                    })}
                  </div>

                  <Button 
                    variant="outline" 
                    size="sm" 
                    disabled={page * limit >= total} 
                    onClick={() => setPage((p) => p + 1)}
                    className="rounded-full"
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
