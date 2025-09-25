"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Star, 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  Heart, 
  ShoppingCart, 
  Eye,
  ChevronLeft,
  ChevronRight,
  SortAsc,
  SortDesc,
  Sparkles,
  Award,
  Truck,
  Shield,
  GitCompare,
  Clock,
  TrendingUp,
  Zap,
  X,
  Minus,
  Plus,
  Share2,
  Bookmark,
  MessageSquare,
  ThumbsUp,
  RefreshCw,
  Loader2
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEffect, useMemo, useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { useProductReviews } from "@/hooks/use-product-reviews"

export default function ProductsClient() {
  const [products, setProducts] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [limit] = useState(12)
  const [search, setSearch] = useState("")
  const [categories, setCategories] = useState<{ _id: string; name: string; slug: string }[]>([])
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFilters, setShowFilters] = useState(false)
  const [priceRange, setPriceRange] = useState([0, 1000])
  const [selectedRatings, setSelectedRatings] = useState<number[]>([])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [availabilityFilter, setAvailabilityFilter] = useState<"all" | "in-stock" | "out-of-stock">("all")
  const [featuredFilter, setFeaturedFilter] = useState(false)
  const [discountFilter, setDiscountFilter] = useState(false)
  const [wishlist, setWishlist] = useState<string[]>([])
  const [compareList, setCompareList] = useState<string[]>([])
  const [recentlyViewed, setRecentlyViewed] = useState<any[]>([])
  const [quickViewProduct, setQuickViewProduct] = useState<any>(null)
  const [showQuickView, setShowQuickView] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // Get product IDs for review stats
  const productIds = useMemo(() => products.map(p => p._id), [products])

  // Use product reviews hook for real-time review stats
  const { reviewStats, isLoading: reviewsLoading, refetch: refetchReviews } = useProductReviews({
    productIds,
    autoRefresh: true,
    refreshInterval: 30000 // 30 seconds
  })

  // Get unique brands and tags from products
  const availableBrands = useMemo(() => {
    const brands = new Set<string>()
    products.forEach(product => {
      if (product.brand) brands.add(product.brand)
      // Also extract brand from product name if no brand field
      if (!product.brand && product.name) {
        const words = product.name.split(' ')
        if (words.length > 1) {
          brands.add(words[0]) // First word as potential brand
        }
      }
    })
    return Array.from(brands).sort()
  }, [products])

  const availableTags = useMemo(() => {
    const tags = new Set<string>()
    products.forEach(product => {
      if (product.tags && Array.isArray(product.tags)) {
        product.tags.forEach((tag: string) => tags.add(tag))
      }
    })
    return Array.from(tags).sort()
  }, [products])

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await fetch("/api/categories")
      const data = await res.json()
      setCategories(data.categories || [])
    }
    fetchCategories()
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const params = new URLSearchParams({ limit: String(limit), page: String(page) })
        if (categoryFilter !== "all") params.set("category", categoryFilter)
        const res = await fetch(`/api/products?${params.toString()}`)
        const data = await res.json()
        setProducts(data.products || [])
        setTotal(data.pagination?.total || 0)
      } catch (error) {
        console.error('Error fetching products:', error)
        toast({
          title: "Error",
          description: "Failed to load products. Please try again.",
          variant: "destructive"
        })
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [page, limit, categoryFilter])

  // Load recently viewed from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentlyViewed')
    if (saved) {
      setRecentlyViewed(JSON.parse(saved))
    }
  }, [])

  // Save recently viewed to localStorage
  const addToRecentlyViewed = (product: any) => {
    const updated = [product, ...recentlyViewed.filter(p => p._id !== product._id)].slice(0, 10)
    setRecentlyViewed(updated)
    localStorage.setItem('recentlyViewed', JSON.stringify(updated))
  }

  const clearRecentlyViewed = () => {
    setRecentlyViewed([])
    localStorage.removeItem('recentlyViewed')
    toast({
      title: "Recently Viewed Cleared",
      description: "All recently viewed products have been removed"
    })
  }

  const removeFromRecentlyViewed = (productId: string) => {
    const updated = recentlyViewed.filter(p => p._id !== productId)
    setRecentlyViewed(updated)
    localStorage.setItem('recentlyViewed', JSON.stringify(updated))
    toast({
      title: "Product Removed",
      description: "Product removed from recently viewed"
    })
  }

  const filtered = useMemo(() => {
    let filteredProducts = products

    // Search filter
    if (search) {
      filteredProducts = filteredProducts.filter((p) => 
        p.name?.toLowerCase().includes(search.toLowerCase()) ||
        p.description?.toLowerCase().includes(search.toLowerCase()) ||
        p.category?.toLowerCase().includes(search.toLowerCase()) ||
        p.tags?.some((tag: string) => tag.toLowerCase().includes(search.toLowerCase()))
      )
    }

    // Category filter
    if (categoryFilter !== "all") {
      filteredProducts = filteredProducts.filter((p) => 
        p.category?.toLowerCase() === categoryFilter.toLowerCase() ||
        p.category?.toLowerCase().includes(categoryFilter.toLowerCase())
      )
    }

    // Price range filter
    filteredProducts = filteredProducts.filter((p) => {
      const price = Number(p.price) || 0
      return price >= priceRange[0] && price <= priceRange[1]
    })

    // Rating filter using real-time review data
    if (selectedRatings.length > 0) {
      filteredProducts = filteredProducts.filter((p) => {
        const productStats = reviewStats[p._id]
        const rating = productStats?.averageRating || p.rating || 0
        return selectedRatings.some(r => Math.floor(rating) >= r)
      })
    }

    // Brand filter
    if (selectedBrands.length > 0) {
      filteredProducts = filteredProducts.filter((p) => 
        selectedBrands.some(brand => 
          p.brand?.toLowerCase().includes(brand.toLowerCase()) ||
          p.name?.toLowerCase().includes(brand.toLowerCase())
        )
      )
    }

    // Tags filter
    if (selectedTags.length > 0) {
      filteredProducts = filteredProducts.filter((p) => 
        selectedTags.some(tag => 
          p.tags?.some((productTag: string) => 
            productTag.toLowerCase().includes(tag.toLowerCase())
          )
        )
      )
    }

    // Availability filter
    if (availabilityFilter !== "all") {
      filteredProducts = filteredProducts.filter((p) => {
        const stock = Number(p.stock) || 0
        return availabilityFilter === "in-stock" ? stock > 0 : stock === 0
      })
    }

    // Featured filter
    if (featuredFilter) {
      filteredProducts = filteredProducts.filter((p) => p.featured === true)
    }

    // Discount filter
    if (discountFilter) {
      filteredProducts = filteredProducts.filter((p) => 
        p.originalPrice && Number(p.originalPrice) > Number(p.price)
      )
    }

    // Sort products
    switch (sortBy) {
      case "price-low":
        filteredProducts.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0))
        break
      case "price-high":
        filteredProducts.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0))
        break
      case "rating":
        filteredProducts.sort((a, b) => {
          const aStats = reviewStats[a._id]
          const bStats = reviewStats[b._id]
          const aRating = aStats?.averageRating || a.rating || 0
          const bRating = bStats?.averageRating || b.rating || 0
          return bRating - aRating
        })
        break
      case "reviews":
        filteredProducts.sort((a, b) => {
          const aStats = reviewStats[a._id]
          const bStats = reviewStats[b._id]
          const aReviews = aStats?.totalReviews || a.reviewCount || 0
          const bReviews = bStats?.totalReviews || b.reviewCount || 0
          return bReviews - aReviews
        })
        break
      case "newest":
      default:
        filteredProducts.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
        break
    }

    return filteredProducts
  }, [products, search, categoryFilter, priceRange, selectedRatings, selectedBrands, selectedTags, availabilityFilter, featuredFilter, discountFilter, sortBy, reviewStats])

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

  const toggleRatingFilter = (rating: number) => {
    setSelectedRatings(prev => 
      prev.includes(rating) 
        ? prev.filter(r => r !== rating)
        : [...prev, rating]
    )
  }

  const toggleBrandFilter = (brand: string) => {
    setSelectedBrands(prev => 
      prev.includes(brand) 
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    )
  }

  const toggleTagFilter = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
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

  const openQuickView = (product: any) => {
    setQuickViewProduct(product)
    setShowQuickView(true)
    addToRecentlyViewed(product)
  }

  const handleProductClick = (product: any) => {
    addToRecentlyViewed(product)
  }

  const shareProduct = async (product: any) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: `${window.location.origin}/products/${product._id}`
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${window.location.origin}/products/${product._id}`)
      toast({
        title: "Link copied",
        description: "Product link copied to clipboard"
      })
    }
  }

  const addToCart = (product: any) => {
    // This would integrate with your cart context
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart`
    })
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-24 md:pt-32 pb-16 md:pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50 dark:from-teal-950/20 dark:via-emerald-950/20 dark:to-cyan-950/20 -z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(20,184,166,0.1),transparent_50%),radial-gradient(ellipse_at_bottom_left,rgba(16,185,129,0.1),transparent_50%)] -z-10" />
        
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4" />
              Discover Premium Quality
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-600 bg-clip-text text-transparent">
              Our Products
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Discover our collection of locally crafted, high-quality products that bring style and functionality to your life
            </p>
            
            {/* Enhanced Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search products, brands, or categories..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-12 pr-4 py-6 text-lg border-2 focus:border-teal-500 rounded-2xl shadow-lg"
                />
                <Button 
                  size="lg" 
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-xl"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-muted/30">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-4 p-4 rounded-lg bg-background border">
              <div className="p-3 rounded-full bg-teal-100 dark:bg-teal-900/30">
                <Award className="h-6 w-6 text-teal-600" />
              </div>
              <div>
                <h3 className="font-semibold">Premium Quality</h3>
                <p className="text-sm text-muted-foreground">Handpicked products</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-lg bg-background border">
              <div className="p-3 rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                <Truck className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-semibold">Fast Shipping</h3>
                <p className="text-sm text-muted-foreground">Free delivery over $50</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-lg bg-background border">
              <div className="p-3 rounded-full bg-cyan-100 dark:bg-cyan-900/30">
                <Shield className="h-6 w-6 text-cyan-600" />
              </div>
              <div>
                <h3 className="font-semibold">Secure Payment</h3>
                <p className="text-sm text-muted-foreground">100% secure checkout</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recently Viewed Section */}
      {recentlyViewed.length > 0 && (
        <section className="py-8 bg-background border-b">
          <div className="container">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <h3 className="text-lg font-semibold">Recently Viewed</h3>
                <Badge variant="secondary" className="text-xs">
                  {recentlyViewed.length}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearRecentlyViewed}
                  className="flex items-center gap-2"
                >
                  <X className="h-4 w-4" />
                  Clear All
                </Button>
              </div>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {recentlyViewed.slice(0, 5).map((product) => (
                <div key={product._id} className="flex-shrink-0 w-32 group relative">
                  <Link
                    href={`/products/${product._id}`}
                    className="block"
                  >
                    <div className="relative h-24 w-full rounded-lg overflow-hidden border">
                      <Image
                        src={product.images?.[0] || "/placeholder.png"}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                      {/* Remove button */}
                      <Button
                        size="sm"
                        variant="destructive"
                        className="absolute top-1 right-1 h-6 w-6 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          removeFromRecentlyViewed(product._id)
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                    <p className="text-xs mt-2 line-clamp-2 group-hover:text-teal-600 transition-colors">
                      {product.name}
                    </p>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Compare Bar */}
      {compareList.length > 0 && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
          <Card className="shadow-lg border-2 border-teal-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <GitCompare className="h-5 w-5 text-teal-600" />
                  <span className="font-medium">
                    {compareList.length} product{compareList.length > 1 ? 's' : ''} selected
                  </span>
                </div>
                <Button size="sm" className="rounded-full">
                  Compare Now
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setCompareList([])}
                  className="rounded-full"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <section className="py-16 md:py-24">
        <div className="container">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className={`lg:w-80 ${showFilters ? 'block' : 'hidden lg:block'}`}>
              <Card className="sticky top-24">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold">Filters</h3>
                      {(() => {
                        const activeFilters = [
                          categoryFilter !== "all",
                          priceRange[0] !== 0 || priceRange[1] !== 1000,
                          selectedRatings.length > 0,
                          selectedBrands.length > 0,
                          selectedTags.length > 0,
                          availabilityFilter !== "all",
                          featuredFilter,
                          discountFilter
                        ].filter(Boolean).length
                        
                        return activeFilters > 0 ? (
                          <Badge variant="secondary" className="text-xs">
                            {activeFilters}
                          </Badge>
                        ) : null
                      })()}
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => {
                        setCategoryFilter("all")
                        setPriceRange([0, 1000])
                        setSelectedRatings([])
                        setSelectedBrands([])
                        setSelectedTags([])
                        setAvailabilityFilter("all")
                        setFeaturedFilter(false)
                        setDiscountFilter(false)
                      }}
                    >
                      Clear All
                    </Button>
                  </div>

                  {/* Category Filter */}
                  <div className="mb-6">
                    <h4 className="font-medium mb-3">Categories</h4>
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="All categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All categories</SelectItem>
                        {categories.map((c) => (
                          <SelectItem key={c._id} value={c.slug}>{c.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator className="my-6" />

                  {/* Price Range */}
                  <div className="mb-6">
                    <h4 className="font-medium mb-3">Price Range</h4>
                    <div className="space-y-3">
                      <Slider
                        value={priceRange}
                        onValueChange={setPriceRange}
                        max={1000}
                        min={0}
                        step={10}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>${priceRange[0]}</span>
                        <span>${priceRange[1]}</span>
                      </div>
                    </div>
                  </div>

                  <Separator className="my-6" />

                  {/* Rating Filter */}
                  <div className="mb-6">
                    <h4 className="font-medium mb-3">Customer Rating</h4>
                    <div className="space-y-2">
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <div key={rating} className="flex items-center space-x-2">
                          <Checkbox
                            id={`rating-${rating}`}
                            checked={selectedRatings.includes(rating)}
                            onCheckedChange={() => toggleRatingFilter(rating)}
                          />
                          <label htmlFor={`rating-${rating}`} className="flex items-center gap-1 text-sm cursor-pointer">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-3 w-3 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                              />
                            ))}
                            <span className="ml-1">& up</span>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator className="my-6" />

                  {/* Availability Filter */}
                  <div className="mb-6">
                    <h4 className="font-medium mb-3">Availability</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="in-stock"
                          checked={availabilityFilter === "in-stock"}
                          onCheckedChange={() => setAvailabilityFilter(availabilityFilter === "in-stock" ? "all" : "in-stock")}
                        />
                        <label htmlFor="in-stock" className="text-sm cursor-pointer">
                          In Stock
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="out-of-stock"
                          checked={availabilityFilter === "out-of-stock"}
                          onCheckedChange={() => setAvailabilityFilter(availabilityFilter === "out-of-stock" ? "all" : "out-of-stock")}
                        />
                        <label htmlFor="out-of-stock" className="text-sm cursor-pointer">
                          Out of Stock
                        </label>
                      </div>
                    </div>
                  </div>

                  <Separator className="my-6" />

                  {/* Special Filters */}
                  <div className="mb-6">
                    <h4 className="font-medium mb-3">Special</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="featured"
                          checked={featuredFilter}
                          onCheckedChange={(checked) => setFeaturedFilter(checked === true)}
                        />
                        <label htmlFor="featured" className="text-sm cursor-pointer flex items-center gap-1">
                          <Award className="h-3 w-3" />
                          Featured Products
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="discount"
                          checked={discountFilter}
                          onCheckedChange={(checked) => setDiscountFilter(checked === true)}
                        />
                        <label htmlFor="discount" className="text-sm cursor-pointer flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          On Sale
                        </label>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Products Section */}
            <div className="flex-1">
              {/* Header Controls */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">All Products</h2>
                  <p className="text-muted-foreground">
                    Showing {filtered.length} of {total} products
                  </p>
                </div>
                
                <div className="flex items-center gap-3">
                  {/* Sort */}
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                      <SelectItem value="reviews">Most Reviews</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* View Mode */}
                  <div className="flex items-center border rounded-lg">
                    <Button
                      variant={viewMode === "grid" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                      className="rounded-r-none"
                    >
                      <Grid3X3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                      className="rounded-l-none"
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Products Grid/List */}
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <Card key={index} className="overflow-hidden">
                      <div className="h-[250px] bg-muted animate-pulse" />
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
              ) : (
                <div className={
                  viewMode === "grid" 
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    : "space-y-4"
                }>
                  {filtered.map((product, index) => (
                  <Card key={index} className="group overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                    <Link 
                      href={`/products/${product._id}`} 
                      className="block"
                      onClick={() => handleProductClick(product)}
                    >
                      {viewMode === "grid" ? (
                        <div className="relative">
                          <div className="relative overflow-hidden h-[250px]">
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
                              openQuickView(product)
                            }}
                          >
                            <Eye className="h-4 w-4" />
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
                        <div className="absolute top-3 left-3 flex flex-col gap-2">
                          {product.featured && (
                            <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white">
                              <Award className="h-3 w-3 mr-1" />
                              Featured
                            </Badge>
                          )}
                          {product.isNew && (
                            <Badge className="bg-teal-500 hover:bg-teal-600 text-white">
                              <Sparkles className="h-3 w-3 mr-1" />
                              New
                            </Badge>
                          )}
                          {product.discount && (
                            <Badge variant="destructive">
                              <TrendingUp className="h-3 w-3 mr-1" />
                              -{product.discount}%
                            </Badge>
                          )}
                          {product.originalPrice && Number(product.originalPrice) > Number(product.price) && (
                            <Badge variant="destructive">
                              <TrendingUp className="h-3 w-3 mr-1" />
                              Sale
                            </Badge>
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
                                {product.description}
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
                              ({reviewStats[product._id]?.totalReviews || product.reviewCount || 0} reviews)
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
                              {product.originalPrice && (
                                <span className="text-sm text-muted-foreground line-through">
                                  ${Number(product.originalPrice)?.toFixed(2)}
                                </span>
                              )}
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
                      ) : (
                        // List View
                        <div className="flex">
                          <div className="relative h-[200px] w-[300px] flex-shrink-0">
                            <Image
                              src={product.images?.[0] || "/placeholder.jpg"}
                              alt={product.name}
                              fill
                              className="object-cover transition-transform duration-300 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                            
                            {/* Badges for List View */}
                            <div className="absolute top-3 left-3 flex flex-col gap-2">
                              {product.featured && (
                                <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white">
                                  <Award className="h-3 w-3 mr-1" />
                                  Featured
                                </Badge>
                              )}
                              {product.isNew && (
                                <Badge className="bg-teal-500 hover:bg-teal-600 text-white">
                                  <Sparkles className="h-3 w-3 mr-1" />
                                  New
                                </Badge>
                              )}
                              {product.discount && (
                                <Badge variant="destructive">
                                  <TrendingUp className="h-3 w-3 mr-1" />
                                  -{product.discount}%
                                </Badge>
                              )}
                              {product.originalPrice && Number(product.originalPrice) > Number(product.price) && (
                                <Badge variant="destructive">
                                  <TrendingUp className="h-3 w-3 mr-1" />
                                  Sale
                                </Badge>
                              )}
                            </div>

                            {/* Action Buttons for List View */}
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
                                  openQuickView(product)
                                }}
                              >
                                <Eye className="h-4 w-4" />
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
                            </div>
                          </div>

                          <CardContent className="p-6 flex-1">
                            <div className="space-y-4">
                              <div>
                                <h3 className="font-semibold text-xl line-clamp-2 group-hover:text-teal-600 transition-colors">
                                  {product.name}
                                </h3>
                                <p className="text-muted-foreground line-clamp-3 mt-2">
                                  {product.description}
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
                                <span className="text-sm text-muted-foreground">
                                  ({reviewStats[product._id]?.totalReviews || product.reviewCount || 0} reviews)
                                </span>
                                {reviewsLoading && (
                                  <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                                )}
                              </div>

                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className="text-2xl font-bold text-teal-600">
                                    ${Number(product.price)?.toFixed(2) || product.price}
                                  </span>
                                  {product.originalPrice && (
                                    <span className="text-lg text-muted-foreground line-through">
                                      ${Number(product.originalPrice)?.toFixed(2)}
                                    </span>
                                  )}
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
                                  Add to Cart
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </div>
                      )}
                    </Link>
                  </Card>
                  ))}
                </div>
              )}

              {/* Quick View Dialog */}
              <Dialog open={showQuickView} onOpenChange={setShowQuickView}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Quick View</DialogTitle>
                  </DialogHeader>
                  {quickViewProduct && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="relative h-80 w-full rounded-lg overflow-hidden">
                          <Image
                            src={quickViewProduct.images?.[0] || "/placeholder.png"}
                            alt={quickViewProduct.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex gap-2">
                          {quickViewProduct.images?.slice(0, 4).map((img: string, index: number) => (
                            <div key={index} className="relative h-16 w-16 rounded-lg overflow-hidden border">
                              <Image
                                src={img}
                                alt={`${quickViewProduct.name} ${index + 1}`}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <h2 className="text-2xl font-bold">{quickViewProduct.name}</h2>
                          <p className="text-muted-foreground mt-2">{quickViewProduct.description}</p>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-4 w-4 ${
                                  i < (quickViewProduct.rating || 0) 
                                    ? 'fill-yellow-400 text-yellow-400' 
                                    : 'text-gray-300'
                                }`} 
                              />
                            ))}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            ({quickViewProduct.reviewCount || 0} reviews)
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-3xl font-bold text-teal-600">
                            ${Number(quickViewProduct.price)?.toFixed(2)}
                          </span>
                          {quickViewProduct.originalPrice && (
                            <span className="text-lg text-muted-foreground line-through">
                              ${Number(quickViewProduct.originalPrice)?.toFixed(2)}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">Quantity:</span>
                          <div className="flex items-center border rounded-lg">
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="px-3 py-1">1</span>
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <Button 
                            className="flex-1"
                            onClick={() => {
                              addToCart(quickViewProduct)
                              setShowQuickView(false)
                            }}
                          >
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            Add to Cart
                          </Button>
                          <Button 
                            variant="outline"
                            onClick={() => toggleWishlist(quickViewProduct._id)}
                          >
                            <Heart className={`h-4 w-4 mr-2 ${wishlist.includes(quickViewProduct._id) ? 'fill-red-500 text-red-500' : ''}`} />
                            Wishlist
                          </Button>
                        </div>

                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => shareProduct(quickViewProduct)}
                          >
                            <Share2 className="h-4 w-4 mr-2" />
                            Share
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => toggleCompare(quickViewProduct._id)}
                          >
                            <GitCompare className={`h-4 w-4 mr-2 ${compareList.includes(quickViewProduct._id) ? 'text-teal-600' : ''}`} />
                            Compare
                          </Button>
                        </div>

                        <div className="pt-4 border-t">
                          <h4 className="font-medium mb-2">Product Details</h4>
                          <div className="space-y-2 text-sm text-muted-foreground">
                            <div className="flex justify-between">
                              <span>Category:</span>
                              <span>{quickViewProduct.category}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Stock:</span>
                              <span>{quickViewProduct.stock} available</span>
                            </div>
                            <div className="flex justify-between">
                              <span>SKU:</span>
                              <span>{quickViewProduct._id.slice(-8)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </DialogContent>
              </Dialog>

              {/* Enhanced Pagination */}
              <div className="flex justify-center mt-12">
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    disabled={page === 1} 
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="rounded-full"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>
                  
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, Math.ceil(total / limit)) }, (_, i) => {
                      const pageNum = i + 1
                      return (
                        <Button
                          key={pageNum}
                          variant={page === pageNum ? "default" : "outline"}
                          size="sm"
                          onClick={() => setPage(pageNum)}
                          className="w-10 h-10 rounded-full"
                        >
                          {pageNum}
                        </Button>
                      )
                    })}
                  </div>

                  <Button 
                    variant="outline" 
                    size="sm" 
                    disabled={page * limit >= total} 
                    onClick={() => setPage((p) => p + 1)}
                    className="rounded-full"
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}


