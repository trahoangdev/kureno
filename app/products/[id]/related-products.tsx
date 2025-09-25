"use client"

import { useState, useEffect, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Star, 
  Heart, 
  ShoppingCart, 
  Eye,
  GitCompare,
  Share2,
  Loader2
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useProductReviews } from "@/hooks/use-product-reviews"

interface RelatedProductsProps {
  currentProductId: string
  category: string
}

interface Product {
  _id: string
  name: string
  price: number
  images: string[]
  category: string
  stock: number
  featured?: boolean
  rating?: number
  reviewCount?: number
}

export default function RelatedProducts({ currentProductId, category }: RelatedProductsProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [wishlist, setWishlist] = useState<string[]>([])
  const [compareList, setCompareList] = useState<string[]>([])
  const { toast } = useToast()

  // Get product IDs for review stats
  const productIds = useMemo(() => products.map(p => p._id), [products])

  // Use product reviews hook for real-time review stats
  const { reviewStats, isLoading: reviewsLoading } = useProductReviews({
    productIds,
    autoRefresh: true,
    refreshInterval: 30000 // 30 seconds
  })

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        setIsLoading(true)
        const res = await fetch(`/api/products?category=${encodeURIComponent(category)}&limit=4`)
        const data = await res.json()
        
        // Filter out current product and get up to 4 related products
        const relatedProducts = (data.products || [])
          .filter((product: Product) => product._id !== currentProductId)
          .slice(0, 4)
        
        setProducts(relatedProducts)
      } catch (error) {
        console.error('Error fetching related products:', error)
        toast({
          title: "Error",
          description: "Failed to load related products",
          variant: "destructive"
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchRelatedProducts()
  }, [currentProductId, category, toast])

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
    toast({
      title: wishlist.includes(productId) ? "Removed from wishlist" : "Added to wishlist",
      description: wishlist.includes(productId) ? "Product removed from your wishlist" : "Product added to your wishlist"
    })
  }

  const toggleCompare = (productId: string) => {
    if (compareList.includes(productId)) {
      setCompareList(prev => prev.filter(id => id !== productId))
      toast({
        title: "Removed from comparison",
        description: "Product removed from comparison list"
      })
    } else if (compareList.length >= 3) {
      toast({
        title: "Comparison limit reached",
        description: "You can compare up to 3 products at once",
        variant: "destructive"
      })
    } else {
      setCompareList(prev => [...prev, productId])
      toast({
        title: "Added to comparison",
        description: "Product added to comparison list"
      })
    }
  }

  const shareProduct = async (product: Product) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.name,
          url: `${window.location.origin}/products/${product._id}`
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/products/${product._id}`)
      toast({
        title: "Link copied",
        description: "Product link copied to clipboard"
      })
    }
  }

  const addToCart = (product: Product) => {
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart`
    })
  }

  if (isLoading) {
    return (
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-8">You Might Also Like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <div className="h-48 bg-muted animate-pulse" />
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="h-4 bg-muted rounded animate-pulse" />
                  <div className="h-3 bg-muted rounded animate-pulse w-3/4" />
                  <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (products.length === 0) {
    return null
  }

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold mb-8">You Might Also Like</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Card key={product._id} className="group overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
            <Link href={`/products/${product._id}`} className="block">
              <div className="relative">
                <div className="relative aspect-square overflow-hidden">
                  <Image 
                    src={product.images?.[0] || "/placeholder.jpg"} 
                    alt={product.name} 
                    fill 
                    className="object-cover transition-transform duration-300 group-hover:scale-110" 
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                  
                  {/* Action Buttons */}
                  <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="h-8 w-8 p-0 rounded-full shadow-lg"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        toggleWishlist(product._id)
                      }}
                    >
                      <Heart className={`h-4 w-4 ${wishlist.includes(product._id) ? 'fill-red-500 text-red-500' : ''}`} />
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="h-8 w-8 p-0 rounded-full shadow-lg"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        toggleCompare(product._id)
                      }}
                    >
                      <GitCompare className={`h-4 w-4 ${compareList.includes(product._id) ? 'text-teal-600' : ''}`} />
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="h-8 w-8 p-0 rounded-full shadow-lg"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        shareProduct(product)
                      }}
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Badges */}
                  <div className="absolute top-3 left-3">
                    {product.featured && (
                      <Badge className="bg-teal-500 hover:bg-teal-600">Featured</Badge>
                    )}
                  </div>
                </div>

                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-teal-600 transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                        {product.category}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => {
                          const productStats = reviewStats[product._id]
                          const rating = productStats?.averageRating || product.rating || 0
                          return (
                            <Star 
                              key={i} 
                              className={`h-4 w-4 ${
                                i < Math.floor(rating) 
                                  ? 'fill-yellow-400 text-yellow-400' 
                                  : 'text-gray-300'
                              }`} 
                            />
                          )
                        })}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        ({reviewStats[product._id]?.totalReviews || product.reviewCount || 0})
                      </span>
                      {reviewsLoading && (
                        <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-teal-600">
                          ${Number(product.price)?.toFixed(2) || product.price}
                        </span>
                      </div>
                      <Button 
                        size="sm" 
                        className="rounded-full"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          addToCart(product)
                        }}
                      >
                        <ShoppingCart className="h-4 w-4 mr-1" />
                        Add
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </div>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  )
}
