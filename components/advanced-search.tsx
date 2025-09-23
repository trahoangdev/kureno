"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, Clock, TrendingUp, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"

interface SearchResult {
  id: string
  title: string
  description: string
  href: string
  type: "product" | "blog" | "page"
  category?: string
  price?: number
  image?: string
}

interface AdvancedSearchProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export default function AdvancedSearch({ isOpen, onOpenChange }: AdvancedSearchProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [popularSearches] = useState([
    "laptop", "smartphone", "headphones", "camera", "watch"
  ])

  // Mock search results - in a real app, this would come from an API
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])

  useEffect(() => {
    // Load recent searches from localStorage
    const saved = localStorage.getItem("recent-searches")
    if (saved) {
      setRecentSearches(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    if (searchQuery.length > 2) {
      // Mock search results
      const mockResults: SearchResult[] = [
        {
          id: "1",
          title: "MacBook Pro 16-inch",
          description: "Latest MacBook Pro with M3 chip",
          href: "/products/1",
          type: "product",
          category: "Electronics",
          price: 2499,
          image: "/placeholder.jpg"
        },
        {
          id: "2",
          title: "How to Build Better UX",
          description: "Learn the fundamentals of user experience design",
          href: "/blog/2",
          type: "blog",
          category: "Design"
        },
        {
          id: "3",
          title: "About Us",
          description: "Learn more about our company and mission",
          href: "/about",
          type: "page"
        }
      ].filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
      
      setSearchResults(mockResults)
    } else {
      setSearchResults([])
    }
  }, [searchQuery])

  const handleSearch = (query: string) => {
    if (query.trim()) {
      // Add to recent searches
      const newRecent = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5)
      setRecentSearches(newRecent)
      localStorage.setItem("recent-searches", JSON.stringify(newRecent))
      
      // Navigate to search results page
      router.push(`/search?q=${encodeURIComponent(query)}`)
      onOpenChange(false)
    }
  }

  const clearRecentSearches = () => {
    setRecentSearches([])
    localStorage.removeItem("recent-searches")
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "product":
        return "🛍️"
      case "blog":
        return "📝"
      case "page":
        return "📄"
      default:
        return "🔍"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "product":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
      case "blog":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
      case "page":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
    }
  }

  return (
    <CommandDialog open={isOpen} onOpenChange={onOpenChange}>
      <CommandInput 
        placeholder="Search products, blog posts, or pages..." 
        value={searchQuery}
        onValueChange={setSearchQuery}
        className="border-0 focus:ring-0"
      />
      <CommandList className="max-h-[400px]">
        {searchQuery.length === 0 ? (
          <>
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <CommandGroup heading="Recent Searches">
                {recentSearches.map((search, index) => (
                  <CommandItem
                    key={index}
                    onSelect={() => handleSearch(search)}
                    className="flex items-center gap-3"
                  >
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{search}</span>
                  </CommandItem>
                ))}
                <CommandItem onSelect={clearRecentSearches} className="text-muted-foreground">
                  Clear recent searches
                </CommandItem>
              </CommandGroup>
            )}

            {/* Popular Searches */}
            <CommandGroup heading="Popular Searches">
              {popularSearches.map((search, index) => (
                <CommandItem
                  key={index}
                  onSelect={() => handleSearch(search)}
                  className="flex items-center gap-3"
                >
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  <span>{search}</span>
                </CommandItem>
              ))}
            </CommandGroup>

            {/* Quick Links */}
            <CommandGroup heading="Quick Links">
              <CommandItem onSelect={() => router.push("/products")}>
                🛍️ Browse Products
              </CommandItem>
              <CommandItem onSelect={() => router.push("/blog")}>
                📝 Read Blog
              </CommandItem>
              <CommandItem onSelect={() => router.push("/about")}>
                ℹ️ About Us
              </CommandItem>
              <CommandItem onSelect={() => router.push("/contact")}>
                📞 Contact
              </CommandItem>
            </CommandGroup>
          </>
        ) : (
          <>
            {searchResults.length > 0 ? (
              <CommandGroup heading="Search Results">
                {searchResults.map((result) => (
                  <CommandItem
                    key={result.id}
                    onSelect={() => {
                      router.push(result.href)
                      onOpenChange(false)
                    }}
                    className="flex items-start gap-3 p-3"
                  >
                    <div className="flex-shrink-0 text-lg">
                      {getTypeIcon(result.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium truncate">{result.title}</span>
                        <Badge 
                          variant="secondary" 
                          className={`text-xs ${getTypeColor(result.type)}`}
                        >
                          {result.type}
                        </Badge>
                        {result.category && (
                          <Badge variant="outline" className="text-xs">
                            {result.category}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {result.description}
                      </p>
                      {result.price && (
                        <p className="text-sm font-medium text-primary mt-1">
                          ${result.price}
                        </p>
                      )}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            ) : (
              <CommandEmpty>
                <div className="text-center py-6">
                  <Search className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">No results found for "{searchQuery}"</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Try different keywords or check your spelling
                  </p>
                </div>
              </CommandEmpty>
            )}
          </>
        )}
      </CommandList>
    </CommandDialog>
  )
}
