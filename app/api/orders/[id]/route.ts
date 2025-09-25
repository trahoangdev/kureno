import { NextResponse, type NextRequest } from "next/server"
import { connectToDatabase } from "@/lib/db"
import Order from "@/lib/models/order"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = (await getServerSession(authOptions as any)) as any

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()

    const order = await Order.findById(params.id)

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    // Check if the user is authorized to view this order
    if (session.user?.role !== "admin" && order.user.toString() !== session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    return NextResponse.json(order)
  } catch (error) {
    console.error("Error fetching order:", error)
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = (await getServerSession(authOptions as any)) as any

    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { status, paymentStatus } = body

    await connectToDatabase()

    const order = await Order.findById(params.id)

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    if (status) {
      order.status = status
    }

    if (paymentStatus) {
      order.paymentStatus = paymentStatus
    }

    await order.save()

    return NextResponse.json(order)
  } catch (error) {
    console.error("Error updating order:", error)
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = (await getServerSession(authOptions as any)) as any

    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()

    const order = await Order.findById(params.id)

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    await Order.findByIdAndDelete(params.id)

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("Error deleting order:", error)
    return NextResponse.json({ error: "Failed to delete order" }, { status: 500 })
  }
}
