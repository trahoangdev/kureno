"use client"

import { Button } from "@/components/ui/button"
import { useCart } from "@/context/cart-context"

export default function AddToCart({ id, name, price, image }: { id: string; name: string; price: number; image: string }) {
  const { addItem } = useCart()
  return (
    <Button className="mt-6" onClick={() => addItem({ id, name, price, image, quantity: 1 })}>
      Add to Cart
    </Button>
  )
}


