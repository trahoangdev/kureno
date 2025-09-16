"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatPrice } from "@/lib/utils"
import { Loader2, ArrowLeft } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

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
  user: {
    _id: string
    name: string
    email: string
  }
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

export default function AdminOrderDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [status, setStatus] = useState("")
  const [paymentStatus, setPaymentStatus] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    if (params.id) {
      fetchOrder()
    }
  }, [params.id])

  const fetchOrder = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/orders/${params.id}`)

      if (!response.ok) {
        throw new Error("Failed to fetch order")
      }

      const data = await response.json()
      setOrder(data)
      setStatus(data.status)
      setPaymentStatus(data.paymentStatus)
    } catch (error) {
      console.error("Error fetching order:", error)
      setError("Failed to load order details. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  const updateOrder = async () => {
    try {
      setIsUpdating(true)
      const response = await fetch(`/api/orders/${params.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status,
          paymentStatus,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update order")
      }

      const updatedOrder = await response.json()
      setOrder(updatedOrder)

      toast({
        title: "Order updated",
        description: "The order has been updated successfully.",
      })
    } catch (error) {
      console.error("Error updating order:", error)
      toast({
        title: "Error",
        description: "Failed to update order. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
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

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
      default:
        return ""
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Orders
        </Button>
        {order && (
          <Button variant="outline" size="sm" asChild>
            <Link href={`/admin/customers/${order.user?._id}`}>View Customer</Link>
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Order Details</CardTitle>
              <CardDescription>
                {order ? `Order #${order._id.substring(order._id.length - 6)}` : "Loading order information"}
              </CardDescription>
            </div>
            {order && (
              <Badge className={getStatusColor(order.status)}>
                <span className="capitalize">{order.status}</span>
              </Badge>
            )}
          </div>
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
              {/* Order Status Management */}
              <div className="rounded-lg border p-4">
                <h3 className="font-medium mb-4">Update Order Status</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Order Status</label>
                    <Select value={status} onValueChange={setStatus}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Payment Status</label>
                    <Select value={paymentStatus} onValueChange={setPaymentStatus}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button
                  className="mt-4"
                  onClick={updateOrder}
                  disabled={isUpdating || (status === order.status && paymentStatus === order.paymentStatus)}
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...
                    </>
                  ) : (
                    "Update Order"
                  )}
                </Button>
              </div>

              {/* Customer Information */}
              <div>
                <h3 className="font-medium mb-4">Customer Information</h3>
                <div className="rounded-lg border p-4">
                  <p className="font-medium">{order.user?.name || "Guest Customer"}</p>
                  <p className="text-muted-foreground">{order.user?.email || "No email provided"}</p>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="font-medium mb-4">Items</h3>
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
                <h3 className="font-medium mb-4">Order Summary</h3>
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
                  <h3 className="font-medium mb-4">Shipping Information</h3>
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
                  <h3 className="font-medium mb-4">Payment Information</h3>
                  <div className="rounded-lg border p-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Payment Method</span>
                      <span className="capitalize">{order.paymentMethod.replace("-", " ")}</span>
                    </div>
                    <div className="mt-2 flex justify-between">
                      <span className="text-muted-foreground">Payment Status</span>
                      <Badge className={getPaymentStatusColor(order.paymentStatus)}>
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
