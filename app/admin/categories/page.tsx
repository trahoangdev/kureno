"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, MoreHorizontal, Edit, Trash, Plus } from "lucide-react"

interface CategoryItem { _id: string; name: string; slug: string; description?: string }

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryItem[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<CategoryItem | null>(null)
  const [form, setForm] = useState({ name: "", slug: "", description: "" })
  const [error, setError] = useState("")

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
    if (!search) return categories
    return categories.filter((c) => [c.name, c.slug, c.description || ""].some((v) => v.toLowerCase().includes(search.toLowerCase())))
  }, [categories, search])

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

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
        <Button onClick={openCreate}><Plus className="mr-2 h-4 w-4" /> New Category</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Category Management</CardTitle>
          <CardDescription>Create, edit, and delete product categories</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search categories..." className="w-full pl-8" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={4} className="py-8 text-center text-muted-foreground">Loading...</TableCell></TableRow>
                ) : filtered.length === 0 ? (
                  <TableRow><TableCell colSpan={4} className="py-8 text-center text-muted-foreground">No categories</TableCell></TableRow>
                ) : (
                  filtered.map((c) => (
                    <TableRow key={c._id}>
                      <TableCell className="font-medium">{c.name}</TableCell>
                      <TableCell>/{c.slug}</TableCell>
                      <TableCell className="truncate max-w-[400px]">{c.description}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /><span className="sr-only">Actions</span></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openEdit(c)}><Edit className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => onDelete(c._id)}><Trash className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Category" : "New Category"}</DialogTitle>
            <DialogDescription>{editing ? "Update this category" : "Create a new category"}</DialogDescription>
          </DialogHeader>
          {error && <div className="text-sm text-destructive">${"" + error}</div>}
          <div className="space-y-3">
            <div className="space-y-1">
              <Label>Name</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label>Slug</Label>
              <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label>Description</Label>
              <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={onSave}>{editing ? "Save Changes" : "Create"}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}


