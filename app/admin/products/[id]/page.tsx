"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

interface ProductItem {
  _id: string
  name: string
  description: string
  price: number
  images: string[]
  category: string
  stock: number
  featured: boolean
  createdAt: string
}

export default function ProductDetailPage() {
  const params = useParams() as { id: string }
  const router = useRouter()
  const [product, setProduct] = useState<ProductItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const res = await fetch(`/api/products/${params.id}`)
      if (!res.ok) {
        setError("Failed to load product")
        setLoading(false)
        return
      }
      const data = await res.json()
      setProduct(data)
      setLoading(false)
    }
    fetchData()
  }, [params.id])

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  if (error || !product) {
    return <div className="text-sm text-destructive">{error || "Product not found"}</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">{product.name}</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href={`/admin/products/${product._id}/edit`}>Edit</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/admin/products">Back</Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Overview</CardTitle>
          <CardDescription>Product details and current status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">{product.category}</Badge>
                {product.featured && <Badge className="bg-green-500">Featured</Badge>}
                <Badge variant={product.stock > 0 ? "default" : "secondary"}>{product.stock > 0 ? `In stock: ${product.stock}` : "Out of stock"}</Badge>
              </div>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{product.description}</p>
              <div className="text-lg font-semibold">${product.price.toFixed(2)}</div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {product.images?.map((src, i) => (
                <div key={i} className="overflow-hidden rounded-md border">
                  <Image src={src || "/placeholder.jpg"} alt={product.name} width={300} height={300} className="h-28 w-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


