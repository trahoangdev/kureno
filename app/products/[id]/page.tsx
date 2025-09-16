"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, Heart, ShoppingCart, Truck, RotateCcw, Shield, Check } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useCart } from "@/context/cart-context"

// Mock product data (in a real app, this would come from an API)
const product = {
  id: "1",
  name: "Handcrafted Wooden Bowl",
  price: 99.0,
  description:
    "This beautifully crafted product exemplifies the essence of Kureno's commitment to quality and local craftsmanship. Each piece is meticulously created by our skilled artisans using traditional techniques passed down through generations.",
  images: [
    "/placeholder.svg?height=500&width=500",
    "/placeholder.svg?height=100&width=100",
    "/placeholder.svg?height=100&width=100",
    "/placeholder.svg?height=100&width=100",
  ],
  colors: ["bg-red-500", "bg-blue-500", "bg-green-500", "bg-yellow-500"],
  sizes: ["S", "M", "L", "XL"],
  stock: 10,
  rating: 4.8,
  reviewCount: 24,
}

export default function ProductPage({ params }: { params: { id: string } }) {
  const [selectedColor, setSelectedColor] = useState(0)
  const [selectedSize, setSelectedSize] = useState(1)
  const [quantity, setQuantity] = useState(1)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const { toast } = useToast()
  const { addItem } = useCart()

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const increaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1)
    }
  }

  const handleAddToCart = () => {
    setIsAddingToCart(true)

    // Simulate a delay to show loading state
    setTimeout(() => {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: quantity,
        image: product.images[0],
      })

      toast({
        title: "Added to cart",
        description: `${quantity} × ${product.name} has been added to your cart.`,
      })

      setIsAddingToCart(false)
    }, 600)
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Product Section */}
      <section className="pt-24 md:pt-32 pb-16 md:pb-24">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="relative h-[400px] md:h-[500px] rounded-lg overflow-hidden">
                <Image
                  src={product.images[0] || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="grid grid-cols-4 gap-4">
                {product.images.slice(1).map((img, index) => (
                  <div
                    key={index}
                    className="relative h-24 rounded-md overflow-hidden border cursor-pointer hover:border-primary"
                  >
                    <Image
                      src={img || "/placeholder.svg"}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Product Details */}
            <div>
              <div className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight mb-2">{product.name}</h1>
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${i < Math.floor(product.rating) ? "fill-primary text-primary" : "text-muted-foreground"}`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">({product.reviewCount} reviews)</span>
                </div>
                <p className="text-2xl font-bold mb-4">${product.price.toFixed(2)}</p>
                <p className="text-muted-foreground mb-6">{product.description}</p>

                {/* Color Selection */}
                <div className="mb-6">
                  <h3 className="font-medium mb-2">Color</h3>
                  <div className="flex gap-2">
                    {product.colors.map((color, index) => (
                      <button
                        key={index}
                        className={`h-8 w-8 rounded-full cursor-pointer ${color} flex items-center justify-center ${
                          selectedColor === index ? "ring-2 ring-primary ring-offset-2" : ""
                        }`}
                      >
                        {selectedColor === index && <Check className="h-4 w-4 text-white" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Size Selection */}
                <div className="mb-6">
                  <h3 className="font-medium mb-2">Size</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size, index) => (
                      <button
                        key={index}
                        className={`h-10 min-w-[40px] px-3 flex items-center justify-center rounded border cursor-pointer ${
                          selectedSize === index ? "bg-primary text-primary-foreground" : "bg-background"
                        }`}
                        onClick={() => setSelectedSize(index)}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity */}
                <div className="mb-6">
                  <h3 className="font-medium mb-2">Quantity</h3>
                  <div className="flex items-center border rounded-md w-32">
                    <button
                      className="w-10 h-10 flex items-center justify-center text-lg"
                      onClick={decreaseQuantity}
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <div className="flex-1 text-center">{quantity}</div>
                    <button
                      className="w-10 h-10 flex items-center justify-center text-lg"
                      onClick={increaseQuantity}
                      disabled={quantity >= product.stock}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Add to Cart */}
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <Button size="lg" className="flex-1" onClick={handleAddToCart} disabled={isAddingToCart}>
                    {isAddingToCart ? (
                      <>
                        <span className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-background border-t-transparent" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
                      </>
                    )}
                  </Button>
                  <Button size="lg" variant="outline">
                    <Heart className="mr-2 h-5 w-5" /> Wishlist
                  </Button>
                </div>

                {/* Features */}
                <div className="border-t pt-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <Truck className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <h4 className="font-medium">Free Shipping</h4>
                      <p className="text-sm text-muted-foreground">On orders over $50</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <RotateCcw className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <h4 className="font-medium">Easy Returns</h4>
                      <p className="text-sm text-muted-foreground">30-day return policy</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <h4 className="font-medium">Quality Guarantee</h4>
                      <p className="text-sm text-muted-foreground">1-year warranty on all products</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Tabs */}
          <div className="mt-16">
            <Tabs defaultValue="description">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="details">Details & Specs</TabsTrigger>
                <TabsTrigger value="reviews">Reviews (24)</TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="pt-6">
                <div className="space-y-4">
                  <p>
                    This product is a testament to Kureno's dedication to preserving local craftsmanship while creating
                    modern, functional items that enhance everyday life. Each piece is handcrafted by our skilled
                    artisans using traditional techniques that have been passed down through generations.
                  </p>
                  <p>
                    The materials used are sourced locally whenever possible, supporting our community's economy and
                    reducing our environmental footprint. We carefully select only the highest quality materials to
                    ensure that each product is not only beautiful but also durable and long-lasting.
                  </p>
                  <p>
                    What makes this product truly special is the story behind it. Each piece carries the unique touch of
                    the artisan who created it, making it not just a product, but a piece of our cultural heritage and a
                    connection to our community's traditions.
                  </p>
                </div>
              </TabsContent>
              <TabsContent value="details" className="pt-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                    <div>
                      <h3 className="font-medium mb-2">Materials</h3>
                      <ul className="list-disc list-inside text-muted-foreground space-y-1">
                        <li>Premium quality material 1</li>
                        <li>Locally sourced material 2</li>
                        <li>Sustainable material 3</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">Dimensions</h3>
                      <ul className="list-disc list-inside text-muted-foreground space-y-1">
                        <li>Height: 10 inches</li>
                        <li>Width: 8 inches</li>
                        <li>Depth: 6 inches</li>
                        <li>Weight: 2 pounds</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">Care Instructions</h3>
                      <ul className="list-disc list-inside text-muted-foreground space-y-1">
                        <li>Hand wash only</li>
                        <li>Do not bleach</li>
                        <li>Air dry</li>
                        <li>Store in a cool, dry place</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">Additional Information</h3>
                      <ul className="list-disc list-inside text-muted-foreground space-y-1">
                        <li>Handcrafted in small batches</li>
                        <li>Slight variations make each piece unique</li>
                        <li>Comes in a gift-ready package</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="reviews" className="pt-6">
                <div className="space-y-8">
                  {[1, 2, 3].map((review) => (
                    <div key={review} className="border-b pb-6 last:border-0">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="relative h-12 w-12 rounded-full overflow-hidden">
                          <Image
                            src={`/placeholder.svg?height=50&width=50`}
                            alt={`Reviewer ${review}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="font-medium">Customer Name {review}</h4>
                          <div className="flex items-center gap-2">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                              ))}
                            </div>
                            <span className="text-xs text-muted-foreground">June 1, 2023</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-muted-foreground">
                        I absolutely love this product! The craftsmanship is exceptional, and you can really tell that
                        it was made with care. The materials are high quality, and it has quickly become one of my
                        favorite purchases. I highly recommend it to anyone looking for a unique, well-made item.
                      </p>
                    </div>
                  ))}

                  <Button variant="outline" className="w-full">
                    Load More Reviews
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Related Products */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold tracking-tight mb-8">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((product) => (
                <Link
                  key={product}
                  href={`/products/${product}`}
                  className="group block overflow-hidden rounded-lg border bg-background transition-all hover:shadow-md"
                >
                  <div className="relative h-[250px] overflow-hidden">
                    <Image
                      src={`/placeholder.svg?height=250&width=250`}
                      alt={`Related product ${product}`}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium">Related Product {product}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">(12 reviews)</span>
                    </div>
                    <p className="mt-2 font-medium">$79.00</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
