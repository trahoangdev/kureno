"use client"

import Link from "next/link"
import RefreshButton from "../components/refresh-button"
import ExportImportDialog from "../components/export-import-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Edit, 
  Trash, 
  Eye, 
  ToggleLeft, 
  ToggleRight,
  FileText,
  TrendingUp,
  Users,
  Calendar,
  Clock,
  Filter,
  Download,
  Upload,
  RefreshCw,
  Grid3X3,
  List,
  SortAsc,
  SortDesc,
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  X,
  Check,
  Copy,
  ExternalLink,
  BookOpen,
  PenTool,
  Image,
  Tag,
  Heart,
  MessageSquare,
  Share,
  BarChart3,
  Activity,
  Target,
  Zap,
  Award,
  Star,
  AlertTriangle,
  CheckCircle,
  Clock3,
  Globe,
  Lock,
  Unlock,
  Archive,
  Bookmark,
  Settings,
  MoreVertical,
  Printer,
  Send,
  Bell,
  Flag,
  Layers,
  Database,
  Server,
  Cloud,
  Sun,
  Moon,
  Sunrise,
  Sunset,
  Thermometer,
  Droplets,
  Wind,
  Waves,
  Mountain,
  Trees,
  Leaf,
  Flower,
  Bug,
  Fish,
  Bird,
  Cat,
  Dog,
  Rabbit,
  Turtle
} from "lucide-react"
import { useEffect, useMemo, useState } from "react"

interface PostItem {
  _id: string
  title: string
  slug: string
  excerpt?: string
  content?: string
  coverImage?: string
  tags?: string[]
  author: { name: string; avatar?: string }
  published: boolean
  publishedAt?: string
  createdAt: string
  updatedAt?: string
  views?: number
  likes?: number
  comments?: number
  readingTime?: number
  featured?: boolean
}

