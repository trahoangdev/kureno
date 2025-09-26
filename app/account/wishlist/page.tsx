"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/lib/utils"
import { useCart } from "@/context/cart-context"
import { useToast } from "@/components/ui/use-toast"
import { Heart, Loader2, ShoppingCart, Trash2, X, Star, AlertCircle, Package, Eye } from "lucide-react"

interface Product {
  _id: string
  name: string
  price: number
  originalPrice?: number
  images: string[]
  inStock: boolean
  stockCount: number
  category: {
    _id: string
    name: string
  }
  featured: boolean
  isNew: boolean
  discount?: number
  rating: number
  reviewCount: number
  description: string
}

interface WishlistItem {
  _id: string
  userId: string
  productId: Product
  addedAt: string
}

export default function WishlistPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { addItem } = useCart()
  const { toast } = useToast()

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  // Fetch wishlist data
  useEffect(() => {
    const fetchWishlist = async () => {
      if (!session?.user) return

      try {
        setIsLoading(true)
        setError(null)
        
        const response = await fetch("/api/user/wishlist")
        const data = await response.json()

        if (response.ok) {
          setWishlistItems(data.wishlist || [])
        } else {
          setError(data.error || "Failed to load wishlist")
          toast({
            title: "Error",
            description: data.error || "Failed to load wishlist",
            variant: "destructive"
          })
        }
      } catch (error) {
        console.error("Error fetching wishlist:", error)
        setError("Failed to load wishlist")
        toast({
          title: "Error",
          description: "Failed to load wishlist",
          variant: "destructive"
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (session?.user) {
      fetchWishlist()
    }
  }, [session, toast])

  const removeFromWishlist = async (wishlistItemId: string) => {
    try {
      const response = await fetch(`/api/user/wishlist/${wishlistItemId}`, {
        method: "DELETE"
      })

      if (response.ok) {
        setWishlistItems((prev) => prev.filter((item) => item._id !== wishlistItemId))
        toast({
          title: "Item removed",
          description: "The item has been removed from your wishlist.",
        })
      } else {
        const data = await response.json()
        toast({
          title: "Error",
          description: data.error || "Failed to remove item from wishlist",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error("Error removing from wishlist:", error)
      toast({
        title: "Error",
        description: "Failed to remove item from wishlist",
        variant: "destructive"
      })
    }
  }

  const addToCart = (item: WishlistItem) => {
    const product = item.productId
    
    // Check if product exists
    if (!product) {
      toast({
        title: "Error",
        description: "Product information is not available.",
        variant: "destructive"
      })
      return
    }

    addItem({
      id: product._id,
      name: product.name || "Unnamed Product",
      price: product.price || 0,
      quantity: 1,
      image: product.images?.[0] || "/placeholder.svg",
    })
    toast({
      title: "Added to cart",
      description: `${product.name || "Product"} has been added to your cart.`,
    })
  }

  const clearWishlist = async () => {
    try {
      const response = await fetch("/api/user/wishlist", {
        method: "DELETE"
      })

      if (response.ok) {
        setWishlistItems([])
        toast({
          title: "Wishlist cleared",
          description: "All items have been removed from your wishlist.",
        })
      } else {
        const data = await response.json()
        toast({
          title: "Error",
          description: data.error || "Failed to clear wishlist",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error("Error clearing wishlist:", error)
      toast({
        title: "Error",
        description: "Failed to clear wishlist",
        variant: "destructive"
      })
    }
  }

  // Show loading while session is loading
  if (status === "loading" || isLoading) {
    return (
      <Card>
        <CardContent className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    )
  }

  // Show login prompt if not authenticated
  if (!session?.user) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">Please sign in</h3>
          <p className="mt-1 text-muted-foreground">You need to be signed in to view your wishlist.</p>
          <Button className="mt-4" asChild>
            <Link href="/login">Sign In</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500" />
            Your Wishlist
            {wishlistItems.length > 0 && (
              <Badge variant="secondary">{wishlistItems.length}</Badge>
            )}
          </CardTitle>
          <CardDescription>Items you've saved for later</CardDescription>
        </div>
        {wishlistItems.length > 0 && (
          <Button variant="outline" size="sm" onClick={clearWishlist}>
            <Trash2 className="mr-2 h-4 w-4" />
            Clear Wishlist
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {error ? (
          <div className="py-8 text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
            <h3 className="mt-4 text-lg font-medium">Error loading wishlist</h3>
            <p className="mt-1 text-muted-foreground">{error}</p>
            <Button className="mt-4" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        ) : wishlistItems.length === 0 ? (
          <div className="py-8 text-center">
            <Heart className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">Your wishlist is empty</h3>
            <p className="mt-1 text-muted-foreground">Save items you love to your wishlist and revisit them anytime.</p>
            <Button className="mt-4" asChild>
              <Link href="/products">Browse Products</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {wishlistItems.map((item) => {
              const product = item.productId
              
              // Skip item if product is null or undefined
              if (!product) {
                return null
              }

              return (
                <div key={item._id} className="flex flex-col sm:flex-row gap-4 border-b pb-6 last:border-0 last:pb-0">
                  <div className="relative h-40 w-40 overflow-hidden rounded-md border">
                    <Image 
                      src={product.images?.[0] || "/placeholder.svg"} 
                      alt={product.name || "Product"} 
                      fill 
                      className="object-cover" 
                    />
                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      {product.featured && (
                        <Badge variant="secondary" className="bg-blue-500 text-white text-xs">
                          Featured
                        </Badge>
                      )}
                      {product.isNew && (
                        <Badge variant="secondary" className="bg-green-500 text-white text-xs">
                          New
                        </Badge>
                      )}
                      {product.discount && product.discount > 0 && (
                        <Badge variant="destructive" className="text-xs">
                          -{product.discount}%
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-1 flex-col">
                    <div className="flex justify-between">
                      <div className="flex-1">
                        <Link 
                          href={`/products/${product._id}`}
                          className="hover:text-blue-600 transition-colors"
                        >
                          <h3 className="font-medium">{product.name || "Unnamed Product"}</h3>
                        </Link>
                        <p className="text-sm text-muted-foreground mt-1">
                          {product.category?.name || "Uncategorized"}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-red-500"
                        onClick={() => removeFromWishlist(item._id)}
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Remove</span>
                      </Button>
                    </div>
                    
                    <div className="mt-2 flex items-center gap-2">
                      <span className="font-medium text-lg">
                        {formatPrice(product.price || 0)}
                      </span>
                      {product.originalPrice && product.originalPrice > (product.price || 0) && (
                        <span className="text-sm text-muted-foreground line-through">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </div>
                    
                    <div className="mt-2 flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-3 w-3 ${
                                i < Math.floor(product.rating || 0) 
                                  ? 'fill-yellow-400 text-yellow-400' 
                                  : 'text-gray-300'
                              }`} 
                            />
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          ({product.reviewCount || 0} reviews)
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-2 flex items-center gap-2">
                      {product.inStock !== false ? (
                        <div className="flex items-center gap-1 text-green-600">
                          <Package className="h-3 w-3" />
                          <span className="text-xs">
                            {(product.stockCount || 0) > 0 
                              ? `${product.stockCount} in stock` 
                              : 'In stock'
                            }
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-red-600">
                          <AlertCircle className="h-3 w-3" />
                          <span className="text-xs">Out of stock</span>
                        </div>
                      )}
                      
                      <div className="text-xs text-muted-foreground">
                        Added {new Date(item.addedAt || Date.now()).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div className="mt-4 flex gap-2">
                      <Button 
                        onClick={() => addToCart(item)} 
                        disabled={!product.inStock}
                        className="flex-1 sm:flex-none"
                      >
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Add to Cart
                      </Button>
                      
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/products/${product._id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
