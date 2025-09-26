"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useToast } from "@/components/ui/use-toast"

export function useWishlist() {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [wishlistItems, setWishlistItems] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Fetch user's wishlist on mount
  useEffect(() => {
    const fetchWishlist = async () => {
      if (!session?.user) return

      try {
        const response = await fetch("/api/user/wishlist")
        if (response.ok) {
          const data = await response.json()
          const productIds = data.wishlist?.map((item: any) => item.productId._id) || []
          setWishlistItems(productIds)
        }
      } catch (error) {
        console.error("Error fetching wishlist:", error)
      }
    }

    fetchWishlist()
  }, [session])

  const isInWishlist = (productId: string) => {
    return wishlistItems.includes(productId)
  }

  const addToWishlist = async (productId: string) => {
    if (!session?.user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to add items to your wishlist.",
        variant: "destructive"
      })
      return false
    }

    try {
      setIsLoading(true)
      const response = await fetch("/api/user/wishlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ productId })
      })

      const data = await response.json()

      if (response.ok) {
        setWishlistItems(prev => [...prev, productId])
        toast({
          title: "Added to wishlist",
          description: "Item has been added to your wishlist."
        })
        return true
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to add item to wishlist.",
          variant: "destructive"
        })
        return false
      }
    } catch (error) {
      console.error("Error adding to wishlist:", error)
      toast({
        title: "Error",
        description: "Failed to add item to wishlist.",
        variant: "destructive"
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const removeFromWishlist = async (productId: string) => {
    if (!session?.user) return false

    try {
      setIsLoading(true)
      
      // Find the wishlist item ID
      const response = await fetch("/api/user/wishlist")
      if (!response.ok) return false
      
      const data = await response.json()
      const wishlistItem = data.wishlist?.find((item: any) => item.productId._id === productId)
      
      if (!wishlistItem) return false

      const deleteResponse = await fetch(`/api/user/wishlist/${wishlistItem._id}`, {
        method: "DELETE"
      })

      if (deleteResponse.ok) {
        setWishlistItems(prev => prev.filter(id => id !== productId))
        toast({
          title: "Removed from wishlist",
          description: "Item has been removed from your wishlist."
        })
        return true
      } else {
        const deleteData = await deleteResponse.json()
        toast({
          title: "Error",
          description: deleteData.error || "Failed to remove item from wishlist.",
          variant: "destructive"
        })
        return false
      }
    } catch (error) {
      console.error("Error removing from wishlist:", error)
      toast({
        title: "Error",
        description: "Failed to remove item from wishlist.",
        variant: "destructive"
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const toggleWishlist = async (productId: string) => {
    if (isInWishlist(productId)) {
      return await removeFromWishlist(productId)
    } else {
      return await addToWishlist(productId)
    }
  }

  return {
    wishlistItems,
    isInWishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isLoading
  }
}
