"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"

export default function EditProductPage() {
  const params = useParams() as { id: string }
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    featured: false,
    images: [""] as string[],
  })
  const [categories, setCategories] = useState<{ _id: string; name: string; slug: string }[]>([])

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true)
      const res = await fetch(`/api/products/${params.id}`)
      if (!res.ok) {
        setError("Failed to load product")
        setLoading(false)
        return
      }
      const p = await res.json()
      setForm({
        name: p.name || "",
        description: p.description || "",
        price: String(p.price ?? ""),
        category: p.category || "",
        stock: String(p.stock ?? ""),
        featured: !!p.featured,
        images: p.images?.length ? p.images : [""],
      })
      setLoading(false)
    }
    fetchProduct()
  }, [params.id])

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

  const updateField = (key: keyof typeof form, value: any) => setForm((f) => ({ ...f, [key]: value }))
  const changeImage = (idx: number, value: string) => {
    const next = [...form.images]
    next[idx] = value
    updateField("images", next)
  }
  const addImage = () => updateField("images", [...form.images, ""])
  const removeImage = (idx: number) => updateField("images", form.images.filter((_, i) => i !== idx))

  const validate = () => {
    if (!form.name.trim()) return "Name is required"
    if (!form.category.trim()) return "Category is required"
    const price = Number(form.price)
    if (Number.isNaN(price) || price < 0) return "Price must be a positive number"
    const stock = Number(form.stock)
    if (Number.isNaN(stock) || stock < 0) return "Stock must be a non-negative integer"
    const images = form.images.map((s) => s.trim()).filter(Boolean)
    if (!images.length) return "At least one image URL is required"
    return ""
  }

  const onSave = async () => {
    const msg = validate()
    if (msg) {
      setError(msg)
      return
    }
    setSaving(true)
    setError("")
    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      category: form.category.trim(),
      stock: Number(form.stock),
      featured: form.featured,
      images: form.images.map((s) => s.trim()).filter(Boolean),
    }
    const res = await fetch(`/api/products/${params.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    setSaving(false)
    if (!res.ok) {
      setError("Failed to save")
      return
    }
    router.push(`/admin/products/${params.id}`)
  }

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Edit Product</CardTitle>
          <CardDescription>Update product information and media</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && <div className="text-sm text-destructive">{error}</div>}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={form.name} onChange={(e) => updateField("name", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={form.category} onValueChange={(v) => updateField("category", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c._id} value={c.slug}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Description</Label>
              <Textarea value={form.description} onChange={(e) => updateField("description", e.target.value)} rows={5} />
            </div>
            <div className="space-y-2">
              <Label>Price</Label>
              <Input type="number" min="0" step="0.01" value={form.price} onChange={(e) => updateField("price", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Stock</Label>
              <Input type="number" min="0" value={form.stock} onChange={(e) => updateField("stock", e.target.value)} />
            </div>
          </div>

          <div className="space-y-3">
            <Label>Images</Label>
            <div className="grid gap-3 md:grid-cols-3">
              {form.images.map((src, i) => (
                <div key={i} className="space-y-2">
                  <div className="overflow-hidden rounded-md border">
                    <Image src={src || "/placeholder.jpg"} alt={`Image ${i + 1}`} width={400} height={300} className="h-40 w-full object-cover" />
                  </div>
                  <Input value={src} onChange={(e) => changeImage(i, e.target.value)} placeholder="Image URL" />
                  <div className="flex gap-2">
                    {i === form.images.length - 1 && (
                      <Button type="button" variant="outline" size="sm" onClick={addImage}>Add</Button>
                    )}
                    {form.images.length > 1 && (
                      <Button type="button" variant="outline" size="sm" onClick={() => removeImage(i)}>Remove</Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
            <Button onClick={onSave} disabled={saving}>{saving ? "Saving..." : "Save Changes"}</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


