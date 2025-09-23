import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { 
  ArrowRight, 
  Star, 
  Heart, 
  ShoppingCart, 
  Eye,
  Sparkles,
  Award,
  Users,
  Calendar,
  MapPin,
  Mail,
  Phone,
  Quote,
  CheckCircle,
  TrendingUp,
  Shield,
  Leaf,
  HandHeart,
  Zap,
  Globe,
  Clock,
  ChevronRight,
  Play,
  BookOpen,
  PenTool
} from "lucide-react"

export default function Home() {
  const featuredProducts = [
    {
      id: 1,
      name: "Artisan Ceramic Bowl Set",
      price: 89.99,
      originalPrice: 120.00,
      rating: 4.8,
      reviews: 124,
      image: "/placeholder.svg?height=300&width=400",
      badge: "Best Seller",
      isNew: false,
      discount: 25
    },
    {
      id: 2,
      name: "Handwoven Textile Collection",
      price: 149.99,
      originalPrice: null,
      rating: 4.9,
      reviews: 89,
      image: "/placeholder.svg?height=300&width=400",
      badge: "New",
      isNew: true,
      discount: null
    },
    {
      id: 3,
      name: "Traditional Wooden Carving",
      price: 199.99,
      originalPrice: 250.00,
      rating: 4.7,
      reviews: 67,
      image: "/placeholder.svg?height=300&width=400",
      badge: "Limited",
      isNew: false,
      discount: 20
    }
  ]

  const categories = [
    { name: "Ceramics", icon: Award, count: 45, color: "from-teal-500 to-emerald-500" },
    { name: "Textiles", icon: Heart, count: 32, color: "from-emerald-500 to-cyan-500" },
    { name: "Woodwork", icon: Shield, count: 28, color: "from-cyan-500 to-teal-500" },
    { name: "Jewelry", icon: Sparkles, count: 19, color: "from-teal-600 to-emerald-600" }
  ]

  const stats = [
    { label: "Happy Customers", value: "10K+", icon: Users },
    { label: "Products Created", value: "500+", icon: Award },
    { label: "Local Artisans", value: "25+", icon: HandHeart },
    { label: "Years of Excellence", value: "9+", icon: Calendar }
  ]

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Interior Designer",
      content: "Kureno's products bring such authentic character to my designs. The quality and craftsmanship are unmatched, and my clients love the unique stories behind each piece.",
      rating: 5,
      avatar: "/placeholder-user.jpg"
    },
    {
      name: "Michael Chen",
      role: "Art Collector",
      content: "I've been collecting Kureno pieces for years. Each item tells a story and preserves our cultural heritage. It's more than just shopping - it's supporting local traditions.",
      rating: 5,
      avatar: "/placeholder-user.jpg"
    },
    {
      name: "Elena Rodriguez",
      role: "Homeowner",
      content: "The attention to detail in every Kureno product is incredible. I love knowing that I'm supporting local artisans while bringing beautiful, meaningful pieces into my home.",
      rating: 5,
      avatar: "/placeholder-user.jpg"
    }
  ]

  const blogPosts = [
    {
      title: "The Art of Traditional Ceramics",
      excerpt: "Discover the ancient techniques passed down through generations of local artisans.",
      image: "/placeholder.svg?height=200&width=300",
      date: "2024-01-15",
      readTime: "5 min read"
    },
    {
      title: "Sustainable Crafting Practices",
      excerpt: "How we're preserving the environment while creating beautiful products.",
      image: "/placeholder.svg?height=200&width=300",
      date: "2024-01-10",
      readTime: "3 min read"
    }
  ]

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-24 md:pt-32 pb-16 md:pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50 dark:from-teal-950/20 dark:via-emerald-950/20 dark:to-cyan-950/20 -z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(20,184,166,0.1),transparent_50%),radial-gradient(ellipse_at_bottom_left,rgba(16,185,129,0.1),transparent_50%)] -z-10" />
        
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 px-4 py-2 rounded-full text-sm font-medium">
                <Sparkles className="h-4 w-4" />
                Locally Crafted Excellence
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                Discover the Essence of{" "}
                <span className="bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-600 bg-clip-text text-transparent">
                  Kureno
                </span>
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
                Authentic products that celebrate our local heritage and craftsmanship, designed with passion and purpose. 
                Every piece tells a story of tradition, quality, and community.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="rounded-full" asChild>
                  <Link href="/products">
                    Explore Products
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="rounded-full" asChild>
                  <Link href="/about">
                    <Play className="mr-2 h-4 w-4" />
                    Our Story
                  </Link>
                </Button>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-6 pt-8">
                {stats.slice(0, 2).map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl font-bold text-teal-600 mb-1">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="relative h-[500px] lg:h-[600px] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/placeholder.svg?height=600&width=500"
                  alt="Kureno featured product"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-6 -right-6 bg-white dark:bg-gray-900 rounded-xl p-4 shadow-lg border">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-teal-100 dark:bg-teal-900/30">
                    <Award className="h-5 w-5 text-teal-600" />
                  </div>
                  <div>
                    <div className="font-semibold">Premium Quality</div>
                    <div className="text-sm text-muted-foreground">Handcrafted</div>
                  </div>
                </div>
              </div>
              
              <div className="absolute -bottom-6 -left-6 bg-white dark:bg-gray-900 rounded-xl p-4 shadow-lg border">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                    <Leaf className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <div className="font-semibold">Eco-Friendly</div>
                    <div className="text-sm text-muted-foreground">Sustainable</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Shop by Category</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore our diverse collection of handcrafted products, each category representing a unique aspect of our cultural heritage.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${category.color} text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <category.icon className="h-8 w-8" />
                  </div>
                  <h3 className="font-semibold mb-2 group-hover:text-teal-600 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">{category.count} items</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
            <div>
              <Badge className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white px-4 py-2 text-sm font-medium mb-4">
                <TrendingUp className="h-4 w-4 mr-2" />
                Featured Products
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight mb-2">Handpicked Excellence</h2>
              <p className="text-muted-foreground max-w-md">Discover our most popular and unique offerings, carefully selected for their exceptional quality and cultural significance.</p>
            </div>
            <Button variant="outline" className="mt-4 md:mt-0 rounded-full" asChild>
              <Link href="/products">
                View All Products <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <Card key={product.id} className="group overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
                <div className="relative">
                  <div className="relative h-[300px] overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                    
                    {/* Action Buttons */}
                    <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Button size="sm" variant="secondary" className="h-8 w-8 p-0 rounded-full shadow-lg">
                        <Heart className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="secondary" className="h-8 w-8 p-0 rounded-full shadow-lg" asChild>
                        <Link href={`/products/${product.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>

                    {/* Badges */}
                    <div className="absolute top-3 left-3">
                      {product.isNew && (
                        <Badge className="bg-teal-500 hover:bg-teal-600">{product.badge}</Badge>
                      )}
                      {product.discount && (
                        <Badge variant="destructive">-{product.discount}%</Badge>
                      )}
                      {!product.isNew && !product.discount && (
                        <Badge variant="outline">{product.badge}</Badge>
                      )}
                    </div>
                  </div>

                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold text-lg mb-2 group-hover:text-teal-600 transition-colors">
                          {product.name}
                        </h3>
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-4 w-4 ${
                                  i < Math.floor(product.rating) 
                                    ? 'fill-yellow-400 text-yellow-400' 
                                    : 'text-gray-300'
                                }`} 
                              />
                            ))}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {product.rating} ({product.reviews} reviews)
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-bold text-teal-600">
                            ${product.price}
                          </span>
                          {product.originalPrice && (
                            <span className="text-sm text-muted-foreground line-through">
                              ${product.originalPrice}
                            </span>
                          )}
                        </div>
                        <Button size="sm" className="rounded-full">
                          <ShoppingCart className="h-4 w-4 mr-1" />
                          Add
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-950/20 dark:to-emerald-950/20">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 text-white mb-4 group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className="h-8 w-8" />
                </div>
                <div className="text-3xl font-bold text-teal-600 mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                <Image 
                  src="/placeholder.svg?height=500&width=600" 
                  alt="About Kureno" 
                  fill 
                  className="object-cover" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
              
              {/* Floating Card */}
              <div className="absolute -bottom-6 -right-6 bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border max-w-xs">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-full bg-teal-100 dark:bg-teal-900/30">
                    <HandHeart className="h-5 w-5 text-teal-600" />
                  </div>
                  <div>
                    <div className="font-semibold">Local Artisans</div>
                    <div className="text-sm text-muted-foreground">25+ Partners</div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Working with skilled craftspeople to preserve traditional techniques and create modern masterpieces.
                </p>
              </div>
            </div>
            
            <div className="space-y-8">
              <div>
                <Badge className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-4 py-2 text-sm font-medium mb-4">
                  <Heart className="h-4 w-4 mr-2" />
                  Our Story
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
                  Crafting Heritage, Creating Future
                </h2>
              </div>
              
              <div className="space-y-6">
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Kureno was born from a passion for authentic local craftsmanship and a desire to share our heritage with
                  the world. What started as a small workshop has grown into a beloved brand that celebrates our community's
                  unique identity.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Every product we create is infused with our values of quality, sustainability, and cultural pride. We work
                  closely with local artisans to ensure that each item tells a story and preserves traditional techniques.
                </p>
              </div>

              <div className="flex items-center gap-4">
                <Button className="rounded-full" asChild>
                  <Link href="/about">
                    Learn More About Us
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" className="rounded-full">
                  <MapPin className="mr-2 h-4 w-4" />
                  Visit Workshop
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Preview */}
      <section className="py-16 md:py-24 bg-muted/40">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
            <div>
              <Badge className="bg-gradient-to-r from-cyan-500 to-teal-500 text-white px-4 py-2 text-sm font-medium mb-4">
                <PenTool className="h-4 w-4 mr-2" />
                Latest Stories
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight mb-2">From Our Blog</h2>
              <p className="text-muted-foreground max-w-md">Discover the stories behind our products and the artisans who create them.</p>
            </div>
            <Button variant="outline" className="mt-4 md:mt-0 rounded-full" asChild>
              <Link href="/blog">
                Read All Stories <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {blogPosts.map((post, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
                <div className="relative h-[200px] overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(post.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {post.readTime}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 group-hover:text-teal-600 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {post.excerpt}
                  </p>
                  <Button variant="ghost" className="p-0 h-auto text-teal-600 hover:text-teal-700">
                    Read More <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="text-center mb-16">
            <Badge className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white px-4 py-2 text-sm font-medium mb-6">
              <Quote className="h-4 w-4 mr-2" />
              Customer Stories
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight mb-4">What Our Customers Say</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Hear from our community of customers who have experienced the quality and authenticity of Kureno products.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <blockquote className="text-muted-foreground mb-6 leading-relaxed">
                    "{testimonial.content}"
                  </blockquote>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                      <AvatarFallback>{testimonial.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-teal-500 to-emerald-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.1),transparent_50%),radial-gradient(ellipse_at_bottom_left,rgba(255,255,255,0.1),transparent_50%)]" />
        <div className="container text-center relative">
          <div className="max-w-2xl mx-auto">
            <Badge className="bg-white/20 text-white border-white/30 px-4 py-2 text-sm font-medium mb-6">
              <Mail className="h-4 w-4 mr-2" />
              Stay Connected
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Join Our Community</h2>
            <p className="text-lg mb-8 opacity-90">
              Subscribe to our newsletter for exclusive offers, new product announcements, and stories from our artisans. 
              Be the first to discover our latest creations.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/70 rounded-full"
              />
              <Button className="bg-white text-teal-600 hover:bg-white/90 hover:text-teal-700 rounded-full">
                Subscribe
              </Button>
            </form>
            <p className="text-sm opacity-75 mt-4">
              Join 5,000+ subscribers. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
