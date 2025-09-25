"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import Link from "next/link"
import { 
  ArrowLeft, 
  Edit, 
  Package, 
  Image as ImageIcon, 
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
  Copy,
  Info
} from "lucide-react"

interface Product {
  _id: string
  name: string
  description: string
  price: number
  images: string[]
  category: string
  stock: number
  featured: boolean
  createdAt: string
  updatedAt: string
  // Advanced fields
  sku?: string
  weight?: number
  dimensions?: {
    length: number
    width: number
    height: number
  }
  seo?: {
    title: string
    description: string
    keywords: string
  }
  variants?: any[]
  tags?: string[]
  status?: "draft" | "published" | "archived"
  visibility?: "public" | "private" | "hidden"
  inventory?: {
    trackQuantity: boolean
    allowBackorder: boolean
    lowStockThreshold: number
  }
}

export default function ProductViewPage() {
  const params = useParams() as { id: string }
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [product, setProduct] = useState<Product | null>(null)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true)
      try {
      const res = await fetch(`/api/products/${params.id}`)
      if (!res.ok) {
          throw new Error("Failed to load product")
      }
      const data = await res.json()
      setProduct(data)
      } catch (error) {
        console.error("Error fetching product:", error)
      } finally {
      setLoading(false)
    }
    }
    fetchProduct()
  }, [params.id])

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <div className="text-center">
          <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium">Product not found</h3>
          <p className="text-muted-foreground">The product you're looking for doesn't exist.</p>
          <Button asChild className="mt-4">
            <Link href="/admin/products">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Products
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200"
      case "draft":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border-yellow-200"
      case "archived":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300 border-gray-200"
    }
  }

  const getVisibilityColor = (visibility: string) => {
    switch (visibility) {
      case "public":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200"
      case "private":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 border-orange-200"
      case "hidden":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300 border-gray-200"
    }
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
                  <Package className="mr-1 h-3 w-3" /> Product Details
                </Badge>
                <Badge className="bg-white/30 text-white backdrop-blur-sm hover:bg-white/40">
                  <Package className="mr-1 h-3 w-3" /> Product Management
                </Badge>
              </div>
              <h1 className="mb-2 text-4xl font-bold tracking-tight text-white md:text-5xl">
                <span className="bg-gradient-to-r from-teal-200 to-emerald-200 bg-clip-text text-transparent">
                  {product.name}
                </span>
              </h1>
              <p className="text-lg text-slate-200">
                View and manage product information, variants, and settings.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button 
              asChild
              className="rounded-full bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm border border-white/30"
            >
              <Link href={`/admin/products/${product._id}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Product
              </Link>
          </Button>
            <Button 
              variant="secondary" 
              className="rounded-full bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm border border-white/30"
              onClick={() => router.back()}
            >
              Back
          </Button>
        </div>
      </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="variants" className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Variants
              </TabsTrigger>
              <TabsTrigger value="seo" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                SEO
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Analytics
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Product Information
                  </CardTitle>
                  <CardDescription>Basic product details and specifications.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Product Name</Label>
                        <p className="text-lg font-semibold">{product.name}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Category</Label>
                        <Badge variant="outline" className="mt-1">
                          {product.category}
                        </Badge>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Price</Label>
                        <p className="text-2xl font-bold text-teal-600">${product.price.toFixed(2)}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Stock</Label>
                        <div className="flex items-center gap-2">
                          <p className="text-lg font-semibold">{product.stock}</p>
                          {product.stock <= (product.inventory?.lowStockThreshold || 5) && (
                            <AlertTriangle className="h-4 w-4 text-yellow-500" />
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                        <Badge className={`mt-1 ${getStatusColor(product.status || "draft")}`}>
                          {product.status || "draft"}
                        </Badge>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Visibility</Label>
                        <Badge className={`mt-1 ${getVisibilityColor(product.visibility || "public")}`}>
                          {product.visibility || "public"}
                        </Badge>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">SKU</Label>
                        <p className="font-mono text-sm">{product.sku || "N/A"}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Featured</Label>
                        <div className="flex items-center gap-2 mt-1">
                          {product.featured ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <AlertTriangle className="h-4 w-4 text-gray-400" />
                          )}
                          <span className="text-sm">{product.featured ? "Yes" : "No"}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Description</Label>
                    <p className="mt-2 text-sm leading-relaxed">{product.description}</p>
                  </div>

                  {product.tags && product.tags.length > 0 && (
                    <>
                      <Separator />
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Tags</Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {product.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Product Images */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="h-5 w-5" />
                    Product Images
                  </CardTitle>
                  <CardDescription>Product image gallery and media assets.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {product.images.map((image, index) => (
                      <div key={index} className="relative group overflow-hidden rounded-lg border bg-white dark:bg-slate-800">
                        <Image
                          src={image || "/placeholder.png"}
                          alt={`${product.name} image ${index + 1}`}
                          width={150}
                          height={150}
                          className="h-full w-full object-cover aspect-square"
                        />
                        {index === 0 && (
                          <Badge className="absolute top-2 left-2 bg-blue-500 text-white">Main</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Product Specifications */}
      <Card>
        <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Product Specifications
                  </CardTitle>
                  <CardDescription>Technical specifications and physical attributes.</CardDescription>
        </CardHeader>
        <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Weight</Label>
                        <p className="text-sm">{product.weight ? `${product.weight} kg` : "N/A"}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Dimensions</Label>
                        <p className="text-sm">
                          {product.dimensions ? 
                            `${product.dimensions.length} × ${product.dimensions.width} × ${product.dimensions.height} cm` : 
                            "N/A"
                          }
                        </p>
                      </div>
                    </div>
            <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Inventory Tracking</Label>
                        <div className="flex items-center gap-2">
                          {product.inventory?.trackQuantity ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <AlertTriangle className="h-4 w-4 text-gray-400" />
                          )}
                          <span className="text-sm">{product.inventory?.trackQuantity ? "Enabled" : "Disabled"}</span>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Allow Backorder</Label>
                        <div className="flex items-center gap-2">
                          {product.inventory?.allowBackorder ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <AlertTriangle className="h-4 w-4 text-gray-400" />
                          )}
                          <span className="text-sm">{product.inventory?.allowBackorder ? "Yes" : "No"}</span>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Low Stock Threshold</Label>
                        <p className="text-sm">{product.inventory?.lowStockThreshold || 5} units</p>
                      </div>
                    </div>
                  </div>
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
                  <CardDescription>Product variations and options available to customers.</CardDescription>
                </CardHeader>
                <CardContent>
                  {product.variants && product.variants.length > 0 ? (
                    <div className="space-y-6">
                      {product.variants.map((variant, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-semibold text-lg">{variant.name}</h4>
                            <Badge variant="outline">{variant.type}</Badge>
                          </div>
                          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                            {variant.options.map((option: any, optIndex: number) => (
                              <div key={optIndex} className="border rounded-lg p-3 bg-muted/20">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="font-medium">{option.name}</span>
                                  <Badge variant={option.available ? "default" : "secondary"}>
                                    {option.available ? "Available" : "Unavailable"}
                                  </Badge>
              </div>
                                <div className="space-y-1 text-sm text-muted-foreground">
                                  <p>Price: ${(product.price + option.priceModifier).toFixed(2)}</p>
                                  <p>Stock: {option.stock}</p>
                                  <p>SKU: {option.sku}</p>
            </div>
                </div>
              ))}
            </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Palette className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium">No variants</h3>
                      <p className="text-muted-foreground">This product doesn't have any variants configured.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* SEO Tab */}
            <TabsContent value="seo" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    SEO Information
                  </CardTitle>
                  <CardDescription>Search engine optimization settings and metadata.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">SEO Title</Label>
                      <p className="text-sm mt-1">{product.seo?.title || "Not set"}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">SEO Description</Label>
                      <p className="text-sm mt-1">{product.seo?.description || "Not set"}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Keywords</Label>
                      <p className="text-sm mt-1">{product.seo?.keywords || "Not set"}</p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">SEO Preview</Label>
                    <div className="mt-2 p-4 border rounded-lg bg-muted/20">
                      <div className="text-sm font-medium text-blue-600 dark:text-blue-400 line-clamp-1">
                        {product.seo?.title || product.name}
                      </div>
                      <div className="text-xs text-green-600 dark:text-green-400">
                        kureno.com/products/{product.name?.toLowerCase().replace(/\s+/g, '-')}
                      </div>
                      <div className="text-sm text-muted-foreground line-clamp-2">
                        {product.seo?.description || product.description}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Product Analytics
                  </CardTitle>
                  <CardDescription>Performance metrics and analytics data.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium">Analytics Coming Soon</h3>
                    <p className="text-muted-foreground">Product analytics and performance metrics will be available soon.</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Product Status Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Product Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Status</span>
                <Badge className={getStatusColor(product.status || "draft")}>
                  {product.status || "draft"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Visibility</span>
                <Badge className={getVisibilityColor(product.visibility || "public")}>
                  {product.visibility || "public"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Featured</span>
                <div className="flex items-center gap-2">
                  {product.featured ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-gray-400" />
                  )}
                  <span className="text-sm">{product.featured ? "Yes" : "No"}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild className="w-full">
                <Link href={`/admin/products/${product._id}/edit`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Product
                </Link>
              </Button>
              <Button variant="outline" className="w-full">
                <Eye className="mr-2 h-4 w-4" />
                View on Site
              </Button>
              <Button variant="outline" className="w-full">
                <Copy className="mr-2 h-4 w-4" />
                Duplicate
              </Button>
            </CardContent>
          </Card>

          {/* Product Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                Product Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Created</span>
                <span className="text-sm text-muted-foreground">
                  {new Date(product.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Last Updated</span>
                <span className="text-sm text-muted-foreground">
                  {new Date(product.updatedAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Product ID</span>
                <span className="text-sm font-mono text-muted-foreground">
                  {product._id.slice(-8)}
                </span>
          </div>
        </CardContent>
      </Card>
        </div>
      </div>
    </div>
  )
}
