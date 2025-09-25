"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock,
  Users,
  MessageCircle,
  Send,
  CheckCircle,
  AlertCircle,
  Loader2,
  Sparkles,
  Heart,
  Award,
  Globe,
  Calendar,
  ChevronDown,
  ChevronUp,
  Linkedin,
  Twitter,
  Instagram,
  Facebook,
  Youtube,
  ArrowRight,
  Building,
  User,
  Headphones,
  ShoppingBag,
  HandHeart
} from "lucide-react"
import { submitContactForm } from "./actions"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

export default function ContactPageClient() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formResponse, setFormResponse] = useState<{
    success?: boolean
    message?: string
  } | null>(null)
  const [openFAQ, setOpenFAQ] = useState<number | null>(null)

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true)
    setFormResponse(null)

    try {
      const response = await submitContactForm(formData)
      setFormResponse(response)

      // Reset form if successful
      if (response.success) {
        const form = document.getElementById("contact-form") as HTMLFormElement
        form.reset()
      }
    } catch (error) {
      setFormResponse({
        success: false,
        message: "An unexpected error occurred. Please try again later.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const contactMethods = [
    {
      icon: Mail,
      title: "Email Support",
      description: "Get help via email",
      primary: "info@kureno.com",
      secondary: "support@kureno.com",
      color: "from-teal-500 to-emerald-500",
      responseTime: "Within 24 hours"
    },
    {
      icon: Phone,
      title: "Phone Support",
      description: "Speak with our team",
      primary: "+1 (555) 123-4567",
      secondary: "Mon-Fri: 9am-5pm EST",
      color: "from-emerald-500 to-cyan-500",
      responseTime: "Immediate"
    },
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Chat with us online",
      primary: "Available 24/7",
      secondary: "Average response: 2 min",
      color: "from-cyan-500 to-teal-500",
      responseTime: "Real-time"
    }
  ]

  const teamMembers = [
    {
      name: "Tra Hoang Trong",
      role: "Customer Success Manager",
      email: "sarah@kureno.com",
      avatar: "/placeholder-user.jpg",
      specialties: ["Product Support", "Order Assistance"]
    },
    {
      name: "Tra Hoang Trong",
      role: "Technical Support",
      email: "marcus@kureno.com",
      avatar: "/placeholder-user.jpg",
      specialties: ["Technical Issues", "Account Help"]
    },
    {
      name: "Tra Hoang Trong",
      role: "Sales Representative",
      email: "elena@kureno.com",
      avatar: "/placeholder-user.jpg",
      specialties: ["Wholesale", "Partnerships"]
    }
  ]

  const faqs = [
    {
      question: "How long does shipping take?",
      answer: "Standard shipping typically takes 3-5 business days within the continental US. International shipping can take 7-14 business days depending on the destination. We also offer express shipping options for faster delivery.",
      category: "Shipping"
    },
    {
      question: "What is your return policy?",
      answer: "We offer a 30-day return policy for all unused and undamaged products. Please contact our customer service team to initiate a return. We'll provide you with a prepaid return label and process your refund within 5-7 business days.",
      category: "Returns"
    },
    {
      question: "Are your products handmade?",
      answer: "Yes, all of our products are handcrafted by skilled local artisans using traditional techniques and high-quality materials. Each piece is unique and tells a story of our cultural heritage.",
      category: "Products"
    },
    {
      question: "Do you offer wholesale options?",
      answer: "Yes, we do offer wholesale options for retailers and businesses. Please contact our sales team at wholesale@kureno.com for more information about minimum order quantities and pricing.",
      category: "Business"
    },
    {
      question: "How can I track my order?",
      answer: "Once your order ships, you will receive a confirmation email with tracking information. You can also track your order by logging into your account on our website or using the tracking number provided.",
      category: "Orders"
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, Apple Pay, and Google Pay. All transactions are secure and encrypted for your protection.",
      category: "Payment"
    }
  ]

  const socialLinks = [
    { name: "Facebook", icon: Facebook, url: "#", color: "hover:text-blue-600" },
    { name: "Instagram", icon: Instagram, url: "#", color: "hover:text-pink-600" },
    { name: "Twitter", icon: Twitter, url: "#", color: "hover:text-blue-400" },
    { name: "LinkedIn", icon: Linkedin, url: "#", color: "hover:text-blue-700" },
    { name: "YouTube", icon: Youtube, url: "#", color: "hover:text-red-600" }
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
              <MessageCircle className="h-4 w-4" />
              We're Here to Help
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-600 bg-clip-text text-transparent">
              Contact Us
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              We'd love to hear from you. Get in touch with our team for support, questions, or just to say hello. 
              We're here to help make your Kureno experience exceptional.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="rounded-full">
                <Phone className="mr-2 h-4 w-4" />
                Call Us Now
              </Button>
              <Button variant="outline" size="lg" className="rounded-full">
                <Mail className="mr-2 h-4 w-4" />
                Send Email
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Choose Your Preferred Contact Method</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Multiple ways to reach us. Pick the option that works best for you.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {contactMethods.map((method, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 text-center">
                <CardContent className="p-8">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${method.color} text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <method.icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-teal-600 transition-colors">
                    {method.title}
                  </h3>
                  <p className="text-muted-foreground mb-4">{method.description}</p>
                  <div className="space-y-2 mb-4">
                    <p className="font-medium text-teal-600">{method.primary}</p>
                    <p className="text-sm text-muted-foreground">{method.secondary}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    <Clock className="h-3 w-3 mr-1" />
                    {method.responseTime}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <div className="mb-8">
                <Badge className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white px-4 py-2 text-sm font-medium mb-4">
                  <Send className="h-4 w-4 mr-2" />
                  Send Us a Message
                </Badge>
              <h2 className="text-3xl font-bold tracking-tight mb-6">Get in Touch</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                Have questions about our products, need assistance with an order, or want to explore partnership
                opportunities? Fill out the form below, and our team will get back to you as soon as possible.
              </p>
              </div>

              {formResponse && (
                <Alert
                  variant={formResponse.success ? "default" : "destructive"}
                  className={`mb-6 ${formResponse.success ? "bg-green-50 text-green-800 dark:bg-green-950/30 dark:text-green-300 border-green-200 dark:border-green-800" : ""}`}
                >
                  {formResponse.success ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <AlertCircle className="h-4 w-4" />
                  )}
                  <AlertDescription>{formResponse.message}</AlertDescription>
                </Alert>
              )}

              <Card>
                <CardContent className="p-8">
              <form id="contact-form" action={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                        <label htmlFor="first-name" className="text-sm font-medium flex items-center gap-2">
                          <User className="h-4 w-4" />
                      First Name
                    </label>
                        <Input 
                          id="first-name" 
                          name="first-name" 
                          placeholder="Enter your first name" 
                          required 
                          className="rounded-lg"
                        />
                  </div>
                  <div className="space-y-2">
                        <label htmlFor="last-name" className="text-sm font-medium flex items-center gap-2">
                          <User className="h-4 w-4" />
                      Last Name
                    </label>
                        <Input 
                          id="last-name" 
                          name="last-name" 
                          placeholder="Enter your last name" 
                          required 
                          className="rounded-lg"
                        />
                  </div>
                </div>
                <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                    Email
                  </label>
                      <Input 
                        id="email" 
                        name="email" 
                        type="email" 
                        placeholder="Enter your email" 
                        required 
                        className="rounded-lg"
                      />
                </div>
                <div className="space-y-2">
                      <label htmlFor="subject" className="text-sm font-medium flex items-center gap-2">
                        <MessageCircle className="h-4 w-4" />
                    Subject
                  </label>
                      <Input 
                        id="subject" 
                        name="subject" 
                        placeholder="What can we help you with?" 
                        required 
                        className="rounded-lg"
                      />
                </div>
                <div className="space-y-2">
                      <label htmlFor="message" className="text-sm font-medium flex items-center gap-2">
                        <MessageCircle className="h-4 w-4" />
                    Message
                  </label>
                      <Textarea 
                        id="message" 
                        name="message" 
                        placeholder="Tell us more about your inquiry..." 
                        rows={5} 
                        required 
                        className="rounded-lg"
                      />
                </div>
                    <Button 
                      type="submit" 
                      size="lg" 
                      className="w-full rounded-full" 
                      disabled={isSubmitting}
                    >
                  {isSubmitting ? (
                    <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending Message...
                    </>
                  ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" /> Send Message
                        </>
                  )}
                </Button>
              </form>
                </CardContent>
              </Card>
            </div>

              <div className="space-y-8">
                  <div>
                <Badge className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-4 py-2 text-sm font-medium mb-4">
                  <Building className="h-4 w-4 mr-2" />
                  Visit Our Office
                </Badge>
                <h2 className="text-3xl font-bold tracking-tight mb-6">Our Location</h2>
                </div>

              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="h-[300px] bg-gradient-to-br from-teal-100 to-emerald-100 dark:from-teal-900/20 dark:to-emerald-900/20 flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="h-12 w-12 text-teal-600 mx-auto mb-4" />
                      <p className="text-muted-foreground">Interactive Map</p>
                      <p className="text-sm text-muted-foreground">123 Main Street, Anytown, ST 12345</p>
                  </div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                <div className="flex items-start gap-4">
                      <div className="p-3 rounded-full bg-teal-100 dark:bg-teal-900/30">
                        <MapPin className="h-6 w-6 text-teal-600" />
                  </div>
                  <div>
                        <h3 className="font-semibold mb-2">Address</h3>
                        <p className="text-muted-foreground mb-1">Flagship Store & Office:</p>
                    <p className="font-medium">123 Main Street</p>
                    <p className="font-medium">Anytown, ST 12345</p>
                    <p className="text-muted-foreground mb-1 mt-3">Store Hours:</p>
                    <p className="font-medium">Monday - Saturday: 10am - 7pm</p>
                    <p className="font-medium">Sunday: 12pm - 5pm</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                        <Clock className="h-6 w-6 text-emerald-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">Business Hours</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Monday - Friday:</span>
                            <span className="font-medium">9:00 AM - 5:00 PM</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Saturday:</span>
                            <span className="font-medium">10:00 AM - 3:00 PM</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Sunday:</span>
                            <span className="font-medium">Closed</span>
                  </div>
                </div>
              </div>
                </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 md:py-24 bg-muted/40">
        <div className="container">
          <div className="text-center mb-16">
            <Badge className="bg-gradient-to-r from-cyan-500 to-teal-500 text-white px-4 py-2 text-sm font-medium mb-6">
              <Users className="h-4 w-4 mr-2" />
              Meet Our Team
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight mb-4">Who You'll Be Talking To</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our dedicated team is here to help you with any questions or concerns. 
              Get to know the people behind the support.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 text-center">
                <CardContent className="p-6">
                  <div className="relative mb-6">
                    <Avatar className="h-20 w-20 mx-auto">
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-teal-600 transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-teal-600 font-medium mb-3">{member.role}</p>
                  
                  <div className="space-y-2 mb-4">
                    {member.specialties.map((specialty, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs mr-1">
                        {specialty}
                      </Badge>
                    ))}
              </div>
                  
                  <Button variant="outline" size="sm" className="rounded-full">
                    <Mail className="mr-2 h-3 w-3" />
                    {member.email}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <Badge className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white px-4 py-2 text-sm font-medium mb-6">
                <MessageCircle className="h-4 w-4 mr-2" />
                Frequently Asked Questions
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight mb-4">Common Questions</h2>
              <p className="text-lg text-muted-foreground">
                Find quick answers to the most common questions about our products, shipping, and services.
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <Card key={index} className="overflow-hidden">
                  <Collapsible open={openFAQ === index} onOpenChange={() => setOpenFAQ(openFAQ === index ? null : index)}>
                    <CollapsibleTrigger asChild>
                      <CardContent className="p-6 cursor-pointer hover:bg-muted/50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <Badge variant="outline" className="text-xs">
                              {faq.category}
                            </Badge>
                            <h3 className="text-lg font-semibold text-left">{faq.question}</h3>
                          </div>
                          {openFAQ === index ? (
                            <ChevronUp className="h-5 w-5 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                      </CardContent>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <CardContent className="pt-0 pb-6">
                        <Separator className="mb-4" />
                        <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                      </CardContent>
                    </CollapsibleContent>
                  </Collapsible>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Social Media & Newsletter */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-950/20 dark:to-emerald-950/20">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-4 py-2 text-sm font-medium mb-6">
                <Globe className="h-4 w-4 mr-2" />
                Connect With Us
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight mb-4">Follow Our Journey</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Stay connected with Kureno on social media for the latest updates, behind-the-scenes content, 
                and exclusive offers.
              </p>
              
              <div className="flex gap-4">
                {socialLinks.map((social, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="lg"
                    className={`rounded-full ${social.color}`}
                    asChild
                  >
                    <a href={social.url}>
                      <social.icon className="h-5 w-5" />
                    </a>
                  </Button>
                ))}
              </div>
            </div>
            
            <Card className="bg-gradient-to-br from-teal-500 to-emerald-600 text-white border-0">
              <CardContent className="p-8">
                <div className="text-center">
                  <Mail className="h-12 w-12 mx-auto mb-4 opacity-90" />
                  <h3 className="text-2xl font-bold mb-4">Stay Updated</h3>
                  <p className="opacity-90 mb-6">
                    Subscribe to our newsletter for exclusive offers, new product announcements, 
                    and stories from our artisans.
                  </p>
                  <div className="space-y-3">
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/70 rounded-full"
                    />
                    <Button className="w-full bg-white text-teal-600 hover:bg-white/90 hover:text-teal-700 rounded-full">
                      Subscribe Now
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
