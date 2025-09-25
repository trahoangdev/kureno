import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
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
  Flag
} from "lucide-react"
import ProductGallery from "@/app/products/[id]/product-gallery"
import ProductReviews from "@/app/products/[id]/product-reviews"
import ReviewsTab from "@/app/products/[id]/reviews-tab"
import RelatedProducts from "@/app/products/[id]/related-products"
import ProductVariantsWrapper from "@/app/products/[id]/product-variants-wrapper"

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
              <span className="text-foreground">{p.name}</span>
            </nav>
          </div>
        </div>
      </div>

      <div className="container py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Product Images */}
          <ProductGallery 
            images={p.images || ["/placeholder.jpg"]} 
            name={p.name}
            featured={p.featured}
          />

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className="capitalize">
                  {p.category}
                </Badge>
                {p.stock > 0 ? (
                  <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                    In Stock ({p.stock})
                  </Badge>
                ) : (
                  <Badge variant="destructive">Out of Stock</Badge>
                )}
              </div>
              
              <h1 className="text-4xl font-bold tracking-tight mb-4">{p.name}</h1>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="ml-2 text-sm text-muted-foreground">(4.8 • 24 reviews)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Trending
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    <Award className="h-3 w-3 mr-1" />
                    Best Seller
                  </Badge>
                </div>
              </div>
              
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-3xl font-bold text-teal-600">
                  ${Number(p.price).toFixed(2)}
                </span>
                <span className="text-lg text-muted-foreground line-through">
                  ${(Number(p.price) * 1.2).toFixed(2)}
                </span>
                <Badge variant="destructive" className="ml-2">
                  Save 20%
                </Badge>
              </div>
            </div>

            <Separator />

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Description</h3>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {p.description}
              </p>
            </div>

            <Separator />

            {/* Product Variants & Add to Cart */}
            <ProductVariantsWrapper 
              productId={p._id}
              name={p.name}
              price={p.price}
              image={p.images?.[0] || "/placeholder.jpg"}
              basePrice={Number(p.price)}
            />

            <Separator />

            {/* Additional Action Buttons */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="lg" className="flex-1">
                  <Heart className="mr-2 h-4 w-4" />
                  Wishlist
                </Button>
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

            {/* Features */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Why Choose This Product?</h3>
              <div className="grid gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-100 dark:bg-teal-900/30">
                    <Truck className="h-4 w-4 text-teal-600" />
                  </div>
                  <div>
                    <p className="font-medium">Free Shipping</p>
                    <p className="text-sm text-muted-foreground">On orders over $50</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-100 dark:bg-teal-900/30">
                    <Shield className="h-4 w-4 text-teal-600" />
                  </div>
                  <div>
                    <p className="font-medium">Secure Payment</p>
                    <p className="text-sm text-muted-foreground">100% secure checkout</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-100 dark:bg-teal-900/30">
                    <RotateCcw className="h-4 w-4 text-teal-600" />
                  </div>
                  <div>
                    <p className="font-medium">Easy Returns</p>
                    <p className="text-sm text-muted-foreground">30-day return policy</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="reviews">
                <ReviewsTab productId={p._id} />
              </TabsTrigger>
              <TabsTrigger value="shipping">Shipping & Returns</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Product Description</h3>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {p.description}
                  </p>
                  
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium">Key Features:</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Premium quality materials</li>
                        <li>• Modern design and functionality</li>
                        <li>• Easy to use and maintain</li>
                        <li>• Long-lasting durability</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium">What's Included:</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Main product</li>
                        <li>• User manual</li>
                        <li>• Warranty card</li>
                        <li>• Original packaging</li>
                      </ul>
                    </div>
                  </div>
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
                        <span className="text-muted-foreground">{p.category}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="font-medium">SKU</span>
                        <span className="text-muted-foreground">{p._id.slice(-8)}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="font-medium">Stock</span>
                        <span className="text-muted-foreground">{p.stock} units</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="font-medium">Weight</span>
                        <span className="text-muted-foreground">1.2 kg</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between py-2 border-b">
                        <span className="font-medium">Dimensions</span>
                        <span className="text-muted-foreground">30 x 20 x 15 cm</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="font-medium">Material</span>
                        <span className="text-muted-foreground">Premium Quality</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="font-medium">Warranty</span>
                        <span className="text-muted-foreground">2 years</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="font-medium">Origin</span>
                        <span className="text-muted-foreground">Made in USA</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="reviews" className="mt-6">
              <ProductReviews productId={p._id} />
            </TabsContent>
            
            <TabsContent value="shipping" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Shipping & Returns</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-medium">Shipping Information</h4>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <Truck className="h-5 w-5 text-teal-600 mt-0.5" />
                          <div>
                            <p className="font-medium">Free Shipping</p>
                            <p className="text-sm text-muted-foreground">On orders over $50</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Clock className="h-5 w-5 text-teal-600 mt-0.5" />
                          <div>
                            <p className="font-medium">Delivery Time</p>
                            <p className="text-sm text-muted-foreground">3-5 business days</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Package className="h-5 w-5 text-teal-600 mt-0.5" />
                          <div>
                            <p className="font-medium">Packaging</p>
                            <p className="text-sm text-muted-foreground">Secure and eco-friendly</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-medium">Return Policy</h4>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <RotateCcw className="h-5 w-5 text-teal-600 mt-0.5" />
                          <div>
                            <p className="font-medium">30-Day Returns</p>
                            <p className="text-sm text-muted-foreground">Full refund guarantee</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Shield className="h-5 w-5 text-teal-600 mt-0.5" />
                          <div>
                            <p className="font-medium">Warranty</p>
                            <p className="text-sm text-muted-foreground">2-year manufacturer warranty</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-teal-600 mt-0.5" />
                          <div>
                            <p className="font-medium">Easy Process</p>
                            <p className="text-sm text-muted-foreground">Simple return process</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products Section */}
        <RelatedProducts currentProductId={p._id} category={p.category} />
      </div>
    </div>
  )
}
