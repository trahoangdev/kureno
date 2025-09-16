import { NextResponse, type NextRequest } from "next/server"
import { connectToDatabase } from "@/lib/db"
import Order from "@/lib/models/order"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"

export async function GET(req: NextRequest) {
  try {
    const session = (await getServerSession(authOptions as any)) as any

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()

    // For admin users, allow filtering by user ID
    if (session.user?.role === "admin") {
      const { searchParams } = new URL(req.url)
      const userId = searchParams.get("userId")
      const status = searchParams.get("status")
      const limit = Number.parseInt(searchParams.get("limit") || "10")
      const page = Number.parseInt(searchParams.get("page") || "1")
      const skip = (page - 1) * limit

      const query: any = {}

      if (userId) {
        query.user = userId
      }

      if (status) {
        query.status = status
      }

      const orders = await Order.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("user", "name email")

      const total = await Order.countDocuments(query)

      return NextResponse.json({
        orders,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      })
    }

    // For regular users, only return their own orders
    const orders = await Order.find({ user: session.user?.id }).sort({ createdAt: -1 })

    return NextResponse.json({ orders })
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = (await getServerSession(authOptions as any)) as any

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { items, subtotal, shipping, total, shippingAddress, paymentMethod } = body

    if (!items || !subtotal || shipping === undefined || !total || !shippingAddress || !paymentMethod) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    await connectToDatabase()

    const order = new Order({
      user: session.user?.id,
      items,
      subtotal,
      shipping,
      total,
      shippingAddress,
      paymentMethod,
      status: "pending",
      paymentStatus: paymentMethod === "cash" ? "pending" : "paid",
    })

    await order.save()

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = (await getServerSession(authOptions as any)) as any
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { ids, status } = body as { ids: string[]; status: string }
    if (!ids?.length || !status) {
      return NextResponse.json({ error: "ids and status are required" }, { status: 400 })
    }

    await connectToDatabase()
    await Order.updateMany({ _id: { $in: ids } }, { $set: { status } })
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("Error bulk updating orders:", error)
    return NextResponse.json({ error: "Failed to update orders" }, { status: 500 })
  }
}
