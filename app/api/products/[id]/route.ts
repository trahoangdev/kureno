import { NextResponse, type NextRequest } from "next/server"
import { connectToDatabase } from "@/lib/db"
import Product from "@/lib/models/product"
import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/route"

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase()
    const product = await Product.findById(params.id)
    if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json(product)
  } catch (e) {
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = (await getServerSession(authOptions as any)) as any
  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    const body = await req.json()
    await connectToDatabase()
    
    // Check for SKU uniqueness if SKU is being updated
    if (body.sku) {
      const existingProduct = await Product.findOne({ 
        sku: body.sku, 
        _id: { $ne: params.id } 
      })
      if (existingProduct) {
        return NextResponse.json({ error: "SKU already exists" }, { status: 400 })
      }
    }
    
    const updated = await Product.findByIdAndUpdate(params.id, body, { new: true })
    return NextResponse.json(updated)
  } catch (e) {
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = (await getServerSession(authOptions as any)) as any
  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    await connectToDatabase()
    await Product.findByIdAndDelete(params.id)
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}


