"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import ImageUpload from "../image-upload"
import CloudinaryImageUpload from "../cloudinary-image-upload"
import CloudinaryVideoUploadComponent from "../cloudinary-video-upload"
import ProductVariants from "../product-variants"
import MarkdownEditor from "../components/markdown-editor"
import { 
  Loader2, 
  ArrowLeft, 
  Plus, 
  Minus, 
  X, 
  Check, 
  Upload, 
  Image as ImageIcon, 
  Video,
  Package, 
  DollarSign, 
  Tag, 
  Star, 
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
  Hash, 
  Calendar, 
  Clock, 
  TrendingUp, 
  BarChart3, 
  Users, 
  ShoppingCart, 
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
  Type, 
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
  Sparkles
} from "lucide-react"
import Link from "next/link"

export default function NewProductPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [categories, setCategories] = useState<{ _id: string; name: string; slug: string }[]>([])
  const [activeTab, setActiveTab] = useState("basic")
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [isAutoSaving, setIsAutoSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    featured: false,
    images: [""], // Start with one empty image URL
    videos: [] as string[], // Product videos
    // Sales pricing
    onSale: false,
    originalPrice: "",
    salePrice: "",
    saleStartDate: "",
    saleEndDate: "",
    // Badge management
    isTrending: false,
    isBestSeller: false,
    isNewProduct: false,
    // Advanced fields
    sku: "",
    weight: "",
    dimensions: {
      length: "",
      width: "",
      height: ""
    },
    seo: {
      title: "",
      description: "",
      keywords: ""
    },
    variants: [] as any[],
    tags: "",
    status: "draft", // draft, published, archived
    visibility: "public", // public, private, hidden
    inventory: {
      trackQuantity: true,
      allowBackorder: false,
      lowStockThreshold: 5
    }
  })
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories")
        const data = await res.json()
        setCategories(data.categories || [])
      } catch (e) {
        // ignore
      }
    }
    fetchCategories()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setHasUnsavedChanges(true)
    
    // Auto-generate SEO title from product name
    if (name === "name" && !formData.seo.title) {
      setFormData((prev) => ({
        ...prev,
        seo: { ...prev.seo, title: value }
      }))
    }
  }

  const handleSwitchChange = (field: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [field]: checked }))
    setHasUnsavedChanges(true)
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }))
    setHasUnsavedChanges(true)
    
    // Auto-generate SKU if not already set
    if (!formData.sku) {
      const prefix = value ? value.slice(0, 3).toUpperCase() : "PRD"
      const random = Math.random().toString(36).substr(2, 6).toUpperCase()
      const sku = `${prefix}-${random}`
      setFormData((prev) => ({ ...prev, sku }))
    }
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

  const handleInventoryChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      inventory: { ...prev.inventory, [field]: value }
    }))
    setHasUnsavedChanges(true)
  }


  // Auto-save functionality
  useEffect(() => {
    if (hasUnsavedChanges && formData.name) {
      const timer = setTimeout(() => {
        setIsAutoSaving(true)
        // Simulate auto-save
        setTimeout(() => {
          setIsAutoSaving(false)
          toast({
            title: "Auto-saved",
            description: "Your changes have been automatically saved.",
          })
        }, 1000)
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [hasUnsavedChanges, formData.name, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Filter out empty image URLs
      const filteredImages = formData.images.filter((url) => url.trim() !== "")

      if (filteredImages.length === 0) {
        throw new Error("At least one image URL is required")
      }

      if (!formData.name.trim()) throw new Error("Product name is required")
      if (!formData.category.trim()) throw new Error("Category is required")
      
      // Validate pricing based on sale status
      if (formData.onSale) {
        const originalPriceNum = Number.parseFloat(formData.originalPrice)
        const salePriceNum = Number.parseFloat(formData.salePrice)
        if (Number.isNaN(originalPriceNum) || originalPriceNum < 0) throw new Error("Original price must be a positive number")
        if (Number.isNaN(salePriceNum) || salePriceNum < 0) throw new Error("Sale price must be a positive number")
        if (salePriceNum >= originalPriceNum) throw new Error("Sale price must be less than original price")
      } else {
        const priceNum = Number.parseFloat(formData.price)
        if (Number.isNaN(priceNum) || priceNum < 0) throw new Error("Price must be a positive number")
      }
      
      const stockNum = Number.parseInt(formData.stock)
      if (Number.isNaN(stockNum) || stockNum < 0) throw new Error("Stock must be a non-negative integer")

      const productData = {
        name: formData.name,
        description: formData.description,
        price: formData.onSale ? Number.parseFloat(formData.salePrice) : Number.parseFloat(formData.price),
        originalPrice: formData.onSale ? Number.parseFloat(formData.originalPrice) : null,
        onSale: formData.onSale,
        saleStartDate: formData.saleStartDate || null,
        saleEndDate: formData.saleEndDate || null,
        category: formData.category,
        stock: Number.parseInt(formData.stock),
        featured: formData.featured,
        images: filteredImages,
        videos: formData.videos.filter(video => video.trim() !== ""),
        // Badge management
        isTrending: formData.isTrending,
        isBestSeller: formData.isBestSeller,
        isNewProduct: formData.isNewProduct,
        // Advanced fields
        sku: formData.sku,
        weight: formData.weight,
        dimensions: formData.dimensions,
        seo: formData.seo,
        tags: formData.tags,
        status: formData.status,
        visibility: formData.visibility,
        inventory: formData.inventory,
      }

      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create product")
      }

      toast({
        title: "Product Created",
        description: "Your product has been successfully created.",
      })

      setHasUnsavedChanges(false)
      router.push("/admin/products")
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
    setError(null)
    
    try {
      // Basic validation for draft
      if (!formData.name.trim()) {
        throw new Error("Product name is required to save draft")
      }

      // Filter out empty image URLs
      const filteredImages = formData.images.filter((url) => url.trim() !== "")
      
      const productData = {
        name: formData.name,
        description: formData.description,
        price: formData.onSale ? 
          (formData.salePrice ? Number.parseFloat(formData.salePrice) : 0) : 
          (formData.price ? Number.parseFloat(formData.price) : 0),
        originalPrice: formData.onSale && formData.originalPrice ? Number.parseFloat(formData.originalPrice) : undefined,
        onSale: formData.onSale,
        saleStartDate: formData.saleStartDate || null,
        saleEndDate: formData.saleEndDate || null,
        category: formData.category || "uncategorized",
        stock: formData.stock ? Number.parseInt(formData.stock) : 0,
        featured: formData.featured,
        images: filteredImages.length > 0 ? filteredImages : [""],
        videos: formData.videos.filter(video => video.trim() !== ""),
        // Badge management
        isTrending: formData.isTrending,
        isBestSeller: formData.isBestSeller,
        isNewProduct: formData.isNewProduct,
        // Advanced fields
        sku: formData.sku,
        weight: formData.weight,
        dimensions: formData.dimensions,
        seo: formData.seo,
        tags: formData.tags,
        status: "draft",
        visibility: formData.visibility,
        inventory: formData.inventory,
      }

      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to save draft")
      }

      toast({
        title: "Draft Saved",
        description: "Your product draft has been saved successfully.",
      })

      setHasUnsavedChanges(false)
      
      // Optionally redirect to edit page
      if (data._id) {
        router.push(`/admin/products/${data._id}/edit`)
      }
    } catch (error: any) {
      setError(error.message || "Failed to save draft")
      toast({
        title: "Error",
        description: error.message || "Failed to save draft",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const generateSKU = () => {
    const prefix = formData.category ? formData.category.slice(0, 3).toUpperCase() : "PRD"
    const random = Math.random().toString(36).substr(2, 6).toUpperCase()
    const sku = `${prefix}-${random}`
    setFormData((prev) => ({ ...prev, sku }))
    setHasUnsavedChanges(true)
  }

  const handleResetForm = () => {
    if (hasUnsavedChanges) {
      const confirmed = window.confirm("Are you sure you want to reset the form? All unsaved changes will be lost.")
      if (!confirmed) return
    }
    
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "",
      stock: "",
      featured: false,
      images: [""],
      videos: [],
      // Sales pricing
      onSale: false,
      originalPrice: "",
      salePrice: "",
      saleStartDate: "",
      saleEndDate: "",
      // Badge management
      isTrending: false,
      isBestSeller: false,
      isNewProduct: false,
      // Advanced fields
      sku: "",
      weight: "",
      dimensions: {
        length: "",
        width: "",
        height: ""
      },
      seo: {
        title: "",
        description: "",
        keywords: ""
      },
      variants: [],
      tags: "",
      status: "draft",
      visibility: "public",
      inventory: {
        trackQuantity: true,
        allowBackorder: false,
        lowStockThreshold: 5
      }
    })
    setHasUnsavedChanges(false)
    setError(null)
    setActiveTab("basic")
    
    toast({
      title: "Form Reset",
      description: "The form has been reset to its initial state.",
    })
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Header Section */}
      <div className="relative mb-8 overflow-hidden rounded-xl bg-gradient-to-br from-slate-500 to-gray-700 p-6 shadow-lg md:p-10">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.1\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'3\'/%3E%3Ccircle cx=\'13\' cy=\'13\' r=\'3\'/%3E%3C/g%3E%3C/svg%3E")',
          maskImage: 'radial-gradient(circle at center, white, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(circle at center, white, transparent 70%)',
        }}></div>
        <div className="relative z-10 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
      <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild className="text-white hover:bg-white/20">
          <Link href="/admin/products">
                <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
            <div>
              <div className="mb-2 flex items-center gap-2">
                <Badge className="bg-white/30 text-white backdrop-blur-sm hover:bg-white/40">
                  <Plus className="mr-1 h-3 w-3" /> New Product
                </Badge>
                <Badge className="bg-white/30 text-white backdrop-blur-sm hover:bg-white/40">
                  <Package className="mr-1 h-3 w-3" /> Product Management
                </Badge>
              </div>
              <h1 className="mb-2 text-4xl font-bold tracking-tight text-white md:text-5xl">
                <span className="bg-gradient-to-r from-teal-200 to-emerald-200 bg-clip-text text-transparent">
                  Create New
                </span>{" "}
                Product
              </h1>
              <p className="text-lg text-slate-200">
                Add a new product to your catalog with advanced options and SEO optimization.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button 
              variant="secondary" 
              className="rounded-full bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm border border-white/30"
              onClick={handleSaveDraft}
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />} Save Draft
            </Button>
            <Button 
              variant="secondary" 
              className="rounded-full bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm border border-white/30"
              onClick={handleResetForm}
            >
              <RefreshCw className="mr-2 h-4 w-4" /> Reset
            </Button>
            <Button 
              variant="secondary" 
              className="rounded-full bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm border border-white/30"
              onClick={() => {
                if (formData.name) {
                  toast({
                    title: "Preview Mode",
                    description: "Product preview will be available after saving.",
                  })
                } else {
                  toast({
                    title: "Preview Unavailable",
                    description: "Please enter a product name first.",
                    variant: "destructive",
                  })
                }
              }}
            >
              <Eye className="mr-2 h-4 w-4" /> Preview
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="relative z-10 mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
          <Card className="bg-white/10 text-white backdrop-blur-sm border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-200">Form Status</p>
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
                  <p className="text-sm text-slate-200">Images</p>
                  <p className="text-xl font-bold">{formData.images.filter(img => img.trim()).length}</p>
                </div>
                <ImageIcon className="h-6 w-6 text-blue-300" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 text-white backdrop-blur-sm border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-200">Description</p>
                  <p className="text-xl font-bold">{formData.description.length} chars</p>
                </div>
                <Type className="h-6 w-6 text-purple-300" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 text-white backdrop-blur-sm border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-200">Auto-save</p>
                  <p className="text-xl font-bold">{isAutoSaving ? "Saving..." : "Ready"}</p>
                </div>
                {isAutoSaving ? <Loader2 className="h-6 w-6 animate-spin text-yellow-300" /> : <Save className="h-6 w-6 text-green-300" />}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 text-white backdrop-blur-sm border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-200">Price</p>
                  <p className="text-xl font-bold">${formData.onSale ? formData.salePrice : formData.price || "0"}</p>
                </div>
                <DollarSign className="h-6 w-6 text-green-300" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 text-white backdrop-blur-sm border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-200">Videos</p>
                  <p className="text-xl font-bold">{formData.videos.filter(video => video.trim()).length}</p>
                </div>
                <Video className="h-6 w-6 text-purple-300" />
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
              <p className="text-sm">You have unsaved changes. Don't forget to save your product.</p>
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
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="basic" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Basic Info
              </TabsTrigger>
              <TabsTrigger value="media" className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4" />
                Media
              </TabsTrigger>
              <TabsTrigger value="variants" className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Variants
              </TabsTrigger>
              <TabsTrigger value="advanced" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Advanced
              </TabsTrigger>
              <TabsTrigger value="seo" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                SEO
              </TabsTrigger>
            </TabsList>

            {/* Basic Information Tab */}
            <TabsContent value="basic" className="space-y-6">
      <Card>
        <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Basic Information
                  </CardTitle>
                  <CardDescription>Essential product details and pricing information.</CardDescription>
        </CardHeader>
                <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between">
                <span>{error}</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setError(null)}
                  className="ml-2 h-6 w-6 p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* Success Alert for Auto-save */}
          {!hasUnsavedChanges && formData.name && (
            <Alert className="mb-6 border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950/20 dark:text-green-400">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Form is saved and ready. You can continue editing or submit when ready.
              </AlertDescription>
            </Alert>
          )}

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                      <Label htmlFor="name" className="flex items-center gap-2">
                        <Type className="h-4 w-4" />
                        Product Name *
                      </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter product name"
                        className="bg-white/50 dark:bg-slate-800/50"
                  required
                />
              </div>
              <div className="space-y-2">
                      <Label htmlFor="category" className="flex items-center gap-2">
                        <Tag className="h-4 w-4" />
                        Category *
                      </Label>
                <Select value={formData.category} onValueChange={handleSelectChange} required>
                        <SelectTrigger className="bg-white/50 dark:bg-slate-800/50">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c._id} value={c.slug}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="flex items-center gap-2">
                <FileCode className="h-4 w-4" />
                Product Description *
                <span className="text-xs text-muted-foreground ml-auto">Supports Markdown</span>
              </Label>
              <MarkdownEditor
                value={formData.description}
                onChange={(value: string) => {
                  setFormData((prev) => ({ ...prev, description: value }))
                  setHasUnsavedChanges(true)
                }}
                placeholder="Enter detailed product description using Markdown formatting..."
                minHeight="400px"
                className="bg-white/50 dark:bg-slate-800/50"
              />
            </div>

            {/* Sales Toggle */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 border border-orange-200/50 dark:border-orange-800/50">
              <div className="flex items-center gap-3">
                <Tag className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                <div>
                  <Label htmlFor="onSale" className="text-base font-medium">Sale Pricing</Label>
                  <p className="text-sm text-muted-foreground">Enable sale pricing with original and discounted prices</p>
                </div>
              </div>
              <Switch id="onSale" checked={formData.onSale} onCheckedChange={(checked) => handleSwitchChange("onSale", checked)} />
            </div>

            {/* Pricing Section */}
            {formData.onSale ? (
              // Sale Pricing Layout
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="originalPrice" className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Original Price ($) *
                    </Label>
                    <Input
                      id="originalPrice"
                      name="originalPrice"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.originalPrice}
                      onChange={handleChange}
                      placeholder="0.00"
                      className="bg-white/50 dark:bg-slate-800/50"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="salePrice" className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-red-600" />
                      Sale Price ($) *
                    </Label>
                    <Input
                      id="salePrice"
                      name="salePrice"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.salePrice}
                      onChange={handleChange}
                      placeholder="0.00"
                      className="bg-white/50 dark:bg-slate-800/50 border-red-200 focus:border-red-500"
                      required
                    />
                  </div>
                </div>

                {/* Sale Duration */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="saleStartDate" className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Sale Start Date
                    </Label>
                    <Input
                      id="saleStartDate"
                      name="saleStartDate"
                      type="datetime-local"
                      value={formData.saleStartDate}
                      onChange={handleChange}
                      className="bg-white/50 dark:bg-slate-800/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="saleEndDate" className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Sale End Date
                    </Label>
                    <Input
                      id="saleEndDate"
                      name="saleEndDate"
                      type="datetime-local"
                      value={formData.saleEndDate}
                      onChange={handleChange}
                      className="bg-white/50 dark:bg-slate-800/50"
                    />
                  </div>
                </div>

                {/* Sale Discount Calculation */}
                {formData.originalPrice && formData.salePrice && (
                  <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="font-medium text-green-800 dark:text-green-200">Discount Calculation</span>
                    </div>
                    <div className="grid gap-2 text-sm">
                      <div className="flex justify-between">
                        <span>Original Price:</span>
                        <span>${parseFloat(formData.originalPrice).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Sale Price:</span>
                        <span className="text-red-600 font-medium">${parseFloat(formData.salePrice).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-medium text-green-600">
                        <span>You Save:</span>
                        <span>${(parseFloat(formData.originalPrice) - parseFloat(formData.salePrice)).toFixed(2)} ({Math.round(((parseFloat(formData.originalPrice) - parseFloat(formData.salePrice)) / parseFloat(formData.originalPrice)) * 100)}% off)</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // Regular Pricing Layout
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="price" className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Price ($) *
                  </Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="0.00"
                    className="bg-white/50 dark:bg-slate-800/50"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock" className="flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    Stock Quantity *
                  </Label>
                  <Input
                    id="stock"
                    name="stock"
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={handleChange}
                    placeholder="0"
                    className="bg-white/50 dark:bg-slate-800/50"
                    required
                  />
                </div>
              </div>
            )}

            {/* Stock field for sale pricing layout */}
            {formData.onSale && (
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="stock" className="flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    Stock Quantity *
                  </Label>
                  <Input
                    id="stock"
                    name="stock"
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={handleChange}
                    placeholder="0"
                    className="bg-white/50 dark:bg-slate-800/50"
                    required
                  />
                </div>
                <div></div> {/* Empty div for grid alignment */}
              </div>
            )}

                  <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border border-blue-200/50 dark:border-blue-800/50">
                    <div className="flex items-center gap-3">
                      <Star className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      <div>
                        <Label htmlFor="featured" className="text-base font-medium">Featured Product</Label>
                        <p className="text-sm text-muted-foreground">Highlight this product on the homepage</p>
                      </div>
                    </div>
                    <Switch id="featured" checked={formData.featured} onCheckedChange={(checked) => handleSwitchChange("featured", checked)} />
                  </div>
                </CardContent>
              </Card>

              {/* Badge Management Section */}
              <Card className="bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Award className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    Badge Management
                  </CardTitle>
                  <CardDescription>Control product badges and special labels for better visibility.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Trending Badge */}
                  <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 border border-orange-200/50 dark:border-orange-800/50">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                        <div>
                          <Label htmlFor="isTrending" className="text-base font-medium">Trending Badge</Label>
                          <p className="text-sm text-muted-foreground">Show trending badge (high stock + featured)</p>
                        </div>
                      </div>
                    </div>
                    <Switch 
                      id="isTrending" 
                      checked={formData.isTrending} 
                      onCheckedChange={(checked) => handleSwitchChange("isTrending", checked)} 
                    />
                  </div>

                  {/* Best Seller Badge */}
                  <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border border-purple-200/50 dark:border-purple-800/50">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Award className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        <div>
                          <Label htmlFor="isBestSeller" className="text-base font-medium">Best Seller Badge</Label>
                          <p className="text-sm text-muted-foreground">Show best seller badge (low stock + featured)</p>
                        </div>
                      </div>
                    </div>
                    <Switch 
                      id="isBestSeller" 
                      checked={formData.isBestSeller} 
                      onCheckedChange={(checked) => handleSwitchChange("isBestSeller", checked)} 
                    />
                  </div>

                  {/* New Badge */}
                  <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-950/20 dark:to-cyan-950/20 border border-teal-200/50 dark:border-teal-800/50">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                        <div>
                          <Label htmlFor="isNewProduct" className="text-base font-medium">New Badge</Label>
                          <p className="text-sm text-muted-foreground">Show new product badge</p>
                        </div>
                      </div>
                    </div>
                    <Switch 
                      id="isNewProduct" 
                      checked={formData.isNewProduct} 
                      onCheckedChange={(checked) => handleSwitchChange("isNewProduct", checked)} 
                    />
                  </div>

                  {/* Badge Preview */}
                  {(formData.isTrending || formData.isBestSeller || formData.isNewProduct || formData.featured || formData.onSale) && (
                    <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                      <div className="flex items-center gap-2 mb-3">
                        <Eye className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Badge Preview</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {formData.featured && (
                          <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white">
                            <Award className="h-3 w-3 mr-1" />
                            Featured
                          </Badge>
                        )}
                        {formData.isNewProduct && (
                          <Badge className="bg-teal-500 hover:bg-teal-600 text-white">
                            <Sparkles className="h-3 w-3 mr-1" />
                            New
                          </Badge>
                        )}
                        {formData.onSale && formData.originalPrice && formData.salePrice && (
                          <Badge variant="destructive">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            Sale
                          </Badge>
                        )}
                        {formData.isTrending && (
                          <Badge className="bg-orange-500 hover:bg-orange-600 text-white">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            Trending
                          </Badge>
                        )}
                        {formData.isBestSeller && (
                          <Badge className="bg-purple-500 hover:bg-purple-600 text-white">
                            <Award className="h-3 w-3 mr-1" />
                            Best Seller
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Media Tab */}
            <TabsContent value="media" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="h-5 w-5" />
                    Product Images & Media
                  </CardTitle>
                  <CardDescription>
                    Upload images to Cloudinary for optimized delivery and performance, or use manual URLs.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <CloudinaryImageUpload
                    images={formData.images}
                    onImagesChange={(images) => {
                      setFormData(prev => ({ ...prev, images }))
                      setHasUnsavedChanges(true)
                    }}
                    maxImages={10}
                    folder="products"
                  />
                  
                  <Separator />
                  
                  <CloudinaryVideoUploadComponent
                    videos={formData.videos}
                    onVideosChange={(videos) => {
                      setFormData(prev => ({ ...prev, videos }))
                      setHasUnsavedChanges(true)
                    }}
                    maxVideos={5}
                    folder="products/videos"
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Variants Tab */}
            <TabsContent value="variants" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    Product Variants
                  </CardTitle>
                  <CardDescription>Create different variations of your product (colors, sizes, materials, etc.)</CardDescription>
                </CardHeader>
                <CardContent>
                  <ProductVariants
                    variants={formData.variants}
                    onVariantsChange={(variants) => {
                      setFormData(prev => ({ ...prev, variants }))
                      setHasUnsavedChanges(true)
                    }}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Advanced Tab */}
            <TabsContent value="advanced" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Advanced Settings
                  </CardTitle>
                  <CardDescription>Additional product configuration and inventory management.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="sku" className="flex items-center gap-2">
                        <Hash className="h-4 w-4" />
                        SKU
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          id="sku"
                          name="sku"
                          value={formData.sku}
                          onChange={handleChange}
                          placeholder="Product SKU"
                          className="bg-white/50 dark:bg-slate-800/50"
                        />
                        <Button type="button" variant="outline" onClick={generateSKU}>
                          <Zap className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="weight" className="flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        Weight (kg)
                      </Label>
                      <Input
                        id="weight"
                        name="weight"
                        type="number"
                        step="0.1"
                        min="0"
                        value={formData.weight}
                        onChange={handleChange}
                        placeholder="0.0"
                        className="bg-white/50 dark:bg-slate-800/50"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-base font-medium">Dimensions (cm)</Label>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label htmlFor="length">Length</Label>
                        <Input
                          id="length"
                          name="length"
                          type="number"
                          step="0.1"
                          min="0"
                          value={formData.dimensions.length}
                          onChange={(e) => handleAdvancedChange("dimensions", { ...formData.dimensions, length: e.target.value })}
                          placeholder="0.0"
                          className="bg-white/50 dark:bg-slate-800/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="width">Width</Label>
                        <Input
                          id="width"
                          name="width"
                          type="number"
                          step="0.1"
                          min="0"
                          value={formData.dimensions.width}
                          onChange={(e) => handleAdvancedChange("dimensions", { ...formData.dimensions, width: e.target.value })}
                          placeholder="0.0"
                          className="bg-white/50 dark:bg-slate-800/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="height">Height</Label>
                        <Input
                          id="height"
                          name="height"
                          type="number"
                          step="0.1"
                          min="0"
                          value={formData.dimensions.height}
                          onChange={(e) => handleAdvancedChange("dimensions", { ...formData.dimensions, height: e.target.value })}
                          placeholder="0.0"
                          className="bg-white/50 dark:bg-slate-800/50"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-base font-medium">Inventory Management</Label>
                    <div className="space-y-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="trackQuantity" className="text-base font-medium">Track Quantity</Label>
                          <p className="text-sm text-muted-foreground">Enable inventory tracking for this product</p>
                        </div>
                        <Switch 
                          id="trackQuantity" 
                          checked={formData.inventory.trackQuantity} 
                          onCheckedChange={(checked) => handleInventoryChange("trackQuantity", checked)} 
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="allowBackorder" className="text-base font-medium">Allow Backorder</Label>
                          <p className="text-sm text-muted-foreground">Allow sales when out of stock</p>
                        </div>
                        <Switch 
                          id="allowBackorder" 
                          checked={formData.inventory.allowBackorder} 
                          onCheckedChange={(checked) => handleInventoryChange("allowBackorder", checked)} 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lowStockThreshold" className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4" />
                          Low Stock Threshold
                        </Label>
                        <Input
                          id="lowStockThreshold"
                          name="lowStockThreshold"
                          type="number"
                          min="0"
                          value={formData.inventory.lowStockThreshold}
                          onChange={(e) => handleInventoryChange("lowStockThreshold", parseInt(e.target.value))}
                          placeholder="5"
                          className="bg-white/50 dark:bg-slate-800/50"
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
                      <Select value={formData.status} onValueChange={(value) => handleAdvancedChange("status", value)}>
                        <SelectTrigger className="bg-white/50 dark:bg-slate-800/50">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="published">Published</SelectItem>
                          <SelectItem value="archived">Archived</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="visibility" className="flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        Visibility
                      </Label>
                      <Select value={formData.visibility} onValueChange={(value) => handleAdvancedChange("visibility", value)}>
                        <SelectTrigger className="bg-white/50 dark:bg-slate-800/50">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">Public</SelectItem>
                          <SelectItem value="private">Private</SelectItem>
                          <SelectItem value="hidden">Hidden</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tags" className="flex items-center gap-2">
                      <Tag className="h-4 w-4" />
                      Tags
                    </Label>
                    <Input
                      id="tags"
                      name="tags"
                      value={formData.tags}
                      onChange={handleChange}
                      placeholder="Enter tags separated by commas"
                      className="bg-white/50 dark:bg-slate-800/50"
                    />
                    <p className="text-xs text-muted-foreground">
                      Separate multiple tags with commas (e.g., electronics, gadgets, mobile)
                    </p>
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
                  <CardDescription>Optimize your product for search engines and social media.</CardDescription>
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
                      <FileCode className="h-4 w-4" />
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

        {/* Product Preview Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Product Preview
              </CardTitle>
              <CardDescription>How your product will appear to customers.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Product Image Preview */}
              <div className="aspect-square overflow-hidden rounded-lg border bg-white dark:bg-slate-800">
                <Image 
                  src={formData.images[0] || "/placeholder.png"} 
                  alt={formData.name || "Product preview"} 
                  width={300} 
                  height={300} 
                  className="h-full w-full object-cover" 
                />
              </div>

              {/* Product Info Preview */}
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-lg">
                    {formData.name || "Product Name"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {formData.category || "Category"}
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {formData.onSale ? (
                    <div className="flex items-center gap-2">
                      <span className="text-lg text-muted-foreground line-through">
                        ${formData.originalPrice || "0.00"}
                      </span>
                      <span className="text-2xl font-bold text-red-600">
                        ${formData.salePrice || "0.00"}
                      </span>
                      {formData.originalPrice && formData.salePrice && (
                        <Badge variant="destructive" className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                          {Math.round(((parseFloat(formData.originalPrice) - parseFloat(formData.salePrice)) / parseFloat(formData.originalPrice)) * 100)}% OFF
                        </Badge>
                      )}
                    </div>
                  ) : (
                    <span className="text-2xl font-bold">
                      ${formData.price || "0.00"}
                    </span>
                  )}
                  {formData.featured && (
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                      <Star className="mr-1 h-3 w-3" />
                      Featured
                    </Badge>
                  )}
                  {formData.isNewProduct && (
                    <Badge className="bg-teal-500 hover:bg-teal-600 text-white">
                      <Sparkles className="mr-1 h-3 w-3" />
                      New
                    </Badge>
                  )}
                  {formData.isTrending && (
                    <Badge className="bg-orange-500 hover:bg-orange-600 text-white">
                      <TrendingUp className="mr-1 h-3 w-3" />
                      Trending
                    </Badge>
                  )}
                  {formData.isBestSeller && (
                    <Badge className="bg-purple-500 hover:bg-purple-600 text-white">
                      <Award className="mr-1 h-3 w-3" />
                      Best Seller
                    </Badge>
                  )}
                  {formData.onSale && (
                    <Badge variant="destructive" className="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400">
                      <Tag className="mr-1 h-3 w-3" />
                      Sale
                    </Badge>
                  )}
                </div>

                <p className="text-sm text-muted-foreground line-clamp-3">
                  {formData.description || "Product description will appear here..."}
                </p>

                <div className="flex items-center gap-2 text-sm">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <span>Stock: {formData.stock || "0"}</span>
                </div>

                {formData.sku && (
                  <div className="flex items-center gap-2 text-sm">
                    <Hash className="h-4 w-4 text-muted-foreground" />
                    <span>SKU: {formData.sku}</span>
                  </div>
                )}
            </div>

              <Separator />

              {/* SEO Preview */}
              <div className="space-y-3">
                <h4 className="font-medium">SEO Preview</h4>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-blue-600 dark:text-blue-400 line-clamp-1">
                    {formData.seo.title || formData.name || "SEO Title"}
                  </div>
                  <div className="text-xs text-green-600 dark:text-green-400">
                    kureno.com/products/{formData.name?.toLowerCase().replace(/\s+/g, '-') || 'product-slug'}
                  </div>
                  <div className="text-sm text-muted-foreground line-clamp-2">
                    {formData.seo.description || formData.description || "SEO description will appear here..."}
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
              <Link href="/admin/products">
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Link>
            </Button>
            <Button variant="outline" onClick={handleSaveDraft} disabled={isLoading}>
              <Save className="mr-2 h-4 w-4" />
              Save Draft
          </Button>
          <Button type="submit" form="product-form" disabled={isLoading}>
            {isLoading ? (
              <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
              </>
            ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Create Product
                </>
            )}
          </Button>
          </div>
        </CardFooter>
      </Card>

      {/* Hidden Form for Submission */}
      <form id="product-form" onSubmit={handleSubmit} className="hidden">
        {/* Form fields are handled by the tabs above */}
      </form>
    </div>
  )
}
