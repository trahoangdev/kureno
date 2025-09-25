"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import {
  Search,
  Trash2,
  Edit,
  Eye,
  MessageCircle,
  Heart,
  Reply,
  Calendar,
  User,
  FileText,
  MoreHorizontal,
  Filter,
  RefreshCw
} from "lucide-react"
import Link from "next/link"

interface Comment {
  _id: string
  content: string
  author: {
    _id: string
    name: string
    email: string
  } | null
  post: {
    _id: string
    title: string
    slug: string
  } | null
  parentId?: string
  likes: number
  createdAt: string
  updatedAt: string
  replies?: Comment[]
}

interface CommentStats {
  total: number
  totalLikes: number
  totalReplies: number
  recentComments: number
}

export default function AdminComments() {
  const { toast } = useToast()
  const [comments, setComments] = useState<Comment[]>([])
  const [stats, setStats] = useState<CommentStats>({
    total: 0,
    totalLikes: 0,
    totalReplies: 0,
    recentComments: 0
  })
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("createdAt")
  const [sortOrder, setSortOrder] = useState("desc")
  const [selectedComments, setSelectedComments] = useState<string[]>([])
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showViewDialog, setShowViewDialog] = useState(false)
  const [editingComment, setEditingComment] = useState<Comment | null>(null)
  const [viewingComment, setViewingComment] = useState<Comment | null>(null)
  const [editContent, setEditContent] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // Fetch comments
  const fetchComments = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
        search: searchQuery,
        sortBy,
        sortOrder
      })

      const res = await fetch(`/api/admin/comments?${params}`)
      if (res.ok) {
        const data = await res.json()
        setComments(data.comments)
        setStats(data.statistics)
        setTotalPages(data.pagination.pages)
      } else {
        throw new Error('Failed to fetch comments')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch comments",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchComments()
  }, [currentPage, searchQuery, sortBy, sortOrder])

  // Handle comment selection
  const handleSelectComment = (commentId: string) => {
    setSelectedComments(prev =>
      prev.includes(commentId)
        ? prev.filter(id => id !== commentId)
        : [...prev, commentId]
    )
  }

  const handleSelectAll = () => {
    setSelectedComments(
      selectedComments.length === comments.length
        ? []
        : comments.map(comment => comment._id)
    )
  }

  // Handle bulk delete
  const handleBulkDelete = async () => {
    if (selectedComments.length === 0) return

    try {
      const res = await fetch('/api/admin/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete',
          commentIds: selectedComments
        })
      })

      if (res.ok) {
        toast({
          title: "Success",
          description: `Deleted ${selectedComments.length} comment(s)`
        })
        setSelectedComments([])
        fetchComments()
      } else {
        throw new Error('Failed to delete comments')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete comments",
        variant: "destructive"
      })
    } finally {
      setShowDeleteDialog(false)
    }
  }

  // Handle edit comment
  const handleEditComment = async () => {
    if (!editingComment || !editContent.trim()) return

    try {
      const res = await fetch(`/api/admin/comments/${editingComment._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: editContent })
      })

      if (res.ok) {
        toast({
          title: "Success",
          description: "Comment updated successfully"
        })
        fetchComments()
      } else {
        throw new Error('Failed to update comment')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update comment",
        variant: "destructive"
      })
    } finally {
      setShowEditDialog(false)
      setEditingComment(null)
      setEditContent("")
    }
  }

  // Handle delete single comment
  const handleDeleteComment = async (commentId: string) => {
    try {
      const res = await fetch(`/api/admin/comments/${commentId}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        toast({
          title: "Success",
          description: "Comment deleted successfully"
        })
        fetchComments()
      } else {
        throw new Error('Failed to delete comment')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete comment",
        variant: "destructive"
      })
    }
  }

  // Open edit dialog
  const openEditDialog = (comment: Comment) => {
    setEditingComment(comment)
    setEditContent(comment.content)
    setShowEditDialog(true)
  }

  // Open view dialog
  const openViewDialog = async (comment: Comment) => {
    try {
      const res = await fetch(`/api/admin/comments/${comment._id}`)
      if (res.ok) {
        const data = await res.json()
        setViewingComment(data.comment)
        setShowViewDialog(true)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load comment details",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Comments Management</h1>
          <p className="text-muted-foreground">
            Manage blog post comments and user interactions
          </p>
        </div>
        <Button onClick={fetchComments} variant="outline" size="sm">
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Comments</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Likes</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalLikes}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Replies</CardTitle>
            <Reply className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalReplies}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent (24h)</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.recentComments}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search comments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt">Created Date</SelectItem>
                <SelectItem value="likes">Likes</SelectItem>
                <SelectItem value="updatedAt">Updated Date</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">Descending</SelectItem>
                <SelectItem value="asc">Ascending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedComments.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {selectedComments.length} comment(s) selected
              </span>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Selected
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Comments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Comments</CardTitle>
          <CardDescription>
            All blog post comments and replies
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="animate-pulse flex items-center space-x-4">
                  <div className="h-4 w-4 bg-muted rounded" />
                  <div className="h-8 w-8 bg-muted rounded-full" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedComments.length === comments.length}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Content</TableHead>
                  <TableHead>Post</TableHead>
                  <TableHead>Likes</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {comments.map((comment) => (
                  <TableRow key={comment._id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedComments.includes(comment._id)}
                        onCheckedChange={() => handleSelectComment(comment._id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage 
                            src={`https://api.dicebear.com/7.x/initials/svg?seed=${comment.author?.name || 'Unknown'}`} 
                          />
                          <AvatarFallback>{comment.author?.name?.charAt(0) || 'U'}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{comment.author?.name || 'Unknown User'}</div>
                          <div className="text-sm text-muted-foreground">
                            {comment.author?.email || 'No email'}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-md">
                        <p className="line-clamp-2">{comment.content}</p>
                        {comment.parentId && (
                          <Badge variant="secondary" className="mt-1">
                            Reply
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {comment.post ? (
                        <Link 
                          href={`/blog/${comment.post._id}`}
                          className="text-primary hover:underline"
                        >
                          {comment.post.title}
                        </Link>
                      ) : (
                        <span className="text-muted-foreground">Unknown Post</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Heart className="h-4 w-4 text-red-500" />
                        {comment.likes}
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openViewDialog(comment)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(comment)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteComment(comment._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Comments</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedComments.length} comment(s)? 
              This action cannot be undone and will also delete all replies.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleBulkDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Comment</DialogTitle>
            <DialogDescription>
              Make changes to the comment content
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              placeholder="Comment content..."
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditComment}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Comment Details</DialogTitle>
          </DialogHeader>
          {viewingComment && (
            <div className="space-y-6">
              {/* Comment Info */}
              <div className="flex items-start gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage 
                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${viewingComment.author?.name || 'Unknown'}`} 
                  />
                  <AvatarFallback>{viewingComment.author?.name?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium">{viewingComment.author?.name || 'Unknown User'}</span>
                    <span className="text-sm text-muted-foreground">
                      {viewingComment.author?.email || 'No email'}
                    </span>
                    <Badge variant="secondary">
                      {new Date(viewingComment.createdAt).toLocaleDateString()}
                    </Badge>
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <p>{viewingComment.content}</p>
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Heart className="h-4 w-4" />
                      {viewingComment.likes} likes
                    </div>
                    <div className="flex items-center gap-1">
                      <FileText className="h-4 w-4" />
                      {viewingComment.post ? (
                        <Link 
                          href={`/blog/${viewingComment.post._id}`}
                          className="text-primary hover:underline"
                        >
                          {viewingComment.post.title}
                        </Link>
                      ) : (
                        <span className="text-muted-foreground">Unknown Post</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Replies */}
              {viewingComment.replies && viewingComment.replies.length > 0 && (
                <div>
                  <h4 className="font-medium mb-4">
                    Replies ({viewingComment.replies.length})
                  </h4>
                  <div className="space-y-4 pl-6 border-l-2 border-muted">
                    {viewingComment.replies.map((reply) => (
                      <div key={reply._id} className="flex items-start gap-4">
                        <Avatar className="h-8 w-8">
                          <AvatarImage 
                            src={`https://api.dicebear.com/7.x/initials/svg?seed=${reply.author?.name || 'Unknown'}`} 
                          />
                          <AvatarFallback>{reply.author?.name?.charAt(0) || 'U'}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm">{reply.author?.name || 'Unknown User'}</span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(reply.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm">{reply.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
