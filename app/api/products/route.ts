import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import Product from "@/lib/models/product"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get("category")
    const featured = searchParams.get("featured")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const skip = (page - 1) * limit

    await connectToDatabase()

    const query: any = {}

    if (category) {
      query.category = category
    }

    if (featured === "true") {
      query.featured = true
    }

    const products = await Product.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit)

    const total = await Product.countDocuments(query)

    return NextResponse.json({
      products,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = (await getServerSession(authOptions as any)) as any

    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { 
      name, 
      description, 
      price, 
      originalPrice,
      onSale,
      saleStartDate,
      saleEndDate,
      images, 
      videos,
      category, 
      stock, 
      featured,
      // Badge management
      isTrending,
      isBestSeller,
      isNewProduct,
      // Advanced fields
      sku,
      weight,
      dimensions,
      seo,
      variants,
      tags,
      status,
      visibility,
      inventory
    } = body

    if (!name || !description || !price || !images || !category || stock === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    await connectToDatabase()

    // Generate SKU if not provided
    let finalSku = sku
    if (!finalSku) {
      const prefix = category ? category.slice(0, 3).toUpperCase() : "PRD"
      const random = Math.random().toString(36).substr(2, 6).toUpperCase()
      finalSku = `${prefix}-${random}`
    }

    // Check for SKU uniqueness
    if (finalSku) {
      const existingProduct = await Product.findOne({ sku: finalSku })
      if (existingProduct) {
        return NextResponse.json({ error: "SKU already exists" }, { status: 400 })
      }
    }

    const product = new Product({
      name,
      description,
      price,
      originalPrice: originalPrice || undefined,
      onSale: onSale || false,
      saleStartDate: saleStartDate || null,
      saleEndDate: saleEndDate || null,
      images,
      videos: videos || [],
      category,
      stock,
      featured: featured || false,
      // Badge management
      isTrending: isTrending || false,
      isBestSeller: isBestSeller || false,
      isNewProduct: isNewProduct || false,
      // Advanced fields
      sku: finalSku,
      weight: weight || 0,
      dimensions: dimensions || { length: 0, width: 0, height: 0 },
      seo: seo || { title: "", description: "", keywords: "" },
      variants: variants || [],
      tags: tags || [],
      status: status || "draft",
      visibility: visibility || "public",
      inventory: inventory || {
        trackQuantity: true,
        allowBackorder: false,
        lowStockThreshold: 5
      }
    })

    await product.save()

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}
