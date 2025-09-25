"use client"

import { useState, useCallback } from "react"
import ProductVariants from "./product-variants"
import AddToCart from "./product-add-to-cart"

interface ProductVariantsWrapperProps {
  productId: string
  name: string
  price: number
  image: string
  basePrice: number
}

export default function ProductVariantsWrapper({
  productId,
  name,
  price,
  image,
  basePrice
}: ProductVariantsWrapperProps) {
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({})
  const [totalPrice, setTotalPrice] = useState(basePrice)

  const handleVariantChange = useCallback((variants: Record<string, string>, newTotalPrice: number) => {
    setSelectedVariants(variants)
    setTotalPrice(newTotalPrice)
  }, [])

  return (
    <div className="space-y-6">
      <ProductVariants 
        productId={productId}
        basePrice={basePrice}
        onVariantChange={handleVariantChange}
      />
      
      <AddToCart 
        id={productId}
        name={name}
        price={price}
        image={image}
        variants={selectedVariants}
        totalPrice={totalPrice}
      />
    </div>
  )
}
