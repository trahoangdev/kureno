"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Heart, 
  ShoppingCart, 
  Eye,
  Sparkles,
  Award,
  TrendingUp,
  GitCompare,
  Share2,
  Star,
  Package
} from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { useCart } from "@/context/cart-context"

interface HomeProductCardProps {
  product: any
}

export default function HomeProductCard({ product }: HomeProductCardProps) {
  const [wishlist, setWishlist] = useState<string[]>([])
  const [compareList, setCompareList] = useState<string[]>([])
  const { toast } = useToast()
  const { addItem } = useCart()

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
    if (compareList.length >= 3 && !compareList.includes(productId)) {
      toast({
        title: "Compare limit reached",
        description: "You can compare up to 3 products at a time",
        variant: "destructive"
      })
      return
    }
    
    const updatedList = compareList.includes(productId) 
      ? compareList.filter(id => id !== productId)
      : [...compareList, productId]
    
    setCompareList(updatedList)
    localStorage.setItem('compareList', JSON.stringify(updatedList))
    
    toast({
      title: compareList.includes(productId) ? "Removed from compare" : "Added to compare",
      description: compareList.includes(productId) ? "Product removed from comparison" : "Product added to comparison"
    })
  }

  const shareProduct = (product: any) => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: `${window.location.origin}/products/${product._id}`
      })
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/products/${product._id}`)
      toast({
        title: "Link copied",
        description: "Product link copied to clipboard"
      })
    }
  }

  const addToCart = (product: any) => {
    const cartItem = {
      id: product._id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.images?.[0] || "/placeholder.png"
    }
    
    addItem(cartItem)
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart`
    })
  }

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2 rounded-xl bg-white dark:bg-gray-800">
      {/* Image Section */}
      <div className="relative h-[300px] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
        <Image
          src={product.images?.[0] || "/placeholder.png"}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
        
        {/* Heart Icon - Top Right */}
        <div className="absolute top-3 right-3">
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0 rounded-full bg-white/90 hover:bg-white shadow-md"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              toggleWishlist(product._id)
            }}
          >
            <Heart className={`h-4 w-4 ${wishlist.includes(product._id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
          </Button>
        </div>

        {/* Badges - Top Left */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.featured && (
            <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white text-xs">
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
          {product.onSale && product.originalPrice && Number(product.originalPrice) > 0 && Number(product.originalPrice) > Number(product.price) && (
            <Badge className="bg-red-500 hover:bg-red-600 text-white text-xs">
              <TrendingUp className="h-3 w-3 mr-1" />
              Sale
            </Badge>
          )}
        </div>

        {/* Action Buttons - Bottom Right */}
        <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button
            size="sm"
            variant="secondary"
            className="h-8 w-8 p-0 rounded-full bg-white/90 hover:bg-white shadow-md"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              // Quick view logic here
            }}
          >
            <Eye className="h-4 w-4 text-gray-600" />
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="h-8 w-8 p-0 rounded-full bg-white/90 hover:bg-white shadow-md"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              toggleCompare(product._id)
            }}
          >
            <GitCompare className={`h-4 w-4 ${compareList.includes(product._id) ? 'text-teal-600' : 'text-gray-600'}`} />
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="h-8 w-8 p-0 rounded-full bg-white/90 hover:bg-white shadow-md"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              shareProduct(product)
            }}
          >
            <Share2 className="h-4 w-4 text-gray-600" />
          </Button>
        </div>
      </div>

      {/* Content Section - White Background */}
      <CardContent className="p-6 bg-white dark:bg-gray-800">
        <div className="space-y-4">
          {/* Product Name */}
          <h3 className="font-bold text-xl leading-tight group-hover:text-teal-600 transition-colors duration-300">
            {product.name || "Product Name"}
          </h3>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="text-xs">
              {product.category || "Category"}
            </Badge>
            {product.tags && product.tags.length > 0 && (
              <Badge variant="outline" className="text-xs">
                {product.tags[0]}
              </Badge>
            )}
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground leading-relaxed">
            {product.description || "Crossing hardwood comfort with off-court flair. '80s-inspired construction, bold details and nothin'-but-net style."}
          </p>

          {/* Price and Add to Cart */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground uppercase tracking-wide">PRICE</span>
              <div className="flex items-center gap-2">
                {product.onSale && product.originalPrice && Number(product.originalPrice) > 0 && Number(product.originalPrice) > Number(product.price) ? (
                  <>
                    <span className="text-sm text-muted-foreground line-through">
                      ${Number(product.originalPrice).toFixed(2)}
                    </span>
                    <span className="text-xl font-bold text-red-600">
                      ${Number(product.price).toFixed(2)}
                    </span>
                  </>
                ) : (
                  <span className="text-xl font-bold">
                    ${Number(product.price).toFixed(2)}
                  </span>
                )}
              </div>
            </div>
            
            <Button
              onClick={() => addToCart(product)}
              className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg font-medium"
            >
              Add to cart
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
