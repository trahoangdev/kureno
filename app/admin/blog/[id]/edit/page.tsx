"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import CloudinaryUpload, { CloudinaryFile } from '@/components/ui/cloudinary-upload'
import CloudinaryVideoUpload, { CloudinaryVideo } from '@/components/ui/cloudinary-video-upload'
// import MarkdownEditor from '../../../admin/products/components/markdown-editor'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { 
  Loader2, 
  ArrowLeft, 
  Plus, 
  Minus, 
  X, 
  Check,
  Save,
  Eye,
  EyeOff,
  Upload,
  Image as ImageIcon,
  Video,
  FileText,
  Settings,
  Calendar,
  Clock,
  Tag,
  User,
  Globe,
  Lock,
  Unlock,
  Star,
  MessageSquare,
  Share2,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  MoreHorizontal,
  Edit,
  Trash,
  Copy,
  ExternalLink,
  BookOpen,
  PenTool,
  Image as ImageIcon2,
  Tag as TagIcon,
  Heart,
  MessageSquare as MessageSquareIcon,
  Share,
  BarChart3,
  Activity,
  Target,
  Zap,
  Award,
  Star as StarIcon,
  AlertTriangle,
  CheckCircle,
  Clock3,
  Globe as GlobeIcon,
  Lock as LockIcon,
  Unlock as UnlockIcon,
  Archive,
  Bookmark,
  Settings as SettingsIcon,
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
  Turtle as TurtleIcon
} from "lucide-react"

