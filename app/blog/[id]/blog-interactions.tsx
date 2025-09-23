"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Heart, Share2, Bookmark } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface BlogInteractionsProps {
  postId: string
  postTitle: string
}

export default function BlogInteractions({ postId, postTitle }: BlogInteractionsProps) {
  const { toast } = useToast()
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [likeCount, setLikeCount] = useState(42) // Mock data

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1)
    toast({
      title: isLiked ? "Unliked" : "Liked",
      description: isLiked ? "You unliked this post" : "You liked this post",
    })
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
    setIsBookmarked(!isBookmarked)
    toast({
      title: isBookmarked ? "Removed from bookmarks" : "Added to bookmarks",
      description: isBookmarked ? "Post removed from your bookmarks" : "Post added to your bookmarks",
    })
  }

  return (
    <div className="flex gap-2">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleLike}
        className={isLiked ? "text-red-500 border-red-500" : ""}
      >
        <Heart className={`mr-2 h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
        {likeCount}
      </Button>
      <Button variant="outline" size="sm" onClick={handleShare}>
        <Share2 className="mr-2 h-4 w-4" />
        Share
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleBookmark}
        className={isBookmarked ? "text-blue-500 border-blue-500" : ""}
      >
        <Bookmark className={`mr-2 h-4 w-4 ${isBookmarked ? "fill-current" : ""}`} />
        Save
      </Button>
    </div>
  )
}
