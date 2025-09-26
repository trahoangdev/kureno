"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import ExportImportDialog from "../components/export-import-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Edit, 
  Trash, 
  Eye, 
  Filter,
  Package,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Grid3X3,
  List,
  Download,
  Upload,
  RefreshCw,
  Star,
  Award,
  Zap,
  BarChart3,
  Settings,
  SortAsc,
  SortDesc,
  Calendar,
  DollarSign,
  ShoppingCart,
  Users,
  Target,
  Activity,
  Clock,
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  X,
  Check,
  Copy,
  ExternalLink
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Product {
  _id: string
  name: string
  category: string
  price: number
  stock: number
  images: string[]
  featured: boolean
  createdAt: string
  // New fields
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

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState<{ _id: string; name: string; slug: string }[]>([])
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [visibilityFilter, setVisibilityFilter] = useState("all")
  const [viewMode, setViewMode] = useState<"table" | "grid">("table")
  const [sortBy, setSortBy] = useState("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    draft: 0,
    archived: 0,
    lowStock: 0
  })

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const params = new URLSearchParams({ limit: String(limit), page: String(page) })
      if (categoryFilter !== "all") params.set("category", categoryFilter)
      if (statusFilter !== "all") params.set("status", statusFilter)
      if (visibilityFilter !== "all") params.set("visibility", visibilityFilter)
      const res = await fetch(`/api/products?${params.toString()}`)
      const data = await res.json()
      setProducts(data.products)
      setTotal(data.pagination.total)
      
      // Calculate stats
      const allProducts = data.products
      const newStats = {
        total: allProducts.length,
        published: allProducts.filter((p: Product) => p.status === "published").length,
        draft: allProducts.filter((p: Product) => p.status === "draft").length,
        archived: allProducts.filter((p: Product) => p.status === "archived").length,
        lowStock: allProducts.filter((p: Product) => p.stock <= (p.inventory?.lowStockThreshold || 5)).length
      }
      setStats(newStats)
      
      setLoading(false)
    }
    fetchData()
  }, [page, limit, categoryFilter, statusFilter, visibilityFilter])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories")
        const data = await res.json()
        setCategories(data.categories || [])
      } catch {}
    }
    fetchCategories()
  }, [])

  const filtered = useMemo(() => {
    let result = products
    
    // Apply search filter
    if (search) {
      result = result.filter((p) =>
        [p.name, p.category].some((v) => v?.toLowerCase().includes(search.toLowerCase())),
      )
    }
    
    // Apply sorting
    result = [...result].sort((a, b) => {
      let aValue: any = a[sortBy as keyof Product]
      let bValue: any = b[sortBy as keyof Product]
      
      if (sortBy === "price" || sortBy === "stock") {
        aValue = Number(aValue)
        bValue = Number(bValue)
      } else if (sortBy === "createdAt") {
        aValue = new Date(aValue).getTime()
        bValue = new Date(bValue).getTime()
      } else {
        aValue = String(aValue).toLowerCase()
        bValue = String(bValue).toLowerCase()
      }
      
      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })
    
    return result
  }, [products, search, sortBy, sortOrder])

  const handleDelete = async (id: string) => {
    const ok = confirm("Delete this product?")
    if (!ok) return
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" })
    if (res.ok) {
      setProducts((prev) => prev.filter((p) => p._id !== id))
      setTotal((t) => Math.max(0, t - 1))
    }
  }

  const handleSelectProduct = (id: string) => {
    setSelectedProducts(prev => 
      prev.includes(id) 
        ? prev.filter(p => p !== id)
        : [...prev, id]
    )
  }

  const handleSelectAll = () => {
    if (selectedProducts.length === filtered.length) {
      setSelectedProducts([])
    } else {
      setSelectedProducts(filtered.map(p => p._id))
    }
  }

  const handleBulkDelete = async () => {
    if (selectedProducts.length === 0) return
    const ok = confirm(`Delete ${selectedProducts.length} products?`)
    if (!ok) return
    
    for (const id of selectedProducts) {
      await fetch(`/api/products/${id}`, { method: "DELETE" })
    }
    
    setProducts((prev) => prev.filter((p) => !selectedProducts.includes(p._id)))
    setTotal((t) => Math.max(0, t - selectedProducts.length))
    setSelectedProducts([])
  }

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(field)
      setSortOrder("asc")
    }
  }

  // Calculate additional statistics
  const additionalStats = useMemo(() => {
    const outOfStock = products.filter(p => p.stock === 0).length
    const featured = products.filter(p => p.featured).length
    const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0)
    
    return { outOfStock, featured, totalValue }
  }, [products])

  return (
    <div className="space-y-8">
      {/* Enhanced Header Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50 dark:from-teal-950/20 dark:via-emerald-950/20 dark:to-cyan-950/20 p-8">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(20,184,166,0.1),transparent_50%),radial-gradient(ellipse_at_bottom_left,rgba(16,185,129,0.1),transparent_50%)] -z-10" />
        
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Badge className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white px-3 py-1 text-sm font-medium">
                <Package className="h-3 w-3 mr-1" />
                Product Management
              </Badge>
              <Badge variant="outline" className="text-xs">
                <Activity className="h-3 w-3 mr-1" />
                {stats.total} Products
              </Badge>
            </div>
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-600 bg-clip-text text-transparent">
              Manage Products
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Oversee your product inventory, track performance, and manage your catalog efficiently.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <ExportImportDialog 
              trigger={
                <Button variant="outline" size="sm" className="rounded-full">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              }
            />
            <ExportImportDialog 
              defaultTab="import"
              trigger={
                <Button variant="outline" size="sm" className="rounded-full">
                  <Upload className="mr-2 h-4 w-4" />
                  Import
                </Button>
              }
            />
            <Button asChild className="rounded-full">
              <Link href="/admin/products/new">
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Link>
            </Button>
          </div>
        </div>
        
        {/* Quick Stats Preview */}
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-5">
          <div className="text-center">
            <div className="text-2xl font-bold text-teal-600">{stats.total}</div>
            <div className="text-xs text-muted-foreground">Total Products</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-600">{stats.published}</div>
            <div className="text-xs text-muted-foreground">Published</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{stats.draft}</div>
            <div className="text-xs text-muted-foreground">Draft</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{stats.lowStock}</div>
            <div className="text-xs text-muted-foreground">Low Stock</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{additionalStats.featured}</div>
            <div className="text-xs text-muted-foreground">Featured</div>
          </div>
        </div>
      </div>

      {/* Enhanced Search and Filter Section */}
      <Card className="group hover:shadow-lg transition-all duration-300">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5 text-teal-600" />
                Search & Filter Products
              </CardTitle>
              <CardDescription>Find and organize your products with advanced filtering options</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="rounded-full"
              >
                <Filter className="mr-2 h-4 w-4" />
                {showFilters ? "Hide Filters" : "Show Filters"}
              </Button>
              <div className="flex items-center border rounded-lg">
                <Button
                  variant={viewMode === "table" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("table")}
                  className="rounded-r-none"
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-l-none"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Main Search Bar */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search products by name, category, or description..."
                  className="pl-10 rounded-full"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-[200px] rounded-full">
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All categories</SelectItem>
                    {categories.map((c) => (
                      <SelectItem key={c._id} value={c.slug}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm" className="rounded-full">
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="grid gap-4 md:grid-cols-6 p-4 bg-muted/30 rounded-lg">
                <div>
                  <label className="text-sm font-medium mb-2 block">Sort By</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="rounded-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">Name</SelectItem>
                      <SelectItem value="price">Price</SelectItem>
                      <SelectItem value="stock">Stock</SelectItem>
                      <SelectItem value="createdAt">Date Created</SelectItem>
                      <SelectItem value="status">Status</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Order</label>
                  <Select value={sortOrder} onValueChange={(value: "asc" | "desc") => setSortOrder(value)}>
                    <SelectTrigger className="rounded-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asc">Ascending</SelectItem>
                      <SelectItem value="desc">Descending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Status</label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="rounded-lg">
                      <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All statuses</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Visibility</label>
                  <Select value={visibilityFilter} onValueChange={setVisibilityFilter}>
                    <SelectTrigger className="rounded-lg">
                      <SelectValue placeholder="All visibility" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All visibility</SelectItem>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                      <SelectItem value="hidden">Hidden</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Stock Status</label>
                  <Select>
                    <SelectTrigger className="rounded-lg">
                      <SelectValue placeholder="All stock levels" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All stock levels</SelectItem>
                      <SelectItem value="in-stock">In Stock</SelectItem>
                      <SelectItem value="low-stock">Low Stock</SelectItem>
                      <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Featured</label>
                  <Select>
                    <SelectTrigger className="rounded-lg">
                      <SelectValue placeholder="All products" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All products</SelectItem>
                      <SelectItem value="featured">Featured only</SelectItem>
                      <SelectItem value="not-featured">Not featured</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Bulk Actions */}
            {selectedProducts.length > 0 && (
              <div className="flex items-center gap-4 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800 dark:text-blue-300">
                    {selectedProducts.length} product{selectedProducts.length > 1 ? 's' : ''} selected
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="rounded-full">
                    <Copy className="mr-2 h-3 w-3" />
                    Duplicate
                  </Button>
                  <Button variant="outline" size="sm" className="rounded-full">
                    <Edit className="mr-2 h-3 w-3" />
                    Edit
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    className="rounded-full"
                    onClick={handleBulkDelete}
                  >
                    <Trash className="mr-2 h-3 w-3" />
                    Delete
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setSelectedProducts([])}
                    className="rounded-full"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Products Table/Grid */}
      <Card className="group hover:shadow-lg transition-all duration-300">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-emerald-600" />
                Products List
              </CardTitle>
              <CardDescription>
                {filtered.length} of {total} products
                {search && ` matching "${search}"`}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                <Clock className="h-3 w-3 mr-1" />
                Updated {new Date().toLocaleTimeString()}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {viewMode === "table" ? (
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-12">
                      <input
                        type="checkbox"
                        checked={selectedProducts.length === filtered.length && filtered.length > 0}
                        onChange={handleSelectAll}
                        className="rounded border-gray-300"
                      />
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/70 transition-colors"
                      onClick={() => handleSort("name")}
                    >
                      <div className="flex items-center gap-2">
                        Product
                        {sortBy === "name" && (
                          sortOrder === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/70 transition-colors"
                      onClick={() => handleSort("category")}
                    >
                      <div className="flex items-center gap-2">
                        Category
                        {sortBy === "category" && (
                          sortOrder === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/70 transition-colors"
                      onClick={() => handleSort("price")}
                    >
                      <div className="flex items-center gap-2">
                        Price
                        {sortBy === "price" && (
                          sortOrder === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/70 transition-colors"
                      onClick={() => handleSort("stock")}
                    >
                      <div className="flex items-center gap-2">
                        Stock
                        {sortBy === "stock" && (
                          sortOrder === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/70 transition-colors"
                      onClick={() => handleSort("status")}
                    >
                      <div className="flex items-center gap-2">
                        Status
                        {sortBy === "status" && (
                          sortOrder === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead>Visibility</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Variants</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={11} className="py-12 text-center">
                        <div className="flex flex-col items-center gap-4">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
                          <div className="text-muted-foreground">Loading products...</div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filtered.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={11} className="py-12 text-center">
                        <div className="flex flex-col items-center gap-4">
                          <Package className="h-12 w-12 text-muted-foreground" />
                          <div>
                            <div className="text-lg font-medium">No products found</div>
                            <div className="text-muted-foreground">
                              {search ? `No products match "${search}"` : "Get started by adding your first product"}
                            </div>
                          </div>
                          {!search && (
                            <Button asChild>
                              <Link href="/admin/products/new">
                                <Plus className="mr-2 h-4 w-4" />
                                Add Product
                              </Link>
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filtered.map((p) => (
                      <TableRow key={p._id} className="group hover:bg-muted/50 transition-colors">
                        <TableCell>
                          <input
                            type="checkbox"
                            checked={selectedProducts.includes(p._id)}
                            onChange={() => handleSelectProduct(p._id)}
                            className="rounded border-gray-300"
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-muted group-hover:scale-105 transition-transform duration-200">
                              <Image
                                src={p.images?.[0] || "/placeholder.jpg"}
                                alt={p.name}
                                width={48}
                                height={48}
                                className="h-full w-full object-cover"
                              />
                              {p.featured && (
                                <div className="absolute -top-1 -right-1">
                                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="font-medium group-hover:text-teal-600 transition-colors">{p.name}</div>
                              <div className="text-xs text-muted-foreground flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {new Date(p.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {p.category}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="font-semibold text-teal-600">${p.price.toFixed(2)}</div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{p.stock}</span>
                            {p.stock <= 10 && p.stock > 0 && (
                              <AlertTriangle className="h-3 w-3 text-yellow-500" />
                            )}
                            {p.stock === 0 && (
                              <AlertTriangle className="h-3 w-3 text-red-500" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${
                              p.status === "published"
                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200"
                                : p.status === "draft"
                                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border-yellow-200"
                                : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300 border-gray-200"
                            }`}
                          >
                            {p.status || "draft"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${
                              p.visibility === "public"
                                ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200"
                                : p.visibility === "private"
                                ? "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 border-orange-200"
                                : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300 border-gray-200"
                            }`}
                          >
                            {p.visibility || "public"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-xs font-mono text-muted-foreground">
                            {p.sku || "N/A"}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {p.variants && p.variants.length > 0 ? (
                              <>
                                <Badge variant="secondary" className="text-xs">
                                  {p.variants.length} variant{p.variants.length > 1 ? 's' : ''}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  ({p.variants.reduce((acc, v) => acc + v.options.length, 0)} options)
                                </span>
                              </>
                            ) : (
                              <span className="text-xs text-muted-foreground">No variants</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="sm" asChild>
                              <Link href={`/admin/products/${p._id}`}>
                                <Eye className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button variant="ghost" size="sm" asChild>
                              <Link href={`/admin/products/${p._id}/edit`}>
                                <Edit className="h-4 w-4" />
                              </Link>
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                  <Link href={`/admin/products/${p._id}`}> 
                                    <Eye className="mr-2 h-4 w-4" /> View Details
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                  <Link href={`/admin/products/${p._id}/edit`}>
                                    <Edit className="mr-2 h-4 w-4" /> Edit Product
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Copy className="mr-2 h-4 w-4" /> Duplicate
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => handleDelete(p._id)}>
                                  <Trash className="mr-2 h-4 w-4" /> Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          ) : (
            // Grid View
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((p) => (
                <Card key={p._id} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      <div className="relative">
                        <div className="aspect-square overflow-hidden rounded-lg bg-muted">
                          <Image
                            src={p.images?.[0] || "/placeholder.jpg"}
                            alt={p.name}
                            width={200}
                            height={200}
                            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-200"
                          />
                        </div>
                        {p.featured && (
                          <div className="absolute top-2 right-2">
                            <Badge className="bg-yellow-500 text-white">
                              <Star className="h-3 w-3 mr-1" />
                              Featured
                            </Badge>
                          </div>
                        )}
                        <div className="absolute top-2 left-2">
                          <input
                            type="checkbox"
                            checked={selectedProducts.includes(p._id)}
                            onChange={() => handleSelectProduct(p._id)}
                            className="rounded border-gray-300"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="font-semibold group-hover:text-teal-600 transition-colors line-clamp-2">
                          {p.name}
                        </h3>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-xs">
                            {p.category}
                          </Badge>
                          <div className="font-semibold text-teal-600">${p.price.toFixed(2)}</div>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Stock: {p.stock}</span>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${
                              p.stock > 10
                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                : p.stock > 0
                                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                                : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                            }`}
                          >
                            {p.stock > 10 ? "In Stock" : p.stock > 0 ? "Low Stock" : "Out of Stock"}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="flex-1" asChild>
                          <Link href={`/admin/products/${p._id}`}>
                            <Eye className="mr-2 h-3 w-3" />
                            View
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1" asChild>
                          <Link href={`/admin/products/${p._id}/edit`}>
                            <Edit className="mr-2 h-3 w-3" />
                            Edit
                          </Link>
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                              <MoreHorizontal className="h-3 w-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Copy className="mr-2 h-4 w-4" /> Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => handleDelete(p._id)}>
                              <Trash className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Enhanced Pagination */}
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total} products
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                disabled={page === 1} 
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="rounded-full"
              >
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
                      className="rounded-full w-8 h-8 p-0"
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
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
