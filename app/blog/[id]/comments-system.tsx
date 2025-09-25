"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, Send, Heart, Reply, MoreHorizontal } from "lucide-react"
import { useSession } from "next-auth/react"
import { useToast } from "@/hooks/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Comment {
  _id: string
  content: string
  author: {
    _id: string
    name: string
    email: string
  }
  createdAt: string
  likes: number
  likedBy: string[]
  replies: Comment[]
}

interface CommentsSystemProps {
  postId: string
}

export default function CommentsSystem({ postId }: CommentsSystemProps) {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch comments
  useEffect(() => {
    const fetchComments = async () => {
      try {
        setIsLoading(true)
        const res = await fetch(`/api/blog/${postId}/comments`)
        if (res.ok) {
          const data = await res.json()
          setComments(data.comments || [])
        }
      } catch (error) {
        console.error('Error fetching comments:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchComments()
  }, [postId])

  const handleSubmitComment = async () => {
    if (!session?.user) {
      toast({
        title: "Login Required",
        description: "Please login to post comments",
        variant: "destructive"
      })
      return
    }

    if (!newComment.trim()) {
      toast({
        title: "Empty Comment",
        description: "Please write something before posting",
        variant: "destructive"
      })
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch(`/api/blog/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newComment })
      })

      const data = await res.json()

      if (res.ok) {
        setComments([data.comment, ...comments])
        setNewComment("")
        toast({
          title: "Comment Posted",
          description: "Your comment has been added successfully"
        })
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to post comment",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error posting comment:', error)
      toast({
        title: "Error",
        description: "Failed to post comment",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmitReply = async (parentId: string) => {
    if (!session?.user || !replyContent.trim()) return

    setIsSubmitting(true)
    try {
      const res = await fetch(`/api/blog/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          content: replyContent,
          parentId 
        })
      })

      if (res.ok) {
        // Refresh comments to show the new reply
        const commentsRes = await fetch(`/api/blog/${postId}/comments`)
        if (commentsRes.ok) {
          const data = await commentsRes.json()
          setComments(data.comments || [])
        }
        
        setReplyContent("")
        setReplyingTo(null)
        toast({
          title: "Reply Posted",
          description: "Your reply has been added successfully"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to post reply",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLikeComment = async (commentId: string) => {
    if (!session?.user) {
      toast({
        title: "Login Required",
        description: "Please login to like comments",
        variant: "destructive"
      })
      return
    }

    try {
      const res = await fetch(`/api/blog/${postId}/comments/${commentId}/like`, {
        method: 'POST'
      })

      if (res.ok) {
        // Refresh comments to show updated likes
        const commentsRes = await fetch(`/api/blog/${postId}/comments`)
        if (commentsRes.ok) {
          const data = await commentsRes.json()
          setComments(data.comments || [])
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update like",
        variant: "destructive"
      })
    }
  }

  const CommentItem = ({ comment, isReply = false }: { comment: Comment, isReply?: boolean }) => {
    const userId = session?.user?.id || (session?.user as any)?.id
    const isLiked = userId && comment.likedBy.includes(userId)
    
    return (
      <div className={`${isReply ? 'ml-12' : ''} border-l-2 border-muted pl-4`}>
        <div className="flex items-start gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${comment.author.name}`} />
            <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-sm">{comment.author.name}</span>
              <span className="text-xs text-muted-foreground">
                {new Date(comment.createdAt).toLocaleDateString()}
              </span>
            </div>
            
            <p className="text-sm mb-2">{comment.content}</p>
            
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleLikeComment(comment._id)}
                className={`h-6 px-2 ${isLiked ? 'text-red-500' : 'text-muted-foreground'}`}
              >
                <Heart className={`h-3 w-3 mr-1 ${isLiked ? 'fill-current' : ''}`} />
                {comment.likes || 0}
              </Button>
              
              {!isReply && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setReplyingTo(replyingTo === comment._id ? null : comment._id)}
                  className="h-6 px-2 text-muted-foreground"
                >
                  <Reply className="h-3 w-3 mr-1" />
                  Reply
                </Button>
              )}
            </div>

            {/* Reply form */}
            {replyingTo === comment._id && (
              <div className="mt-3 space-y-2">
                <Textarea
                  placeholder="Write your reply..."
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  className="min-h-[60px]"
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleSubmitReply(comment._id)}
                    disabled={isSubmitting || !replyContent.trim()}
                  >
                    <Send className="h-3 w-3 mr-1" />
                    Reply
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setReplyingTo(null)
                      setReplyContent("")
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-4 space-y-4">
            {comment.replies.map((reply) => (
              <CommentItem key={reply._id} comment={reply} isReply={true} />
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <Card className="mt-12">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Comments ({comments.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Comment form */}
        <div className="space-y-4">
          <Textarea
            placeholder={session?.user ? "Share your thoughts..." : "Please login to comment"}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            disabled={!session?.user}
            className="min-h-[100px]"
          />
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              {session?.user ? `Posting as ${session.user.name}` : "Login required to comment"}
            </span>
            <Button
              onClick={handleSubmitComment}
              disabled={isSubmitting || !session?.user || !newComment.trim()}
            >
              <Send className="h-4 w-4 mr-2" />
              Post Comment
            </Button>
          </div>
        </div>

        {/* Comments list */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse flex gap-3">
                <div className="h-8 w-8 bg-muted rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-1/4" />
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : comments.length > 0 ? (
          <div className="space-y-6">
            {comments.map((comment) => (
              <CommentItem key={comment._id} comment={comment} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No comments yet. Be the first to share your thoughts!</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
