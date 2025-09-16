"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Phone, MapPin } from "lucide-react"
import { submitContactForm } from "./actions"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"

export default function ContactPageClient() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formResponse, setFormResponse] = useState<{
    success?: boolean
    message?: string
  } | null>(null)

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

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-24 md:pt-32 pb-16 md:pb-24">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-950/20 dark:to-emerald-950/20 -z-10" />
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Contact Us</h1>
            <p className="text-xl text-muted-foreground">We'd love to hear from you. Get in touch with our team.</p>
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-6">Get in Touch</h2>
              <p className="text-muted-foreground mb-8">
                Have questions about our products, need assistance with an order, or want to explore partnership
                opportunities? Fill out the form below, and our team will get back to you as soon as possible.
              </p>

              {formResponse && (
                <Alert
                  variant={formResponse.success ? "default" : "destructive"}
                  className={`mb-6 ${formResponse.success ? "bg-green-50 text-green-800 dark:bg-green-950/30 dark:text-green-300" : ""}`}
                >
                  <AlertDescription>{formResponse.message}</AlertDescription>
                </Alert>
              )}

              <form id="contact-form" action={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="first-name" className="text-sm font-medium">
                      First Name
                    </label>
                    <Input id="first-name" name="first-name" placeholder="Enter your first name" required />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="last-name" className="text-sm font-medium">
                      Last Name
                    </label>
                    <Input id="last-name" name="last-name" placeholder="Enter your last name" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <Input id="email" name="email" type="email" placeholder="Enter your email" required />
                </div>
                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium">
                    Subject
                  </label>
                  <Input id="subject" name="subject" placeholder="Enter the subject" required />
                </div>
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">
                    Message
                  </label>
                  <Textarea id="message" name="message" placeholder="Enter your message" rows={5} required />
                </div>
                <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...
                    </>
                  ) : (
                    "Send Message"
                  )}
                </Button>
              </form>
            </div>

            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-6">Contact Information</h2>
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="bg-muted p-3 rounded-lg">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Email</h3>
                    <p className="text-muted-foreground mb-1">For general inquiries:</p>
                    <p className="font-medium">info@kureno.com</p>
                    <p className="text-muted-foreground mb-1 mt-3">For customer support:</p>
                    <p className="font-medium">support@kureno.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-muted p-3 rounded-lg">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Phone</h3>
                    <p className="text-muted-foreground mb-1">Customer Service:</p>
                    <p className="font-medium">+1 (555) 123-4567</p>
                    <p className="text-muted-foreground mb-1 mt-3">Business Hours:</p>
                    <p className="font-medium">Monday - Friday: 9am - 5pm</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-muted p-3 rounded-lg">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Visit Us</h3>
                    <p className="text-muted-foreground mb-1">Flagship Store:</p>
                    <p className="font-medium">123 Main Street</p>
                    <p className="font-medium">Anytown, ST 12345</p>
                    <p className="text-muted-foreground mb-1 mt-3">Store Hours:</p>
                    <p className="font-medium">Monday - Saturday: 10am - 7pm</p>
                    <p className="font-medium">Sunday: 12pm - 5pm</p>
                  </div>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="mt-8 h-[300px] rounded-lg overflow-hidden border">
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <p className="text-muted-foreground">Map would be displayed here</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24 bg-muted/40">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground">
              Find answers to common questions about our products, shipping, and more.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {[
              {
                question: "How long does shipping take?",
                answer:
                  "Standard shipping typically takes 3-5 business days within the continental US. International shipping can take 7-14 business days depending on the destination.",
              },
              {
                question: "What is your return policy?",
                answer:
                  "We offer a 30-day return policy for all unused and undamaged products. Please contact our customer service team to initiate a return.",
              },
              {
                question: "Are your products handmade?",
                answer:
                  "Yes, all of our products are handcrafted by skilled local artisans using traditional techniques and high-quality materials.",
              },
              {
                question: "Do you offer wholesale options?",
                answer:
                  "Yes, we do offer wholesale options for retailers. Please contact our sales team at wholesale@kureno.com for more information.",
              },
              {
                question: "How can I track my order?",
                answer:
                  "Once your order ships, you will receive a confirmation email with tracking information. You can also track your order by logging into your account on our website.",
              },
            ].map((faq, index) => (
              <div key={index} className="border rounded-lg p-6 bg-background">
                <h3 className="text-lg font-medium mb-2">{faq.question}</h3>
                <p className="text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
