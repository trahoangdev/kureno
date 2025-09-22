"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEffect, useMemo, useState } from "react"

export default function ProductsClient() {
  const [products, setProducts] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [limit] = useState(12)
  const [search, setSearch] = useState("")
  const [categories, setCategories] = useState<{ _id: string; name: string; slug: string }[]>([])
  const [categoryFilter, setCategoryFilter] = useState("all")

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
      const params = new URLSearchParams({ limit: String(limit), page: String(page) })
      if (categoryFilter !== "all") params.set("category", categoryFilter)
      const res = await fetch(`/api/products?${params.toString()}`)
      const data = await res.json()
      setProducts(data.products || [])
      setTotal(data.pagination?.total || 0)
    }
    fetchData()
  }, [page, limit, categoryFilter])

  const filtered = useMemo(() => {
    if (!search) return products
    return products.filter((p) => p.name?.toLowerCase().includes(search.toLowerCase()))
  }, [products, search])

  return (
    <div className="flex flex-col min-h-screen">
      <section className="relative pt-24 md:pt-32 pb-16 md:pb-24">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-950/20 dark:to-emerald-950/20 -z-10" />
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Our Products</h1>
            <p className="text-xl text-muted-foreground">
              Discover our collection of locally crafted, high-quality products
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">All Products</h2>
              <p className="text-muted-foreground">Showing {Math.min(page * limit, total)} of {total} products</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <input
                  className="h-9 w-[220px] rounded-md border bg-background px-3 text-sm"
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[180px]"><SelectValue placeholder="All categories" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All categories</SelectItem>
                  {categories.map((c) => (
                    <SelectItem key={c._id} value={c.slug}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((p, index) => (
              <Link
                key={index}
                href={`/products/${p._id}`}
                className="group block overflow-hidden rounded-lg border bg-background transition-all hover:shadow-md"
              >
                <div className="relative h-[300px] overflow-hidden">
                  <Image
                    src={p.images?.[0] || "/placeholder.jpg"}
                    alt={p.name}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-medium">{p.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">(24 reviews)</span>
                  </div>
                  <p className="mt-2 font-medium">${p.price?.toFixed?.(2) ?? p.price}</p>
                </div>
              </Link>
            ))}
          </div>

          <div className="flex justify-center mt-12">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
                Previous
              </Button>
              <Button variant="outline" size="sm" disabled={page * limit >= total} onClick={() => setPage((p) => p + 1)}>
                Next
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}


