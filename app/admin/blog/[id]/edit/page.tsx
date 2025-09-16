"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"

export default function EditBlogPostPage() {
  const params = useParams() as { id: string }
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [showPreview, setShowPreview] = useState(false)
  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    coverImage: "/placeholder.jpg",
    content: "",
    tags: "",
    published: false,
  })

  const editor = useEditor({
    extensions: [StarterKit],
    content: form.content,
    onUpdate: ({ editor }: { editor: any }) => {
      setForm((f) => ({ ...f, content: editor.getHTML() }))
    },
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "prose prose-sm dark:prose-invert focus:outline-none min-h-[240px] p-3 border rounded-md",
      },
    },
  })

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true)
      const res = await fetch(`/api/blog/${params.id}`)
      if (!res.ok) {
        setError("Failed to load post")
        setLoading(false)
        return
      }
      const data = await res.json()
      const p = data.post
      setForm({
        title: p.title || "",
        slug: p.slug || "",
        excerpt: p.excerpt || "",
        coverImage: p.coverImage || "/placeholder.jpg",
        content: p.content || "",
        tags: (p.tags || []).join(", "),
        published: !!p.published,
      })
      setLoading(false)
      // Sync to editor
      setTimeout(() => editor?.commands.setContent(p.content || ""), 0)
    }
    fetchPost()
  }, [params.id, editor])

  const onSave = async () => {
    setSaving(true)
    setError("")
    const res = await fetch(`/api/blog/${params.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        tags: form.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      }),
    })
    setSaving(false)
    if (!res.ok) {
      setError("Failed to save")
      return
    }
    router.push("/admin/blog")
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
          <CardTitle>Edit Blog Post</CardTitle>
          <CardDescription>Update content, metadata and publish state</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && <div className="text-sm text-destructive">{error}</div>}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input id="slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea id="excerpt" value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="coverImage">Cover Image URL</Label>
              <Input id="coverImage" value={form.coverImage} onChange={(e) => setForm({ ...form, coverImage: e.target.value })} />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <Input id="tags" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Content</Label>
              <div className="flex items-center gap-2 pb-2">
                <Button type="button" variant="outline" size="sm" onClick={() => editor?.chain().focus().toggleBold().run()}>
                  Bold
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={() => editor?.chain().focus().toggleItalic().run()}>
                  Italic
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}>
                  H2
                </Button>
                <Button type="button" variant="secondary" size="sm" onClick={() => setShowPreview((p) => !p)}>
                  {showPreview ? "Hide Preview" : "Preview"}
                </Button>
              </div>
              {!showPreview ? (
                <EditorContent editor={editor} />
              ) : (
                <div className="prose prose-sm dark:prose-invert min-h-[240px] rounded-md border p-3" dangerouslySetInnerHTML={{ __html: form.content }} />
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <Badge variant={form.published ? "default" : "secondary"}>{form.published ? "Published" : "Draft"}</Badge>
              <Button variant="outline" size="sm" onClick={() => setForm({ ...form, published: !form.published })}>
                Toggle Publish
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => history.back()}>Cancel</Button>
              <Button onClick={onSave} disabled={saving}>{saving ? "Saving..." : "Save Changes"}</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


