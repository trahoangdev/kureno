"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import { Suspense } from "react"
import Navbar from "./navbar"
import Footer from "./footer"

function AppShellContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith("/admin")

  if (isAdmin) {
    return <>{children}</>
  }

  return (
    <div className="relative flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 pt-16">{children}</main>
      <Footer />
    </div>
  )
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={
      <div className="relative flex min-h-screen flex-col">
        <div className="h-16 bg-background border-b" />
        <main className="flex-1 pt-16">{children}</main>
        <Footer />
      </div>
    }>
      <AppShellContent>{children}</AppShellContent>
    </Suspense>
  )
}


