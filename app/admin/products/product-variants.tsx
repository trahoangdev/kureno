"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { 
  Plus, 
  Minus, 
  X, 
  Palette, 
  Package, 
  DollarSign,
  Hash,
  AlertTriangle
} from "lucide-react"

interface Variant {
  id: string
  name: string
  type: string // 'color', 'size', 'material', etc.
  options: VariantOption[]
}

interface VariantOption {
  id: string
  name: string
  value: string
  priceModifier: number
  stock: number
  sku: string
  available: boolean
  image?: string
}

interface ProductVariantsProps {
  variants: Variant[]
  onVariantsChange: (variants: Variant[]) => void
}

export default function ProductVariants({ variants, onVariantsChange }: ProductVariantsProps) {
  const [expandedVariants, setExpandedVariants] = useState<string[]>([])

  const addVariant = () => {
    const newVariant: Variant = {
      id: `variant-${Date.now()}`,
      name: "",
      type: "color",
      options: []
    }
    onVariantsChange([...variants, newVariant])
    setExpandedVariants([...expandedVariants, newVariant.id])
  }

  const removeVariant = (variantId: string) => {
    onVariantsChange(variants.filter(v => v.id !== variantId))
    setExpandedVariants(expandedVariants.filter(id => id !== variantId))
  }

  const updateVariant = (variantId: string, updates: Partial<Variant>) => {
    onVariantsChange(variants.map(v => 
      v.id === variantId ? { ...v, ...updates } : v
    ))
  }

  const addVariantOption = (variantId: string) => {
    const newOption: VariantOption = {
      id: `option-${Date.now()}`,
      name: "",
      value: "",
      priceModifier: 0,
      stock: 0,
      sku: "",
      available: true
    }
    
    onVariantsChange(variants.map(v => 
      v.id === variantId 
        ? { ...v, options: [...v.options, newOption] }
        : v
    ))
  }

  const removeVariantOption = (variantId: string, optionId: string) => {
    onVariantsChange(variants.map(v => 
      v.id === variantId 
        ? { ...v, options: v.options.filter(o => o.id !== optionId) }
        : v
    ))
  }

  const updateVariantOption = (variantId: string, optionId: string, updates: Partial<VariantOption>) => {
    onVariantsChange(variants.map(v => 
      v.id === variantId 
        ? { 
            ...v, 
            options: v.options.map(o => 
              o.id === optionId ? { ...o, ...updates } : o
            )
          }
        : v
    ))
  }

  const toggleVariantExpanded = (variantId: string) => {
    setExpandedVariants(prev => 
      prev.includes(variantId) 
        ? prev.filter(id => id !== variantId)
        : [...prev, variantId]
    )
  }

  const variantTypes = [
    { value: "color", label: "Color" },
    { value: "size", label: "Size" },
    { value: "material", label: "Material" },
    { value: "style", label: "Style" },
    { value: "pattern", label: "Pattern" },
    { value: "finish", label: "Finish" }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Product Variants</h3>
          <p className="text-sm text-muted-foreground">
            Create different variations of your product (colors, sizes, etc.)
          </p>
        </div>
        <Button onClick={addVariant} variant="outline">
          <Plus className="mr-2 h-4 w-4" />
          Add Variant
        </Button>
      </div>

      {variants.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium mb-2">No variants created</h3>
            <p className="text-muted-foreground mb-4">
              Add variants to offer different options for your product
            </p>
            <Button onClick={addVariant}>
              <Plus className="mr-2 h-4 w-4" />
              Create First Variant
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {variants.map((variant) => (
            <Card key={variant.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Palette className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <CardTitle className="text-base">
                        {variant.name || "Untitled Variant"}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {variant.options.length} option(s)
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleVariantExpanded(variant.id)}
                    >
                      {expandedVariants.includes(variant.id) ? "Collapse" : "Expand"}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeVariant(variant.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {expandedVariants.includes(variant.id) && (
                <CardContent className="space-y-4">
                  {/* Variant Settings */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor={`variant-name-${variant.id}`}>Variant Name</Label>
                      <Input
                        id={`variant-name-${variant.id}`}
                        value={variant.name}
                        onChange={(e) => updateVariant(variant.id, { name: e.target.value })}
                        placeholder="e.g., Color, Size, Material"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`variant-type-${variant.id}`}>Variant Type</Label>
                      <Select
                        value={variant.type}
                        onValueChange={(value) => updateVariant(variant.id, { type: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {variantTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Variant Options */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-base font-medium">Options</Label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addVariantOption(variant.id)}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Option
                      </Button>
                    </div>

                    {variant.options.length === 0 ? (
                      <div className="text-center py-4 text-muted-foreground">
                        <Package className="mx-auto h-8 w-8 mb-2" />
                        <p>No options added yet</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {variant.options.map((option) => (
                          <Card key={option.id} className="border-dashed">
                            <CardContent className="p-4">
                              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                                <div className="space-y-2">
                                  <Label>Option Name</Label>
                                  <Input
                                    value={option.name}
                                    onChange={(e) => updateVariantOption(variant.id, option.id, { name: e.target.value })}
                                    placeholder="e.g., Red, Large, Cotton"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Value</Label>
                                  <Input
                                    value={option.value}
                                    onChange={(e) => updateVariantOption(variant.id, option.id, { value: e.target.value })}
                                    placeholder="e.g., #FF0000, L, 100% Cotton"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Price Modifier ($)</Label>
                                  <Input
                                    type="number"
                                    step="0.01"
                                    value={option.priceModifier}
                                    onChange={(e) => updateVariantOption(variant.id, option.id, { priceModifier: parseFloat(e.target.value) || 0 })}
                                    placeholder="0.00"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Stock</Label>
                                  <Input
                                    type="number"
                                    min="0"
                                    value={option.stock}
                                    onChange={(e) => updateVariantOption(variant.id, option.id, { stock: parseInt(e.target.value) || 0 })}
                                    placeholder="0"
                                  />
                                </div>
                              </div>
                              
                              <div className="grid gap-4 md:grid-cols-2 mt-4">
                                <div className="space-y-2">
                                  <Label>SKU</Label>
                                  <Input
                                    value={option.sku}
                                    onChange={(e) => updateVariantOption(variant.id, option.id, { sku: e.target.value })}
                                    placeholder="Unique SKU"
                                  />
                                </div>
                                <div className="flex items-center justify-between">
                                  <div>
                                    <Label>Available</Label>
                                    <p className="text-xs text-muted-foreground">Enable this option</p>
                                  </div>
                                  <Switch
                                    checked={option.available}
                                    onCheckedChange={(checked) => updateVariantOption(variant.id, option.id, { available: checked })}
                                  />
                                </div>
                              </div>

                              <div className="flex justify-end mt-4">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeVariantOption(variant.id, option.id)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Variant Summary */}
      {variants.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Hash className="h-4 w-4" />
              <span className="font-medium">Variant Summary</span>
            </div>
            <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
              {variants.map((variant) => (
                <div key={variant.id} className="flex items-center gap-2">
                  <Badge variant="outline">
                    {variant.name || "Untitled"}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {variant.options.length} option(s)
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
