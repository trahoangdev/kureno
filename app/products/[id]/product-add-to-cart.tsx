"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCart } from "@/context/cart-context"
import { ShoppingCart, Plus, Minus, Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function AddToCart({ 
  id, 
  name, 
  price, 
  image, 
  variants = {},
  totalPrice 
}: { 
  id: string; 
  name: string; 
  price: number; 
  image: string;
  variants?: Record<string, string>;
  totalPrice?: number;
}) {
  const { addItem } = useCart()
  const { toast } = useToast()
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const [added, setAdded] = useState(false)

  const handleAddToCart = async () => {
    setIsAdding(true)
    try {
      const finalPrice = totalPrice || price
      const itemName = Object.keys(variants).length > 0 
        ? `${name} (${Object.values(variants).join(', ')})`
        : name
      
      addItem({ 
        id, 
        name: itemName, 
        price: finalPrice, 
        image, 
        quantity,
        variants: Object.keys(variants).length > 0 ? variants : undefined
      })
      setAdded(true)
      toast({
        title: "Success",
        description: `${itemName} added to cart!`,
      })
      
      // Reset after 2 seconds
      setTimeout(() => {
        setAdded(false)
        setQuantity(1)
      }, 2000)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      })
    } finally {
      setIsAdding(false)
    }
  }

  const incrementQuantity = () => {
    setQuantity(prev => Math.min(prev + 1, 10))
  }

  const decrementQuantity = () => {
    setQuantity(prev => Math.max(prev - 1, 1))
  }

  return (
    <div className="space-y-4">
      {/* Quantity Selector */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium">Quantity:</span>
        <div className="flex items-center border rounded-md">
          <Button
            variant="ghost"
            size="sm"
            onClick={decrementQuantity}
            disabled={quantity <= 1}
            className="h-8 w-8 p-0"
          >
            <Minus className="h-4 w-4" />
          </Button>
          <Input
            type="number"
            min="1"
            max="10"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))}
            className="w-16 h-8 text-center border-0 focus-visible:ring-0"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={incrementQuantity}
            disabled={quantity >= 10}
            className="h-8 w-8 p-0"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Add to Cart Button */}
      <Button
        size="lg"
        className="w-full bg-teal-600 hover:bg-teal-700 text-white"
        onClick={handleAddToCart}
        disabled={isAdding}
      >
        {added ? (
          <>
            <Check className="mr-2 h-4 w-4" />
            Added to Cart
          </>
        ) : (
          <>
            <ShoppingCart className="mr-2 h-4 w-4" />
            {isAdding ? "Adding..." : "Add to Cart"}
          </>
        )}
      </Button>

      {/* Price Summary */}
      <div className="text-center text-sm text-muted-foreground">
        Total: <span className="font-semibold text-foreground">
          ${((totalPrice || Number(price)) * quantity).toFixed(2)}
        </span>
        {totalPrice && totalPrice !== Number(price) && (
          <div className="text-xs mt-1">
            <span className="line-through text-muted-foreground">
              ${(Number(price) * quantity).toFixed(2)}
            </span>
            <span className="text-green-600 ml-1">
              Save ${((Number(price) - totalPrice) * quantity).toFixed(2)}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}


