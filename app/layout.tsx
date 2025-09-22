import type React from "react"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { siteConfig } from "@/config/site"
import AppShell from "@/components/app-shell"
import { CartProvider } from "@/context/cart-context"
import { SessionProvider } from "@/components/session-provider"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: ["Kureno", "Local brand", "Products", "Services", "Blog"],
  authors: [
    {
      name: "Kureno",
      url: "https://kureno.com",
    },
  ],
  creator: "Kureno",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    creator: "@kureno",
  },
  icons: {
    icon: "./favicon.ico",
    shortcut: "./favicon-16x16.png",
    apple: "./apple-touch-icon.png",
  },
  manifest: `${siteConfig.url}/site.webmanifest`,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <SessionProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <CartProvider>
              <AppShell>{children}</AppShell>
              <Toaster />
            </CartProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
