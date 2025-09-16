import { Input } from "@/components/ui/input"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, Star } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-24 md:pt-32 pb-16 md:pb-24">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-950/20 dark:to-emerald-950/20 -z-10" />
        <div className="container grid md:grid-cols-2 gap-8 items-center">
          <div className="flex flex-col space-y-6">
            <div className="inline-block px-3 py-1 rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-800 dark:text-teal-300 text-sm font-medium">
              Locally Crafted Excellence
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Discover the Essence of{" "}
              <span className="bg-gradient-to-r from-teal-500 to-emerald-600 bg-clip-text text-transparent">
                Kureno
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-md">
              Authentic products that celebrate our local heritage and craftsmanship, designed with passion and purpose.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild>
                <Link href="/products">Explore Products</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/about">Our Story</Link>
              </Button>
            </div>
          </div>
          <div className="relative h-[400px] md:h-[500px] rounded-lg overflow-hidden">
            <Image
              src="/placeholder.svg?height=500&width=500"
              alt="Kureno featured product"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-2">Featured Products</h2>
              <p className="text-muted-foreground max-w-md">Discover our most popular and unique offerings</p>
            </div>
            <Button variant="ghost" className="mt-4 md:mt-0" asChild>
              <Link href="/products">
                View All Products <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((product) => (
              <Link
                key={product}
                href={`/products/${product}`}
                className="group block overflow-hidden rounded-lg border bg-background transition-all hover:shadow-md"
              >
                <div className="relative h-[300px] overflow-hidden">
                  <Image
                    src={`/placeholder.svg?height=300&width=400`}
                    alt={`Product ${product}`}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-medium">Product Name {product}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">(24 reviews)</span>
                  </div>
                  <p className="mt-2 font-medium">$99.00</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 md:py-24 bg-muted/40">
        <div className="container grid md:grid-cols-2 gap-12 items-center">
          <div className="relative h-[400px] rounded-lg overflow-hidden">
            <Image src="/placeholder.svg?height=400&width=600" alt="About Kureno" fill className="object-cover" />
          </div>
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-6">Our Story</h2>
            <p className="text-muted-foreground mb-6">
              Kureno was born from a passion for authentic local craftsmanship and a desire to share our heritage with
              the world. What started as a small workshop has grown into a beloved brand that celebrates our community's
              unique identity.
            </p>
            <p className="text-muted-foreground mb-6">
              Every product we create is infused with our values of quality, sustainability, and cultural pride. We work
              closely with local artisans to ensure that each item tells a story and preserves traditional techniques.
            </p>
            <Button asChild>
              <Link href="/about">Learn More About Us</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-24">
        <div className="container">
          <h2 className="text-3xl font-bold tracking-tight text-center mb-12">What Our Customers Say</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((testimonial) => (
              <div key={testimonial} className="rounded-lg border bg-background p-6">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                  ))}
                </div>
                <p className="mt-4 text-muted-foreground">
                  "The quality and craftsmanship of Kureno products is exceptional. I love supporting a brand that
                  values local traditions and creates such beautiful items."
                </p>
                <div className="mt-6 flex items-center gap-4">
                  <div className="relative h-10 w-10 rounded-full overflow-hidden">
                    <Image src="/placeholder.svg?height=40&width=40" alt="Customer" fill className="object-cover" />
                  </div>
                  <div>
                    <p className="font-medium">Customer Name {testimonial}</p>
                    <p className="text-sm text-muted-foreground">Verified Buyer</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-teal-500 to-emerald-600 text-white">
        <div className="container text-center">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Join Our Community</h2>
          <p className="max-w-md mx-auto mb-8">
            Subscribe to our newsletter for exclusive offers, new product announcements, and stories from our artisans.
          </p>
          <form className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/70"
            />
            <Button className="bg-white text-teal-600 hover:bg-white/90 hover:text-teal-700">Subscribe</Button>
          </form>
        </div>
      </section>
    </div>
  )
}
