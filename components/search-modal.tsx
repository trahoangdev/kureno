"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { 
  Search, 
  Package, 
  FileText, 
  FolderOpen,
  Loader2,
  Clock,
  TrendingUp,
  X
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { formatPrice } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"

interface SearchResult {
  id: string
  type: "product" | "blog" | "category"
  title: string
  description: string
  url: string
  image?: string
  price?: number
  category?: string
  author?: string
  publishedAt?: string
  readingTime?: number
  featured?: boolean
  discount?: number
}

interface SearchResults {
  products: SearchResult[]
  blogs: SearchResult[]
  categories: SearchResult[]
  total: number
}

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

const getResultIcon = (type: string) => {
  switch (type) {
    case "product":
      return Package
    case "blog":
      return FileText
    case "category":
      return FolderOpen
    default:
      return Search
  }
}

const recentSearches = [
  "iPhone 15",
  "MacBook Air",
  "Heritage crafts",
  "Traditional art",
  "Handmade jewelry"
]

const trendingSearches = [
  "Premium collection",
  "Sale items",
  "New arrivals",
  "Featured products",
  "Blog tutorials"
]

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResults>({
    products: [],
    blogs: [],
    categories: [],
    total: 0
  })
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const [searchHistory, setSearchHistory] = useState<string[]>([])

  useEffect(() => {
    if (isOpen) {
      // Focus input when modal opens
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)

      // Load search history from localStorage
      const history = localStorage.getItem("searchHistory")
      if (history) {
        try {
          setSearchHistory(JSON.parse(history))
        } catch (error) {
          console.error("Error parsing search history:", error)
        }
      }
    } else {
      // Reset state when modal closes
      setQuery("")
      setResults({
        products: [],
        blogs: [],
        categories: [],
        total: 0
      })
      setActiveTab("all")
    }
  }, [isOpen])

  useEffect(() => {
    if (query.length >= 2) {
      const debounceTimer = setTimeout(() => {
        performSearch(query)
      }, 300)

      return () => clearTimeout(debounceTimer)
    } else {
      setResults({
        products: [],
        blogs: [],
        categories: [],
        total: 0
      })
    }
  }, [query])

  const performSearch = async (searchQuery: string) => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&limit=15`)
      
      if (response.ok) {
        const data = await response.json()
        setResults(data.results)
      } else {
        console.error("Search failed")
      }
    } catch (error) {
      console.error("Error performing search:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearchSubmit = (searchQuery: string) => {
    if (searchQuery.trim()) {
      // Add to search history
      const newHistory = [searchQuery, ...searchHistory.filter(h => h !== searchQuery)].slice(0, 10)
      setSearchHistory(newHistory)
      localStorage.setItem("searchHistory", JSON.stringify(newHistory))

      // Navigate to search results page
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
      onClose()
    }
  }

  const handleResultClick = (result: SearchResult) => {
    // Add to search history
    const newHistory = [result.title, ...searchHistory.filter(h => h !== result.title)].slice(0, 10)
    setSearchHistory(newHistory)
    localStorage.setItem("searchHistory", JSON.stringify(newHistory))

    router.push(result.url)
    onClose()
  }

  const clearSearchHistory = () => {
    setSearchHistory([])
    localStorage.removeItem("searchHistory")
  }

  const renderSearchResult = (result: SearchResult) => {
    const Icon = getResultIcon(result.type)

    return (
      <div
        key={result.id}
        onClick={() => handleResultClick(result)}
        className="flex items-start gap-3 p-3 hover:bg-muted/50 cursor-pointer rounded-lg transition-colors"
      >
        <div className="relative w-12 h-12 flex-shrink-0 overflow-hidden rounded-md bg-muted">
          {result.image ? (
            <Image
              src={result.image}
              alt={result.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Icon className="h-5 w-5 text-muted-foreground" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-sm font-medium line-clamp-1">
              {result.title}
            </h4>
            <div className="flex items-center gap-1 flex-shrink-0">
              {result.featured && (
                <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                  Featured
                </Badge>
              )}
              {result.discount && result.discount > 0 && (
                <Badge variant="destructive" className="text-xs">
                  -{result.discount}%
                </Badge>
              )}
            </div>
          </div>

          <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
            {result.description}
          </p>

          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Icon className="h-3 w-3" />
              <span className="capitalize">{result.type}</span>
              {result.category && (
                <>
                  <span>•</span>
                  <span>{result.category}</span>
                </>
              )}
            </div>

            {result.price && (
              <div className="text-sm font-medium">
                {formatPrice(result.price)}
              </div>
            )}

            {result.publishedAt && (
              <div className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(result.publishedAt), { addSuffix: true })}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  const renderEmptyState = () => (
    <div className="py-8 px-4">
      <div className="text-center">
        <Search className="h-8 w-8 mx-auto text-muted-foreground mb-3" />
        <h3 className="text-sm font-medium mb-2">Start typing to search</h3>
        <p className="text-xs text-muted-foreground mb-6">
          Search for products, blog posts, and categories
        </p>

        {searchHistory.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Recent Searches
              </h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSearchHistory}
                className="text-xs h-auto p-1"
              >
                Clear
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {searchHistory.slice(0, 5).map((search, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="cursor-pointer hover:bg-muted"
                  onClick={() => setQuery(search)}
                >
                  {search}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div>
          <h4 className="text-xs font-medium text-muted-foreground mb-3 flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            Trending Searches
          </h4>
          <div className="flex flex-wrap gap-2">
            {trendingSearches.map((search, index) => (
              <Badge
                key={index}
                variant="outline"
                className="cursor-pointer hover:bg-muted"
                onClick={() => setQuery(search)}
              >
                {search}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] p-0">
        <DialogHeader className="p-4 pb-0">
          <DialogTitle className="sr-only">Search</DialogTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              ref={inputRef}
              placeholder="Search products, blogs, categories..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearchSubmit(query)
                }
              }}
              className="pl-10 pr-10 h-12 text-base"
            />
            {query && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setQuery("")}
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </DialogHeader>

        <div className="px-4">
          {query.length >= 2 ? (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all" className="text-xs">
                  All ({results.total})
                </TabsTrigger>
                <TabsTrigger value="products" className="text-xs">
                  Products ({results.products.length})
                </TabsTrigger>
                <TabsTrigger value="blogs" className="text-xs">
                  Blogs ({results.blogs.length})
                </TabsTrigger>
                <TabsTrigger value="categories" className="text-xs">
                  Categories ({results.categories.length})
                </TabsTrigger>
              </TabsList>

              <ScrollArea className="h-96 mt-4">
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <>
                    <TabsContent value="all" className="mt-0">
                      {results.total === 0 ? (
                        <div className="text-center py-8">
                          <Search className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground">No results found</p>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          {results.products.slice(0, 5).map(renderSearchResult)}
                          {results.products.length > 0 && results.blogs.length > 0 && <Separator />}
                          {results.blogs.slice(0, 3).map(renderSearchResult)}
                          {(results.products.length > 0 || results.blogs.length > 0) && results.categories.length > 0 && <Separator />}
                          {results.categories.slice(0, 2).map(renderSearchResult)}
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="products" className="mt-0">
                      {results.products.length === 0 ? (
                        <div className="text-center py-8">
                          <Package className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground">No products found</p>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          {results.products.map(renderSearchResult)}
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="blogs" className="mt-0">
                      {results.blogs.length === 0 ? (
                        <div className="text-center py-8">
                          <FileText className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground">No blog posts found</p>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          {results.blogs.map(renderSearchResult)}
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="categories" className="mt-0">
                      {results.categories.length === 0 ? (
                        <div className="text-center py-8">
                          <FolderOpen className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground">No categories found</p>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          {results.categories.map(renderSearchResult)}
                        </div>
                      )}
                    </TabsContent>
                  </>
                )}
              </ScrollArea>

              {results.total > 0 && (
                <div className="p-3 border-t">
                  <Button
                    onClick={() => handleSearchSubmit(query)}
                    className="w-full"
                    variant="outline"
                  >
                    View all results for "{query}"
                  </Button>
                </div>
              )}
            </Tabs>
          ) : (
            renderEmptyState()
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
