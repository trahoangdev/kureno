"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Heart, Share2, Bookmark, Eye } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useSession } from "next-auth/react"

interface BlogInteractionsProps {
  postId: string
  postTitle: string
}

interface InteractionsData {
  likes: number
  bookmarks: number
  views: number
  userInteractions: {
    liked: boolean
    bookmarked: boolean
  }
}

export default function BlogInteractions({ postId, postTitle }: BlogInteractionsProps) {
  const { toast } = useToast()
  const { data: session } = useSession()
  const [interactions, setInteractions] = useState<InteractionsData>({
    likes: 0,
    bookmarks: 0,
    views: 0,
    userInteractions: {
      liked: false,
      bookmarked: false
    }
  })
  const [isLoading, setIsLoading] = useState(false)

  // Fetch interactions on component mount
  useEffect(() => {
    const fetchInteractions = async () => {
      try {
        const res = await fetch(`/api/blog/${postId}/interactions`)
        if (res.ok) {
          const data = await res.json()
          setInteractions(data.interactions)
        }
      } catch (error) {
        console.error('Error fetching interactions:', error)
      }
    }

    fetchInteractions()

    // Track page view
    const trackView = async () => {
      try {
        await fetch(`/api/blog/${postId}/interactions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'view' })
        })
      } catch (error) {
        console.error('Error tracking view:', error)
      }
    }

    // Track view only if user is logged in (to avoid inflating views)
    if (session?.user) {
      trackView()
    }
  }, [postId, session])

  const handleInteraction = async (action: string) => {
    if (!session?.user) {
      toast({
        title: "Login Required",
        description: "Please login to interact with posts",
        variant: "destructive"
      })
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch(`/api/blog/${postId}/interactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      })

      if (res.ok) {
        const data = await res.json()
        setInteractions(data.interactions)
        
        const actionLabels = {
          like: "Liked",
          unlike: "Unliked", 
          bookmark: "Bookmarked",
          unbookmark: "Removed from bookmarks"
        }
        
        toast({
          title: actionLabels[action as keyof typeof actionLabels],
          description: `Post ${action.includes('un') ? 'removed from' : 'added to'} your ${action.includes('like') ? 'likes' : 'bookmarks'}`,
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update interaction",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleLike = () => {
    const action = interactions.userInteractions.liked ? 'unlike' : 'like'
    handleInteraction(action)
  }

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: postTitle,
          text: `Check out this blog post: ${postTitle}`,
          url: window.location.href,
        })
      } else {
        await navigator.clipboard.writeText(window.location.href)
        toast({
          title: "Link copied",
          description: "Post link has been copied to clipboard",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to share post",
        variant: "destructive",
      })
    }
  }

  const handleBookmark = () => {
    const action = interactions.userInteractions.bookmarked ? 'unbookmark' : 'bookmark'
    handleInteraction(action)
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleLike}
        disabled={isLoading}
        className={interactions.userInteractions.liked ? "text-red-500 border-red-500" : ""}
      >
        <Heart className={`mr-2 h-4 w-4 ${interactions.userInteractions.liked ? "fill-current" : ""}`} />
        {interactions.likes}
      </Button>
      
      <Button variant="outline" size="sm" onClick={handleShare} disabled={isLoading}>
        <Share2 className="mr-2 h-4 w-4" />
        Share
      </Button>
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleBookmark}
        disabled={isLoading}
        className={interactions.userInteractions.bookmarked ? "text-blue-500 border-blue-500" : ""}
      >
        <Bookmark className={`mr-2 h-4 w-4 ${interactions.userInteractions.bookmarked ? "fill-current" : ""}`} />
        {interactions.bookmarks}
      </Button>

      {/* Views counter (read-only) */}
      <div className="flex items-center gap-1 px-3 py-1 text-sm text-muted-foreground border rounded-md">
        <Eye className="h-4 w-4" />
        {interactions.views} views
      </div>
    </div>
  )
}
