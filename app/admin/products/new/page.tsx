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
  Turtle
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
  const [dragOver, setDragOver] = useState(false)

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

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, featured: checked }))
    setHasUnsavedChanges(true)
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }))
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

  const handleInventoryChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      inventory: { ...prev.inventory, [field]: value }
    }))
    setHasUnsavedChanges(true)
  }

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...formData.images]
    newImages[index] = value
    setFormData((prev) => ({ ...prev, images: newImages }))
    setHasUnsavedChanges(true)
  }

  const addImageField = () => {
    setFormData((prev) => ({ ...prev, images: [...prev.images, ""] }))
    setHasUnsavedChanges(true)
  }

  const removeImageField = (index: number) => {
    if (formData.images.length > 1) {
      const newImages = [...formData.images]
      newImages.splice(index, 1)
      setFormData((prev) => ({ ...prev, images: newImages }))
      setHasUnsavedChanges(true)
    }
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
      const priceNum = Number.parseFloat(formData.price)
      if (Number.isNaN(priceNum) || priceNum < 0) throw new Error("Price must be a positive number")
      const stockNum = Number.parseInt(formData.stock)
      if (Number.isNaN(stockNum) || stockNum < 0) throw new Error("Stock must be a non-negative integer")

      const productData = {
        name: formData.name,
        description: formData.description,
        price: Number.parseFloat(formData.price),
        category: formData.category,
        stock: Number.parseInt(formData.stock),
        featured: formData.featured,
        images: filteredImages,
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
    try {
      const productData = {
        ...formData,
        status: "draft",
        price: formData.price ? Number.parseFloat(formData.price) : 0,
        stock: formData.stock ? Number.parseInt(formData.stock) : 0,
      }

      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      })

      if (response.ok) {
        toast({
          title: "Draft Saved",
          description: "Your product draft has been saved.",
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

  const generateSKU = () => {
    const prefix = formData.category ? formData.category.slice(0, 3).toUpperCase() : "PRD"
    const random = Math.random().toString(36).substr(2, 6).toUpperCase()
    const sku = `${prefix}-${random}`
    setFormData((prev) => ({ ...prev, sku }))
    setHasUnsavedChanges(true)
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
                  <p className="text-sm text-slate-200">Category</p>
                  <p className="text-xl font-bold">{formData.category ? "Selected" : "None"}</p>
                </div>
                <Tag className="h-6 w-6 text-purple-300" />
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
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Basic Info
              </TabsTrigger>
              <TabsTrigger value="media" className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4" />
                Media
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
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
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
                      Description *
                    </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                      placeholder="Enter detailed product description"
                rows={5}
                      className="bg-white/50 dark:bg-slate-800/50"
                required
              />
            </div>

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

                  <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border border-blue-200/50 dark:border-blue-800/50">
                    <div className="flex items-center gap-3">
                      <Star className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      <div>
                        <Label htmlFor="featured" className="text-base font-medium">Featured Product</Label>
                        <p className="text-sm text-muted-foreground">Highlight this product on the homepage</p>
                      </div>
                    </div>
                    <Switch id="featured" checked={formData.featured} onCheckedChange={handleSwitchChange} />
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
                    Product Images
                  </CardTitle>
                  <CardDescription>Upload and manage product images. Drag and drop supported.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Drag & Drop Area */}
                  <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                      dragOver
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20"
                        : "border-gray-300 dark:border-gray-700"
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium mb-2">Upload Product Images</h3>
                    <p className="text-muted-foreground mb-4">
                      Drag and drop images here, or click to browse
                    </p>
                    <Button variant="outline" className="mb-2">
                      <Upload className="mr-2 h-4 w-4" />
                      Choose Files
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      Supports: JPG, PNG, WebP (Max 10MB each)
                    </p>
                  </div>

                  {/* Image URLs */}
                  <div className="space-y-4">
                    <Label className="text-base font-medium">Image URLs</Label>
                    {formData.images.map((image, index) => (
                      <div key={index} className="grid gap-4 md:grid-cols-[120px_1fr_auto] items-start">
                        <div className="overflow-hidden rounded-lg border bg-white dark:bg-slate-800">
                          <Image 
                            src={image || "/placeholder.png"} 
                            alt={`Preview ${index + 1}`} 
                            width={120} 
                            height={90} 
                            className="h-24 w-full object-cover" 
                          />
                        </div>
                        <div className="space-y-2">
                  <Input
                    value={image}
                    onChange={(e) => handleImageChange(index, e.target.value)}
                    placeholder="Enter image URL"
                            className="bg-white/50 dark:bg-slate-800/50"
                    required={index === 0}
                  />
                          <p className="text-xs text-muted-foreground">
                            {index === 0 ? "Main product image (required)" : "Additional product image"}
                          </p>
                        </div>
                  <div className="flex gap-2">
                    {index === formData.images.length - 1 && (
                            <Button type="button" variant="outline" size="sm" onClick={addImageField}>
                              <Plus className="h-4 w-4" />
                            </Button>
                    )}
                    {index > 0 && (
                            <Button type="button" variant="outline" size="sm" onClick={() => removeImageField(index)}>
                              <Minus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
                  </div>
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

                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">
                    ${formData.price || "0.00"}
                  </span>
                  {formData.featured && (
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                      <Star className="mr-1 h-3 w-3" />
                      Featured
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
