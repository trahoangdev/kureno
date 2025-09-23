"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { 
  Search, 
  MoreHorizontal, 
  Edit, 
  Trash, 
  Plus,
  Tags,
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
  ExternalLink,
  Eye,
  Filter,
  Package,
  Hash,
  FileText,
  Globe,
  Link as LinkIcon,
  Bookmark,
  Archive,
  Folder,
  FolderOpen
} from "lucide-react"

interface CategoryItem { 
  _id: string
  name: string
  slug: string
  description?: string
  productCount?: number
  createdAt?: string
  updatedAt?: string
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryItem[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<CategoryItem | null>(null)
  const [form, setForm] = useState({ name: "", slug: "", description: "" })
  const [error, setError] = useState("")
  const [viewMode, setViewMode] = useState<"table" | "grid">("table")
  const [sortBy, setSortBy] = useState("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (search) params.set("q", search)
    const res = await fetch(`/api/categories?${params.toString()}`)
    const data = await res.json()
    setCategories(data.categories)
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [])
  useEffect(() => { const t = setTimeout(fetchData, 300); return () => clearTimeout(t) }, [search])

  const filtered = useMemo(() => {
    let result = categories
    
    // Apply search filter
    if (search) {
      result = result.filter((c) => 
        [c.name, c.slug, c.description || ""].some((v) => 
          v.toLowerCase().includes(search.toLowerCase())
        )
      )
    }
    
    // Apply sorting
    result = [...result].sort((a, b) => {
      let aValue: any = a[sortBy as keyof CategoryItem]
      let bValue: any = b[sortBy as keyof CategoryItem]
      
      if (sortBy === "productCount") {
        aValue = Number(aValue) || 0
        bValue = Number(bValue) || 0
      } else if (sortBy === "createdAt" || sortBy === "updatedAt") {
        aValue = new Date(aValue || "").getTime()
        bValue = new Date(bValue || "").getTime()
      } else {
        aValue = String(aValue || "").toLowerCase()
        bValue = String(bValue || "").toLowerCase()
      }
      
      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })
    
    return result
  }, [categories, search, sortBy, sortOrder])

  const openCreate = () => { setEditing(null); setForm({ name: "", slug: "", description: "" }); setError(""); setOpen(true) }
  const openEdit = (c: CategoryItem) => { setEditing(c); setForm({ name: c.name, slug: c.slug, description: c.description || "" }); setError(""); setOpen(true) }

  const onSave = async () => {
    if (!form.name.trim() || !form.slug.trim()) { setError("Name and slug are required"); return }
    const nameExists = categories.some((c) => c.name.toLowerCase() === form.name.trim().toLowerCase() && (!editing || c._id !== editing._id))
    if (nameExists) { setError("Name already exists"); return }
    const slugExists = categories.some((c) => c.slug.toLowerCase() === form.slug.trim().toLowerCase() && (!editing || c._id !== editing._id))
    if (slugExists) { setError("Slug already exists"); return }
    const payload = { name: form.name.trim(), slug: form.slug.trim().toLowerCase(), description: form.description.trim() }
    const res = await fetch(editing ? `/api/categories/${editing._id}` : "/api/categories", {
      method: editing ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    if (!res.ok) { setError("Failed to save"); return }
    setOpen(false); fetchData()
  }

  const onDelete = async (id: string) => {
    if (!confirm("Delete this category?")) return
    const res = await fetch(`/api/categories/${id}`, { method: "DELETE" })
    if (res.ok) fetchData()
  }

  const handleSelectCategory = (id: string) => {
    setSelectedCategories(prev => 
      prev.includes(id) 
        ? prev.filter(c => c !== id)
        : [...prev, id]
    )
  }

  const handleSelectAll = () => {
    if (selectedCategories.length === filtered.length) {
      setSelectedCategories([])
    } else {
      setSelectedCategories(filtered.map(c => c._id))
    }
  }

  const handleBulkDelete = async () => {
    if (selectedCategories.length === 0) return
    const ok = confirm(`Delete ${selectedCategories.length} categories?`)
    if (!ok) return
    
    for (const id of selectedCategories) {
      await fetch(`/api/categories/${id}`, { method: "DELETE" })
    }
    
    setCategories((prev) => prev.filter((c) => !selectedCategories.includes(c._id)))
    setSelectedCategories([])
  }

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(field)
      setSortOrder("asc")
    }
  }

  // Calculate statistics
  const stats = useMemo(() => {
    const totalCategories = categories.length
    const categoriesWithProducts = categories.filter(c => (c.productCount || 0) > 0).length
    const emptyCategories = categories.filter(c => (c.productCount || 0) === 0).length
    const totalProducts = categories.reduce((sum, c) => sum + (c.productCount || 0), 0)
    
    return { totalCategories, categoriesWithProducts, emptyCategories, totalProducts }
  }, [categories])

  return (
    <div className="space-y-8">
      {/* Enhanced Header Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 dark:from-purple-950/20 dark:via-indigo-950/20 dark:to-blue-950/20 p-8">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(139,92,246,0.1),transparent_50%),radial-gradient(ellipse_at_bottom_left,rgba(99,102,241,0.1),transparent_50%)] -z-10" />
        
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Badge className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-3 py-1 text-sm font-medium">
                <Tags className="h-3 w-3 mr-1" />
                Category Management
              </Badge>
              <Badge variant="outline" className="text-xs">
                <Activity className="h-3 w-3 mr-1" />
                {stats.totalCategories} Categories
              </Badge>
            </div>
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent">
              Manage Categories
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Organize your products with categories, create hierarchies, and manage your catalog structure efficiently.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="rounded-full">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button variant="outline" size="sm" className="rounded-full">
              <Upload className="mr-2 h-4 w-4" />
              Import
            </Button>
            <Button onClick={openCreate} className="rounded-full">
              <Plus className="mr-2 h-4 w-4" />
              New Category
            </Button>
          </div>
        </div>
        
        {/* Quick Stats Preview */}
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.totalCategories}</div>
            <div className="text-xs text-muted-foreground">Total Categories</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-600">{stats.categoriesWithProducts}</div>
            <div className="text-xs text-muted-foreground">With Products</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.emptyCategories}</div>
            <div className="text-xs text-muted-foreground">Empty</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.totalProducts}</div>
            <div className="text-xs text-muted-foreground">Total Products</div>
          </div>
        </div>
      </div>

      {/* Enhanced Search and Filter Section */}
      <Card className="group hover:shadow-lg transition-all duration-300">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5 text-purple-600" />
                Search & Filter Categories
              </CardTitle>
              <CardDescription>Find and organize your categories with advanced filtering options</CardDescription>
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
                  placeholder="Search categories by name, slug, or description..."
                  className="pl-10 rounded-full"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="rounded-full">
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="grid gap-4 md:grid-cols-3 p-4 bg-muted/30 rounded-lg">
                <div>
                  <label className="text-sm font-medium mb-2 block">Sort By</label>
                  <select 
                    value={sortBy} 
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="name">Name</option>
                    <option value="slug">Slug</option>
                    <option value="productCount">Product Count</option>
                    <option value="createdAt">Date Created</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Order</label>
                  <select 
                    value={sortOrder} 
                    onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Status</label>
                  <select className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                    <option value="all">All categories</option>
                    <option value="with-products">With products</option>
                    <option value="empty">Empty categories</option>
                  </select>
                </div>
              </div>
            )}

            {/* Bulk Actions */}
            {selectedCategories.length > 0 && (
              <div className="flex items-center gap-4 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800 dark:text-blue-300">
                    {selectedCategories.length} categor{selectedCategories.length > 1 ? 'ies' : 'y'} selected
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
                    onClick={() => setSelectedCategories([])}
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

      {/* Enhanced Categories Table/Grid */}
      <Card className="group hover:shadow-lg transition-all duration-300">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Tags className="h-5 w-5 text-indigo-600" />
                Categories List
              </CardTitle>
              <CardDescription>
                {filtered.length} of {categories.length} categories
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
                        checked={selectedCategories.length === filtered.length && filtered.length > 0}
                        onChange={handleSelectAll}
                        className="rounded border-gray-300"
                      />
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/70 transition-colors"
                      onClick={() => handleSort("name")}
                    >
                      <div className="flex items-center gap-2">
                        Name
                        {sortBy === "name" && (
                          sortOrder === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/70 transition-colors"
                      onClick={() => handleSort("slug")}
                    >
                      <div className="flex items-center gap-2">
                        Slug
                        {sortBy === "slug" && (
                          sortOrder === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/70 transition-colors"
                      onClick={() => handleSort("productCount")}
                    >
                      <div className="flex items-center gap-2">
                        Products
                        {sortBy === "productCount" && (
                          sortOrder === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="py-12 text-center">
                        <div className="flex flex-col items-center gap-4">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                          <div className="text-muted-foreground">Loading categories...</div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filtered.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="py-12 text-center">
                        <div className="flex flex-col items-center gap-4">
                          <Tags className="h-12 w-12 text-muted-foreground" />
                          <div>
                            <div className="text-lg font-medium">No categories found</div>
                            <div className="text-muted-foreground">
                              {search ? `No categories match "${search}"` : "Get started by creating your first category"}
                            </div>
                          </div>
                          {!search && (
                            <Button onClick={openCreate}>
                              <Plus className="mr-2 h-4 w-4" />
                              Create Category
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filtered.map((c) => (
                      <TableRow key={c._id} className="group hover:bg-muted/50 transition-colors">
                        <TableCell>
                          <input
                            type="checkbox"
                            checked={selectedCategories.includes(c._id)}
                            onChange={() => handleSelectCategory(c._id)}
                            className="rounded border-gray-300"
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30">
                              <Folder className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                              <div className="font-medium group-hover:text-purple-600 transition-colors">{c.name}</div>
                              {c.createdAt && (
                                <div className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {new Date(c.createdAt).toLocaleDateString()}
                                </div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <LinkIcon className="h-3 w-3 text-muted-foreground" />
                            <code className="text-xs bg-muted px-2 py-1 rounded">/{c.slug}</code>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-[300px]">
                            {c.description ? (
                              <p className="text-sm text-muted-foreground line-clamp-2">{c.description}</p>
                            ) : (
                              <span className="text-xs text-muted-foreground italic">No description</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${
                                (c.productCount || 0) > 0
                                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200"
                                  : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300 border-gray-200"
                              }`}
                            >
                              {c.productCount || 0} products
                            </Badge>
                            {(c.productCount || 0) === 0 && (
                              <AlertTriangle className="h-3 w-3 text-yellow-500" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="sm" onClick={() => openEdit(c)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => openEdit(c)}>
                                  <Edit className="mr-2 h-4 w-4" /> Edit Category
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Copy className="mr-2 h-4 w-4" /> Duplicate
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => onDelete(c._id)}>
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
              {filtered.map((c) => (
                <Card key={c._id} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 group-hover:scale-110 transition-transform duration-200">
                          <Folder className="h-6 w-6 text-purple-600" />
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={selectedCategories.includes(c._id)}
                            onChange={() => handleSelectCategory(c._id)}
                            className="rounded border-gray-300"
                          />
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => openEdit(c)}>
                                <Edit className="mr-2 h-4 w-4" /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Copy className="mr-2 h-4 w-4" /> Duplicate
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => onDelete(c._id)}>
                                <Trash className="mr-2 h-4 w-4" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <h3 className="font-semibold group-hover:text-purple-600 transition-colors line-clamp-2">
                            {c.name}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <LinkIcon className="h-3 w-3 text-muted-foreground" />
                            <code className="text-xs bg-muted px-2 py-1 rounded">/{c.slug}</code>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          {c.description ? (
                            <p className="text-sm text-muted-foreground line-clamp-3">{c.description}</p>
                          ) : (
                            <p className="text-xs text-muted-foreground italic">No description</p>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${
                              (c.productCount || 0) > 0
                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
                            }`}
                          >
                            {c.productCount || 0} products
                          </Badge>
                          {(c.productCount || 0) === 0 && (
                            <AlertTriangle className="h-4 w-4 text-yellow-500" />
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="flex-1" onClick={() => openEdit(c)}>
                          <Edit className="mr-2 h-3 w-3" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Eye className="mr-2 h-3 w-3" />
                          View
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Enhanced Dialog Form */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30">
                <Tags className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <DialogTitle className="text-xl">
                  {editing ? "Edit Category" : "Create New Category"}
                </DialogTitle>
                <DialogDescription>
                  {editing ? "Update the category information below" : "Fill in the details to create a new category"}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          
          {error && (
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <span className="text-sm text-red-800 dark:text-red-300">{error}</span>
              </div>
            </div>
          )}
          
          <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Hash className="h-4 w-4" />
                  Category Name
                </Label>
                <Input 
                  value={form.name} 
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Enter category name..."
                  className="rounded-lg"
                />
                <p className="text-xs text-muted-foreground">This will be displayed to customers</p>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <LinkIcon className="h-4 w-4" />
                  URL Slug
                </Label>
                <Input 
                  value={form.slug} 
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  placeholder="category-slug"
                  className="rounded-lg"
                />
                <p className="text-xs text-muted-foreground">Used in URLs: /categories/{form.slug || "category-slug"}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Description
              </Label>
              <Textarea 
                value={form.description} 
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Enter a description for this category..."
                className="rounded-lg min-h-[100px]"
              />
              <p className="text-xs text-muted-foreground">Optional description to help organize your categories</p>
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="text-sm text-muted-foreground">
                {editing ? "Last updated: " + new Date().toLocaleDateString() : "Category will be created immediately"}
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setOpen(false)} className="rounded-full">
                  Cancel
                </Button>
                <Button onClick={onSave} className="rounded-full">
                  {editing ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Create Category
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}


