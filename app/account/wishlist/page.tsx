"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatPrice } from "@/lib/utils"
import { useCart } from "@/context/cart-context"
import { useToast } from "@/components/ui/use-toast"
import { Heart, Loader2, ShoppingCart, Trash2, X } from "lucide-react"

// Mock wishlist data (in a real app, this would come from an API)
const mockWishlistItems = [
  {
    id: "1",
    name: "Handcrafted Wooden Bowl",
    price: 99.0,
    image: "/placeholder.svg?height=200&width=200",
    inStock: true,
  },
  {
    id: "2",
    name: "Artisan Ceramic Mug",
    price: 45.0,
    image: "/placeholder.svg?height=200&width=200",
    inStock: true,
  },
  {
    id: "3",
    name: "Woven Basket Set",
    price: 129.0,
    image: "/placeholder.svg?height=200&width=200",
    inStock: false,
  },
]

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState(mockWishlistItems)
  const [isLoading, setIsLoading] = useState(true)
  const { addItem } = useCart()
  const { toast } = useToast()

  useEffect(() => {
    // Simulate loading wishlist data
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const removeFromWishlist = (id: string) => {
    setWishlistItems((prev) => prev.filter((item) => item.id !== id))
    toast({
      title: "Item removed",
      description: "The item has been removed from your wishlist.",
    })
  }

  const addToCart = (item: (typeof wishlistItems)[0]) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      image: item.image,
    })
    toast({
      title: "Added to cart",
      description: `${item.name} has been added to your cart.`,
    })
  }

  const clearWishlist = () => {
    setWishlistItems([])
    toast({
      title: "Wishlist cleared",
      description: "All items have been removed from your wishlist.",
    })
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Your Wishlist</CardTitle>
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
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
            {wishlistItems.map((item) => (
              <div key={item.id} className="flex flex-col sm:flex-row gap-4 border-b pb-6 last:border-0 last:pb-0">
                <div className="relative h-40 w-40 overflow-hidden rounded-md border">
                  <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                </div>
                <div className="flex flex-1 flex-col">
                  <div className="flex justify-between">
                    <h3 className="font-medium">{item.name}</h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground"
                      onClick={() => removeFromWishlist(item.id)}
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Remove</span>
                    </Button>
                  </div>
                  <p className="mt-1 font-medium">{formatPrice(item.price)}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{item.inStock ? "In stock" : "Out of stock"}</p>
                  <div className="mt-auto pt-4">
                    <Button onClick={() => addToCart(item)} disabled={!item.inStock} className="w-full sm:w-auto">
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
