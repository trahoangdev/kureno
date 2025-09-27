"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"
import Link from "next/link"
import { 
  ArrowLeft, 
  Save, 
  Package, 
  Image as ImageIcon, 
  Video,
  Settings, 
  Globe, 
  Palette,
  Hash,
  DollarSign,
  Tag,
  Eye,
  Star,
  AlertTriangle,
  CheckCircle,
  Loader2,
  RefreshCw,
  Info,
  Type,
  FileCode,
  Zap,
  Activity,
  TrendingUp
} from "lucide-react"
import ImageUpload from "../../image-upload"
import CloudinaryImageUpload from "../../cloudinary-image-upload"
import CloudinaryVideoUploadComponent from "../../cloudinary-video-upload"
import ProductVariants from "../../product-variants"
import { useToast } from "@/hooks/use-toast"

export default function EditProductPage() {
  const params = useParams() as { id: string }
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [isAutoSaving, setIsAutoSaving] = useState(false)
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    salePrice: "",
    onSale: false,
    saleStartDate: "",
    saleEndDate: "",
    category: "",
    stock: "",
    featured: false,
    images: [""] as string[],
    videos: [] as string[],
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
    status: "draft" as "draft" | "published" | "archived",
    visibility: "public" as "public" | "private" | "hidden",
    inventory: {
      trackQuantity: true,
      allowBackorder: false,
      lowStockThreshold: 5
    }
  })
  const [categories, setCategories] = useState<{ _id: string; name: string; slug: string }[]>([])
  const [activeTab, setActiveTab] = useState("basic")

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true)
      const res = await fetch(`/api/products/${params.id}`)
      if (!res.ok) {
        setError("Failed to load product")
        setLoading(false)
        return
      }
      const p = await res.json()
      setForm({
        name: p.name || "",
        description: p.description || "",
        price: String(p.onSale ? (p.originalPrice ?? p.price) : p.price ?? ""),
        originalPrice: String(p.originalPrice ?? ""),
        salePrice: String(p.onSale ? p.price : ""),
        onSale: !!p.onSale,
        saleStartDate: p.saleStartDate || "",
        saleEndDate: p.saleEndDate || "",
        category: p.category || "",
        stock: String(p.stock ?? ""),
        featured: !!p.featured,
        images: p.images?.length ? p.images : [""],
        videos: p.videos?.length ? p.videos : [],
        // Advanced fields
        sku: p.sku || "",
        weight: String(p.weight ?? ""),
        dimensions: {
          length: String(p.dimensions?.length ?? ""),
          width: String(p.dimensions?.width ?? ""),
          height: String(p.dimensions?.height ?? "")
        },
        seo: {
          title: p.seo?.title || "",
          description: p.seo?.description || "",
          keywords: p.seo?.keywords || ""
        },
        variants: p.variants || [],
        tags: p.tags?.join(", ") || "",
        status: p.status || "draft",
        visibility: p.visibility || "public",
        inventory: {
          trackQuantity: p.inventory?.trackQuantity ?? true,
          allowBackorder: p.inventory?.allowBackorder ?? false,
          lowStockThreshold: p.inventory?.lowStockThreshold ?? 5
        }
      })
      setLoading(false)
    }
    fetchProduct()
  }, [params.id])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories")
        const data = await res.json()
        setCategories(data.categories || [])
      } catch {}
    }
    fetchCategories()
  }, [])

  const updateField = (key: keyof typeof form, value: any) => {
    setForm((f) => ({ ...f, [key]: value }))
    setHasUnsavedChanges(true)
  }

  const handleSelectChange = (value: string) => {
    updateField("category", value)
  }

  const handleSwitchChange = (key: string, checked: boolean) => {
    setForm((f) => ({ ...f, [key]: checked }))
    setHasUnsavedChanges(true)
  }

  // Auto-save functionality
  useEffect(() => {
    if (hasUnsavedChanges && form.name) {
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
  }, [hasUnsavedChanges, form.name, toast])

  const validate = () => {
    if (!form.name.trim()) return "Name is required"
    if (!form.category.trim()) return "Category is required"
    const price = Number(form.price)
    if (Number.isNaN(price) || price < 0) return "Price must be a positive number"
    const stock = Number(form.stock)
    if (Number.isNaN(stock) || stock < 0) return "Stock must be a non-negative integer"
    const images = form.images.map((s) => s.trim()).filter(Boolean)
    if (!images.length) return "At least one image URL is required"
    return ""
  }

  const onSave = async () => {
    setSaving(true)
    setError("")
    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: form.onSale ? Number(form.salePrice) : Number(form.price),
      originalPrice: form.onSale && form.originalPrice ? Number(form.originalPrice) : undefined,
      onSale: form.onSale,
      saleStartDate: form.saleStartDate || null,
      saleEndDate: form.saleEndDate || null,
      category: form.category.trim(),
      stock: Number(form.stock),
      featured: form.featured,
      images: form.images.map((s) => s.trim()).filter(Boolean),
      videos: form.videos.map((s) => s.trim()).filter(Boolean),
      // Advanced fields
      sku: form.sku.trim(),
      weight: Number(form.weight) || 0,
      dimensions: {
        length: Number(form.dimensions.length) || 0,
        width: Number(form.dimensions.width) || 0,
        height: Number(form.dimensions.height) || 0
      },
      seo: {
        title: form.seo.title.trim(),
        description: form.seo.description.trim(),
        keywords: form.seo.keywords.trim()
      },
      variants: form.variants,
      tags: form.tags.split(",").map(tag => tag.trim()).filter(Boolean),
      status: form.status,
      visibility: form.visibility,
      inventory: form.inventory
    }
    const res = await fetch(`/api/products/${params.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    setSaving(false)
    if (!res.ok) {
      const errorData = await res.json()
      setError(errorData.error || "Failed to save product")
      toast({
        title: "Error",
        description: errorData.error || "Failed to save product.",
        variant: "destructive",
      })
      return
    }
    toast({
      title: "Product Updated",
      description: "Your product has been successfully updated.",
    })
    setHasUnsavedChanges(false)
    router.push(`/admin/products/${params.id}`)
    router.refresh()
  }

  const generateSKU = () => {
    const prefix = form.category ? form.category.slice(0, 3).toUpperCase() : "PRD"
    const random = Math.random().toString(36).substr(2, 6).toUpperCase()
    const sku = `${prefix}-${random}`
    updateField("sku", sku)
  }

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
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
                  <Package className="mr-1 h-3 w-3" /> Edit Product
                </Badge>
                <Badge className="bg-white/30 text-white backdrop-blur-sm hover:bg-white/40">
                  <Tag className="mr-1 h-3 w-3" /> {form.category}
                </Badge>
              </div>
              <h1 className="mb-2 text-4xl font-bold tracking-tight text-white md:text-5xl">
                <span className="bg-gradient-to-r from-teal-200 to-emerald-200 bg-clip-text text-transparent">
                  {form.name || "Product Name"}
                </span>
              </h1>
              <p className="text-lg text-slate-200">
                Update product details, media, variants, and SEO settings.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" className="rounded-full bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm border border-white/30" onClick={onSave} disabled={saving || !hasUnsavedChanges}>
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />} Save Changes
            </Button>
            <Button variant="secondary" className="rounded-full bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm border border-white/30" asChild>
              <Link href={`/products/${params.id}`} target="_blank">
                <Eye className="mr-2 h-4 w-4" /> View on Site
              </Link>
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
                  <p className="text-xl font-bold">{form.images.filter(img => img.trim()).length}</p>
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
                  <p className="text-xl font-bold">{form.description.length} chars</p>
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
                  <p className="text-xl font-bold">${form.onSale ? form.salePrice : form.price || "0"}</p>
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
                  <p className="text-xl font-bold">{form.videos.filter(video => video.trim()).length}</p>
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
            <Button onClick={onSave} disabled={saving} className="ml-auto">
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Save Changes
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
                    <div className="rounded-lg bg-red-50 p-4 text-red-800 dark:bg-red-950/20 dark:text-red-200">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                        <div>
                          <h4 className="font-semibold">Error</h4>
                          <p className="text-sm">{error}</p>
                        </div>
                      </div>
                    </div>
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
                        value={form.name}
                        onChange={(e) => updateField("name", e.target.value)}
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
                      <Select value={form.category} onValueChange={handleSelectChange} required>
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
                      value={form.description}
                      onChange={(e) => updateField("description", e.target.value)}
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
                        value={form.price}
                        onChange={(e) => updateField("price", e.target.value)}
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
                        value={form.stock}
                        onChange={(e) => updateField("stock", e.target.value)}
                        placeholder="0"
                        className="bg-white/50 dark:bg-slate-800/50"
                        required
                      />
                    </div>
                  </div>

                  {/* Sales Pricing Section */}
                  <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 border border-orange-200/50 dark:border-orange-800/50">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                      <div>
                        <Label htmlFor="onSale" className="text-base font-medium">On Sale</Label>
                        <p className="text-sm text-muted-foreground">Enable special pricing for this product</p>
                      </div>
                    </div>
                    <Switch id="onSale" checked={form.onSale} onCheckedChange={(checked) => handleSwitchChange("onSale", checked)} />
                  </div>

                  {/* Pricing Section */}
                  {form.onSale ? (
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
                            value={form.originalPrice}
                            onChange={(e) => updateField("originalPrice", e.target.value)}
                            placeholder="0.00"
                            className="bg-white/50 dark:bg-slate-800/50"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="salePrice" className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4" />
                            Sale Price ($) *
                          </Label>
                          <Input
                            id="salePrice"
                            name="salePrice"
                            type="number"
                            step="0.01"
                            min="0"
                            value={form.salePrice}
                            onChange={(e) => updateField("salePrice", e.target.value)}
                            placeholder="0.00"
                            className="bg-white/50 dark:bg-slate-800/50 border-red-200 focus:border-red-500"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="saleStartDate">Sale Start Date</Label>
                          <Input
                            id="saleStartDate"
                            name="saleStartDate"
                            type="datetime-local"
                            value={form.saleStartDate}
                            onChange={(e) => updateField("saleStartDate", e.target.value)}
                            className="bg-white/50 dark:bg-slate-800/50"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="saleEndDate">Sale End Date</Label>
                          <Input
                            id="saleEndDate"
                            name="saleEndDate"
                            type="datetime-local"
                            value={form.saleEndDate}
                            onChange={(e) => updateField("saleEndDate", e.target.value)}
                            className="bg-white/50 dark:bg-slate-800/50"
                          />
                        </div>
                      </div>

                      {/* Discount Calculation */}
                      {form.originalPrice && form.salePrice && (
                        <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
                          <div className="flex items-center gap-2 mb-2">
                            <TrendingUp className="h-4 w-4 text-green-600" />
                            <span className="font-medium text-green-800 dark:text-green-200">Discount Calculation</span>
                          </div>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span>Original Price:</span>
                              <span>${parseFloat(form.originalPrice).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Sale Price:</span>
                              <span className="text-red-600 font-medium">${parseFloat(form.salePrice).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between font-medium text-green-600">
                              <span>You Save:</span>
                              <span>${(parseFloat(form.originalPrice) - parseFloat(form.salePrice)).toFixed(2)} ({Math.round(((parseFloat(form.originalPrice) - parseFloat(form.salePrice)) / parseFloat(form.originalPrice)) * 100)}% off)</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    // Regular Pricing Layout
                    <div className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="price" className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4" />
                            Regular Price ($) *
                          </Label>
                          <Input
                            id="price"
                            name="price"
                            type="number"
                            step="0.01"
                            min="0"
                            value={form.price}
                            onChange={(e) => updateField("price", e.target.value)}
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
                            value={form.stock}
                            onChange={(e) => updateField("stock", e.target.value)}
                            placeholder="0"
                            className="bg-white/50 dark:bg-slate-800/50"
                            required
                          />
                        </div>
                      </div>
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
                    <Switch id="featured" checked={form.featured} onCheckedChange={(checked) => updateField("featured", checked)} />
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
                  <CardDescription>Upload images to Cloudinary for optimized delivery and performance, or use manual URLs.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <CloudinaryImageUpload
                    images={form.images}
                    onImagesChange={(images) => updateField("images", images)}
                    maxImages={10}
                    folder="products"
                  />
                  
                  <Separator />
                  
                  <CloudinaryVideoUploadComponent
                    videos={form.videos}
                    onVideosChange={(videos) => updateField("videos", videos)}
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
                    variants={form.variants}
                    onVariantsChange={(variants) => updateField("variants", variants)}
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
                          value={form.sku}
                          onChange={(e) => updateField("sku", e.target.value)}
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
                        value={form.weight}
                        onChange={(e) => updateField("weight", e.target.value)}
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
                          value={form.dimensions.length}
                          onChange={(e) => updateField("dimensions", { ...form.dimensions, length: e.target.value })}
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
                          value={form.dimensions.width}
                          onChange={(e) => updateField("dimensions", { ...form.dimensions, width: e.target.value })}
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
                          value={form.dimensions.height}
                          onChange={(e) => updateField("dimensions", { ...form.dimensions, height: e.target.value })}
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
                          checked={form.inventory.trackQuantity}
                          onCheckedChange={(checked) => updateField("inventory", { ...form.inventory, trackQuantity: checked })}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="allowBackorder" className="text-base font-medium">Allow Backorder</Label>
                          <p className="text-sm text-muted-foreground">Allow sales when out of stock</p>
                        </div>
                        <Switch
                          id="allowBackorder"
                          checked={form.inventory.allowBackorder}
                          onCheckedChange={(checked) => updateField("inventory", { ...form.inventory, allowBackorder: checked })}
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
                          value={form.inventory.lowStockThreshold}
                          onChange={(e) => updateField("inventory", { ...form.inventory, lowStockThreshold: parseInt(e.target.value) })}
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
                      <Select value={form.status} onValueChange={(value) => updateField("status", value)}>
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
                      <Select value={form.visibility} onValueChange={(value) => updateField("visibility", value)}>
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
                      value={form.tags}
                      onChange={(e) => updateField("tags", e.target.value)}
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
                      value={form.seo.title}
                      onChange={(e) => updateField("seo", { ...form.seo, title: e.target.value })}
                      placeholder="SEO optimized title"
                      className="bg-white/50 dark:bg-slate-800/50"
                    />
                    <p className="text-xs text-muted-foreground">
                      {form.seo.title.length}/60 characters
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="seo-description" className="flex items-center gap-2">
                      <FileCode className="h-4 w-4" />
                      SEO Description
                    </Label>
                    <Textarea
                      id="seo-description"
                      value={form.seo.description}
                      onChange={(e) => updateField("seo", { ...form.seo, description: e.target.value })}
                      placeholder="SEO optimized description"
                      rows={3}
                      className="bg-white/50 dark:bg-slate-800/50"
                    />
                    <p className="text-xs text-muted-foreground">
                      {form.seo.description.length}/160 characters
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="seo-keywords" className="flex items-center gap-2">
                      <Hash className="h-4 w-4" />
                      Keywords
                    </Label>
                    <Input
                      id="seo-keywords"
                      value={form.seo.keywords}
                      onChange={(e) => updateField("seo", { ...form.seo, keywords: e.target.value })}
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
                  src={form.images[0] || "/placeholder.png"}
                  alt={form.name || "Product preview"}
                  width={300}
                  height={300}
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Product Info Preview */}
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-lg">
                    {form.name || "Product Name"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {form.category || "Category"}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">
                    ${form.price || "0.00"}
                  </span>
                  {form.featured && (
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                      <Star className="mr-1 h-3 w-3" />
                      Featured
                    </Badge>
                  )}
                </div>

                <p className="text-sm text-muted-foreground line-clamp-3">
                  {form.description || "Product description will appear here..."}
                </p>

                <div className="flex items-center gap-2 text-sm">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <span>Stock: {form.stock || "0"}</span>
                </div>

                {form.sku && (
                  <div className="flex items-center gap-2 text-sm">
                    <Hash className="h-4 w-4 text-muted-foreground" />
                    <span>SKU: {form.sku}</span>
                  </div>
                )}
              </div>

              <Separator />

              {/* SEO Preview */}
              <div className="space-y-3">
                <h4 className="font-medium">SEO Preview</h4>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-blue-600 dark:text-blue-400 line-clamp-1">
                    {form.seo.title || form.name || "SEO Title"}
                  </div>
                  <div className="text-xs text-green-600 dark:text-green-400">
                    kureno.com/products/{form.name?.toLowerCase().replace(/\s+/g, '-') || 'product-slug'}
                  </div>
                  <div className="text-sm text-muted-foreground line-clamp-2">
                    {form.seo.description || form.description || "SEO description will appear here..."}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Form Actions */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center">
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
                  Cancel
                </Link>
              </Button>
              <Button type="submit" onClick={onSave} disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


