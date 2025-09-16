import mongoose from "mongoose"
import { connectToDatabase } from "../lib/db"
import User from "../lib/models/user"
import Product from "../lib/models/product"
import BlogPost from "../lib/models/blog-post"

function generateProducts(count: number) {
  const categories = ["Electronics", "Home", "Fashion", "Sports", "Books"]
  const images = [
    "/placeholder.jpg",
    "/placeholder.png",
    "/placeholder.svg",
    "/placeholder-logo.png",
  ]
  return Array.from({ length: count }).map((_, idx) => {
    const category = categories[idx % categories.length]
    const price = Number((Math.random() * 500 + 10).toFixed(2))
    const stock = Math.floor(Math.random() * 100) + 1
    return {
      name: `Sample Product ${idx + 1}`,
      description: `This is a sample description for product ${idx + 1}.`,
      price,
      images: [images[idx % images.length]],
      category,
      stock,
      featured: idx % 5 === 0,
    }
  })
}

function toSlug(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
}

async function run() {
  const uri = process.env.MONGODB_URI || ""
  if (!uri) {
    console.error("MONGODB_URI is not set. Set env or pass via CLI.")
    process.exit(1)
  }

  await connectToDatabase()

  // Clean existing
  await Promise.all([
    User.deleteMany({}),
    Product.deleteMany({}),
    BlogPost.deleteMany({}),
  ])

  // Users (use create/save to trigger pre-save password hashing)
  const usersData = [
    {
      name: "Admin User",
      email: "admin@kureno.dev",
      password: "Admin@123",
      role: "admin" as const,
      preferences: { emailNotifications: true, marketingEmails: false },
      isActive: true,
    },
    {
      name: "Alice Customer",
      email: "alice@example.com",
      password: "Password1",
      role: "user" as const,
      preferences: { emailNotifications: true, marketingEmails: false },
      isActive: true,
    },
    {
      name: "Bob Customer",
      email: "bob@example.com",
      password: "Password1",
      role: "user" as const,
      preferences: { emailNotifications: true, marketingEmails: true },
      isActive: true,
    },
    {
      name: "Carol Customer",
      email: "carol@example.com",
      password: "Password1",
      role: "user" as const,
      preferences: { emailNotifications: true, marketingEmails: false },
      isActive: true,
    },
  ]

  const users = await Promise.all(usersData.map((u) => User.create(u)))

  const adminUser = users[0]

  // Products
  const productsData = generateProducts(15)
  const products = await Product.insertMany(productsData)

  // Blogs
  const blogsData = Array.from({ length: 15 }).map((_, i) => {
    const title = `Sample Blog Post ${i + 1}`
    return {
      title,
      slug: toSlug(title),
      content:
        `# ${title}\n\nThis is sample content for blog post ${i + 1}. Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
      excerpt: `Short excerpt for blog post ${i + 1}.`,
      author: adminUser._id as mongoose.Types.ObjectId,
      coverImage: "/placeholder.jpg",
      tags: ["sample", "news", (i % 2 === 0 ? "feature" : "update")],
      published: true,
      publishedAt: new Date(),
    }
  })
  await BlogPost.insertMany(blogsData)

  const counts = await Promise.all([
    User.countDocuments({}),
    Product.countDocuments({}),
    BlogPost.countDocuments({}),
  ])

  console.log(
    JSON.stringify(
      { users: counts[0], products: counts[1], blogs: counts[2] },
      null,
      2,
    ),
  )

  await mongoose.connection.close()
}

run().catch(async (err) => {
  console.error(err)
  try {
    await mongoose.connection.close()
  } catch {}
  process.exit(1)
})


