import Image from "next/image"
import { notFound } from "next/navigation"

async function fetchPost(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/blog/${id}`, { cache: "no-store" })
  if (!res.ok) return null
  return (await res.json()).post
}

export default async function BlogDetail({ params }: { params: { id: string } }) {
  const post = await fetchPost(params.id)
  if (!post) return notFound()
  return (
    <div className="container py-12">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-4 text-3xl font-bold tracking-tight">{post.title}</h1>
        <div className="mb-6 flex items-center gap-3 text-sm text-muted-foreground">
          <div className="relative h-8 w-8 overflow-hidden rounded-full">
            <Image src="/placeholder-user.jpg" alt="Author" fill className="object-cover" />
          </div>
          <span>{post.author?.name || "Admin"}</span>
          <span>·</span>
          <span>{new Date(post.publishedAt || post.createdAt).toLocaleDateString()}</span>
        </div>
        <div className="relative mb-8 h-[360px] overflow-hidden rounded-md border">
          <Image src={post.coverImage || "/placeholder.jpg"} alt={post.title} fill className="object-cover" />
        </div>
        <article className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>
    </div>
  )
}


