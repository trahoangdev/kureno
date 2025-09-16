"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { CheckCircle, Loader2 } from "lucide-react"
import { formatPrice } from "@/lib/utils"

interface Order {
  _id: string
  items: Array<{
    name: string
    quantity: number
    price: number
  }>
  subtotal: number
  shipping: number
  total: number
  status: string
  createdAt: string
}

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("orderId")
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (orderId) {
      setLoading(true)
      fetch(`/api/orders/${orderId}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error("Failed to fetch order")
          }
          return res.json()
        })
        .then((data) => {
          setOrder(data)
          setLoading(false)
        })
        .catch((err) => {
          console.error("Error fetching order:", err)
          setError("Could not load order details")
          setLoading(false)
        })
    }
  }, [orderId])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-24 md:py-32">
      <div className="mx-auto max-w-md text-center">
        <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
        <h1 className="mt-6 text-3xl font-bold">Order Confirmed!</h1>
        <p className="mt-3 text-muted-foreground">
          Thank you for your purchase. Your order has been received and is being processed.
        </p>
        <p className="mt-2 text-muted-foreground">A confirmation email has been sent to your email address.</p>

        {loading && (
          <div className="mt-6 flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {error && <p className="mt-6 text-destructive">{error}</p>}

        {order && (
          <div className="mt-8 rounded-lg border p-6 text-left">
            <h2 className="text-xl font-bold">Order #{order._id.substring(order._id.length - 6)}</h2>
            <p className="text-sm text-muted-foreground">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>

            <div className="mt-4 space-y-2">
              <p className="text-sm font-medium">
                Order Status: <span className="capitalize">{order.status}</span>
              </p>

              <div className="mt-4">
                <h3 className="text-sm font-medium">Items:</h3>
                <ul className="mt-2 space-y-2">
                  {order.items.map((item, index) => (
                    <li key={index} className="flex justify-between text-sm">
                      <span>
                        {item.name} x {item.quantity}
                      </span>
                      <span>{formatPrice(item.price * item.quantity)}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-4 border-t pt-4">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>{formatPrice(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>{order.shipping === 0 ? "Free" : formatPrice(order.shipping)}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>{formatPrice(order.total)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 flex flex-col gap-4">
          <Button asChild>
            <Link href="/products">Continue Shopping</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/account/orders">View Your Orders</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
