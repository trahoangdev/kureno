"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronRight, List } from "lucide-react"

interface TOCItem {
  id: string
  title: string
  level: number
}

interface TableOfContentsProps {
  content: string
}

export default function TableOfContents({ content }: TableOfContentsProps) {
  const [tocItems, setTocItems] = useState<TOCItem[]>([])
  const [activeId, setActiveId] = useState<string>("")
  const [isCollapsed, setIsCollapsed] = useState(false)

  // Extract headings from markdown content
  useEffect(() => {
    const headingRegex = /^(#{1,6})\s+(.+)$/gm
    const items: TOCItem[] = []
    let match

    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length
      const title = match[2].trim()
      const id = title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()

      items.push({ id, title, level })
    }

    setTocItems(items)
  }, [content])

  // Track active heading based on scroll position
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      {
        rootMargin: '-20% 0% -35% 0%',
        threshold: 0
      }
    )

    // Observe all headings
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6')
    headings.forEach((heading) => {
      if (heading.id) {
        observer.observe(heading)
      }
    })

    return () => observer.disconnect()
  }, [tocItems])

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      })
    }
  }

  if (tocItems.length === 0) {
    return null
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold flex items-center gap-2">
            <List className="h-4 w-4" />
            Table of Contents
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="h-6 w-6 p-0"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>

        {!isCollapsed && (
          <nav className="space-y-2">
            {tocItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToHeading(item.id)}
                className={`
                  block w-full text-left text-sm transition-colors hover:text-primary
                  ${activeId === item.id ? 'text-primary font-medium' : 'text-muted-foreground'}
                  ${item.level === 1 ? 'pl-0' : ''}
                  ${item.level === 2 ? 'pl-3' : ''}
                  ${item.level === 3 ? 'pl-6' : ''}
                  ${item.level === 4 ? 'pl-9' : ''}
                  ${item.level === 5 ? 'pl-12' : ''}
                  ${item.level === 6 ? 'pl-15' : ''}
                `}
              >
                <div className="flex items-center gap-2 py-1">
                  <div 
                    className={`h-1 w-1 rounded-full transition-all ${
                      activeId === item.id 
                        ? 'bg-primary scale-150' 
                        : 'bg-muted-foreground'
                    }`} 
                  />
                  <span className="line-clamp-2">{item.title}</span>
                </div>
              </button>
            ))}
          </nav>
        )}
      </CardContent>
    </Card>
  )
}
