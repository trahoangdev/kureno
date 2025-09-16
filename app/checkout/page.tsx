"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useCart } from "@/context/cart-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatPrice } from "@/lib/utils"
import { Loader2, ArrowLeft, CreditCard, Truck, ShieldCheck } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function CheckoutPage() {
  const router = useRouter()
  const { items, subtotal, clearCart } = useCart()
  const [isProcessing, setIsProcessing] = useState(false)
  const { toast } = useToast()
  const { data: session, status } = useSession()
  const [mounted, setMounted] = useState(false)

  // Shipping cost calculation
  const shippingCost = subtotal > 50 ? 0 : 5.99
  const total = subtotal + shippingCost

  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "US",
    paymentMethod: "credit-card",
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
    saveInfo: true,
  })

  // Initialize form with user data if available
  useEffect(() => {
    setMounted(true)
    if (session?.user) {
      setFormData((prev) => ({
        ...prev,
        email: session.user.email || prev.email,
      }))

      // You could fetch the user's saved address info here
      // and populate the form fields
    }
  }, [session])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    try {
      // If user is not logged in, redirect to login page
      if (!session) {
        router.push(`/login?callbackUrl=${encodeURIComponent("/checkout")}`)
        return
      }

      // Validate form
      if (
        !formData.firstName ||
        !formData.lastName ||
        !formData.address ||
        !formData.city ||
        !formData.state ||
        !formData.zipCode
      ) {
        throw new Error("Please fill in all required fields")
      }

      // Validate payment info if using credit card
      if (formData.paymentMethod === "credit-card") {
        if (!formData.cardNumber || !formData.cardExpiry || !formData.cardCvc) {
          throw new Error("Please provide valid payment information")
        }
      }

      // Create order in database
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
          })),
          subtotal,
          shipping: shippingCost,
          total,
          shippingAddress: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode,
            country: formData.country,
          },
          paymentMethod: formData.paymentMethod,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create order")
      }

      const order = await response.json()

      // Save user address if requested
      if (formData.saveInfo) {
        try {
          await fetch("/api/user/address", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              firstName: formData.firstName,
              lastName: formData.lastName,
              address: formData.address,
              city: formData.city,
              state: formData.state,
              zipCode: formData.zipCode,
              country: formData.country,
            }),
          })
        } catch (error) {
          console.error("Failed to save address", error)
          // Non-critical error, continue with checkout
        }
      }

      toast({
        title: "Order placed successfully!",
        description: "Thank you for your purchase. You will receive a confirmation email shortly.",
      })

      clearCart()
      router.push(`/checkout/success?orderId=${order._id}`)
    } catch (error: any) {
      console.error("Error creating order:", error)
      toast({
        title: "Error",
        description: error.message || "There was an error processing your order. Please try again.",
        variant: "destructive",
      })
      setIsProcessing(false)
    }
  }

  if (!mounted) {
    return (
      <div className="container py-24 md:py-32 flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4 py-24 md:py-32">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-muted-foreground mb-6">Looks like you haven&apos;t added anything to your cart yet.</p>
          <Button asChild>
            <Link href="/products">Browse Products</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-24 md:py-32">
      <div className="mb-8">
        <Button variant="outline" size="sm" asChild>
          <Link href="/products">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Continue Shopping
          </Link>
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Checkout</CardTitle>
              <CardDescription>Complete your order by providing your shipping and payment details</CardDescription>
            </CardHeader>
            <CardContent>
              {!session && (
                <div className="mb-6 p-4 bg-muted rounded-lg">
                  <p className="mb-2">Already have an account?</p>
                  <Button asChild>
                    <Link href={`/login?callbackUrl=${encodeURIComponent("/checkout")}`}>
                      Sign in for a faster checkout
                    </Link>
                  </Button>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Contact Information */}
                <div>
                  <h2 className="text-lg font-medium mb-4">Contact Information</h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">
                        First Name <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">
                        Last Name <span className="text-destructive">*</span>
                      </Label>
                      <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="email">
                        Email <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email || (session?.user?.email ?? "")}
                        onChange={handleChange}
                        required
                        disabled={!!session?.user?.email}
                      />
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                <div>
                  <h2 className="text-lg font-medium mb-4">Shipping Address</h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="address">
                        Address <span className="text-destructive">*</span>
                      </Label>
                      <Input id="address" name="address" value={formData.address} onChange={handleChange} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">
                        City <span className="text-destructive">*</span>
                      </Label>
                      <Input id="city" name="city" value={formData.city} onChange={handleChange} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">
                        State / Province <span className="text-destructive">*</span>
                      </Label>
                      <Input id="state" name="state" value={formData.state} onChange={handleChange} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zipCode">
                        ZIP / Postal Code <span className="text-destructive">*</span>
                      </Label>
                      <Input id="zipCode" name="zipCode" value={formData.zipCode} onChange={handleChange} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">
                        Country <span className="text-destructive">*</span>
                      </Label>
                      <Input id="country" name="country" value={formData.country} onChange={handleChange} required />
                    </div>
                    <div className="sm:col-span-2 flex items-center space-x-2 pt-2">
                      <Input
                        type="checkbox"
                        id="saveInfo"
                        name="saveInfo"
                        className="h-4 w-4"
                        checked={formData.saveInfo}
                        onChange={handleChange}
                      />
                      <Label htmlFor="saveInfo" className="text-sm font-normal">
                        Save this information for next time
                      </Label>
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div>
                  <h2 className="text-lg font-medium mb-4">Payment Method</h2>
                  <Tabs
                    defaultValue="credit-card"
                    className="w-full"
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, paymentMethod: value }))}
                  >
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="credit-card" className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        Credit Card
                      </TabsTrigger>
                      <TabsTrigger value="cash" className="flex items-center gap-2">
                        <Truck className="h-4 w-4" />
                        Cash on Delivery
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="credit-card" className="space-y-4 pt-4">
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">
                          Card Number <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="cardNumber"
                          name="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          value={formData.cardNumber}
                          onChange={handleChange}
                          required={formData.paymentMethod === "credit-card"}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="cardExpiry">
                            Expiry Date <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="cardExpiry"
                            name="cardExpiry"
                            placeholder="MM/YY"
                            value={formData.cardExpiry}
                            onChange={handleChange}
                            required={formData.paymentMethod === "credit-card"}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cardCvc">
                            CVC <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="cardCvc"
                            name="cardCvc"
                            placeholder="123"
                            value={formData.cardCvc}
                            onChange={handleChange}
                            required={formData.paymentMethod === "credit-card"}
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                        <ShieldCheck className="h-4 w-4" />
                        <span>Your payment information is secure and encrypted</span>
                      </div>
                    </TabsContent>
                    <TabsContent value="cash" className="pt-4">
                      <div className="rounded-md bg-muted p-4">
                        <p className="text-sm">
                          Pay with cash upon delivery. Please ensure you have the exact amount ready when your order
                          arrives. Our delivery personnel do not carry change.
                        </p>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={isProcessing}>
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing Order...
                    </>
                  ) : (
                    <>Place Order ({formatPrice(total)})</>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div>
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
              <CardDescription>
                {items.length} {items.length === 1 ? "item" : "items"} in your cart
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative h-16 w-16 overflow-hidden rounded-md border">
                      <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                      <p className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>{shippingCost === 0 ? "Free" : formatPrice(shippingCost)}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              <div className="mt-6 rounded-md border border-muted p-4">
                <div className="flex items-center gap-2 text-sm">
                  <Truck className="h-4 w-4 text-muted-foreground" />
                  <span>Free shipping on orders over $50</span>
                </div>
                <div className="mt-2 flex items-center gap-2 text-sm">
                  <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                  <span>Secure checkout with encrypted payment</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
