"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import CloudinaryUpload, { CloudinaryFile } from '@/components/ui/cloudinary-upload'
import CloudinaryVideoUpload, { CloudinaryVideo } from '@/components/ui/cloudinary-video-upload'
import MarkdownEditor from '../../../admin/products/components/markdown-editor'
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
  Upload, 
  Image as ImageIcon, 
  FileText, 
  Type, 
  Hash, 
  Eye, 
  Save, 
  RefreshCw, 
  AlertTriangle, 
  Info, 
  CheckCircle, 
  XCircle, 
  Copy, 
  Edit, 
  Trash2, 
  Search, 
  Filter, 
  Settings, 
  Globe, 
  Link as LinkIcon, 
  Calendar, 
  Clock, 
  TrendingUp, 
  BarChart3, 
  Users, 
  Target, 
  Activity, 
  Zap, 
  Award, 
  Shield, 
  Lock, 
  Unlock, 
  Palette, 
  Layers, 
  Grid3X3, 
  List, 
  Layout, 
  Maximize, 
  Minimize, 
  RotateCcw, 
  RotateCw, 
  ZoomIn, 
  ZoomOut, 
  Move, 
  MousePointer, 
  Hand, 
  Bold, 
  Italic, 
  Underline, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignJustify, 
  ListOrdered, 
  Quote, 
  Code, 
  Terminal, 
  FileCode, 
  GitBranch, 
  GitCommit, 
  GitMerge, 
  GitPullRequest, 
  GitCompare, 
  GitFork, 
  Github, 
  Gitlab, 
  Cloud, 
  CloudRain, 
  CloudSnow, 
  CloudLightning, 
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
  Turtle,
  BookOpen,
  PenTool,
  MessageSquare,
  Share2,
  Bookmark,
  Heart,
  Star,
  ThumbsUp,
  Calendar as CalendarIcon,
  Clock as ClockIcon,
  User,
  Tag,
  Hash as HashIcon,
  Link2,
  ExternalLink,
  Download,
  Upload as UploadIcon,
  Send,
  Upload as Publish,
  FileText as Draft,
  Archive,
  Trash,
  Edit3,
  EyeOff,
  Lock as LockIcon,
  Unlock as UnlockIcon,
  Globe as GlobeIcon,
  Search as SearchIcon,
  Filter as FilterIcon,
  SortAsc,
  SortDesc,
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  MoreVertical,
  Menu,
  MenuSquare,
  PanelLeft,
  PanelRight,
  Sidebar,
  SidebarClose,
  SidebarOpen,
  Maximize2,
  Minimize2,
  RotateCcw as RotateCcwIcon,
  RotateCw as RotateCwIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  Move as MoveIcon,
  MousePointer as MousePointerIcon,
  Hand as HandIcon,
  Type as TypeIcon,
  Bold as BoldIcon,
  Italic as ItalicIcon,
  Underline as UnderlineIcon,
  AlignLeft as AlignLeftIcon,
  AlignCenter as AlignCenterIcon,
  AlignRight as AlignRightIcon,
  AlignJustify as AlignJustifyIcon,
  ListOrdered as ListOrderedIcon,
  Quote as QuoteIcon,
  Code as CodeIcon,
  Terminal as TerminalIcon,
  FileCode as FileCodeIcon,
  GitBranch as GitBranchIcon,
  GitCommit as GitCommitIcon,
  GitMerge as GitMergeIcon,
  GitPullRequest as GitPullRequestIcon,
  GitCompare as GitCompareIcon,
  GitFork as GitForkIcon,
  Github as GithubIcon,
  Gitlab as GitlabIcon,
  Cloud as CloudIcon,
  CloudRain as CloudRainIcon,
  CloudSnow as CloudSnowIcon,
  CloudLightning as CloudLightningIcon,
  Sun as SunIcon,
  Moon as MoonIcon,
  Sunrise as SunriseIcon,
  Sunset as SunsetIcon,
  Thermometer as ThermometerIcon,
  Droplets as DropletsIcon,
  Wind as WindIcon,
  Waves as WavesIcon,
  Mountain as MountainIcon,
  Trees as TreesIcon,
  Leaf as LeafIcon,
  Flower as FlowerIcon,
  Bug as BugIcon,
  Fish as FishIcon,
  Bird as BirdIcon,
  Cat as CatIcon,
  Dog as DogIcon,
  Rabbit as RabbitIcon,
  Turtle as TurtleIcon
} from "lucide-react"

