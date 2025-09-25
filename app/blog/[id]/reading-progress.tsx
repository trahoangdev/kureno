"use client"

import { useState, useEffect } from "react"
import { Progress } from "@/components/ui/progress"

export default function ReadingProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const updateProgress = () => {
      const article = document.querySelector('article')
      if (!article) return

      const articleTop = article.offsetTop
      const articleHeight = article.offsetHeight
      const windowHeight = window.innerHeight
      const scrollTop = window.scrollY

      // Calculate how much of the article has been scrolled through
      const articleStart = articleTop - windowHeight * 0.1 // Start counting when article is 10% visible
      const articleEnd = articleTop + articleHeight - windowHeight * 0.9 // End when 90% through

      if (scrollTop <= articleStart) {
        setProgress(0)
      } else if (scrollTop >= articleEnd) {
        setProgress(100)
      } else {
        const progressPercent = ((scrollTop - articleStart) / (articleEnd - articleStart)) * 100
        setProgress(Math.max(0, Math.min(100, progressPercent)))
      }
    }

    // Update progress on scroll
    const handleScroll = () => {
      requestAnimationFrame(updateProgress)
    }

    window.addEventListener('scroll', handleScroll)
    updateProgress() // Initial calculation

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b">
      <Progress 
        value={progress} 
        className="h-1 rounded-none border-none"
      />
    </div>
  )
}
