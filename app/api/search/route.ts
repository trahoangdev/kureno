import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import Product from "@/lib/models/product"
import BlogPost from "@/lib/models/blog-post"
import Category from "@/lib/models/category"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")?.trim()
    const type = searchParams.get("type") || "all" // all, products, blogs, categories
    const limit = Math.min(Math.max(Number.parseInt(searchParams.get("limit") || "10"), 1), 50)

    if (!query || query.length < 2) {
      return NextResponse.json({
        success: true,
        results: {
          products: [],
          blogs: [],
          categories: [],
          total: 0
        }
      })
    }

    await connectToDatabase()

    const searchRegex = new RegExp(query, "i")
    const results: any = {
      products: [],
      blogs: [],
      categories: [],
      total: 0
    }

    // Search Products
    if (type === "all" || type === "products") {
      const products = await Product.find({
        $and: [
          {
            $or: [
              { name: searchRegex },
              { description: searchRegex },
              { tags: { $in: [searchRegex] } },
              { "seo.metaTitle": searchRegex },
              { "seo.metaDescription": searchRegex }
            ]
          },
          { status: "active" },
          { visibility: "public" }
        ]
      })
      .populate("category", "name slug")
      .select("name slug description price images category featured discount status")
      .limit(type === "products" ? limit : Math.ceil(limit / 3))
      .lean()

      results.products = products.map(product => ({
        id: product._id,
        type: "product",
        title: product.name,
        description: product.description?.substring(0, 150) + "...",
        url: `/products/${product.slug}`,
        image: product.images?.[0] || "/placeholder.svg",
        price: product.price,
        category: product.category?.name,
        featured: product.featured,
        discount: product.discount
      }))
    }

    // Search Blog Posts
    if (type === "all" || type === "blogs") {
      const blogs = await BlogPost.find({
        $and: [
          {
            $or: [
              { title: searchRegex },
              { excerpt: searchRegex },
              { content: searchRegex },
              { tags: { $in: [searchRegex] } },
              { "seo.metaTitle": searchRegex },
              { "seo.metaDescription": searchRegex }
            ]
          },
          { status: "published" },
          { visibility: "public" }
        ]
      })
      .populate("author", "name")
      .populate("category", "name slug")
      .select("title slug excerpt featuredImage author category publishedAt readingTime")
      .limit(type === "blogs" ? limit : Math.ceil(limit / 3))
      .lean()

      results.blogs = blogs.map(blog => ({
        id: blog._id,
        type: "blog",
        title: blog.title,
        description: blog.excerpt,
        url: `/blog/${blog.slug}`,
        image: blog.featuredImage || "/placeholder.svg",
        author: blog.author?.name,
        category: blog.category?.name,
        publishedAt: blog.publishedAt,
        readingTime: blog.readingTime
      }))
    }

    // Search Categories
    if (type === "all" || type === "categories") {
      const categories = await Category.find({
        $or: [
          { name: searchRegex },
          { description: searchRegex }
        ]
      })
      .select("name slug description image")
      .limit(type === "categories" ? limit : Math.ceil(limit / 3))
      .lean()

      results.categories = categories.map(category => ({
        id: category._id,
        type: "category",
        title: category.name,
        description: category.description,
        url: `/products?category=${category.slug}`,
        image: category.image || "/placeholder.svg"
      }))
    }

    // Calculate total results
    results.total = results.products.length + results.blogs.length + results.categories.length

    // If searching all types, limit total results and balance them
    if (type === "all" && results.total > limit) {
      const maxPerType = Math.ceil(limit / 3)
      results.products = results.products.slice(0, maxPerType)
      results.blogs = results.blogs.slice(0, maxPerType)
      results.categories = results.categories.slice(0, maxPerType)
      results.total = results.products.length + results.blogs.length + results.categories.length
    }

    return NextResponse.json({
      success: true,
      query,
      results
    })

  } catch (error) {
    console.error("Error performing search:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// POST /api/search - Advanced search with filters
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { 
      query, 
      type = "all",
      filters = {},
      sort = "relevance",
      limit = 10,
      page = 1
    } = body

    if (!query || query.trim().length < 2) {
      return NextResponse.json({
        success: true,
        results: {
          products: [],
          blogs: [],
          categories: [],
          total: 0
        },
        pagination: {
          page,
          limit,
          total: 0,
          pages: 0
        }
      })
    }

    await connectToDatabase()

    const searchRegex = new RegExp(query.trim(), "i")
    const skip = (page - 1) * limit
    const results: any = {
      products: [],
      blogs: [],
      categories: [],
      total: 0
    }

    // Advanced Product Search
    if (type === "all" || type === "products") {
      const productQuery: any = {
        $and: [
          {
            $or: [
              { name: searchRegex },
              { description: searchRegex },
              { tags: { $in: [searchRegex] } }
            ]
          },
          { status: "active" },
          { visibility: "public" }
        ]
      }

      // Apply filters
      if (filters.category) {
        productQuery.$and.push({ category: filters.category })
      }
      if (filters.priceMin !== undefined) {
        productQuery.$and.push({ price: { $gte: filters.priceMin } })
      }
      if (filters.priceMax !== undefined) {
        productQuery.$and.push({ price: { $lte: filters.priceMax } })
      }
      if (filters.featured === true) {
        productQuery.$and.push({ featured: true })
      }
      if (filters.onSale === true) {
        productQuery.$and.push({ discount: { $gt: 0 } })
      }

      // Apply sorting
      let sortOption: any = { createdAt: -1 }
      switch (sort) {
        case "price_asc":
          sortOption = { price: 1 }
          break
        case "price_desc":
          sortOption = { price: -1 }
          break
        case "newest":
          sortOption = { createdAt: -1 }
          break
        case "oldest":
          sortOption = { createdAt: 1 }
          break
        case "name_asc":
          sortOption = { name: 1 }
          break
        case "name_desc":
          sortOption = { name: -1 }
          break
      }

      const [products, productCount] = await Promise.all([
        Product.find(productQuery)
          .populate("category", "name slug")
          .select("name slug description price images category featured discount status")
          .sort(sortOption)
          .skip(type === "products" ? skip : 0)
          .limit(type === "products" ? limit : Math.ceil(limit / 3))
          .lean(),
        Product.countDocuments(productQuery)
      ])

      results.products = products.map(product => ({
        id: product._id,
        type: "product",
        title: product.name,
        description: product.description?.substring(0, 150) + "...",
        url: `/products/${product.slug}`,
        image: product.images?.[0] || "/placeholder.svg",
        price: product.price,
        category: product.category?.name,
        featured: product.featured,
        discount: product.discount
      }))

      if (type === "products") {
        results.total = productCount
      }
    }

    // Advanced Blog Search
    if (type === "all" || type === "blogs") {
      const blogQuery: any = {
        $and: [
          {
            $or: [
              { title: searchRegex },
              { excerpt: searchRegex },
              { content: searchRegex },
              { tags: { $in: [searchRegex] } }
            ]
          },
          { status: "published" },
          { visibility: "public" }
        ]
      }

      // Apply filters
      if (filters.category) {
        blogQuery.$and.push({ category: filters.category })
      }
      if (filters.author) {
        blogQuery.$and.push({ author: filters.author })
      }
      if (filters.dateFrom) {
        blogQuery.$and.push({ publishedAt: { $gte: new Date(filters.dateFrom) } })
      }
      if (filters.dateTo) {
        blogQuery.$and.push({ publishedAt: { $lte: new Date(filters.dateTo) } })
      }

      let blogSortOption: any = { publishedAt: -1 }
      if (sort === "oldest") {
        blogSortOption = { publishedAt: 1 }
      } else if (sort === "title_asc") {
        blogSortOption = { title: 1 }
      } else if (sort === "title_desc") {
        blogSortOption = { title: -1 }
      }

      const [blogs, blogCount] = await Promise.all([
        BlogPost.find(blogQuery)
          .populate("author", "name")
          .populate("category", "name slug")
          .select("title slug excerpt featuredImage author category publishedAt readingTime")
          .sort(blogSortOption)
          .skip(type === "blogs" ? skip : 0)
          .limit(type === "blogs" ? limit : Math.ceil(limit / 3))
          .lean(),
        BlogPost.countDocuments(blogQuery)
      ])

      results.blogs = blogs.map(blog => ({
        id: blog._id,
        type: "blog",
        title: blog.title,
        description: blog.excerpt,
        url: `/blog/${blog.slug}`,
        image: blog.featuredImage || "/placeholder.svg",
        author: blog.author?.name,
        category: blog.category?.name,
        publishedAt: blog.publishedAt,
        readingTime: blog.readingTime
      }))

      if (type === "blogs") {
        results.total = blogCount
      }
    }

    if (type === "all") {
      results.total = results.products.length + results.blogs.length + results.categories.length
    }

    return NextResponse.json({
      success: true,
      query,
      results,
      pagination: {
        page,
        limit,
        total: results.total,
        pages: Math.ceil(results.total / limit)
      }
    })

  } catch (error) {
    console.error("Error performing advanced search:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
