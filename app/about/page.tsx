import Image from "next/image"
import type { Metadata } from "next"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { 
  Heart, 
  Users, 
  Award, 
  Leaf, 
  HandHeart, 
  Sparkles,
  Star,
  Quote,
  Calendar,
  MapPin,
  Mail,
  Linkedin,
  Twitter,
  Instagram,
  ArrowRight,
  CheckCircle,
  Target,
  Lightbulb,
  Shield,
  Globe,
  Zap
} from "lucide-react"

export const metadata: Metadata = {
  title: "About",
  description: "Learn about Kureno's story, mission, and values",
}

export default function AboutPage() {
  const values = [
    {
      icon: Award,
      title: "Quality Craftsmanship",
      description: "We believe in creating products that last, using the finest materials and traditional techniques that have stood the test of time.",
      color: "from-teal-500 to-emerald-500"
    },
    {
      icon: Heart,
      title: "Cultural Heritage",
      description: "We honor and preserve our local traditions by incorporating elements of our cultural heritage into modern, functional designs.",
      color: "from-emerald-500 to-cyan-500"
    },
    {
      icon: Leaf,
      title: "Sustainability",
      description: "We're committed to environmentally responsible practices, from sourcing materials to packaging and shipping.",
      color: "from-cyan-500 to-teal-500"
    },
    {
      icon: HandHeart,
      title: "Community Support",
      description: "We invest in our local community by providing fair wages, training opportunities, and supporting other local businesses.",
      color: "from-teal-600 to-emerald-600"
    },
    {
      icon: Shield,
      title: "Authenticity",
      description: "We create genuine products with real stories, avoiding mass production in favor of thoughtful, meaningful items.",
      color: "from-emerald-600 to-cyan-600"
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "While respecting tradition, we continuously explore new techniques and designs to keep our offerings fresh and relevant.",
      color: "from-cyan-600 to-teal-600"
    },
  ]

  const teamMembers = [
    {
      name: "Sarah Chen",
      role: "Founder & CEO",
      bio: "Passionate about preserving traditional craftsmanship while embracing modern innovation.",
      image: "/placeholder.svg?height=300&width=300",
      social: {
        linkedin: "#",
        twitter: "#",
        instagram: "#"
      }
    },
    {
      name: "Marcus Rodriguez",
      role: "Head of Design",
      bio: "Bringing cultural heritage to life through thoughtful, functional design.",
      image: "/placeholder.svg?height=300&width=300",
      social: {
        linkedin: "#",
        twitter: "#",
        instagram: "#"
      }
    },
    {
      name: "Elena Kowalski",
      role: "Production Manager",
      bio: "Ensuring every product meets our high standards of quality and sustainability.",
      image: "/placeholder.svg?height=300&width=300",
      social: {
        linkedin: "#",
        twitter: "#",
        instagram: "#"
      }
    },
    {
      name: "David Kim",
      role: "Community Relations",
      bio: "Building bridges between our brand and the local artisan community.",
      image: "/placeholder.svg?height=300&width=300",
      social: {
        linkedin: "#",
        twitter: "#",
        instagram: "#"
      }
    }
  ]

  const stats = [
    { label: "Years of Excellence", value: "9+", icon: Calendar },
    { label: "Local Artisans", value: "25+", icon: Users },
    { label: "Products Created", value: "500+", icon: Award },
    { label: "Happy Customers", value: "10K+", icon: Heart }
  ]

  const timeline = [
    {
      year: "2015",
      title: "The Beginning",
      description: "Founded in a small garage with a vision to preserve local craftsmanship"
    },
    {
      year: "2017",
      title: "First Workshop",
      description: "Opened our first dedicated workshop space and hired local artisans"
    },
    {
      year: "2019",
      title: "Community Expansion",
      description: "Partnered with 15+ local craftspeople and launched our online presence"
    },
    {
      year: "2021",
      title: "Sustainability Focus",
      description: "Implemented eco-friendly practices and sustainable sourcing"
    },
    {
      year: "2023",
      title: "Global Recognition",
      description: "Received awards for cultural preservation and sustainable business practices"
    }
  ]

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-24 md:pt-32 pb-16 md:pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50 dark:from-teal-950/20 dark:via-emerald-950/20 dark:to-cyan-950/20 -z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(20,184,166,0.1),transparent_50%),radial-gradient(ellipse_at_bottom_left,rgba(16,185,129,0.1),transparent_50%)] -z-10" />
        
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4" />
              Our Journey Since 2015
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-600 bg-clip-text text-transparent">
              Our Story
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Discover the passion, purpose, and people behind Kureno. From humble beginnings to becoming a beacon of local craftsmanship and cultural preservation.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="rounded-full">
                Explore Our Products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg" className="rounded-full">
                Meet Our Team
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
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

      {/* Story Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div>
                <Badge className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white px-4 py-2 text-sm font-medium mb-4">
                  <Target className="h-4 w-4 mr-2" />
                  Our Mission
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
                  How It All Began
                </h2>
              </div>
              
              <div className="space-y-6">
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Kureno was founded in 2015 by a group of friends who shared a passion for local craftsmanship and a
                  vision to preserve traditional techniques while creating modern, functional products.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  What started as a small workshop in a garage has grown into a beloved brand that celebrates our
                  community's unique identity and heritage. Our journey has been one of discovery, learning, and growth,
                  but our core values have remained unchanged.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Today, we work with over 25 local artisans and craftspeople, creating products that tell a story and
                  connect people to our cultural roots.
                </p>
              </div>

              <div className="flex items-center gap-4">
                <Button className="rounded-full">
                  Read Our Full Story
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="outline" className="rounded-full">
                  <MapPin className="mr-2 h-4 w-4" />
                  Visit Our Workshop
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                <Image 
                  src="/placeholder.svg?height=500&width=600" 
                  alt="Kureno founders" 
                  fill 
                  className="object-cover" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
              
              {/* Floating Cards */}
              <div className="absolute -bottom-6 -left-6 bg-white dark:bg-gray-900 rounded-xl p-4 shadow-lg border">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-teal-100 dark:bg-teal-900/30">
                    <Users className="h-5 w-5 text-teal-600" />
                  </div>
                  <div>
                    <div className="font-semibold">25+ Artisans</div>
                    <div className="text-sm text-muted-foreground">Local Partners</div>
                  </div>
                </div>
              </div>
              
              <div className="absolute -top-6 -right-6 bg-white dark:bg-gray-900 rounded-xl p-4 shadow-lg border">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                    <Award className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <div className="font-semibold">9+ Years</div>
                    <div className="text-sm text-muted-foreground">Of Excellence</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 md:py-24 bg-muted/40">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-6">Our Journey</h2>
            <p className="text-lg text-muted-foreground">
              From a small garage to a thriving community of artisans, here's how we've grown over the years.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-teal-500 to-emerald-500"></div>
              
              {timeline.map((item, index) => (
                <div key={index} className="relative flex items-start gap-8 mb-12 last:mb-0">
                  <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {item.year}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <Badge className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-4 py-2 text-sm font-medium mb-6">
              <Heart className="h-4 w-4 mr-2" />
              Our Core Values
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight mb-6">What Drives Us</h2>
            <p className="text-lg text-muted-foreground">
              At Kureno, we're guided by a set of core principles that inform everything we do, from product design to
              customer service.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
                <CardContent className="p-8">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${value.color} text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <value.icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4 group-hover:text-teal-600 transition-colors">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 md:py-24 bg-muted/40">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <Badge className="bg-gradient-to-r from-cyan-500 to-teal-500 text-white px-4 py-2 text-sm font-medium mb-6">
              <Users className="h-4 w-4 mr-2" />
              Meet Our Team
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight mb-6">The People Behind Kureno</h2>
            <p className="text-lg text-muted-foreground">
              The passionate individuals who bring our vision to life every day and make Kureno what it is today.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 text-center">
                <CardContent className="p-6">
                  <div className="relative mb-6">
                    <div className="relative h-48 w-48 mx-auto rounded-2xl overflow-hidden">
                      <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-teal-600 transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-teal-600 font-medium mb-3">{member.role}</p>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    {member.bio}
                  </p>
                  
                  <div className="flex justify-center gap-3">
                    <Button size="sm" variant="outline" className="rounded-full h-8 w-8 p-0">
                      <Linkedin className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="rounded-full h-8 w-8 p-0">
                      <Twitter className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="rounded-full h-8 w-8 p-0">
                      <Instagram className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <Badge className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white px-4 py-2 text-sm font-medium mb-6">
              <Quote className="h-4 w-4 mr-2" />
              What People Say
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight mb-6">Loved by Our Community</h2>
            <p className="text-lg text-muted-foreground">
              Hear from our customers, partners, and community members about their experience with Kureno.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Maria Santos",
                role: "Local Artisan",
                content: "Working with Kureno has given me the opportunity to share my craft with the world while preserving our cultural traditions.",
                rating: 5
              },
              {
                name: "James Wilson",
                role: "Customer",
                content: "The quality and authenticity of Kureno products is unmatched. Every piece tells a story and brings joy to our home.",
                rating: 5
              },
              {
                name: "Dr. Lisa Chen",
                role: "Cultural Preservationist",
                content: "Kureno's commitment to preserving local craftsmanship while adapting to modern needs is truly inspiring.",
                rating: 5
              }
            ].map((testimonial, index) => (
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
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="/placeholder-user.jpg" alt={testimonial.name} />
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

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-950/20 dark:to-emerald-950/20">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold tracking-tight mb-6">Join Our Story</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Be part of our journey as we continue to celebrate local craftsmanship and create meaningful connections through our products.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="rounded-full">
                Explore Our Products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg" className="rounded-full">
                <Mail className="mr-2 h-4 w-4" />
                Get in Touch
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
