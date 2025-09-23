import type { Metadata } from "next"
import BlogPageClient from "./blog-client"

export const metadata: Metadata = {
  title: "Blog",
  description: "Read the latest news, stories, and updates from Kureno",
}

export default function BlogPage() {
  return <BlogPageClient />
}
