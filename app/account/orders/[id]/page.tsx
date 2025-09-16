"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { formatPrice } from "@/lib/utils"
import { Loader2, ArrowLeft, Package, Truck, CheckCircle } from "lucide-react"

interface OrderItem {
  name: string
  quantity: number
  price: number
  image: string
}

interface ShippingAddress {
  firstName: string
  lastName: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
}

interface Order {
  _id: string
  items: OrderItem[]
  subtotal: number
  shipping: number
  total: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  paymentStatus: "pending" | "paid" | "failed"
  paymentMethod: string
  shippingAddress: ShippingAddress
  createdAt: string
  updatedAt: string
}

export default function OrderDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (session && params.id) {
      fetchOrder()
    }
  }, [session, params.id])

  const fetchOrder = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/orders/${params.id}`)

      if (!response.ok) {
        throw new Error("Failed to fetch order")
      }

      const data = await response.json()
      setOrder(data)
    } catch (error) {
      console.error("Error fetching order:", error)
      setError("Failed to load order details. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
      case "processing":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
      case "shipped":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
      case "delivered":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
      default:
        return ""
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Package className="h-5 w-5" />
      case "processing":
        return <Package className="h-5 w-5" />
      case "shipped":
        return <Truck className="h-5 w-5" />
      case "delivered":
        return <CheckCircle className="h-5 w-5" />
      default:
        return <Package className="h-5 w-5" />
    }
  }

  return (
    <div>
      <div className="mb-6">
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Orders
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Order Details</CardTitle>
          <CardDescription>
            {order ? `Order #${order._id.substring(order._id.length - 6)}` : "Loading order information"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="py-8 text-center">
              <p className="text-destructive">{error}</p>
              <Button variant="outline" className="mt-4" onClick={fetchOrder}>
                Try Again
              </Button>
            </div>
          ) : order ? (
            <div className="space-y-8">
              {/* Order Status */}
              <div className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Order Status</h3>
                  <Badge className={getStatusColor(order.status)}>
                    <span className="capitalize">{order.status}</span>
                  </Badge>
                </div>

                <div className="mt-4">
                  <div className="relative flex items-center justify-between">
                    <div className="absolute left-0 right-0 top-1/2 h-0.5 -translate-y-1/2 bg-muted"></div>
                    {["pending", "processing", "shipped", "delivered"].map((status, index) => {
                      const isActive = ["pending", "processing", "shipped", "delivered"].indexOf(order.status) >= index
                      return (
                        <div key={status} className="relative z-10 flex flex-col items-center">
                          <div
                            className={`flex h-8 w-8 items-center justify-center rounded-full ${
                              isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {getStatusIcon(status)}
                          </div>
                          <span className="mt-2 text-xs capitalize">{status}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="mb-4 font-medium">Items</h3>
                <div className="space-y-4 rounded-lg border p-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="relative h-16 w-16 overflow-hidden rounded-md border">
                        <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                        <p className="text-sm text-muted-foreground">{formatPrice(item.price)} each</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div>
                <h3 className="mb-4 font-medium">Order Summary</h3>
                <div className="rounded-lg border p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>{formatPrice(order.subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>{order.shipping === 0 ? "Free" : formatPrice(order.shipping)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-medium">
                      <span>Total</span>
                      <span>{formatPrice(order.total)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping & Payment */}
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="mb-4 font-medium">Shipping Information</h3>
                  <div className="rounded-lg border p-4">
                    <p className="font-medium">
                      {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                    </p>
                    <p className="mt-1 text-muted-foreground">{order.shippingAddress.address}</p>
                    <p className="text-muted-foreground">
                      {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                    </p>
                    <p className="text-muted-foreground">{order.shippingAddress.country}</p>
                  </div>
                </div>

                <div>
                  <h3 className="mb-4 font-medium">Payment Information</h3>
                  <div className="rounded-lg border p-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Payment Method</span>
                      <span className="capitalize">{order.paymentMethod.replace("-", " ")}</span>
                    </div>
                    <div className="mt-2 flex justify-between">
                      <span className="text-muted-foreground">Payment Status</span>
                      <Badge
                        variant={order.paymentStatus === "paid" ? "default" : "destructive"}
                        className={
                          order.paymentStatus === "paid"
                            ? "bg-green-500"
                            : order.paymentStatus === "pending"
                              ? "bg-yellow-500"
                              : ""
                        }
                      >
                        <span className="capitalize">{order.paymentStatus}</span>
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Dates */}
              <div className="rounded-lg border p-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Order Date</p>
                    <p>{new Date(order.createdAt).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Last Updated</p>
                    <p>{new Date(order.updatedAt).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  )
}