export default function BlogPostsPage() {
  const [posts, setPosts] = useState<PostItem[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<"table" | "grid">("table")
  const [sortBy, setSortBy] = useState("createdAt")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [selectedPosts, setSelectedPosts] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [statusFilter, setStatusFilter] = useState("all")
  const [authorFilter, setAuthorFilter] = useState("all")

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const res = await fetch("/api/blog?limit=50")
      const data = await res.json()
      setPosts(data.posts)
      setLoading(false)
    }
    fetchData()
  }, [])

  const filtered = useMemo(() => {
    let filteredPosts = posts

    // Search filter
    if (search) {
      filteredPosts = filteredPosts.filter((p) => 
        [p.title, p.slug, p.author?.name, p.excerpt].some((v) => 
          v?.toLowerCase().includes(search.toLowerCase())
        )
      )
    }

    // Status filter
    if (statusFilter !== "all") {
      filteredPosts = filteredPosts.filter((p) => 
        statusFilter === "published" ? p.published : !p.published
      )
    }

    // Author filter
    if (authorFilter !== "all") {
      filteredPosts = filteredPosts.filter((p) => p.author?.name === authorFilter)
    }

    // Sorting
    filteredPosts.sort((a, b) => {
      let aValue: any = a[sortBy as keyof PostItem]
      let bValue: any = b[sortBy as keyof PostItem]

      if (sortBy === "createdAt" || sortBy === "publishedAt" || sortBy === "updatedAt") {
        aValue = new Date(aValue || 0).getTime()
        bValue = new Date(bValue || 0).getTime()
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    return filteredPosts
  }, [posts, search, statusFilter, authorFilter, sortBy, sortOrder])

  // Calculate stats
  const stats = useMemo(() => {
    const totalPosts = posts.length
    const publishedPosts = posts.filter(p => p.published).length
    const draftPosts = totalPosts - publishedPosts
    const totalViews = posts.reduce((sum, p) => sum + (p.views || 0), 0)
    const totalLikes = posts.reduce((sum, p) => sum + (p.likes || 0), 0)
    const totalComments = posts.reduce((sum, p) => sum + (p.comments || 0), 0)
    const featuredPosts = posts.filter(p => p.featured).length

    return {
      totalPosts,
      publishedPosts,
      draftPosts,
      totalViews,
      totalLikes,
      totalComments,
      featuredPosts
    }
  }, [posts])

  // Helper functions
  const handleSelectPost = (postId: string) => {
    setSelectedPosts(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    )
  }

  const handleSelectAll = () => {
    setSelectedPosts(
      selectedPosts.length === filtered.length 
        ? [] 
        : filtered.map(p => p._id)
    )
  }

  const handleBulkAction = async (action: string) => {
    // Implement bulk actions
    console.log(`Bulk action: ${action} on posts:`, selectedPosts)
    setSelectedPosts([])
  }

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(column)
      setSortOrder("desc")
    }
  }

  const getStatusColor = (published: boolean) => {
    return published 
      ? "bg-green-500/20 text-green-600 dark:text-green-400" 
      : "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400"
  }

  const getStatusIcon = (published: boolean) => {
    return published ? CheckCircle : Clock3
  }

  const togglePublish = async (id: string, current: boolean) => {
    const res = await fetch(`/api/blog/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ published: !current }) })
    if (res.ok) {
      setPosts((prev) => prev.map((p) => (p._id === id ? { ...p, published: !current, publishedAt: !current ? new Date().toISOString() : undefined } : p)))
    }
  }

  return (
    <div className="space-y-8">
      {/* Enhanced Header Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 dark:from-purple-950/20 dark:via-pink-950/20 dark:to-indigo-950/20 p-8">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(147,51,234,0.1),transparent_50%),radial-gradient(ellipse_at_bottom_left,rgba(236,72,153,0.1),transparent_50%)] -z-10" />
        
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 text-sm font-medium">
                <FileText className="h-3 w-3 mr-1" />
                Blog Management
              </Badge>
              <Badge variant="outline" className="text-xs">
                <Activity className="h-3 w-3 mr-1" />
                Content Hub
              </Badge>
            </div>
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent">
              Blog Posts
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Create, manage, and optimize your blog content with powerful tools for content creation, SEO optimization, and performance tracking.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <ExportImportDialog 
              trigger={
                <Button variant="outline" size="sm" className="rounded-full">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              }
            />
            <RefreshButton variant="outline" size="sm" className="rounded-full" />
            <Button asChild className="rounded-full">
              <Link href="/admin/blog/new">
                <Plus className="mr-2 h-4 w-4" />
                New Post
              </Link>
            </Button>
          </div>
        </div>
        
        {/* Quick Stats Preview */}
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.totalPosts}</div>
            <div className="text-xs text-muted-foreground">Total Posts</div>
            <div className="text-xs text-green-600 flex items-center justify-center gap-1">
              <TrendingUp className="h-3 w-3" />
              +12%
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-pink-600">{stats.publishedPosts}</div>
            <div className="text-xs text-muted-foreground">Published</div>
            <div className="text-xs text-green-600 flex items-center justify-center gap-1">
              <CheckCircle className="h-3 w-3" />
              {Math.round((stats.publishedPosts / stats.totalPosts) * 100)}%
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-600">{stats.totalViews}</div>
            <div className="text-xs text-muted-foreground">Total Views</div>
            <div className="text-xs text-green-600 flex items-center justify-center gap-1">
              <TrendingUp className="h-3 w-3" />
              +8.5%
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{stats.featuredPosts}</div>
            <div className="text-xs text-muted-foreground">Featured</div>
            <div className="text-xs text-green-600 flex items-center justify-center gap-1">
              <Star className="h-3 w-3" />
              {Math.round((stats.featuredPosts / stats.totalPosts) * 100)}%
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Search and Filter Section */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  type="search" 
                  placeholder="Search posts, authors, tags..." 
                  className="pl-10 rounded-full" 
                  value={search} 
                  onChange={(e) => setSearch(e.target.value)} 
                />
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowFilters(!showFilters)}
                className="rounded-full"
              >
                <Filter className="mr-2 h-4 w-4" />
                Filters
                {showFilters ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center border rounded-full p-1">
                <Button
                  variant={viewMode === "table" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("table")}
                  className="rounded-full"
                >
                  <List className="h-4 w-4" />
              </Button>
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-full"
                >
                  <Grid3X3 className="h-4 w-4" />
              </Button>
              </div>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-6 p-4 border rounded-lg bg-muted/30">
              <div className="grid gap-4 md:grid-cols-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Sort By</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="createdAt">Date Created</SelectItem>
                      <SelectItem value="publishedAt">Date Published</SelectItem>
                      <SelectItem value="title">Title</SelectItem>
                      <SelectItem value="views">Views</SelectItem>
                      <SelectItem value="likes">Likes</SelectItem>
                      <SelectItem value="comments">Comments</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Order</label>
                  <Select value={sortOrder} onValueChange={(value: "asc" | "desc") => setSortOrder(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="desc">Newest First</SelectItem>
                      <SelectItem value="asc">Oldest First</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Status</label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Posts</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Author</label>
                  <Select value={authorFilter} onValueChange={setAuthorFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Authors</SelectItem>
                      {Array.from(new Set(posts.map(p => p.author?.name))).map(author => (
                        <SelectItem key={author} value={author || ""}>{author || "Admin"}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Bulk Actions */}
          {selectedPosts.length > 0 && (
            <div className="mt-4 p-3 bg-primary/10 border border-primary/20 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  {selectedPosts.length} post{selectedPosts.length > 1 ? 's' : ''} selected
                </span>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleBulkAction('publish')}>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Publish
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleBulkAction('unpublish')}>
                    <Clock3 className="mr-2 h-4 w-4" />
                    Unpublish
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleBulkAction('delete')}>
                    <Trash className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedPosts([])}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Enhanced Table View */}
      {viewMode === "table" && (
        <Card>
          <CardContent className="p-0">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                    <TableHead className="w-12">
                      <Checkbox 
                        checked={selectedPosts.length === filtered.length && filtered.length > 0}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSort("title")}
                    >
                      <div className="flex items-center gap-2">
                        Post
                        {sortBy === "title" && (
                          sortOrder === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSort("author")}
                    >
                      <div className="flex items-center gap-2">
                        Author
                        {sortBy === "author" && (
                          sortOrder === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSort("createdAt")}
                    >
                      <div className="flex items-center gap-2">
                        Date
                        {sortBy === "createdAt" && (
                          sortOrder === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSort("views")}
                    >
                      <div className="flex items-center gap-2">
                        Stats
                        {sortBy === "views" && (
                          sortOrder === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSort("published")}
                    >
                      <div className="flex items-center gap-2">
                        Status
                        {sortBy === "published" && (
                          sortOrder === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
                        )}
                      </div>
                    </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                      <TableCell colSpan={7} className="py-12 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                          <p className="text-muted-foreground">Loading posts...</p>
                        </div>
                      </TableCell>
                  </TableRow>
                ) : filtered.length === 0 ? (
                  <TableRow>
                      <TableCell colSpan={7} className="py-12 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <FileText className="h-12 w-12 text-muted-foreground" />
                          <p className="text-muted-foreground">No posts found</p>
                          <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
                        </div>
                      </TableCell>
                  </TableRow>
                ) : (
                    filtered.map((post) => {
                      const StatusIcon = getStatusIcon(post.published)
                      return (
                        <TableRow key={post._id} className="hover:bg-muted/50">
                          <TableCell>
                            <Checkbox 
                              checked={selectedPosts.includes(post._id)}
                              onCheckedChange={() => handleSelectPost(post._id)}
                            />
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30">
                                <FileText className="h-4 w-4 text-purple-600" />
                              </div>
                              <div>
                                <div className="font-medium hover:text-primary cursor-pointer">
                                  {post.title}
                                </div>
                                <div className="text-xs text-muted-foreground">/{post.slug}</div>
                                {post.featured && (
                                  <Badge variant="secondary" className="text-xs mt-1">
                                    <Star className="h-3 w-3 mr-1" />
                                    Featured
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={post.author?.avatar} />
                                <AvatarFallback className="text-xs">
                                  {post.author?.name?.charAt(0) || "A"}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm">{post.author?.name || "Admin"}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {post.publishedAt ? "Published" : "Created"}
                            </div>
                          </TableCell>
                      <TableCell>
                            <div className="flex items-center gap-4 text-sm">
                              <div className="flex items-center gap-1">
                                <Eye className="h-3 w-3 text-muted-foreground" />
                                {post.views || 0}
                              </div>
                              <div className="flex items-center gap-1">
                                <Heart className="h-3 w-3 text-muted-foreground" />
                                {post.likes || 0}
                              </div>
                              <div className="flex items-center gap-1">
                                <MessageSquare className="h-3 w-3 text-muted-foreground" />
                                {post.comments || 0}
                              </div>
                            </div>
                      </TableCell>
                      <TableCell>
                            <Badge className={getStatusColor(post.published)}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {post.published ? "Published" : "Draft"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button variant="ghost" size="sm" asChild>
                                <Link href={`/blog/${post.slug}`}>
                                  <Eye className="h-4 w-4" />
                                </Link>
                              </Button>
                              <Button variant="ghost" size="sm" asChild>
                                <Link href={`/admin/blog/${post._id}/edit`}>
                                  <Edit className="h-4 w-4" />
                                </Link>
                              </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                                  <DropdownMenuItem asChild>
                                    <Link href={`/blog/${post.slug}`}>
                                      <ExternalLink className="mr-2 h-4 w-4" />
                                      View Post
                                    </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                    <Link href={`/admin/blog/${post._id}/edit`}>
                                <Edit className="mr-2 h-4 w-4" />
                                      Edit Post
                              </Link>
                            </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => togglePublish(post._id, post.published)}>
                                    {post.published ? (
                                <ToggleLeft className="mr-2 h-4 w-4" />
                              ) : (
                                <ToggleRight className="mr-2 h-4 w-4" />
                              )}
                                    {post.published ? "Unpublish" : "Publish"}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Copy className="mr-2 h-4 w-4" />
                                    Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive focus:text-destructive">
                              <Trash className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                            </div>
                      </TableCell>
                    </TableRow>
                      )
                    })
                )}
              </TableBody>
            </Table>
          </div>
          </CardContent>
        </Card>
      )}

      {/* Enhanced Grid View */}
      {viewMode === "grid" && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                    <div className="h-20 bg-muted rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : filtered.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-12">
              <FileText className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No posts found</h3>
              <p className="text-muted-foreground text-center max-w-md">
                Try adjusting your search criteria or create a new post to get started.
              </p>
            </div>
          ) : (
            filtered.map((post) => {
              const StatusIcon = getStatusIcon(post.published)
              return (
                <Card key={post._id} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 group-hover:scale-110 transition-transform duration-200">
                            <FileText className="h-4 w-4 text-purple-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                              {post.title}
                            </h3>
                            <p className="text-xs text-muted-foreground">/{post.slug}</p>
                          </div>
                        </div>
                        <Checkbox 
                          checked={selectedPosts.includes(post._id)}
                          onCheckedChange={() => handleSelectPost(post._id)}
                        />
                      </div>

                      {/* Excerpt */}
                      {post.excerpt && (
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {post.excerpt}
                        </p>
                      )}

                      {/* Author & Date */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={post.author?.avatar} />
                            <AvatarFallback className="text-xs">
                              {post.author?.name?.charAt(0) || "A"}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{post.author?.name || "Admin"}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {post.views || 0}
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="h-3 w-3" />
                          {post.likes || 0}
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="h-3 w-3" />
                          {post.comments || 0}
                        </div>
                        {post.readingTime && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {post.readingTime}m
                          </div>
                        )}
                      </div>

                      {/* Tags */}
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {post.tags.slice(0, 3).map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              <Tag className="h-3 w-3 mr-1" />
                              {tag}
                            </Badge>
                          ))}
                          {post.tags.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{post.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}

                      {/* Status & Actions */}
                      <div className="flex items-center justify-between pt-2 border-t">
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(post.published)}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {post.published ? "Published" : "Draft"}
                          </Badge>
                          {post.featured && (
                            <Badge variant="secondary" className="text-xs">
                              <Star className="h-3 w-3 mr-1" />
                              Featured
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/blog/${post.slug}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/admin/blog/${post._id}/edit`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link href={`/blog/${post.slug}`}>
                                  <ExternalLink className="mr-2 h-4 w-4" />
                                  View Post
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/admin/blog/${post._id}/edit`}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit Post
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => togglePublish(post._id, post.published)}>
                                {post.published ? (
                                  <ToggleLeft className="mr-2 h-4 w-4" />
                                ) : (
                                  <ToggleRight className="mr-2 h-4 w-4" />
                                )}
                                {post.published ? "Unpublish" : "Publish"}
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Copy className="mr-2 h-4 w-4" />
                                Duplicate
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive focus:text-destructive">
                                <Trash className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>
      )}

      {/* Enhanced Pagination */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {filtered.length} of {posts.length} posts
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled className="rounded-full">
                Previous
              </Button>
              <Button variant="outline" size="sm" className="bg-primary text-primary-foreground rounded-full">
                1
              </Button>
              <Button variant="outline" size="sm" className="rounded-full">
                2
              </Button>
              <Button variant="outline" size="sm" className="rounded-full">
                3
              </Button>
              <Button variant="outline" size="sm" className="rounded-full">
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
