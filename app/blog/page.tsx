import { Input } from "@/components/ui/input"
import Image from "next/image"
import Link from "next/link"
import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Blog",
  description: "Read the latest news, stories, and updates from Kureno",
}

export default function BlogPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-24 md:pt-32 pb-16 md:pb-24">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-950/20 dark:to-emerald-950/20 -z-10" />
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Our Blog</h1>
            <p className="text-xl text-muted-foreground">Stories, news, and insights from the Kureno community</p>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-12 md:py-16">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="relative h-[300px] md:h-[400px] rounded-lg overflow-hidden">
              <Image
                src="/placeholder.svg?height=400&width=600"
                alt="Featured blog post"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <div className="mb-2">
                <span className="inline-block px-3 py-1 rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-800 dark:text-teal-300 text-sm font-medium">
                  Featured
                </span>
              </div>
              <h2 className="text-3xl font-bold tracking-tight mb-4">
                The Art of Traditional Craftsmanship in Modern Times
              </h2>
              <p className="text-muted-foreground mb-6">
                Explore how Kureno is preserving ancient techniques while creating contemporary products that resonate
                with today's consumers. This in-depth look at our process reveals the careful balance between tradition
                and innovation.
              </p>
              <div className="flex items-center gap-4 mb-6">
                <div className="relative h-10 w-10 rounded-full overflow-hidden">
                  <Image src="/placeholder.svg?height=40&width=40" alt="Author" fill className="object-cover" />
                </div>
                <div>
                  <p className="font-medium">Author Name</p>
                  <p className="text-sm text-muted-foreground">April 15, 2023 · 10 min read</p>
                </div>
              </div>
              <Button asChild>
                <Link href="/blog/1">
                  Read Article <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-12 md:py-16">
        <div className="container">
          <h2 className="text-2xl font-bold tracking-tight mb-8">Latest Articles</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, index) => (
              <Link
                key={index}
                href={`/blog/${index + 2}`}
                className="group block overflow-hidden rounded-lg border bg-background transition-all hover:shadow-md"
              >
                <div className="relative h-[200px] overflow-hidden">
                  <Image
                    src={`/placeholder.svg?height=200&width=400`}
                    alt={`Blog post ${index + 2}`}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <div className="mb-2">
                    <span className="inline-block px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-xs font-medium">
                      Category
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                    Blog Post Title {index + 2}
                  </h3>
                  <p className="text-muted-foreground mb-4 line-clamp-2">
                    A brief description of the blog post that gives readers an idea of what the article is about without
                    revealing too much.
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="relative h-8 w-8 rounded-full overflow-hidden">
                      <Image src={`/placeholder.svg?height=30&width=30`} alt="Author" fill className="object-cover" />
                    </div>
                    <div className="text-sm">
                      <p className="font-medium">Author Name</p>
                      <p className="text-muted-foreground">April 1, 2023</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-12">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" disabled>
                &lt;
              </Button>
              <Button variant="default" size="icon">
                1
              </Button>
              <Button variant="outline" size="icon">
                2
              </Button>
              <Button variant="outline" size="icon">
                3
              </Button>
              <Button variant="outline" size="icon">
                &gt;
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 md:py-24 bg-muted/40">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Subscribe to Our Newsletter</h2>
            <p className="text-muted-foreground mb-8">
              Stay updated with our latest articles, product releases, and exclusive offers.
            </p>
            <form className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <Input type="email" placeholder="Enter your email" className="flex-1" />
              <Button>Subscribe</Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}
