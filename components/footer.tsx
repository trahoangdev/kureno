import Link from "next/link"
import { siteConfig } from "@/config/site"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Facebook, Instagram, Twitter } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-muted/40">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link href="/" className="group flex items-center gap-3 mb-4">
              <div className="relative w-12 h-12 rounded-xl bg-white dark:bg-gray-900 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105 border border-border/20 overflow-hidden">
                <div className="absolute -inset-1 bg-gradient-to-r from-teal-500 to-emerald-600 rounded-xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                <img 
                  src="/logo.svg" 
                  alt="Kureno Logo" 
                  className="w-8 h-8 transition-transform duration-300 group-hover:scale-110 relative z-10"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold bg-gradient-to-r from-teal-500 to-emerald-600 bg-clip-text text-transparent">
                  Kureno
                </span>
                <span className="text-xs text-muted-foreground font-medium tracking-wide">
                  Crafting Heritage
                </span>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Kureno was born from a passion for authentic local craftsmanship and a desire to share our heritage with the world. Every product we create preserves traditional techniques while celebrating our community's unique identity.
            </p>
          </div>
          <div>
            <h3 className="text-base font-medium mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-base font-medium mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Returns & Refunds
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-base font-medium mb-4">Subscribe</h3>
            <p className="text-sm text-muted-foreground mb-4">Stay updated with our latest products and offers.</p>
            <form className="flex flex-col sm:flex-row gap-2">
              <Input type="email" placeholder="Enter your email" className="flex-1" />
              <Button type="submit">Subscribe</Button>
            </form>
            <div className="flex items-center gap-3 mt-6">
              <span className="text-xs text-muted-foreground font-medium">Follow us:</span>
              <div className="flex items-center gap-2">
                <Link href={siteConfig.links.twitter} target="_blank" rel="noreferrer">
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950 transition-all duration-300">
                    <Twitter className="h-4 w-4" />
                    <span className="sr-only">Twitter</span>
                  </Button>
                </Link>
                <Link href={siteConfig.links.instagram} target="_blank" rel="noreferrer">
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-pink-50 hover:text-pink-600 dark:hover:bg-pink-950 transition-all duration-300">
                    <Instagram className="h-4 w-4" />
                    <span className="sr-only">Instagram</span>
                  </Button>
                </Link>
                <Link href={siteConfig.links.facebook} target="_blank" rel="noreferrer">
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-950 transition-all duration-300">
                    <Facebook className="h-4 w-4" />
                    <span className="sr-only">Facebook</span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-lg bg-white dark:bg-gray-900 flex items-center justify-center shadow-sm border border-border/20">
              <img 
                src="/logo.svg" 
                alt="Kureno Logo" 
                className="w-4 h-4"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} Kureno. All rights reserved.
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            Designed and developed with <span className="text-red-500 animate-pulse">❤️</span> for Heritage
          </p>
        </div>
      </div>
    </footer>
  )
}
