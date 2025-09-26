"use client"

import { Button } from "@/components/ui/button"
import { Heart, Loader2 } from "lucide-react"
import { useWishlist } from "@/hooks/use-wishlist"
import { cn } from "@/lib/utils"

interface WishlistButtonProps {
  productId: string
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
  showText?: boolean
}

export default function WishlistButton({
  productId,
  variant = "outline",
  size = "lg",
  className,
  showText = true
}: WishlistButtonProps) {
  const { isInWishlist, toggleWishlist, isLoading } = useWishlist()
  const inWishlist = isInWishlist(productId)

  const handleClick = async () => {
    await toggleWishlist(productId)
  }

  return (
    <Button
      variant={inWishlist ? "default" : variant}
      size={size}
      className={cn(
        "transition-all duration-200",
        inWishlist && "bg-red-500 hover:bg-red-600 text-white",
        className
      )}
      onClick={handleClick}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Heart 
          className={cn(
            "h-4 w-4",
            showText && "mr-2",
            inWishlist && "fill-current"
          )} 
        />
      )}
      {showText && (inWishlist ? "In Wishlist" : "Add to Wishlist")}
    </Button>
  )
}