export default function EditBlogPostPage() {
  const params = useParams() as { id: string }
  const router = useRouter()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("content")
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [isAutoSaving, setIsAutoSaving] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    coverImage: "",
    images: [] as string[],
    videos: [] as string[],
    tags: "",
    published: false,
    // Advanced fields
    author: "",
    category: "",
    status: "draft", // draft, published, scheduled, archived
    visibility: "public", // public, private, password-protected
    featured: false,
    allowComments: true,
    seo: {
      title: "",
      description: "",
      keywords: ""
    },
    scheduling: {
      publishAt: "",
      unpublishAt: ""
    },
    readingTime: 0,
    wordCount: 0
  })

  // Callback functions for Cloudinary uploads
  const handleCoverImageUpload = useCallback((files: CloudinaryFile[]) => {
    if (files.length > 0) {
      setFormData(prev => ({ ...prev, coverImage: files[0].secureUrl }))
      setHasUnsavedChanges(true)
    }
  }, [])

  const handleImagesUpload = useCallback((files: CloudinaryFile[]) => {
    const urls = files.map(file => file.secureUrl)
    setFormData(prev => ({ ...prev, images: urls }))
    setHasUnsavedChanges(true)
  }, [])

  const handleVideosUpload = useCallback((videos: CloudinaryVideo[]) => {
    const urls = videos.map(video => video.secureUrl)
    setFormData(prev => ({ ...prev, videos: urls }))
    setHasUnsavedChanges(true)
  }, [])

  // Helper function to generate unique slug
  const generateUniqueSlug = useCallback((baseSlug: string) => {
    return `${baseSlug}-${Date.now()}`
  }, [])

  // Helper function to handle slug conflict
  const handleSlugConflict = useCallback(async (postData: any, isDraft: boolean = false) => {
    const uniqueSlug = generateUniqueSlug(formData.slug)
    setFormData(prev => ({ ...prev, slug: uniqueSlug }))
    
    toast({
      title: "Slug Conflict",
      description: `Slug already exists. Using unique slug: ${uniqueSlug}`,
      variant: "destructive",
    })
    
    // Retry with new slug
    const retryPostData = { ...postData, slug: uniqueSlug }
    const retryResponse = await fetch(`/api/blog/${params.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(retryPostData),
    })
    
    if (retryResponse.ok) {
      const successMessage = isDraft 
        ? "Your blog post draft has been saved with a unique slug."
        : "Your blog post has been successfully updated with a unique slug."
      
      toast({
        title: isDraft ? "Draft Saved" : "Blog Post Updated",
        description: successMessage,
      })
      
      setHasUnsavedChanges(false)
      
      if (!isDraft) {
        router.push("/admin/blog")
        router.refresh()
      }
      
      return true
    }
    
    return false
  }, [formData.slug, generateUniqueSlug, router, params.id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setHasUnsavedChanges(true)
  }

  const handleAdvancedChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setHasUnsavedChanges(true)
  }

  const handleSEOChange = (field: string, value: string) => {
    setFormData((prev) => ({ 
      ...prev, 
      seo: { ...prev.seo, [field]: value } 
    }))
    setHasUnsavedChanges(true)
  }

  const handleSchedulingChange = (field: string, value: string) => {
    setFormData((prev) => ({ 
      ...prev, 
      scheduling: { ...prev.scheduling, [field]: value } 
    }))
    setHasUnsavedChanges(true)
  }

  const addTag = () => {
    const newTag = prompt("Enter new tag:")
    if (newTag && newTag.trim()) {
      const currentTags = formData.tags ? formData.tags.split(",").map(t => t.trim()) : []
      if (!currentTags.includes(newTag.trim())) {
        setFormData(prev => ({ 
          ...prev, 
          tags: [...currentTags, newTag.trim()].join(", ") 
        }))
        setHasUnsavedChanges(true)
      }
    }
  }

  const removeTag = (tagToRemove: string) => {
    const currentTags = formData.tags ? formData.tags.split(",").map(t => t.trim()) : []
    const updatedTags = currentTags.filter(tag => tag !== tagToRemove)
    setFormData(prev => ({ ...prev, tags: updatedTags.join(", ") }))
    setHasUnsavedChanges(true)
  }

  // Auto-save functionality
  useEffect(() => {
    if (hasUnsavedChanges && formData.title && formData.content) {
      const timer = setTimeout(() => {
        handleSaveDraft()
      }, 2000) // Auto-save after 2 seconds of inactivity

      return () => clearTimeout(timer)
    }
  }, [hasUnsavedChanges, formData.title, formData.content])

  // Load existing blog post
  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true)
      try {
      const res = await fetch(`/api/blog/${params.id}`)
      if (!res.ok) {
        setError("Failed to load post")
        setLoading(false)
        return
      }
      const data = await res.json()
        const post = data.post
        
        setFormData({
          title: post.title || "",
          slug: post.slug || "",
          excerpt: post.excerpt || "",
          content: post.content || "",
          coverImage: post.coverImage || "",
          images: post.images || [],
          videos: post.videos || [],
          tags: (post.tags || []).join(", "),
          published: !!post.published,
          author: post.author || "",
          category: post.category || "",
          status: post.status || "draft",
          visibility: post.visibility || "public",
          featured: !!post.featured,
          allowComments: post.allowComments !== false,
          seo: {
            title: post.seo?.title || "",
            description: post.seo?.description || "",
            keywords: post.seo?.keywords || ""
          },
          scheduling: {
            publishAt: post.scheduling?.publishAt || "",
            unpublishAt: post.scheduling?.unpublishAt || ""
          },
          readingTime: post.readingTime || 0,
          wordCount: post.wordCount || 0
      })
      setLoading(false)
      } catch (error) {
        console.error('Error fetching post:', error)
        setError("Failed to load post")
        setLoading(false)
      }
    }
    fetchPost()
  }, [params.id])

  const handleSaveDraft = async () => {
    setIsLoading(true)
    try {
      // Validate required fields
      if (!formData.title || !formData.slug || !formData.content || !formData.excerpt) {
        toast({
          title: "Missing Required Fields",
          description: "Please fill in title, slug, content, and excerpt before saving.",
          variant: "destructive",
        })
        setIsLoading(false)
      return
    }

      const postData = {
        ...formData,
        status: "draft",
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        author: formData.author || "Admin",
        category: formData.category || "General",
        readingTime: formData.readingTime,
        wordCount: formData.wordCount,
        // Media fields
        images: formData.images,
        videos: formData.videos,
        // Ensure coverImage is provided or use placeholder
        coverImage: formData.coverImage || "https://via.placeholder.com/1200x630?text=No+Cover+Image"
      }

      const response = await fetch(`/api/blog/${params.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      })

      if (response.ok) {
        toast({
          title: "Draft Saved",
          description: "Your blog post draft has been saved.",
        })
        setHasUnsavedChanges(false)
      } else {
        const errorData = await response.json()
        
        if (response.status === 409 && errorData.error === "Slug already exists") {
          await handleSlugConflict(postData, true)
        } else {
          toast({
            title: "Error",
            description: errorData.error || "Failed to save draft",
            variant: "destructive",
          })
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save draft.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const postData = {
        ...formData,
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        publishedAt: formData.published ? new Date().toISOString() : null,
        // Advanced fields
        author: formData.author || "Admin",
        category: formData.category || "General",
        status: formData.published ? "published" : formData.status,
        visibility: formData.visibility,
        featured: formData.featured,
        allowComments: formData.allowComments,
        seo: formData.seo,
        scheduling: formData.scheduling,
        readingTime: formData.readingTime,
        wordCount: formData.wordCount,
        // Media fields
        images: formData.images,
        videos: formData.videos,
        // Ensure coverImage is provided or use placeholder
        coverImage: formData.coverImage || "https://via.placeholder.com/1200x630?text=No+Cover+Image"
      }

      const response = await fetch(`/api/blog/${params.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      })

      if (response.ok) {
        toast({
          title: "Blog Post Updated",
          description: "Your blog post has been successfully updated.",
        })

        setHasUnsavedChanges(false)
    router.push("/admin/blog")
        router.refresh()
      } else {
        const errorData = await response.json()
        
        if (response.status === 409 && errorData.error === "Slug already exists") {
          const success = await handleSlugConflict(postData, false)
          if (!success) {
            throw new Error("Failed to update blog post even with unique slug")
          }
        } else {
          throw new Error(errorData.error || "Failed to update blog post")
        }
      }
    } catch (error: any) {
      setError(error.message || "Something went wrong. Please try again.")
      toast({
        title: "Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-950">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/blog">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Blog
              </Link>
            </Button>
            <Badge variant="outline" className="text-xs">
              <Edit className="h-3 w-3 mr-1" />
              Edit Mode
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Edit Blog Post</h1>
              <p className="text-muted-foreground mt-2">
                Update your blog post content, settings, and metadata
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              {hasUnsavedChanges && (
                <Badge variant="outline" className="text-amber-600 border-amber-200">
                  <Clock className="h-3 w-3 mr-1" />
                  Unsaved Changes
                </Badge>
              )}
              {isAutoSaving && (
                <Badge variant="outline" className="text-blue-600 border-blue-200">
                  <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                  Auto-saving...
                </Badge>
              )}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger value="media">Media</TabsTrigger>
                  <TabsTrigger value="seo">SEO</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>

                {/* Content Tab */}
                <TabsContent value="content" className="space-y-6">
      <Card>
        <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Basic Information
                      </CardTitle>
                      <CardDescription>
                        Essential information for your blog post
                      </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
                          <Label htmlFor="title">Title *</Label>
                          <Input
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Enter blog post title"
                            required
                          />
            </div>
            <div className="space-y-2">
                          <Label htmlFor="slug">Slug *</Label>
                          <Input
                            id="slug"
                            name="slug"
                            value={formData.slug}
                            onChange={handleChange}
                            placeholder="url-friendly-slug"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="excerpt">Excerpt *</Label>
                        <Textarea
                          id="excerpt"
                          name="excerpt"
                          value={formData.excerpt}
                          onChange={handleChange}
                          placeholder="Brief description of your blog post"
                          rows={3}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="content">Content *</Label>
                        <Textarea
                          id="content"
                          name="content"
                          value={formData.content}
                          onChange={handleChange}
                          placeholder="Write your blog post content here..."
                          rows={10}
                          required
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Media Tab */}
                <TabsContent value="media" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <ImageIcon className="h-5 w-5" />
                        Cover Image
                      </CardTitle>
                      <CardDescription>
                        Upload a cover image for your blog post
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <CloudinaryUpload
                        onUpload={handleCoverImageUpload}
                        maxFiles={1}
                        folder="blog"
                      />
                      {formData.coverImage && (
                        <div className="mt-4">
                          <Image
                            src={formData.coverImage}
                            alt="Cover preview"
                            width={400}
                            height={200}
                            className="rounded-lg object-cover"
                          />
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <ImageIcon className="h-5 w-5" />
                        Additional Images
                      </CardTitle>
                      <CardDescription>
                        Upload additional images for your blog post
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <CloudinaryUpload
                        onUpload={handleImagesUpload}
                        maxFiles={10}
                        folder="blog"
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Video className="h-5 w-5" />
                        Videos
                      </CardTitle>
                      <CardDescription>
                        Upload videos for your blog post
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <CloudinaryVideoUpload
                        onUpload={handleVideosUpload}
                        maxFiles={5}
                        folder="blog"
                      />
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* SEO Tab */}
                <TabsContent value="seo" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Search className="h-5 w-5" />
                        SEO Settings
                      </CardTitle>
                      <CardDescription>
                        Optimize your blog post for search engines
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="seo-title">SEO Title</Label>
                        <Input
                          id="seo-title"
                          value={formData.seo.title}
                          onChange={(e) => handleSEOChange("title", e.target.value)}
                          placeholder="SEO optimized title"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="seo-description">SEO Description</Label>
                        <Textarea
                          id="seo-description"
                          value={formData.seo.description}
                          onChange={(e) => handleSEOChange("description", e.target.value)}
                          placeholder="Meta description for search engines"
                          rows={3}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="seo-keywords">SEO Keywords</Label>
                        <Input
                          id="seo-keywords"
                          value={formData.seo.keywords}
                          onChange={(e) => handleSEOChange("keywords", e.target.value)}
                          placeholder="keyword1, keyword2, keyword3"
                        />
            </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Settings Tab */}
                <TabsContent value="settings" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Settings className="h-5 w-5" />
                        Post Settings
                      </CardTitle>
                      <CardDescription>
                        Configure advanced settings for your blog post
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="author">Author</Label>
                          <Input
                            id="author"
                            name="author"
                            value={formData.author}
                            onChange={handleChange}
                            placeholder="Author name"
                          />
            </div>
                        <div className="space-y-2">
                          <Label htmlFor="category">Category</Label>
                          <Input
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            placeholder="Blog category"
                          />
            </div>
            </div>

                      <div className="space-y-2">
                        <Label htmlFor="tags">Tags</Label>
                        <div className="flex gap-2">
                          <Input
                            id="tags"
                            name="tags"
                            value={formData.tags}
                            onChange={handleChange}
                            placeholder="tag1, tag2, tag3"
                          />
                          <Button type="button" variant="outline" onClick={addTag}>
                            <Plus className="h-4 w-4" />
                </Button>
              </div>
                        {formData.tags && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {formData.tags.split(",").map((tag, index) => (
                              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                                {tag.trim()}
                                <X 
                                  className="h-3 w-3 cursor-pointer" 
                                  onClick={() => removeTag(tag.trim())}
                                />
                              </Badge>
                            ))}
                          </div>
              )}
            </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Published</Label>
                            <p className="text-sm text-muted-foreground">
                              Make this post visible to readers
                            </p>
                          </div>
                          <Switch
                            checked={formData.published}
                            onCheckedChange={(checked) => handleAdvancedChange("published", checked)}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Featured</Label>
                            <p className="text-sm text-muted-foreground">
                              Highlight this post as featured content
                            </p>
                          </div>
                          <Switch
                            checked={formData.featured}
                            onCheckedChange={(checked) => handleAdvancedChange("featured", checked)}
                          />
          </div>

          <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Allow Comments</Label>
                            <p className="text-sm text-muted-foreground">
                              Enable comments on this post
                            </p>
                          </div>
                          <Switch
                            checked={formData.allowComments}
                            onCheckedChange={(checked) => handleAdvancedChange("allowComments", checked)}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="visibility">Visibility</Label>
                        <select
                          id="visibility"
                          value={formData.visibility}
                          onChange={(e) => handleAdvancedChange("visibility", e.target.value)}
                          className="w-full p-2 border rounded-md"
                        >
                          <option value="public">Public</option>
                          <option value="private">Private</option>
                          <option value="password-protected">Password Protected</option>
                        </select>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Right Column - Actions & Preview */}
            <div className="space-y-6">
              {/* Actions Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col gap-2">
                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Update Post
                        </>
                      )}
                    </Button>
                    
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handleSaveDraft}
                      disabled={isLoading}
                      className="w-full"
                    >
                      <Save className="mr-2 h-4 w-4" />
                      Save Draft
                    </Button>
                    
                    <Button 
                      type="button" 
                      variant="outline" 
                      asChild
                      className="w-full"
                    >
                      <Link href="/admin/blog">
                        <X className="mr-2 h-4 w-4" />
                        Cancel
                      </Link>
              </Button>
            </div>
                </CardContent>
              </Card>

              {/* Status Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Status</span>
                    <Badge variant={formData.published ? "default" : "secondary"}>
                      {formData.published ? "Published" : "Draft"}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Visibility</span>
                    <Badge variant="outline">
                      {formData.visibility}
                    </Badge>
                  </div>
                  
                  {formData.featured && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Featured</span>
                      <Badge variant="default" className="bg-yellow-500">
                        <Star className="h-3 w-3 mr-1" />
                        Featured
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Stats Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Word Count</span>
                    <span className="text-sm text-muted-foreground">
                      {formData.content.split(' ').length}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Reading Time</span>
                    <span className="text-sm text-muted-foreground">
                      ~{Math.ceil(formData.content.split(' ').length / 200)} min
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Images</span>
                    <span className="text-sm text-muted-foreground">
                      {formData.images.length}
                    </span>
            </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Videos</span>
                    <span className="text-sm text-muted-foreground">
                      {formData.videos.length}
                    </span>
          </div>
        </CardContent>
      </Card>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </form>
      </div>
    </div>
  )
}
