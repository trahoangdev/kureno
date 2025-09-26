import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

// Import models
import Product from "@/lib/models/product"
import Category from "@/lib/models/category"
import User from "@/lib/models/user"
import BlogPost from "@/lib/models/blog-post"
import AdminNotification from "@/lib/models/admin-notification"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || (session.user as any).role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 401 }
      )
    }

    await connectToDatabase()

    const contentType = request.headers.get("content-type")
    
    if (!contentType?.includes("multipart/form-data")) {
      return NextResponse.json(
        { error: "Content-Type must be multipart/form-data" },
        { status: 400 }
      )
    }

    const formData = await request.formData()
    const file = formData.get("file") as File
    const entity = formData.get("entity") as string
    const mode = formData.get("mode") as string || "create" // create, update, upsert
    const validateOnly = formData.get("validateOnly") === "true"

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      )
    }

    if (!entity) {
      return NextResponse.json(
        { error: "Entity type is required" },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = ["application/json", "text/csv", "text/plain"]
    if (!allowedTypes.includes(file.type) && !file.name.endsWith(".json") && !file.name.endsWith(".csv")) {
      return NextResponse.json(
        { error: "Invalid file type. Only JSON and CSV files are allowed" },
        { status: 400 }
      )
    }

    // Read file content
    const fileContent = await file.text()
    let data: any[]

    try {
      if (file.name.endsWith(".csv") || file.type === "text/csv") {
        data = parseCSV(fileContent)
      } else {
        const parsed = JSON.parse(fileContent)
        // Handle both direct array and object with entity property
        data = Array.isArray(parsed) ? parsed : (parsed[entity] || [])
      }
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid file format or corrupted data" },
        { status: 400 }
      )
    }

    if (!Array.isArray(data) || data.length === 0) {
      return NextResponse.json(
        { error: "No valid data found in file" },
        { status: 400 }
      )
    }

    // Validate data structure
    const validationResult = await validateImportData(entity, data)
    if (!validationResult.isValid) {
      return NextResponse.json(
        { 
          error: "Data validation failed",
          details: validationResult.errors,
        },
        { status: 400 }
      )
    }

    if (validateOnly) {
      return NextResponse.json({
        success: true,
        message: "Data validation passed",
        summary: {
          totalRecords: data.length,
          validRecords: validationResult.validCount,
          entity,
        },
      })
    }

    // Process import
    const importResult = await processImport(entity, data, mode, session.user.email)

    // Create notification about import
    await AdminNotification.createNotification({
      title: "Data Import Completed",
      message: `Successfully imported ${importResult.successCount} ${entity} records`,
      type: importResult.errors.length > 0 ? "warning" : "success",
      category: "system",
      priority: "medium",
      userId: (session.user as any).id,
      actionUrl: `/admin/${entity}`,
    })

    return NextResponse.json({
      success: true,
      message: "Import completed successfully",
      summary: {
        totalRecords: data.length,
        successCount: importResult.successCount,
        errorCount: importResult.errors.length,
        errors: importResult.errors,
        entity,
        mode,
      },
    })

  } catch (error) {
    console.error("Import error:", error)
    
    // Create error notification
    try {
      const session = await getServerSession(authOptions)
      if (session?.user) {
        await AdminNotification.createNotification({
          title: "Data Import Failed",
          message: "An error occurred during data import",
          type: "error",
          category: "system",
          priority: "high",
          userId: (session.user as any).id,
        })
      }
    } catch (notificationError) {
      console.error("Failed to create error notification:", notificationError)
    }

    return NextResponse.json(
      { error: "Failed to import data" },
      { status: 500 }
    )
  }
}

// Helper function to parse CSV
function parseCSV(csvContent: string): any[] {
  const lines = csvContent.trim().split("\n")
  if (lines.length < 2) return []

  const headers = lines[0].split(",").map(h => h.trim().replace(/"/g, ""))
  const data: any[] = []

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i])
    if (values.length === headers.length) {
      const obj: any = {}
      headers.forEach((header, index) => {
        obj[header] = values[index]
      })
      data.push(obj)
    }
  }

  return data
}

// Helper function to parse CSV line (handles quoted values)
function parseCSVLine(line: string): string[] {
  const result: string[] = []
  let current = ""
  let inQuotes = false
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"'
        i++ // Skip next quote
      } else {
        inQuotes = !inQuotes
      }
    } else if (char === "," && !inQuotes) {
      result.push(current.trim())
      current = ""
    } else {
      current += char
    }
  }
  
  result.push(current.trim())
  return result
}

