import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import MarkdownRenderer from "@/components/ui/markdown-renderer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { 
  ArrowLeft, 
  Heart, 
  Share2, 
  Star, 
  Truck, 
  Shield, 
  RotateCcw, 
  CheckCircle,
  ZoomIn,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Clock,
  Award,
  Package,
  Users,
  TrendingUp,
  GitCompare,
  Bookmark,
  Flag,
  Sparkles
} from "lucide-react"
import ProductGallery from "@/app/products/[id]/product-gallery"
import ProductReviews from "@/app/products/[id]/product-reviews"
import ReviewsTab from "@/app/products/[id]/reviews-tab"
import RelatedProducts from "@/app/products/[id]/related-products"
import ProductVariantsWrapper from "@/app/products/[id]/product-variants-wrapper"
import WishlistButton from "@/app/products/[id]/wishlist-button"

async function fetchProduct(id: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/products/${id}`, { 
      cache: "no-store",
      headers: {
        'Content-Type': 'application/json',
      }
    })
    if (!res.ok) {
      console.error(`Failed to fetch product: ${res.status} ${res.statusText}`)
      return null
    }
    return await res.json()
  } catch (error) {
    console.error('Error fetching product:', error)
    return null
  }
}

export default async function ProductDetail({ params }: { params: { id: string } }) {
  const p = await fetchProduct(params.id)
  if (!p) return notFound()
  
  // Type assertion for product data
  const product = p as any
  
  // Debug: Log product data to console
  console.log('Product data:', {
    name: product.name,
    price: product.price,
    originalPrice: product.originalPrice,
    onSale: product.onSale,
    saleStartDate: product.saleStartDate,
    saleEndDate: product.saleEndDate,
    priceType: typeof product.price,
    originalPriceType: typeof product.originalPrice,
    priceNumber: Number(product.price),
    originalPriceNumber: Number(product.originalPrice),
    shouldShowSale: product.onSale && product.originalPrice && Number(product.originalPrice) > 0 && Number(product.originalPrice) > Number(product.price)
  })

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb & Back Button */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/products">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Products
              </Link>
            </Button>
            <Separator orientation="vertical" className="h-4" />
            <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-foreground">Home</Link>
              <span>/</span>
              <Link href="/products" className="hover:text-foreground">Products</Link>
              <span>/</span>
              <span className="text-foreground">{product.name}</span>
            </nav>
          </div>
        </div>
      </div>

      <div className="container py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Product Images */}
          <ProductGallery 
            images={product.images || ["/placeholder.jpg"]} 
            name={product.name}
            featured={product.featured}
          />

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className="capitalize">
                  {product.category}
                </Badge>
                {product.stock > 0 ? (
                  <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                    In Stock ({product.stock})
                  </Badge>
                ) : (
                  <Badge variant="destructive">Out of Stock</Badge>
                )}
              </div>
              
              <h1 className="text-4xl font-bold tracking-tight mb-4">{product.name}</h1>
              
              <div className="flex items-center gap-4 mb-4">
                {product.averageRating > 0 && (
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-4 w-4 ${
                          i < Math.floor(product.averageRating) 
                            ? 'fill-yellow-400 text-yellow-400' 
                            : 'text-gray-300'
                        }`} 
                      />
                    ))}
                    <span className="ml-2 text-sm text-muted-foreground">
                      ({product.averageRating.toFixed(1)} • {product.reviewCount || 0} reviews)
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  {product.featured && (
                    <Badge variant="outline" className="text-xs">
                      <Award className="h-3 w-3 mr-1" />
                      Featured
                    </Badge>
                  )}
                  {product.isNewProduct && (
                    <Badge className="bg-teal-500 hover:bg-teal-600 text-white text-xs">
                      <Sparkles className="h-3 w-3 mr-1" />
                      New
                    </Badge>
                  )}
                  {product.isTrending && (
                    <Badge className="bg-orange-500 hover:bg-orange-600 text-white text-xs">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Trending
                    </Badge>
                  )}
                  {product.isBestSeller && (
                    <Badge className="bg-purple-500 hover:bg-purple-600 text-white text-xs">
                      <Award className="h-3 w-3 mr-1" />
                      Best Seller
                    </Badge>
                  )}
                  {product.onSale && (
                    <Badge variant="destructive" className="text-xs">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      On Sale
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="flex items-baseline gap-2 mb-6">
                {product.onSale && product.originalPrice && Number(product.originalPrice) > 0 && Number(product.originalPrice) > Number(product.price) ? (
                  <>
                    <span className="text-3xl font-bold text-red-600">
                      ${Number(product.price).toFixed(2)}
                    </span>
                    <span className="text-lg text-muted-foreground line-through">
                      ${Number(product.originalPrice).toFixed(2)}
                    </span>
                    <Badge variant="destructive" className="ml-2">
                      Save {Math.round(((Number(product.originalPrice) - Number(product.price)) / Number(product.originalPrice)) * 100)}%
                    </Badge>
                  </>
                ) : (
                  <span className="text-3xl font-bold text-teal-600">
                    ${Number(product.price).toFixed(2)}
                  </span>
                )}
              </div>
              
              {/* Sale Information */}
              {product.onSale && (
                <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800">
                  <div className="flex items-center gap-2 text-red-800 dark:text-red-200">
                    <TrendingUp className="h-4 w-4" />
                    <span className="font-medium">Special Sale Price!</span>
                  </div>
                  {product.originalPrice && Number(product.originalPrice) > Number(product.price) && (
                    <p className="text-sm text-red-600 dark:text-red-300 mt-1">
                      You save ${(Number(product.originalPrice) - Number(product.price)).toFixed(2)} ({Math.round(((Number(product.originalPrice) - Number(product.price)) / Number(product.originalPrice)) * 100)}% off)
                    </p>
                  )}
                  {product.saleEndDate && (
                    <p className="text-sm text-red-600 dark:text-red-300 mt-1">
                      Sale ends: {new Date(product.saleEndDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
              )}
            </div>

            <Separator />

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Description</h3>
              <MarkdownRenderer content={product.description} />
            </div>

            <Separator />

            {/* Product Variants & Add to Cart */}
            <ProductVariantsWrapper 
              productId={product._id}
              name={product.name}
              price={product.price}
              image={product.images?.[0] || "/placeholder.jpg"}
              basePrice={Number(product.price)}
            />

            <Separator />

            {/* Additional Action Buttons */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <WishlistButton 
                  productId={product._id} 
                  className="flex-1"
                />
                <Button variant="outline" size="lg" className="flex-1">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="lg" className="flex-1">
                  <GitCompare className="mr-2 h-4 w-4" />
                  Compare
                </Button>
                <Button variant="outline" size="lg" className="flex-1">
                  <Bookmark className="mr-2 h-4 w-4" />
                  Save
                </Button>
              </div>
            </div>

            <Separator />

            {/* Product Features */}
            {product.featured && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Why Choose This Product?</h3>
                <div className="grid gap-3">
                  {product.featured && (
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-100 dark:bg-teal-900/30">
                        <Award className="h-4 w-4 text-teal-600" />
                      </div>
                      <div>
                        <p className="font-medium">Featured Product</p>
                        <p className="text-sm text-muted-foreground">Handpicked by our team</p>
                      </div>
                    </div>
                  )}
                  {product.onSale && (
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                        <TrendingUp className="h-4 w-4 text-red-600" />
                      </div>
                      <div>
                        <p className="font-medium">Special Sale Price</p>
                        <p className="text-sm text-muted-foreground">
                          {product.originalPrice && Number(product.originalPrice) > Number(product.price) 
                            ? `Save ${Math.round(((Number(product.originalPrice) - Number(product.price)) / Number(product.originalPrice)) * 100)}% ($${(Number(product.originalPrice) - Number(product.price)).toFixed(2)})`
                            : 'Limited time offer'
                          }
                        </p>
                      </div>
                    </div>
                  )}
                  {product.stock > 0 && (
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-100 dark:bg-teal-900/30">
                        <CheckCircle className="h-4 w-4 text-teal-600" />
                      </div>
                      <div>
                        <p className="font-medium">In Stock</p>
                        <p className="text-sm text-muted-foreground">{product.stock} units available</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="reviews">
                <ReviewsTab productId={product._id} />
              </TabsTrigger>
              <TabsTrigger value="shipping">Shipping & Returns</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Product Description</h3>
                  <MarkdownRenderer content={product.description} />
                  
                  {/* Additional Product Info */}
                  {(product.tags && product.tags.length > 0) && (
                    <div className="mt-6">
                      <h4 className="font-medium mb-3">Product Tags:</h4>
                      <div className="flex flex-wrap gap-2">
                        {product.tags.map((tag: string, index: number) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="specifications" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Product Specifications</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex justify-between py-2 border-b">
                        <span className="font-medium">Category</span>
                        <span className="text-muted-foreground capitalize">{product.category}</span>
                      </div>
                      {product.sku && (
                        <div className="flex justify-between py-2 border-b">
                          <span className="font-medium">SKU</span>
                          <span className="text-muted-foreground">{product.sku}</span>
                        </div>
                      )}
                      <div className="flex justify-between py-2 border-b">
                        <span className="font-medium">Stock</span>
                        <span className="text-muted-foreground">{product.stock} units</span>
                      </div>
                      {product.weight && product.weight > 0 && (
                        <div className="flex justify-between py-2 border-b">
                          <span className="font-medium">Weight</span>
                          <span className="text-muted-foreground">{product.weight} kg</span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-3">
                      {product.dimensions && (product.dimensions.length > 0 || product.dimensions.width > 0 || product.dimensions.height > 0) && (
                        <div className="flex justify-between py-2 border-b">
                          <span className="font-medium">Dimensions</span>
                          <span className="text-muted-foreground">
                            {product.dimensions.length} x {product.dimensions.width} x {product.dimensions.height} cm
                          </span>
                        </div>
                      )}
                      {product.tags && product.tags.length > 0 && (
                        <div className="flex justify-between py-2 border-b">
                          <span className="font-medium">Tags</span>
                          <span className="text-muted-foreground">{product.tags.join(', ')}</span>
                        </div>
                      )}
                      <div className="flex justify-between py-2 border-b">
                        <span className="font-medium">Status</span>
                        <span className="text-muted-foreground capitalize">{product.status}</span>
                      </div>
                      {product.onSale && (
                        <div className="flex justify-between py-2 border-b">
                          <span className="font-medium">Sale Status</span>
                          <span className="text-red-600 font-medium">On Sale</span>
                        </div>
                      )}
                      {product.onSale && product.originalPrice && (
                        <div className="flex justify-between py-2 border-b">
                          <span className="font-medium">Original Price</span>
                          <span className="text-muted-foreground line-through">${Number(product.originalPrice).toFixed(2)}</span>
                        </div>
                      )}
                      {product.saleStartDate && (
                        <div className="flex justify-between py-2 border-b">
                          <span className="font-medium">Sale Start</span>
                          <span className="text-muted-foreground">{new Date(product.saleStartDate).toLocaleDateString()}</span>
                        </div>
                      )}
                      {product.saleEndDate && (
                        <div className="flex justify-between py-2 border-b">
                          <span className="font-medium">Sale End</span>
                          <span className="text-muted-foreground">{new Date(product.saleEndDate).toLocaleDateString()}</span>
                        </div>
                      )}
                      <div className="flex justify-between py-2 border-b">
                        <span className="font-medium">Visibility</span>
                        <span className="text-muted-foreground capitalize">{product.visibility}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="reviews" className="mt-6">
              <ProductReviews productId={product._id} />
            </TabsContent>
            
            <TabsContent value="shipping" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Shipping & Returns</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-medium">Product Information</h4>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <Package className="h-5 w-5 text-teal-600 mt-0.5" />
                          <div>
                            <p className="font-medium">Stock Status</p>
                            <p className="text-sm text-muted-foreground">
                              {product.stock > 0 ? `${product.stock} units available` : 'Out of stock'}
                            </p>
                          </div>
                        </div>
                        {product.weight && product.weight > 0 && (
                          <div className="flex items-start gap-3">
                            <Truck className="h-5 w-5 text-teal-600 mt-0.5" />
                            <div>
                              <p className="font-medium">Weight</p>
                              <p className="text-sm text-muted-foreground">{product.weight} kg</p>
                            </div>
                          </div>
                        )}
                        {product.dimensions && (product.dimensions.length > 0 || product.dimensions.width > 0 || product.dimensions.height > 0) && (
                          <div className="flex items-start gap-3">
                            <Clock className="h-5 w-5 text-teal-600 mt-0.5" />
                            <div>
                              <p className="font-medium">Dimensions</p>
                              <p className="text-sm text-muted-foreground">
                                {product.dimensions.length} x {product.dimensions.width} x {product.dimensions.height} cm
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-medium">Product Status</h4>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-teal-600 mt-0.5" />
                          <div>
                            <p className="font-medium">Status</p>
                            <p className="text-sm text-muted-foreground capitalize">{product.status}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Shield className="h-5 w-5 text-teal-600 mt-0.5" />
                          <div>
                            <p className="font-medium">Visibility</p>
                            <p className="text-sm text-muted-foreground capitalize">{product.visibility}</p>
                          </div>
                        </div>
                        {product.featured && (
                          <div className="flex items-start gap-3">
                            <Award className="h-5 w-5 text-teal-600 mt-0.5" />
                            <div>
                              <p className="font-medium">Featured Product</p>
                              <p className="text-sm text-muted-foreground">Handpicked by our team</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products Section */}
        <RelatedProducts currentProductId={product._id} category={product.category} />
      </div>
    </div>
  )
}
