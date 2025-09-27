import dotenv from 'dotenv'
import { connectToDatabase } from '../lib/db'
import Product from '../lib/models/product'

// Load environment variables
dotenv.config({ path: '.env.local' })

async function seedProductWithMarkdown() {
  try {
    await connectToDatabase()
    console.log('Connected to database')

    const markdownDescription = `# **Haori casual Flash Sale**

## Premium Quality Materials
Our haori is crafted from the finest materials to ensure comfort and durability.

### Key Features:
- **Premium cotton blend** for ultimate comfort
- **Traditional Japanese design** with modern fit
- **Hand-finished details** for superior quality
- **Machine washable** for easy care

### What's Included:
1. Main haori garment
2. Care instructions
3. Authenticity certificate
4. Premium packaging

> **Note**: This is a limited edition piece with only 100 units available worldwide.

### Care Instructions:
- Machine wash cold
- Tumble dry low
- Iron on low heat
- Do not bleach

**Don't miss out on this exclusive offer!**`

    const productData = {
      name: "Premium Haori Casual Jacket",
      description: markdownDescription,
      price: 89.99,
      originalPrice: 129.99,
      onSale: true,
      category: "clothing",
      stock: 50,
      featured: true,
      images: [
        "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&h=800&fit=crop",
        "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&h=800&fit=crop&q=80",
        "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&h=800&fit=crop&q=80"
      ],
      videos: [
        "https://res.cloudinary.com/demo/video/upload/sample.mp4"
      ],
      sku: "HAO-001",
      weight: 0.8,
      dimensions: {
        length: 75,
        width: 60,
        height: 2
      },
      seo: {
        title: "Premium Haori Casual Jacket - Limited Edition",
        description: "Discover our premium haori casual jacket with traditional Japanese design and modern comfort. Limited edition with only 100 units available.",
        keywords: "haori, japanese, casual, jacket, premium, limited edition"
      },
      tags: ["haori", "japanese", "casual", "jacket", "premium", "limited"],
      status: "published",
      visibility: "public",
      inventory: {
        trackQuantity: true,
        allowBackorder: false,
        lowStockThreshold: 5
      }
    }

    // Check if product already exists
    const existingProduct = await Product.findOne({ sku: productData.sku })
    if (existingProduct) {
      console.log('Product already exists, updating...')
      await Product.findByIdAndUpdate(existingProduct._id, productData)
      console.log('Product updated successfully!')
    } else {
      const product = new Product(productData)
      await product.save()
      console.log('Product created successfully!')
    }

    console.log('Product data:', productData)
    console.log('✅ Seeding completed!')
  } catch (error) {
    console.error('❌ Error seeding product:', error)
  } finally {
    process.exit(0)
  }
}

seedProductWithMarkdown()