// Helper function to validate import data
async function validateImportData(entity: string, data: any[]): Promise<{
  isValid: boolean
  errors: string[]
  validCount: number
}> {
  const errors: string[] = []
  let validCount = 0

  for (let i = 0; i < data.length; i++) {
    const item = data[i]
    const rowNumber = i + 1

    try {
      switch (entity) {
        case "products":
          if (!item.name) errors.push(`Row ${rowNumber}: Product name is required`)
          if (!item.price || isNaN(parseFloat(item.price))) errors.push(`Row ${rowNumber}: Valid price is required`)
          if (!item.category) errors.push(`Row ${rowNumber}: Category is required`)
          break

        case "categories":
          if (!item.name) errors.push(`Row ${rowNumber}: Category name is required`)
          break

        case "users":
          if (!item.email) errors.push(`Row ${rowNumber}: Email is required`)
          if (!item.name) errors.push(`Row ${rowNumber}: Name is required`)
          if (item.email && !/\S+@\S+\.\S+/.test(item.email)) {
            errors.push(`Row ${rowNumber}: Invalid email format`)
          }
          break

        case "blog":
          if (!item.title) errors.push(`Row ${rowNumber}: Blog title is required`)
          if (!item.content) errors.push(`Row ${rowNumber}: Blog content is required`)
          if (!item.author) errors.push(`Row ${rowNumber}: Blog author is required`)
          break

        default:
          errors.push(`Row ${rowNumber}: Unknown entity type: ${entity}`)
      }

      if (errors.length === 0) validCount++
    } catch (error) {
      errors.push(`Row ${rowNumber}: Validation error - ${error}`)
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    validCount,
  }
}

// Helper function to process import
async function processImport(
  entity: string, 
  data: any[], 
  mode: string, 
  importedBy: string
): Promise<{
  successCount: number
  errors: string[]
}> {
  const errors: string[] = []
  let successCount = 0

  for (let i = 0; i < data.length; i++) {
    const item = data[i]
    const rowNumber = i + 1

    try {
      switch (entity) {
        case "products":
          await processProductImport(item, mode)
          break

        case "categories":
          await processCategoryImport(item, mode)
          break

        case "users":
          await processUserImport(item, mode)
          break

        case "blog":
          await processBlogImport(item, mode)
          break

        default:
          throw new Error(`Unsupported entity: ${entity}`)
      }

      successCount++
    } catch (error) {
      errors.push(`Row ${rowNumber}: ${error}`)
    }
  }

  return { successCount, errors }
}

// Entity-specific import processors
async function processProductImport(item: any, mode: string) {
  const productData = {
    name: item.name,
    description: item.description || "",
    price: parseFloat(item.price),
    originalPrice: item.originalPrice ? parseFloat(item.originalPrice) : undefined,
    category: item.category, // Will need to resolve to ObjectId
    images: item.images ? JSON.parse(item.images) : [],
    featured: item.featured === "true" || item.featured === true,
    inStock: item.inStock !== "false" && item.inStock !== false,
    discount: item.discount ? parseFloat(item.discount) : 0,
  }

  if (mode === "create") {
    await Product.create(productData)
  } else if (mode === "upsert") {
    await Product.findOneAndUpdate(
      { name: productData.name },
      productData,
      { upsert: true, new: true }
    )
  }
}

async function processCategoryImport(item: any, mode: string) {
  const categoryData = {
    name: item.name,
    description: item.description || "",
    image: item.image || "",
  }

  if (mode === "create") {
    await Category.create(categoryData)
  } else if (mode === "upsert") {
    await Category.findOneAndUpdate(
      { name: categoryData.name },
      categoryData,
      { upsert: true, new: true }
    )
  }
}

async function processUserImport(item: any, mode: string) {
  const userData = {
    name: item.name,
    email: item.email,
    role: item.role || "user",
    isActive: item.isActive !== "false" && item.isActive !== false,
    // Note: Password handling would need special consideration
  }

  if (mode === "create") {
    await User.create(userData)
  } else if (mode === "upsert") {
    await User.findOneAndUpdate(
      { email: userData.email },
      userData,
      { upsert: true, new: true }
    )
  }
}

async function processBlogImport(item: any, mode: string) {
  const blogData = {
    title: item.title,
    content: item.content,
    excerpt: item.excerpt || "",
    author: item.author, // Will need to resolve to ObjectId
    tags: item.tags ? JSON.parse(item.tags) : [],
    published: item.published !== "false" && item.published !== false,
  }

  if (mode === "create") {
    await BlogPost.create(blogData)
  } else if (mode === "upsert") {
    await BlogPost.findOneAndUpdate(
      { title: blogData.title },
      blogData,
      { upsert: true, new: true }
    )
  }
}