export default function NewBlogPostPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("content")
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [isAutoSaving, setIsAutoSaving] = useState(false)
  const [dragOver, setDragOver] = useState(false)
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
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setHasUnsavedChanges(true)

    // Auto-generate slug from title
    if (name === "title") {
      const slug = value
        .toLowerCase()
        .replace(/[^\w\s]/gi, "")
        .replace(/\s+/g, "-")
      setFormData((prev) => ({ ...prev, slug }))
      
      // Auto-generate SEO title from blog title
      if (!formData.seo.title) {
        setFormData((prev) => ({
          ...prev,
          seo: { ...prev.seo, title: value }
        }))
      }
    }

    // Calculate word count and reading time
    if (name === "content") {
      const words = value.trim().split(/\s+/).filter(word => word.length > 0).length
      const readingTime = Math.ceil(words / 200) // Average reading speed: 200 words per minute
      setFormData((prev) => ({ 
        ...prev, 
        wordCount: words,
        readingTime: readingTime
      }))
    }
  }

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, published: checked }))
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

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    
    const files = Array.from(e.dataTransfer.files)
    const imageFiles = files.filter(file => file.type.startsWith('image/'))
    
    if (imageFiles.length > 0) {
      // In a real app, you would upload these files to a server
      toast({
        title: "Files detected",
        description: `${imageFiles.length} image file(s) detected. Please upload them manually for now.`,
      })
    }
  }

  // Auto-save functionality
  useEffect(() => {
    if (hasUnsavedChanges && formData.title) {
      const timer = setTimeout(() => {
        setIsAutoSaving(true)
        // Simulate auto-save
        setTimeout(() => {
          setIsAutoSaving(false)
          toast({
            title: "Auto-saved",
            description: "Your blog post has been automatically saved.",
          })
        }, 1000)
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [hasUnsavedChanges, formData.title, toast])

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
        videos: formData.videos
      }

      const response = await fetch("/api/blog", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create blog post")
      }

      toast({
        title: "Blog Post Created",
        description: "Your blog post has been successfully created.",
      })

      setHasUnsavedChanges(false)
      router.push("/admin/blog")
      router.refresh()
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

  const handleSaveDraft = async () => {
    setIsLoading(true)
    try {
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
        videos: formData.videos
      }

      const response = await fetch("/api/blog", {
        method: "POST",
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

  const generateSlug = () => {
    const slug = formData.title
      .toLowerCase()
      .replace(/[^\w\s]/gi, "")
      .replace(/\s+/g, "-")
    setFormData((prev) => ({ ...prev, slug }))
    setHasUnsavedChanges(true)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied",
      description: "Text copied to clipboard.",
    })
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Header Section */}
      <div className="relative mb-8 overflow-hidden rounded-xl bg-gradient-to-br from-blue-500 to-indigo-700 p-6 shadow-lg md:p-10">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.1\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'3\'/%3E%3Ccircle cx=\'13\' cy=\'13\' r=\'3\'/%3E%3C/g%3E%3C/svg%3E")',
          maskImage: 'radial-gradient(circle at center, white, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(circle at center, white, transparent 70%)',
        }}></div>
        <div className="relative z-10 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
      <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild className="text-white hover:bg-white/20">
          <Link href="/admin/blog">
                <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
            <div>
              <div className="mb-2 flex items-center gap-2">
                <Badge className="bg-white/30 text-white backdrop-blur-sm hover:bg-white/40">
                  <PenTool className="mr-1 h-3 w-3" /> New Post
                </Badge>
                <Badge className="bg-white/30 text-white backdrop-blur-sm hover:bg-white/40">
                  <BookOpen className="mr-1 h-3 w-3" /> Blog Management
                </Badge>
              </div>
              <h1 className="mb-2 text-4xl font-bold tracking-tight text-white md:text-5xl">
                <span className="bg-gradient-to-r from-blue-200 to-indigo-200 bg-clip-text text-transparent">
                  Create New
                </span>{" "}
                Blog Post
              </h1>
              <p className="text-lg text-blue-100">
                Write and publish engaging content with advanced SEO optimization and scheduling.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" className="rounded-full bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm border border-white/30">
              <Save className="mr-2 h-4 w-4" /> Save Draft
            </Button>
            <Button variant="secondary" className="rounded-full bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm border border-white/30">
              <RefreshCw className="mr-2 h-4 w-4" /> Reset
            </Button>
            <Button variant="secondary" className="rounded-full bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm border border-white/30">
              <Settings className="mr-2 h-4 w-4" /> Settings
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="relative z-10 mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-white/10 text-white backdrop-blur-sm border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-100">Form Status</p>
                  <p className="text-xl font-bold">{hasUnsavedChanges ? "Unsaved" : "Saved"}</p>
                </div>
                {hasUnsavedChanges ? <AlertTriangle className="h-6 w-6 text-orange-300" /> : <CheckCircle className="h-6 w-6 text-green-300" />}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 text-white backdrop-blur-sm border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-100">Word Count</p>
                  <p className="text-xl font-bold">{formData.wordCount}</p>
                </div>
                <Type className="h-6 w-6 text-blue-300" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 text-white backdrop-blur-sm border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-100">Reading Time</p>
                  <p className="text-xl font-bold">{formData.readingTime} min</p>
                </div>
                <Clock className="h-6 w-6 text-purple-300" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 text-white backdrop-blur-sm border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-100">Auto-save</p>
                  <p className="text-xl font-bold">{isAutoSaving ? "Saving..." : "Ready"}</p>
                </div>
                {isAutoSaving ? <Loader2 className="h-6 w-6 animate-spin text-yellow-300" /> : <Save className="h-6 w-6 text-green-300" />}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Unsaved Changes Alert */}
      {hasUnsavedChanges && (
        <div className="rounded-lg bg-orange-50 p-4 text-orange-800 shadow-md dark:bg-orange-950/20 dark:text-orange-200">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            <div>
              <h4 className="font-semibold">Unsaved Changes</h4>
              <p className="text-sm">You have unsaved changes. Don't forget to save your blog post.</p>
            </div>
            <Button onClick={handleSaveDraft} disabled={isLoading} className="ml-auto">
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Save Draft
            </Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="content" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Content
              </TabsTrigger>
              <TabsTrigger value="media" className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4" />
                Media
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </TabsTrigger>
              <TabsTrigger value="seo" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                SEO
              </TabsTrigger>
            </TabsList>

            {/* Content Tab */}
            <TabsContent value="content" className="space-y-6">
      <Card>
        <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Blog Content
                  </CardTitle>
                  <CardDescription>Write your blog post content with rich text editing.</CardDescription>
        </CardHeader>
                <CardContent className="space-y-6">
          {error && (
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

            <div className="space-y-2">
                    <Label htmlFor="title" className="flex items-center gap-2">
                      <Type className="h-4 w-4" />
                      Blog Title *
                    </Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                      placeholder="Enter your blog post title"
                      className="bg-white/50 dark:bg-slate-800/50 text-lg font-medium"
                required
              />
            </div>

            <div className="space-y-2">
                    <Label htmlFor="slug" className="flex items-center gap-2">
                      <LinkIcon className="h-4 w-4" />
                      URL Slug *
                    </Label>
                    <div className="flex gap-2">
              <Input
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                placeholder="enter-blog-post-slug"
                        className="bg-white/50 dark:bg-slate-800/50"
                required
              />
                      <Button type="button" variant="outline" onClick={generateSlug}>
                        <Zap className="h-4 w-4" />
                      </Button>
                    </div>
              <p className="text-xs text-muted-foreground">
                      URL: https://kureno.com/blog/{formData.slug || "example-slug"}
              </p>
            </div>

            <div className="space-y-2">
                    <Label htmlFor="excerpt" className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Excerpt *
                    </Label>
              <Textarea
                id="excerpt"
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                      placeholder="Write a brief summary of your blog post..."
                      rows={3}
                      className="bg-white/50 dark:bg-slate-800/50"
                required
              />
                    <p className="text-xs text-muted-foreground">
                      {formData.excerpt.length}/160 characters
                    </p>
            </div>

                  <div className="space-y-2">
                    <Label htmlFor="content" className="flex items-center gap-2">
                      <PenTool className="h-4 w-4" />
                      Content *
                      <Badge variant="outline" className="text-xs">
                        Supports Markdown
                      </Badge>
                    </Label>
                    <MarkdownEditor
                      value={formData.content}
                      onChange={(value: string) => {
                        setFormData(prev => ({ ...prev, content: value }))
                        setHasUnsavedChanges(true)
                        
                        // Calculate word count and reading time
                        const words = value.trim().split(/\s+/).filter(word => word.length > 0).length
                        const readingTime = Math.ceil(words / 200) // Average reading speed: 200 words per minute
                        setFormData(prev => ({ 
                          ...prev, 
                          wordCount: words,
                          readingTime: readingTime
                        }))
                      }}
                      placeholder="Write your blog post content here... Use markdown for rich formatting."
                      minHeight="400px"
                      className="bg-white/50 dark:bg-slate-800/50"
                    />
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{formData.wordCount} words</span>
                      <span>{formData.readingTime} min read</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Media Tab */}
            <TabsContent value="media" className="space-y-6">
              {/* Cover Image Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="h-5 w-5" />
                    Cover Image
                  </CardTitle>
                  <CardDescription>
                    Upload a cover image for your blog post. Recommended size: 1200x630px for optimal social media sharing.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Tabs defaultValue="cloudinary" className="space-y-4">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="cloudinary">Cloudinary Upload</TabsTrigger>
                      <TabsTrigger value="url">Manual URL</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="cloudinary">
                      <CloudinaryUpload
                        onUpload={(files: CloudinaryFile[]) => {
                          if (files.length > 0) {
                            setFormData(prev => ({ ...prev, coverImage: files[0].secureUrl }))
                            setHasUnsavedChanges(true)
                          }
                        }}
                        maxFiles={1}
                        maxFileSize={10}
                        acceptedTypes={['image']}
                        folder="blog"
                        multiple={false}
                        showPreview={true}
                        className="border rounded-lg p-4"
                      />
                    </TabsContent>
                    
                    <TabsContent value="url">
                      <div className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-[200px_1fr] items-start">
                          <div className="overflow-hidden rounded-lg border bg-white dark:bg-slate-800">
                            <Image 
                              src={formData.coverImage || "/placeholder.png"} 
                              alt="Cover preview" 
                              width={200} 
                              height={120} 
                              className="h-32 w-full object-cover" 
                            />
                          </div>
                          <div className="space-y-2">
                            <Input
                              id="coverImage"
                              name="coverImage"
                              value={formData.coverImage}
                              onChange={handleChange}
                              placeholder="https://example.com/cover-image.jpg"
                              className="bg-white/50 dark:bg-slate-800/50"
                            />
                            <p className="text-xs text-muted-foreground">
                              Enter a direct URL to your cover image
                            </p>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              {/* Additional Images Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="h-5 w-5" />
                    Additional Images
                  </CardTitle>
                  <CardDescription>
                    Upload additional images for your blog post content. These can be referenced in your markdown.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CloudinaryUpload
                    onUpload={(files: CloudinaryFile[]) => {
                      const urls = files.map(file => file.secureUrl)
                      setFormData(prev => ({ ...prev, images: urls }))
                      setHasUnsavedChanges(true)
                    }}
                    maxFiles={20}
                    maxFileSize={10}
                    acceptedTypes={['image']}
                    folder="blog"
                    multiple={true}
                    showPreview={true}
                    className="border rounded-lg p-4"
                  />
                </CardContent>
              </Card>

              {/* Videos Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    Videos
                  </CardTitle>
                  <CardDescription>
                    Upload videos to enhance your blog post. These can be embedded in your content.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CloudinaryVideoUpload
                    onUpload={(videos: CloudinaryVideo[]) => {
                      const urls = videos.map(video => video.secureUrl)
                      setFormData(prev => ({ ...prev, videos: urls }))
                      setHasUnsavedChanges(true)
                    }}
                    maxFiles={5}
                    maxFileSize={100}
                    folder="blog"
                    multiple={true}
                    showPreview={true}
                    className="border rounded-lg p-4"
                  />
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
                  <CardDescription>Configure publishing options and post visibility.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="author" className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Author
                      </Label>
                      <Input
                        id="author"
                        name="author"
                        value={formData.author}
                        onChange={handleChange}
                        placeholder="Author name"
                        className="bg-white/50 dark:bg-slate-800/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category" className="flex items-center gap-2">
                        <Tag className="h-4 w-4" />
                        Category
                      </Label>
                      <Input
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        placeholder="Blog category"
                        className="bg-white/50 dark:bg-slate-800/50"
                      />
                    </div>
            </div>

            <div className="space-y-2">
                    <Label htmlFor="tags" className="flex items-center gap-2">
                      <Hash className="h-4 w-4" />
                      Tags
                    </Label>
              <Input
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                      placeholder="technology, web development, tutorial"
                      className="bg-white/50 dark:bg-slate-800/50"
              />
                    <p className="text-xs text-muted-foreground">
                      Separate tags with commas
                    </p>
            </div>

                  <div className="space-y-4">
                    <Label className="text-base font-medium">Publishing Options</Label>
                    <div className="space-y-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="published" className="text-base font-medium">Publish Immediately</Label>
                          <p className="text-sm text-muted-foreground">Make this post live right away</p>
                        </div>
              <Switch id="published" checked={formData.published} onCheckedChange={handleSwitchChange} />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="featured" className="text-base font-medium">Featured Post</Label>
                          <p className="text-sm text-muted-foreground">Highlight this post on the homepage</p>
                        </div>
                        <Switch 
                          id="featured" 
                          checked={formData.featured} 
                          onCheckedChange={(checked) => handleAdvancedChange("featured", checked)} 
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="allowComments" className="text-base font-medium">Allow Comments</Label>
                          <p className="text-sm text-muted-foreground">Enable reader comments on this post</p>
                        </div>
                        <Switch 
                          id="allowComments" 
                          checked={formData.allowComments} 
                          onCheckedChange={(checked) => handleAdvancedChange("allowComments", checked)} 
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="status" className="flex items-center gap-2">
                        <Activity className="h-4 w-4" />
                        Status
                      </Label>
                      <select 
                        id="status"
                        value={formData.status} 
                        onChange={(e) => handleAdvancedChange("status", e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-white/50 dark:bg-slate-800/50"
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                        <option value="scheduled">Scheduled</option>
                        <option value="archived">Archived</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="visibility" className="flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        Visibility
                      </Label>
                      <select 
                        id="visibility"
                        value={formData.visibility} 
                        onChange={(e) => handleAdvancedChange("visibility", e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-white/50 dark:bg-slate-800/50"
                      >
                        <option value="public">Public</option>
                        <option value="private">Private</option>
                        <option value="password-protected">Password Protected</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-base font-medium">Scheduling</Label>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="publishAt" className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Publish Date
                        </Label>
                        <Input
                          id="publishAt"
                          name="publishAt"
                          type="datetime-local"
                          value={formData.scheduling.publishAt}
                          onChange={(e) => handleSchedulingChange("publishAt", e.target.value)}
                          className="bg-white/50 dark:bg-slate-800/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="unpublishAt" className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          Unpublish Date
                        </Label>
                        <Input
                          id="unpublishAt"
                          name="unpublishAt"
                          type="datetime-local"
                          value={formData.scheduling.unpublishAt}
                          onChange={(e) => handleSchedulingChange("unpublishAt", e.target.value)}
                          className="bg-white/50 dark:bg-slate-800/50"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* SEO Tab */}
            <TabsContent value="seo" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    SEO Optimization
                  </CardTitle>
                  <CardDescription>Optimize your blog post for search engines and social media.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="seo-title" className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      SEO Title
                    </Label>
                    <Input
                      id="seo-title"
                      value={formData.seo.title}
                      onChange={(e) => handleSEOChange("title", e.target.value)}
                      placeholder="SEO optimized title"
                      className="bg-white/50 dark:bg-slate-800/50"
                    />
                    <p className="text-xs text-muted-foreground">
                      {formData.seo.title.length}/60 characters
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="seo-description" className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      SEO Description
                    </Label>
                    <Textarea
                      id="seo-description"
                      value={formData.seo.description}
                      onChange={(e) => handleSEOChange("description", e.target.value)}
                      placeholder="SEO optimized description"
                      rows={3}
                      className="bg-white/50 dark:bg-slate-800/50"
                    />
                    <p className="text-xs text-muted-foreground">
                      {formData.seo.description.length}/160 characters
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="seo-keywords" className="flex items-center gap-2">
                      <Hash className="h-4 w-4" />
                      Keywords
                    </Label>
                    <Input
                      id="seo-keywords"
                      value={formData.seo.keywords}
                      onChange={(e) => handleSEOChange("keywords", e.target.value)}
                      placeholder="Enter relevant keywords"
                      className="bg-white/50 dark:bg-slate-800/50"
                    />
                    <p className="text-xs text-muted-foreground">
                      Separate keywords with commas
                    </p>
                  </div>

                  <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-950/20">
                    <div className="flex items-start gap-3">
                      <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-900 dark:text-blue-100">SEO Tips</h4>
                        <ul className="mt-2 text-sm text-blue-800 dark:text-blue-200 space-y-1">
                          <li>• Use relevant keywords naturally in your title and description</li>
                          <li>• Keep titles under 60 characters for optimal display</li>
                          <li>• Write compelling descriptions that encourage clicks</li>
                          <li>• Include your brand name in the title when appropriate</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Blog Post Preview Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Post Preview
              </CardTitle>
              <CardDescription>How your blog post will appear to readers.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Cover Image Preview */}
              <div className="aspect-video overflow-hidden rounded-lg border bg-white dark:bg-slate-800">
                <Image 
                  src={formData.coverImage || "/placeholder.png"} 
                  alt={formData.title || "Blog post preview"} 
                  width={300} 
                  height={200} 
                  className="h-full w-full object-cover" 
                />
              </div>

              {/* Post Info Preview */}
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-lg line-clamp-2">
                    {formData.title || "Blog Post Title"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {formData.excerpt || "Blog post excerpt will appear here..."}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span>{formData.author || "Author"}</span>
                  <span>•</span>
                  <Clock className="h-4 w-4" />
                  <span>{formData.readingTime} min read</span>
                </div>

                {formData.tags && (
                  <div className="flex flex-wrap gap-1">
                    {formData.tags.split(',').slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag.trim()}
                      </Badge>
                    ))}
                    {formData.tags.split(',').length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{formData.tags.split(',').length - 3} more
                      </Badge>
                    )}
                  </div>
                )}

                <div className="flex items-center gap-2 text-sm">
                  {formData.featured && (
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                      <Star className="mr-1 h-3 w-3" />
                      Featured
                    </Badge>
                  )}
                  <Badge variant="outline" className="text-xs">
                    {formData.status}
                  </Badge>
                </div>
              </div>

              <Separator />

              {/* SEO Preview */}
              <div className="space-y-3">
                <h4 className="font-medium">SEO Preview</h4>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-blue-600 dark:text-blue-400 line-clamp-1">
                    {formData.seo.title || formData.title || "SEO Title"}
                  </div>
                  <div className="text-xs text-green-600 dark:text-green-400">
                    kureno.com/blog/{formData.slug || 'blog-slug'}
                  </div>
                  <div className="text-sm text-muted-foreground line-clamp-2">
                    {formData.seo.description || formData.excerpt || "SEO description will appear here..."}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Post Stats */}
              <div className="space-y-3">
                <h4 className="font-medium">Post Statistics</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                    <div className="font-semibold">{formData.wordCount}</div>
                    <div className="text-xs text-muted-foreground">Words</div>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                    <div className="font-semibold">{formData.readingTime}</div>
                    <div className="text-xs text-muted-foreground">Min Read</div>
                  </div>
                </div>
            </div>
        </CardContent>
          </Card>
        </div>
      </div>

      {/* Form Actions */}
      <Card>
        <CardFooter className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {hasUnsavedChanges && (
              <>
                <AlertTriangle className="h-4 w-4 text-orange-500" />
                <span>You have unsaved changes</span>
              </>
            )}
            {isAutoSaving && (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                <span>Auto-saving...</span>
              </>
            )}
          </div>
          <div className="flex gap-3">
          <Button variant="outline" asChild>
              <Link href="/admin/blog">
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Link>
            </Button>
            <Button variant="outline" onClick={handleSaveDraft} disabled={isLoading}>
              <Save className="mr-2 h-4 w-4" />
              Save Draft
          </Button>
          <Button type="submit" form="blog-form" disabled={isLoading}>
            {isLoading ? (
              <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
              </>
            ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Create Post
                </>
            )}
          </Button>
          </div>
        </CardFooter>
      </Card>

      {/* Hidden Form for Submission */}
      <form id="blog-form" onSubmit={handleSubmit} className="hidden">
        {/* Form fields are handled by the tabs above */}
      </form>
    </div>
  )
}
