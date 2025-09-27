import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import Product from "@/lib/models/product"

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const { productIds } = await request.json()

    if (!productIds || !Array.isArray(productIds)) {
      return NextResponse.json(
        { error: "Product IDs array is required" },
        { status: 400 }
      )
    }

    if (productIds.length === 0) {
      return NextResponse.json({ products: [] })
    }

    if (productIds.length > 3) {
      return NextResponse.json(
        { error: "Cannot compare more than 3 products" },
        { status: 400 }
      )
    }

    const products = await Product.find({
      _id: { $in: productIds }
    }).select(
      "name description price originalPrice onSale images category stock featured isNewProduct isTrending isBestSeller averageRating reviewCount tags weight dimensions sku brand"
    )

    if (products.length === 0) {
      return NextResponse.json(
        { error: "No products found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ products })

  } catch (error) {
    console.error("Error fetching products for comparison:", error)
    return NextResponse.json(
      { error: "Failed to fetch products for comparison" },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    { message: "Compare API endpoint" },
    { status: 200 }
  )
}
