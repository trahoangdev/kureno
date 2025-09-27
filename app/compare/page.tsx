"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import { 
  ArrowLeft, 
  ShoppingCart, 
  Heart, 
  X, 
  Star,
  Package,
  Award,
  Sparkles,
  TrendingUp,
  Trash2,
  Plus
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useCart } from "@/context/cart-context"

interface Product {
  _id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  onSale?: boolean
  images: string[]
  category: string
  stock: number
  featured: boolean
  isNewProduct?: boolean
  isTrending?: boolean
  isBestSeller?: boolean
  averageRating?: number
  reviewCount?: number
  tags?: string[]
  weight?: string
  dimensions?: {
    length: string
    width: string
    height: string
  }
  sku?: string
  brand?: string
}

export default function ComparePage() {
  const [compareList, setCompareList] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const { addItem } = useCart()
  const router = useRouter()

  useEffect(() => {
    // Load compare list from localStorage and fetch product details
    const loadCompareList = async () => {
      try {
        const savedCompareList = localStorage.getItem('compareList')
        if (savedCompareList) {
          const productIds = JSON.parse(savedCompareList)
          if (productIds.length > 0) {
            // Fetch product details from API
            const response = await fetch('/api/compare', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ productIds }),
            })

            if (response.ok) {
              const data = await response.json()
              setCompareList(data.products)
            } else {
              console.error('Failed to fetch products for comparison')
              setCompareList([])
            }
          } else {
            setCompareList([])
          }
        } else {
          setCompareList([])
        }
      } catch (error) {
        console.error('Error loading compare list:', error)
        setCompareList([])
      } finally {
        setLoading(false)
      }
    }

    loadCompareList()
  }, [])

  const removeFromCompare = (productId: string) => {
    const updatedList = compareList.filter(product => product._id !== productId)
    const updatedIds = updatedList.map(product => product._id)
    setCompareList(updatedList)
    localStorage.setItem('compareList', JSON.stringify(updatedIds))
    toast({
      title: "Removed from compare",
      description: "Product has been removed from comparison"
    })
  }

  const clearAll = () => {
    setCompareList([])
    localStorage.setItem('compareList', JSON.stringify([]))
    toast({
      title: "Compare list cleared",
      description: "All products have been removed from comparison"
    })
  }

  const addToCart = (product: Product) => {
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

  const addToWishlist = (product: Product) => {
    // Add to wishlist logic here
    toast({
      title: "Added to wishlist",
      description: `${product.name} has been added to your wishlist`
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teal-600"></div>
      </div>
    )
  }

  if (compareList.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <h1 className="text-3xl font-bold">Compare Products</h1>
          </div>

          {/* Empty State */}
          <Card className="max-w-2xl mx-auto">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <Package className="h-16 w-16 text-gray-400 mb-4" />
              <h2 className="text-2xl font-semibold mb-2">No Products to Compare</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Add products to your compare list to see detailed comparisons
              </p>
              <Button asChild>
                <Link href="/products">
                  <Plus className="h-4 w-4 mr-2" />
                  Browse Products
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <h1 className="text-3xl font-bold">Compare Products</h1>
            <Badge variant="secondary" className="text-sm">
              {compareList.length} products
            </Badge>
          </div>
          <Button
            variant="outline"
            onClick={clearAll}
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Clear All
          </Button>
        </div>

        {/* Compare Table */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-48">Product</TableHead>
                  {compareList.map((product) => (
                    <TableHead key={product._id} className="w-64 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <div className="relative w-32 h-32">
                          <Image
                            src={product.images?.[0] || "/placeholder.png"}
                            alt={product.name}
                            fill
                            className="object-cover rounded-lg"
                          />
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCompare(product._id)}
                          className="h-6 w-6 p-0 text-gray-500 hover:text-red-500"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Product Name */}
                <TableRow>
                  <TableCell className="font-semibold">Product Name</TableCell>
                  {compareList.map((product) => (
                    <TableCell key={product._id} className="text-center">
                      <Link 
                        href={`/products/${product._id}`}
                        className="font-semibold text-teal-600 hover:text-teal-700 transition-colors"
                      >
                        {product.name}
                      </Link>
                    </TableCell>
                  ))}
                </TableRow>

                {/* Price */}
                <TableRow>
                  <TableCell className="font-semibold">Price</TableCell>
                  {compareList.map((product) => (
                    <TableCell key={product._id} className="text-center">
                      <div className="flex flex-col items-center gap-1">
                        {product.onSale && product.originalPrice && product.originalPrice > product.price ? (
                          <>
                            <span className="text-lg font-bold text-red-600">
                              ${product.price.toFixed(2)}
                            </span>
                            <span className="text-sm text-gray-500 line-through">
                              ${product.originalPrice.toFixed(2)}
                            </span>
                          </>
                        ) : (
                          <span className="text-lg font-bold">
                            ${product.price.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </TableCell>
                  ))}
                </TableRow>

                {/* Rating */}
                <TableRow>
                  <TableCell className="font-semibold">Rating</TableCell>
                  {compareList.map((product) => (
                    <TableCell key={product._id} className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < Math.floor(product.averageRating || 0)
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">
                          ({product.reviewCount || 0})
                        </span>
                      </div>
                    </TableCell>
                  ))}
                </TableRow>

                {/* Category */}
                <TableRow>
                  <TableCell className="font-semibold">Category</TableCell>
                  {compareList.map((product) => (
                    <TableCell key={product._id} className="text-center">
                      <Badge variant="outline">{product.category}</Badge>
                    </TableCell>
                  ))}
                </TableRow>

                {/* Stock */}
                <TableRow>
                  <TableCell className="font-semibold">Stock</TableCell>
                  {compareList.map((product) => (
                    <TableCell key={product._id} className="text-center">
                      <span className={`font-semibold ${
                        product.stock > 10 
                          ? 'text-green-600' 
                          : product.stock > 0 
                            ? 'text-yellow-600' 
                            : 'text-red-600'
                      }`}>
                        {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                      </span>
                    </TableCell>
                  ))}
                </TableRow>

                {/* Features */}
                <TableRow>
                  <TableCell className="font-semibold">Features</TableCell>
                  {compareList.map((product) => (
                    <TableCell key={product._id} className="text-center">
                      <div className="flex flex-wrap justify-center gap-1">
                        {product.featured && (
                          <Badge className="bg-yellow-500 text-white text-xs">
                            <Award className="h-3 w-3 mr-1" />
                            Featured
                          </Badge>
                        )}
                        {product.isNewProduct && (
                          <Badge className="bg-teal-500 text-white text-xs">
                            <Sparkles className="h-3 w-3 mr-1" />
                            New
                          </Badge>
                        )}
                        {product.isTrending && (
                          <Badge className="bg-orange-500 text-white text-xs">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            Trending
                          </Badge>
                        )}
                        {product.isBestSeller && (
                          <Badge className="bg-purple-500 text-white text-xs">
                            <Award className="h-3 w-3 mr-1" />
                            Best Seller
                          </Badge>
                        )}
                        {product.onSale && (
                          <Badge className="bg-red-500 text-white text-xs">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            Sale
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                  ))}
                </TableRow>

                {/* Description */}
                <TableRow>
                  <TableCell className="font-semibold">Description</TableCell>
                  {compareList.map((product) => (
                    <TableCell key={product._id} className="text-center">
                      <p className="text-sm text-gray-600 line-clamp-3">
                        {product.description}
                      </p>
                    </TableCell>
                  ))}
                </TableRow>

                {/* SKU */}
                <TableRow>
                  <TableCell className="font-semibold">SKU</TableCell>
                  {compareList.map((product) => (
                    <TableCell key={product._id} className="text-center">
                      <span className="text-sm text-gray-600">{product.sku || 'N/A'}</span>
                    </TableCell>
                  ))}
                </TableRow>

                {/* Brand */}
                <TableRow>
                  <TableCell className="font-semibold">Brand</TableCell>
                  {compareList.map((product) => (
                    <TableCell key={product._id} className="text-center">
                      <span className="text-sm text-gray-600">{product.brand || 'N/A'}</span>
                    </TableCell>
                  ))}
                </TableRow>

                {/* Weight */}
                <TableRow>
                  <TableCell className="font-semibold">Weight</TableCell>
                  {compareList.map((product) => (
                    <TableCell key={product._id} className="text-center">
                      <span className="text-sm text-gray-600">{product.weight || 'N/A'}</span>
                    </TableCell>
                  ))}
                </TableRow>

                {/* Dimensions */}
                <TableRow>
                  <TableCell className="font-semibold">Dimensions</TableCell>
                  {compareList.map((product) => (
                    <TableCell key={product._id} className="text-center">
                      <span className="text-sm text-gray-600">
                        {product.dimensions 
                          ? `${product.dimensions.length} × ${product.dimensions.width} × ${product.dimensions.height}`
                          : 'N/A'
                        }
                      </span>
                    </TableCell>
                  ))}
                </TableRow>

                {/* Actions */}
                <TableRow>
                  <TableCell className="font-semibold">Actions</TableCell>
                  {compareList.map((product) => (
                    <TableCell key={product._id} className="text-center">
                      <div className="flex flex-col gap-2">
                        <Button
                          size="sm"
                          onClick={() => addToCart(product)}
                          className="w-full"
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Add to Cart
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => addToWishlist(product)}
                          className="w-full"
                        >
                          <Heart className="h-4 w-4 mr-2" />
                          Add to Wishlist
                        </Button>
                      </div>
                    </TableCell>
                  ))}
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* Add More Products */}
        <Card className="mt-8">
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Want to compare more products?</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Add more products to your compare list for detailed comparisons
              </p>
              <Button asChild>
                <Link href="/products">
                  <Plus className="h-4 w-4 mr-2" />
                  Browse More Products
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
