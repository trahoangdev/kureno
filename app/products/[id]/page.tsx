import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Heart, Share2, Star, Truck, Shield, RotateCcw, CheckCircle } from "lucide-react"
import AddToCart from "@/app/products/[id]/product-add-to-cart"

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
          <div className="space-y-4">
            <div className="relative aspect-square w-full overflow-hidden rounded-xl border bg-muted">
              <Image 
                src={p.images?.[0] || "/placeholder.jpg"} 
                alt={p.name} 
                fill 
                className="object-cover transition-transform hover:scale-105" 
                priority
              />
              {p.featured && (
                <Badge className="absolute left-4 top-4 bg-teal-500 hover:bg-teal-600">
                  Featured
                </Badge>
              )}
            </div>
            
            {/* Thumbnail Images */}
            {(p.images || []).length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {(p.images || []).slice(0, 4).map((src: string, i: number) => (
                  <div key={i} className="relative aspect-square overflow-hidden rounded-lg border bg-muted">
                    <Image 
                      src={src} 
                      alt={`${p.name} ${i + 1}`} 
                      fill 
                      className="object-cover transition-transform hover:scale-105 cursor-pointer" 
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

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

            {/* Action Buttons */}
            <div className="space-y-4">
              <AddToCart id={p._id} name={p.name} price={p.price} image={p.images?.[0] || "/placeholder.jpg"} />
              
              <div className="flex gap-2">
                <Button variant="outline" size="lg" className="flex-1">
                  <Heart className="mr-2 h-4 w-4" />
                  Add to Wishlist
                </Button>
                <Button variant="outline" size="lg" className="flex-1">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
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

        {/* Related Products Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-8">You Might Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Placeholder for related products */}
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="group overflow-hidden transition-all hover:shadow-lg">
                <div className="relative aspect-square overflow-hidden">
                  <Image 
                    src="/placeholder.jpg" 
                    alt={`Related product ${i}`} 
                    fill 
                    className="object-cover transition-transform group-hover:scale-105" 
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-medium mb-2">Related Product {i}</h3>
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="font-semibold text-teal-600">$99.99</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
