"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { 
  Palette, 
  Ruler, 
  Package, 
  Check,
  AlertCircle
} from "lucide-react"

interface Variant {
  id: string
  name: string
  value: string
  available: boolean
  priceModifier?: number
  image?: string
}

interface ProductVariantsProps {
  productId: string
  basePrice: number
  onVariantChange?: (variants: Record<string, string>, totalPrice: number) => void
}

export default function ProductVariants({ 
  productId, 
  basePrice, 
  onVariantChange 
}: ProductVariantsProps) {
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({})
  const [priceModifier, setPriceModifier] = useState(0)
  const onVariantChangeRef = useRef(onVariantChange)

  // Update ref when onVariantChange changes
  useEffect(() => {
    onVariantChangeRef.current = onVariantChange
  }, [onVariantChange])

  // Notify parent component when variants change
  useEffect(() => {
    if (onVariantChangeRef.current && Object.keys(selectedVariants).length > 0) {
      const variantValues = Object.entries(selectedVariants).reduce((acc, [type, id]) => {
        const variant = variantOptions[type as keyof typeof variantOptions]?.find(v => v.id === id)
        acc[type] = variant?.value || id
        return acc
      }, {} as Record<string, string>)
      
      onVariantChangeRef.current(variantValues, basePrice + priceModifier)
    }
  }, [selectedVariants, priceModifier, basePrice])

  // Mock variant data - in real app, this would come from API
  const variantOptions = {
    color: [
      { id: "red", name: "Red", value: "Red", available: true, image: "/placeholder-red.jpg" },
      { id: "blue", name: "Blue", value: "Blue", available: true, image: "/placeholder-blue.jpg" },
      { id: "green", name: "Green", value: "Green", available: true, image: "/placeholder-green.jpg" },
      { id: "black", name: "Black", value: "Black", available: false, image: "/placeholder-black.jpg" },
      { id: "white", name: "White", value: "White", available: true, image: "/placeholder-white.jpg" }
    ] as Variant[],
    size: [
      { id: "xs", name: "XS", value: "Extra Small", available: true },
      { id: "s", name: "S", value: "Small", available: true },
      { id: "m", name: "M", value: "Medium", available: true },
      { id: "l", name: "L", value: "Large", available: true },
      { id: "xl", name: "XL", value: "Extra Large", available: false },
      { id: "xxl", name: "XXL", value: "2X Large", available: true, priceModifier: 5 }
    ] as Variant[],
    material: [
      { id: "cotton", name: "Cotton", value: "100% Cotton", available: true },
      { id: "polyester", name: "Polyester", value: "Polyester Blend", available: true, priceModifier: -2 },
      { id: "wool", name: "Wool", value: "Premium Wool", available: true, priceModifier: 10 },
      { id: "silk", name: "Silk", value: "Pure Silk", available: true, priceModifier: 15 }
    ] as Variant[],
    style: [
      { id: "classic", name: "Classic", value: "Classic Style", available: true },
      { id: "modern", name: "Modern", value: "Modern Style", available: true },
      { id: "vintage", name: "Vintage", value: "Vintage Style", available: true, priceModifier: 3 }
    ] as Variant[]
  }

  const handleVariantSelect = (variantType: string, variantId: string) => {
    const newSelectedVariants = {
      ...selectedVariants,
      [variantType]: variantId
    }
    
    setSelectedVariants(newSelectedVariants)
    
    // Calculate price modifier
    let totalModifier = 0
    Object.entries(newSelectedVariants).forEach(([type, id]) => {
      const variant = variantOptions[type as keyof typeof variantOptions]?.find(v => v.id === id)
      if (variant?.priceModifier) {
        totalModifier += variant.priceModifier
      }
    })
    
    setPriceModifier(totalModifier)
  }

  const getVariantIcon = (variantType: string) => {
    switch (variantType) {
      case 'color':
        return <Palette className="h-4 w-4" />
      case 'size':
        return <Ruler className="h-4 w-4" />
      case 'material':
        return <Package className="h-4 w-4" />
      default:
        return <Package className="h-4 w-4" />
    }
  }

  const getVariantLabel = (variantType: string) => {
    switch (variantType) {
      case 'color':
        return 'Color'
      case 'size':
        return 'Size'
      case 'material':
        return 'Material'
      case 'style':
        return 'Style'
      default:
        return variantType.charAt(0).toUpperCase() + variantType.slice(1)
    }
  }

  return (
    <div className="space-y-6">
      {Object.entries(variantOptions).map(([variantType, variants]) => (
        <div key={variantType} className="space-y-3">
          <div className="flex items-center gap-2">
            {getVariantIcon(variantType)}
            <h3 className="font-medium">{getVariantLabel(variantType)}</h3>
            <Badge variant="outline" className="text-xs">
              Required
            </Badge>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {variants.map((variant) => {
              const isSelected = selectedVariants[variantType] === variant.id
              const isAvailable = variant.available
              
              return (
                <Button
                  key={variant.id}
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                  disabled={!isAvailable}
                  onClick={() => handleVariantSelect(variantType, variant.id)}
                  className={`
                    relative min-w-[60px] h-10 px-3
                    ${isSelected 
                      ? 'bg-teal-600 hover:bg-teal-700 text-white border-teal-600' 
                      : 'hover:border-teal-300'
                    }
                    ${!isAvailable 
                      ? 'opacity-50 cursor-not-allowed' 
                      : 'cursor-pointer'
                    }
                    ${variantType === 'color' ? 'flex items-center gap-2' : ''}
                  `}
                >
                  {variantType === 'color' && (
                    <div 
                      className="w-4 h-4 rounded-full border border-gray-300"
                      style={{ 
                        backgroundColor: variant.id === 'red' ? '#ef4444' :
                                       variant.id === 'blue' ? '#3b82f6' :
                                       variant.id === 'green' ? '#22c55e' :
                                       variant.id === 'black' ? '#000000' :
                                       variant.id === 'white' ? '#ffffff' : '#6b7280'
                      }}
                    />
                  )}
                  
                  <span className="text-sm font-medium">
                    {variant.name}
                  </span>
                  
                  {variant.priceModifier && variant.priceModifier > 0 && (
                    <span className="text-xs ml-1">
                      +${variant.priceModifier}
                    </span>
                  )}
                  
                  {variant.priceModifier && variant.priceModifier < 0 && (
                    <span className="text-xs ml-1 text-green-600">
                      ${variant.priceModifier}
                    </span>
                  )}
                  
                  {isSelected && (
                    <Check className="h-3 w-3 ml-1" />
                  )}
                  
                  {!isAvailable && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <AlertCircle className="h-3 w-3 text-red-500" />
                    </div>
                  )}
                </Button>
              )
            })}
          </div>
          
          {variants.some(variant => !variant.available) && (
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              Some variants are currently out of stock
            </p>
          )}
        </div>
      ))}
      
      {/* Price Summary */}
      {Object.keys(selectedVariants).length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Base Price:</span>
                <span className="text-sm">${basePrice.toFixed(2)}</span>
              </div>
              
              {priceModifier !== 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Variant Modifier:</span>
                  <span className={`text-sm ${priceModifier > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {priceModifier > 0 ? '+' : ''}${priceModifier.toFixed(2)}
                  </span>
                </div>
              )}
              
              <Separator />
              
              <div className="flex justify-between items-center">
                <span className="font-semibold">Total Price:</span>
                <span className="font-bold text-lg text-teal-600">
                  ${(basePrice + priceModifier).toFixed(2)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Selected Variants Summary */}
      {Object.keys(selectedVariants).length > 0 && (
        <Card>
          <CardContent className="p-4">
            <h4 className="font-medium mb-3">Selected Options:</h4>
            <div className="space-y-2">
              {Object.entries(selectedVariants).map(([type, id]) => {
                const variant = variantOptions[type as keyof typeof variantOptions]?.find(v => v.id === id)
                return (
                  <div key={type} className="flex justify-between items-center text-sm">
                    <span className="capitalize">{getVariantLabel(type)}:</span>
                    <span className="font-medium">{variant?.value || id}</span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
