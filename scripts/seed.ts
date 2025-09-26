import mongoose from "mongoose"
import { connectToDatabase } from "../lib/db"
import User from "../lib/models/user"
import Product from "../lib/models/product"
import BlogPost from "../lib/models/blog-post"
import Category from "../lib/models/category"
import Order from "../lib/models/order"
import Message from "../lib/models/message"
import Wishlist from "../models/wishlist"


// User Notification Schema for seeding
const userNotificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, enum: ["order", "wishlist", "product", "system", "promotion"], required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  data: { type: mongoose.Schema.Types.Mixed, default: {} },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
})

const UserNotification = (mongoose.models.UserNotification as any) || mongoose.model("UserNotification", userNotificationSchema)

// Product categories details - Heritage & Craft focused
const categoriesData = [
  {
    name: "Handwoven Textiles",
    slug: "handwoven-textiles",
    description: "Traditional fabrics and textiles crafted by local artisans using time-honored weaving techniques passed down through generations."
  },
  {
    name: "Artisan Ceramics",
    slug: "artisan-ceramics",
    description: "Beautiful pottery and ceramic pieces shaped by skilled hands, each telling a story of our cultural heritage and artistic tradition."
  },
  {
    name: "Wooden Crafts",
    slug: "wooden-crafts",
    description: "Sustainable wooden products carved and crafted from locally sourced materials, preserving traditional woodworking skills."
  },
  {
    name: "Cultural Jewelry",
    slug: "cultural-jewelry",
    description: "Handcrafted jewelry pieces that celebrate our cultural identity, made with traditional techniques and meaningful symbols."
  },
  {
    name: "Heritage Home Decor",
    slug: "heritage-home-decor",
    description: "Authentic home decoration items that bring cultural warmth and traditional aesthetics to modern living spaces."
  }
]

// Detailed products for each category - Heritage & Craft focused
const productsData = [
  // Handwoven Textiles
  {
    name: "Traditional Ikat Silk Scarf",
    description: "Exquisite silk scarf featuring traditional ikat patterns, handwoven by master artisans using techniques passed down through five generations. Each piece takes 3 weeks to complete, with natural dyes creating vibrant, lasting colors that tell stories of our cultural heritage.",
    price: 89,
    originalPrice: 120,
    images: ["/placeholder.png"],
    category: "Handwoven Textiles",
    stock: 15,
    featured: true,
    isNew: true,
    discount: 26,
    sku: "TEX-IKAT-SCARF-001",
    weight: 0.08,
    dimensions: { length: 180, width: 60, height: 0.2 },
    seo: {
      title: "Traditional Ikat Silk Scarf - Handwoven Heritage",
      description: "Authentic ikat silk scarf handwoven by master artisans using traditional techniques. Cultural heritage in every thread.",
      keywords: "ikat, silk scarf, handwoven, traditional, artisan, heritage"
    },
    variants: [
      {
        id: "color-variant",
        name: "Pattern",
        type: "color",
        options: [
          {
            id: "sunset-bloom",
            name: "Sunset Bloom",
            value: "#FF6B35",
            priceModifier: 0,
            stock: 5,
            sku: "TEX-IKAT-SCARF-001-SB",
            available: true
          },
          {
            id: "ocean-wave",
            name: "Ocean Wave",
            value: "#1B4D72",
            priceModifier: 0,
            stock: 6,
            sku: "TEX-IKAT-SCARF-001-OW",
            available: true
          },
          {
            id: "forest-spirit",
            name: "Forest Spirit",
            value: "#2D5016",
            priceModifier: 5,
            stock: 4,
            sku: "TEX-IKAT-SCARF-001-FS",
            available: true
          }
        ]
      }
    ],
    tags: ["handwoven", "silk", "ikat", "traditional", "artisan", "heritage"],
    status: "published",
    visibility: "public",
    inventory: {
      trackQuantity: true,
      allowBackorder: false,
      lowStockThreshold: 3
    }
  },
  {
    name: "Heritage Cotton Table Runner",
    description: "Beautifully crafted table runner featuring intricate geometric patterns inspired by ancient textile traditions. Hand-loomed using organic cotton and natural indigo dyes. Each piece represents months of careful work by skilled artisans, bringing timeless elegance to your dining experience.",
    price: 65,
    originalPrice: 85,
    images: ["/placeholder.png"],
    category: "Handwoven Textiles",
    stock: 20,
    featured: true,
    isNew: false,
    discount: 24,
    sku: "TEX-RUNNER-HER-001",
    weight: 0.4,
    dimensions: { length: 180, width: 35, height: 0.5 },
    seo: {
      title: "Heritage Cotton Table Runner - Handwoven Tradition",
      description: "Handwoven cotton table runner with geometric patterns. Organic materials, natural dyes, artisan crafted.",
      keywords: "table runner, handwoven, cotton, geometric, indigo, artisan"
    },
    variants: [
      {
        id: "size-variant",
        name: "Size",
        type: "size",
        options: [
          {
            id: "medium",
            name: "Medium (180cm)",
            value: "180cm",
            priceModifier: 0,
            stock: 12,
            sku: "TEX-RUNNER-HER-001-M",
            available: true
          },
          {
            id: "large",
            name: "Large (220cm)",
            value: "220cm",
            priceModifier: 15,
            stock: 8,
            sku: "TEX-RUNNER-HER-001-L",
            available: true
          }
        ]
      }
    ],
    tags: ["table runner", "handwoven", "cotton", "geometric", "heritage", "organic"],
    status: "published",
    visibility: "public",
    inventory: {
      trackQuantity: true,
      allowBackorder: true,
      lowStockThreshold: 5
    }
  },
  
  // Artisan Ceramics
  {
    name: "Handcrafted Ceramic Tea Set",
    description: "Elegant ceramic tea set featuring traditional glazing techniques perfected over centuries. Each piece is hand-thrown on the potter's wheel and fired in our heritage kiln. The subtle earth tones and organic shapes reflect the natural beauty of our local clay, creating a perfect harmony for your tea ceremony.",
    price: 145,
    originalPrice: 195,
    images: ["/placeholder.png"],
    category: "Artisan Ceramics",
    stock: 12,
    featured: false,
    isNew: true,
    discount: 26,
    sku: "CER-TEA-SET-001",
    weight: 2.1,
    dimensions: { length: 25, width: 20, height: 15 },
    seo: {
      title: "Handcrafted Ceramic Tea Set - Artisan Pottery",
      description: "Traditional ceramic tea set hand-thrown by master potters. Heritage glazing techniques, natural clay.",
      keywords: "ceramic tea set, handcrafted, pottery, traditional, artisan, heritage"
    },
    variants: [
      {
        id: "glaze-variant",
        name: "Glaze Finish",
        type: "color",
        options: [
          {
            id: "earth-tone",
            name: "Earth Tone",
            value: "#8B4513",
            priceModifier: 0,
            stock: 5,
            sku: "CER-TEA-SET-001-ET",
            available: true
          },
          {
            id: "celadon-green",
            name: "Celadon Green",
            value: "#ACE1AF",
            priceModifier: 10,
            stock: 4,
            sku: "CER-TEA-SET-001-CG",
            available: true
          },
          {
            id: "midnight-blue",
            name: "Midnight Blue",
            value: "#191970",
            priceModifier: 15,
            stock: 3,
            sku: "CER-TEA-SET-001-MB",
            available: true
          }
        ]
      }
    ],
    tags: ["ceramic", "tea set", "handcrafted", "pottery", "traditional", "artisan"],
    status: "published",
    visibility: "public",
    inventory: {
      trackQuantity: true,
      allowBackorder: false,
      lowStockThreshold: 3
    }
  },
  {
    name: "Artisan Ceramic Bowl Collection",
    description: "Set of three handcrafted ceramic bowls, each uniquely shaped and glazed by our master ceramicists. Inspired by traditional forms but designed for modern living, these bowls showcase the natural variations that make handmade ceramics so special. Perfect for serving, display, or as thoughtful gifts.",
    price: 85,
    originalPrice: 110,
    images: ["/placeholder.png"],
    category: "Artisan Ceramics",
    stock: 18,
    featured: true,
    isNew: false,
    discount: 23,
    sku: "CER-BOWL-COL-001",
    weight: 1.8,
    dimensions: { length: 20, width: 20, height: 8 },
    seo: {
      title: "Artisan Ceramic Bowl Collection - Handcrafted Pottery",
      description: "Set of three handcrafted ceramic bowls by master ceramicists. Traditional forms, modern living.",
      keywords: "ceramic bowls, handcrafted, pottery, artisan, traditional, collection"
    },
    variants: [
      {
        id: "size-variant",
        name: "Set Size",
        type: "size",
        options: [
          {
            id: "small-set",
            name: "Small Set (3 bowls)",
            value: "Small",
            priceModifier: 0,
            stock: 10,
            sku: "CER-BOWL-COL-001-S",
            available: true
          },
          {
            id: "large-set",
            name: "Large Set (5 bowls)",
            value: "Large",
            priceModifier: 35,
            stock: 8,
            sku: "CER-BOWL-COL-001-L",
            available: true
          }
        ]
      }
    ],
    tags: ["ceramic", "bowls", "handcrafted", "pottery", "artisan", "collection"],
    status: "published",
    visibility: "public",
    inventory: {
      trackQuantity: true,
      allowBackorder: true,
      lowStockThreshold: 4
    }
  },
  
  // Wooden Crafts
  {
    name: "Heritage Wooden Serving Tray",
    description: "Beautifully carved wooden serving tray made from sustainably sourced local hardwood. Each tray features intricate traditional patterns carved by hand, taking skilled artisans over 40 hours to complete. The natural wood grain and hand-rubbed finish create a unique piece that celebrates our woodworking heritage.",
    price: 125,
    images: ["/placeholder.png"],
    category: "Wooden Crafts",
    stock: 15,
    featured: false,
    sku: "WOD-TRAY-HER-001",
    weight: 1.2,
    dimensions: { length: 40, width: 25, height: 3 },
    seo: {
      title: "Heritage Wooden Serving Tray - Hand Carved",
      description: "Hand-carved wooden serving tray from sustainable hardwood. Traditional patterns, 40+ hours craftsmanship.",
      keywords: "wooden tray, hand carved, sustainable, hardwood, traditional, heritage"
    },
    variants: [
      {
        id: "wood-type",
        name: "Wood Type",
        type: "material",
        options: [
          {
            id: "teak",
            name: "Teak",
            value: "Teak",
            priceModifier: 0,
            stock: 8,
            sku: "WOD-TRAY-HER-001-TK",
            available: true
          },
          {
            id: "mahogany",
            name: "Mahogany",
            value: "Mahogany",
            priceModifier: 25,
            stock: 7,
            sku: "WOD-TRAY-HER-001-MH",
            available: true
          }
        ]
      }
    ],
    tags: ["wooden tray", "hand carved", "sustainable", "hardwood", "traditional", "heritage"],
    status: "published",
    visibility: "public",
    inventory: {
      trackQuantity: true,
      allowBackorder: false,
      lowStockThreshold: 3
    }
  },
  {
    name: "Handcrafted Wooden Jewelry Box",
    description: "Exquisite jewelry box crafted from premium wood with traditional joinery techniques. Features multiple compartments lined with soft fabric, hand-carved decorative elements, and a smooth lacquer finish. A perfect blend of functionality and artistry, representing generations of woodworking mastery.",
    price: 89,
    images: ["/placeholder.png"],
    category: "Wooden Crafts",
    stock: 22,
    featured: true,
    sku: "WOD-JEW-BOX-001",
    weight: 0.8,
    dimensions: { length: 20, width: 15, height: 8 },
    seo: {
      title: "Handcrafted Wooden Jewelry Box - Traditional Joinery",
      description: "Premium wooden jewelry box with traditional joinery. Hand-carved details, multiple compartments.",
      keywords: "wooden jewelry box, handcrafted, traditional joinery, premium wood, artisan"
    },
    variants: [
      {
        id: "finish-variant",
        name: "Finish",
        type: "color",
        options: [
          {
            id: "natural",
            name: "Natural",
            value: "#DEB887",
            priceModifier: 0,
            stock: 12,
            sku: "WOD-JEW-BOX-001-NAT",
            available: true
          },
          {
            id: "dark-walnut",
            name: "Dark Walnut",
            value: "#5D4037",
            priceModifier: 10,
            stock: 10,
            sku: "WOD-JEW-BOX-001-DW",
            available: true
          }
        ]
      }
    ],
    tags: ["wooden jewelry box", "handcrafted", "traditional joinery", "premium", "artisan"],
    status: "published",
    visibility: "public",
    inventory: {
      trackQuantity: true,
      allowBackorder: true,
      lowStockThreshold: 5
    }
  },
  
  // Cultural Jewelry
  {
    name: "Traditional Silver Pendant Necklace",
    description: "Stunning silver pendant necklace featuring ancient cultural motifs passed down through generations. Each piece is hand-forged by master silversmiths using traditional techniques. The intricate patterns tell stories of our heritage, making this not just jewelry, but a piece of living history.",
    price: 165,
    images: ["/placeholder.png"],
    category: "Cultural Jewelry",
    stock: 25,
    featured: true,
    sku: "JEW-PEN-SIL-001",
    weight: 0.045,
    dimensions: { length: 3, width: 2.5, height: 0.3 },
    seo: {
      title: "Traditional Silver Pendant Necklace - Cultural Heritage",
      description: "Hand-forged silver pendant with ancient cultural motifs. Master craftsmanship, living history.",
      keywords: "silver pendant, traditional, cultural motifs, hand-forged, heritage, silversmith"
    },
    variants: [
      {
        id: "chain-length",
        name: "Chain Length",
        type: "size",
        options: [
          {
            id: "short",
            name: "Short (45cm)",
            value: "45cm",
            priceModifier: 0,
            stock: 12,
            sku: "JEW-PEN-SIL-001-S",
            available: true
          },
          {
            id: "medium",
            name: "Medium (55cm)",
            value: "55cm",
            priceModifier: 15,
            stock: 8,
            sku: "JEW-PEN-SIL-001-M",
            available: true
          },
          {
            id: "long",
            name: "Long (65cm)",
            value: "65cm",
            priceModifier: 25,
            stock: 5,
            sku: "JEW-PEN-SIL-001-L",
            available: true
          }
        ]
      }
    ],
    tags: ["silver pendant", "traditional", "cultural", "hand-forged", "heritage", "necklace"],
    status: "published",
    visibility: "public",
    inventory: {
      trackQuantity: true,
      allowBackorder: false,
      lowStockThreshold: 5
    }
  },
  {
    name: "Artisan Copper Bracelet Set",
    description: "Set of three handcrafted copper bracelets featuring traditional hammered textures and cultural engravings. Made using ancient metalworking techniques, each bracelet develops a unique patina over time. Believed to carry protective properties, these pieces connect the wearer to our ancestral traditions.",
    price: 75,
    images: ["/placeholder.png"],
    category: "Cultural Jewelry",
    stock: 35,
    featured: false,
    sku: "JEW-BRA-COP-001",
    weight: 0.12,
    dimensions: { length: 18, width: 1.2, height: 0.3 },
    seo: {
      title: "Artisan Copper Bracelet Set - Traditional Metalwork",
      description: "Handcrafted copper bracelets with traditional hammered textures. Ancient techniques, protective properties.",
      keywords: "copper bracelet, handcrafted, traditional, hammered, metalwork, artisan"
    },
    variants: [
      {
        id: "size-variant",
        name: "Size",
        type: "size",
        options: [
          {
            id: "small",
            name: "Small (16-17cm)",
            value: "S",
            priceModifier: 0,
            stock: 15,
            sku: "JEW-BRA-COP-001-S",
            available: true
          },
          {
            id: "medium",
            name: "Medium (17-18cm)",
            value: "M",
            priceModifier: 0,
            stock: 12,
            sku: "JEW-BRA-COP-001-M",
            available: true
          },
          {
            id: "large",
            name: "Large (18-19cm)",
            value: "L",
            priceModifier: 0,
            stock: 8,
            sku: "JEW-BRA-COP-001-L",
            available: true
          }
        ]
      }
    ],
    tags: ["copper bracelet", "handcrafted", "traditional", "hammered", "metalwork", "set"],
    status: "published",
    visibility: "public",
    inventory: {
      trackQuantity: true,
      allowBackorder: true,
      lowStockThreshold: 8
    }
  },
  
  // Heritage Home Decor
  {
    name: "Traditional Woven Wall Hanging",
    description: "Magnificent wall hanging woven using traditional techniques with natural fibers and organic dyes. This large decorative piece features geometric patterns that have been part of our cultural identity for centuries. Each hanging takes months to complete and serves as a stunning focal point for any room.",
    price: 195,
    images: ["/placeholder.png"],
    category: "Heritage Home Decor",
    stock: 8,
    featured: true,
    sku: "DEC-WAL-WOV-001",
    weight: 1.5,
    dimensions: { length: 120, width: 80, height: 2 },
    seo: {
      title: "Traditional Woven Wall Hanging - Cultural Art",
      description: "Large woven wall hanging with traditional geometric patterns. Natural fibers, organic dyes, months of craftsmanship.",
      keywords: "wall hanging, woven, traditional, geometric patterns, natural fibers, cultural"
    },
    variants: [
      {
        id: "color-scheme",
        name: "Color Scheme",
        type: "color",
        options: [
          {
            id: "earth-tones",
            name: "Earth Tones",
            value: "#8B4513",
            priceModifier: 0,
            stock: 4,
            sku: "DEC-WAL-WOV-001-ET",
            available: true
          },
          {
            id: "ocean-blues",
            name: "Ocean Blues",
            value: "#4682B4",
            priceModifier: 20,
            stock: 4,
            sku: "DEC-WAL-WOV-001-OB",
            available: true
          }
        ]
      }
    ],
    tags: ["wall hanging", "woven", "traditional", "geometric", "natural fibers", "heritage"],
    status: "published",
    visibility: "public",
    inventory: {
      trackQuantity: true,
      allowBackorder: false,
      lowStockThreshold: 2
    }
  },
  {
    name: "Heritage Candle Collection",
    description: "Set of handcrafted candles made from natural beeswax and infused with traditional aromatic herbs. Each candle is hand-dipped using techniques preserved for generations, creating unique textures and burns. The scents are inspired by our local flora and cultural ceremonies, bringing ancestral warmth to modern homes.",
    price: 45,
    images: ["/placeholder.png"],
    category: "Heritage Home Decor",
    stock: 40,
    featured: false,
    sku: "DEC-CAN-HER-001",
    weight: 0.6,
    dimensions: { length: 8, width: 8, height: 15 },
    seo: {
      title: "Heritage Candle Collection - Natural Beeswax",
      description: "Hand-dipped beeswax candles with traditional aromatic herbs. Ancestral techniques, local flora scents.",
      keywords: "beeswax candles, hand-dipped, traditional herbs, aromatic, heritage, natural"
    },
    variants: [
      {
        id: "scent-variant",
        name: "Scent",
        type: "scent",
        options: [
          {
            id: "lavender-sage",
            name: "Lavender & Sage",
            value: "Lavender & Sage",
            priceModifier: 0,
            stock: 15,
            sku: "DEC-CAN-HER-001-LS",
            available: true
          },
          {
            id: "cedar-pine",
            name: "Cedar & Pine",
            value: "Cedar & Pine",
            priceModifier: 0,
            stock: 12,
            sku: "DEC-CAN-HER-001-CP",
            available: true
          },
          {
            id: "jasmine-mint",
            name: "Jasmine & Mint",
            value: "Jasmine & Mint",
            priceModifier: 5,
            stock: 13,
            sku: "DEC-CAN-HER-001-JM",
            available: true
          }
        ]
      }
    ],
    tags: ["beeswax candles", "hand-dipped", "traditional", "aromatic herbs", "heritage", "natural"],
    status: "published",
    visibility: "public",
    inventory: {
      trackQuantity: true,
      allowBackorder: true,
      lowStockThreshold: 10
    }
  }
]

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
    Category.deleteMany({}),
    Order.deleteMany({}),
    Message.deleteMany({}),
    UserNotification.deleteMany({}),
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
  const customerUsers = users.slice(1)

  // Categories
  const categories = await Category.insertMany(categoriesData)

  // Products
  const products = await Product.insertMany(productsData)

  // Heritage & Craft focused Blog Posts
  const blogsData = [
    {
      title: "The Ancient Art of Ikat Weaving: Preserving Cultural Heritage",
      slug: "ancient-art-ikat-weaving-cultural-heritage",
      content: `# The Ancient Art of Ikat Weaving: Preserving Cultural Heritage

Ikat weaving represents one of humanity's most sophisticated textile traditions, with techniques that have been passed down through countless generations. At Kureno, we are proud to work with master weavers who continue this ancient craft with the same passion and precision as their ancestors.

## The Sacred Process

### 1. Preparing the Threads
The journey begins with carefully selecting the finest silk threads. Each thread is measured and prepared with meticulous attention to detail, as the quality of the final piece depends entirely on this foundation.

### 2. The Art of Resist Dyeing
The heart of ikat lies in its unique dyeing process. Sections of the warp threads are bound with plant fibers before dyeing, creating intricate patterns that will emerge only when the fabric is woven. This process requires years of training to master.

### 3. Natural Dyes and Colors
Our artisans use only natural dyes derived from local plants, roots, and minerals. The vibrant blues come from indigo, the rich reds from madder root, and the golden yellows from turmeric. These natural colors not only create beautiful textiles but also connect us to our environment.

## Cultural Significance

Each ikat pattern tells a story. The geometric designs are not merely decorative – they carry deep cultural meaning, representing everything from family lineages to spiritual beliefs. When you wear an ikat piece, you carry these stories with you.

## Preserving the Future

Through our partnership with local artisans, we ensure that these ancient techniques continue to thrive. Each purchase supports not just the craftsperson, but an entire community dedicated to preserving this irreplaceable heritage.

## Conclusion

In our fast-paced modern world, the deliberate, meditative process of ikat weaving reminds us of the value of patience, skill, and cultural continuity. Every thread woven is a thread connecting us to our past and future.`,
      excerpt: "Discover the ancient art of ikat weaving and how traditional techniques are being preserved for future generations through master artisan partnerships.",
      author: adminUser._id as mongoose.Types.ObjectId,
      coverImage: "/placeholder.png",
      tags: ["ikat", "weaving", "heritage", "craftsmanship", "traditional"],
      published: true,
      publishedAt: new Date(),
    },
    {
      title: "From Clay to Art: The Journey of Ceramic Craftsmanship",
      slug: "clay-to-art-ceramic-craftsmanship-journey",
      content: `# From Clay to Art: The Journey of Ceramic Craftsmanship

The transformation of humble clay into beautiful ceramic art is one of humanity's oldest and most enduring crafts. At Kureno, our master ceramicists continue traditions that span millennia, creating pieces that bridge ancient wisdom with contemporary living.

## The Sacred Earth

### 1. Selecting the Clay
Not all clay is created equal. Our artisans travel to specific locations where the earth has been blessed with the perfect mineral composition. This local clay carries the essence of our homeland in every particle.

### 2. Preparation and Aging
The clay must be prepared through a process of weathering and aging that can take months. This patience allows the clay to develop the plasticity and character needed for fine work.

## The Potter's Wheel

### 1. Centering the Clay
The first and most crucial step is centering the clay on the wheel. This requires not just physical skill, but a meditative state where the potter becomes one with the material.

### 2. Shaping with Intent
Each vessel is shaped not just by hands, but by generations of knowledge passed down through families. The curves and proportions follow ancient principles of beauty and function.

## Fire and Transformation

### 1. The First Fire
The bisque firing transforms soft clay into ceramic. This irreversible process requires precise temperature control and timing, skills that take decades to master.

### 2. Glazing Traditions
Our glazes are mixed using traditional recipes, some dating back centuries. The interaction between glaze and fire creates unique effects that can never be exactly replicated.

### 3. The Final Fire
The glaze firing is the moment of truth. Years of preparation culminate in this final transformation, where heat and chemistry create the finished piece.

## Cultural Heritage

Each ceramic piece carries within it the cultural DNA of our community. The forms echo vessels used in daily life for generations, while the decorative elements reference stories, beliefs, and natural phenomena important to our culture.

## Sustainability and Future

Our ceramic tradition is inherently sustainable. We use local materials, fire with renewable energy sources, and create pieces built to last generations rather than seasons.

## Conclusion

In every ceramic piece, you hold thousands of years of human creativity and cultural continuity. These are not just objects, but vessels carrying our heritage into the future.`,
      excerpt: "Follow the sacred journey from local clay to finished ceramic art, exploring traditional techniques and cultural significance preserved by master craftspeople.",
      author: adminUser._id as mongoose.Types.ObjectId,
      coverImage: "/placeholder.png",
      tags: ["ceramics", "pottery", "craftsmanship", "traditional", "heritage"],
      published: true,
      publishedAt: new Date(),
    },
    {
      title: "Sustainable Woodworking: Honoring Trees, Preserving Traditions",
      slug: "sustainable-woodworking-honoring-trees-preserving-traditions",
      content: `# Sustainable Woodworking: Honoring Trees, Preserving Traditions

Wood has been humanity's companion since the dawn of civilization. At Kureno, our approach to woodworking goes beyond mere craftsmanship – it's a philosophy that honors the tree, respects the environment, and preserves ancient techniques for future generations.

## The Sacred Relationship with Trees

### 1. Selecting with Reverence
Every piece of wood tells the story of a tree's life. Our artisans carefully select only sustainably harvested wood, often from trees that have lived for decades or centuries. We believe in honoring the tree's sacrifice by creating pieces that will last equally long.

### 2. Understanding Wood Grain
Reading wood grain is like reading a book. Each line tells of seasons weathered, storms survived, and years of patient growth. Master woodworkers spend decades learning to work with, rather than against, the natural characteristics of each piece.

## Traditional Tools and Techniques

### 1. Hand Tools vs. Machines
While modern tools have their place, our artisans primarily use traditional hand tools passed down through generations. The connection between craftsperson and material is more intimate, resulting in pieces with soul and character.

### 2. Joinery Without Nails
Traditional joinery techniques like mortise and tenon, dovetail, and finger joints create connections stronger than any nail or screw. These techniques, refined over centuries, ensure our pieces can be passed down through generations.

## The Meditation of Woodworking

### 1. Patience and Rhythm
Woodworking cannot be rushed. Each cut, each shave of the plane, follows a natural rhythm. This meditative process connects the craftsperson to centuries of woodworkers who have followed the same motions.

### 2. Respect for Imperfection
In a world of machine precision, handcrafted wood pieces celebrate the beautiful imperfections that make each piece unique. These variations are not flaws – they are signatures of human craftsmanship.

## Environmental Stewardship

### 1. Zero Waste Philosophy
Every scrap of wood finds a purpose in our workshop. Larger pieces become furniture, smaller ones become decorative items, and even sawdust is composted to nourish new trees.

### 2. Supporting Forest Communities
By working with local forestry cooperatives, we ensure that our wood sourcing supports communities dedicated to sustainable forest management. Every purchase helps plant new trees for future generations.

## Cultural Heritage in Wood

Each wooden piece carries cultural significance. The forms, proportions, and decorative elements reflect aesthetic principles developed over generations, connecting modern users to their cultural roots.

## Conclusion

When you hold a piece of our handcrafted woodwork, you're touching not just wood, but the hands of the artisan, the roots of the tree, and the wisdom of generations. This is craftsmanship with purpose, creating beauty that honors both nature and culture.`,
      excerpt: "Explore sustainable woodworking practices that honor trees and preserve traditional craftsmanship techniques for future generations.",
      author: adminUser._id as mongoose.Types.ObjectId,
      coverImage: "/placeholder.png",
      tags: ["woodworking", "sustainable", "traditional", "craftsmanship", "heritage"],
      published: true,
      publishedAt: new Date(),
    },
    {
      title: "The Living Art of Traditional Jewelry Making",
      slug: "living-art-traditional-jewelry-making",
      content: `# The Living Art of Traditional Jewelry Making

Jewelry has always been more than mere adornment – it's a language of culture, status, and spiritual belief. At Kureno, our jewelry artisans continue traditions that transform precious metals into meaningful art, creating pieces that carry the soul of our heritage.

## The Sacred Metals

### 1. Silver: The Moon's Gift
Silver has been revered in our culture as the metal of the moon, possessing protective and purifying properties. Our silversmiths work with this living metal, understanding its temperament and honoring its spiritual significance.

### 2. Copper: The Earth's Warmth
Copper, with its warm glow, represents the earth's life force. Traditional belief holds that copper jewelry can channel healing energy and provide protection to the wearer.

## Ancient Techniques, Timeless Beauty

### 1. Hand-Forging Traditions
Every piece begins with fire and hammer. Our artisans heat the metal until it glows, then shape it with techniques unchanged for centuries. The rhythm of hammer on metal is like a heartbeat, connecting craftsperson to countless generations before them.

### 2. Granulation and Filigree
These delicate techniques involve creating patterns with tiny metal spheres or fine wire. The precision required takes years to master, and the results are breathtakingly intricate designs that seem to capture light itself.

### 3. Traditional Patination
The aging process that gives our copper pieces their unique patina is both art and science. Through controlled oxidation, each piece develops its own character over time, becoming more beautiful with age.

## Cultural Symbolism

### 1. Protective Motifs
Many of our designs incorporate ancient symbols believed to offer protection, prosperity, and good fortune. These aren't mere decorations – they're talismans carrying the hopes and beliefs of our ancestors.

### 2. Connection to Nature
Our jewelry often reflects natural forms – leaves, flowers, water patterns – connecting the wearer to the natural world and its cycles. This reflects our culture's deep respect for nature's wisdom.

## The Artisan's Journey

### 1. Years of Apprenticeship
Becoming a master jewelry artisan requires decades of dedication. Young apprentices start by learning to control fire and understand metal, gradually progressing to more complex techniques.

### 2. Passing Down Knowledge
Each master artisan is also a teacher, ensuring that these precious skills continue to flow from one generation to the next. This unbroken chain of knowledge is what keeps our traditions alive.

## Modern Relevance

In our digital age, handcrafted jewelry offers something irreplaceable – the touch of human hands, the warmth of personal creation, and the connection to cultural roots. Each piece is a small rebellion against mass production.

## Conclusion

When you wear our traditional jewelry, you carry with you not just beautiful metalwork, but the prayers, hopes, and artistic vision of countless artisans. You become part of an unbroken chain of cultural continuity, wearing history as art.`,
      excerpt: "Discover the sacred art of traditional jewelry making, where ancient techniques transform precious metals into meaningful cultural treasures.",
      author: adminUser._id as mongoose.Types.ObjectId,
      coverImage: "/placeholder.png",
      tags: ["jewelry", "traditional", "silversmith", "metalwork", "cultural"],
      published: true,
      publishedAt: new Date(),
    },
    {
      title: "Creating Sacred Spaces: The Philosophy of Heritage Home Decor",
      slug: "creating-sacred-spaces-heritage-home-decor-philosophy",
      content: `# Creating Sacred Spaces: The Philosophy of Heritage Home Decor

A home is more than shelter – it's a sanctuary where we connect with ourselves, our families, and our cultural roots. At Kureno, we believe that heritage home decor doesn't just beautify spaces; it creates sacred environments that nurture the soul and honor our ancestors.

## The Language of Objects

### 1. Every Piece Tells a Story
Traditional home decor items are not mere objects but storytellers. A handwoven wall hanging speaks of the weaver's skill and cultural heritage. A ceramic vase carries the earth's memory and the potter's prayers.

### 2. Connecting Past and Present
By incorporating heritage pieces into modern homes, we create bridges between past and present, allowing ancient wisdom to inform contemporary living.

## The Art of Natural Materials

### 1. Celebrating Imperfection
Unlike mass-produced items, heritage pieces celebrate the beautiful imperfections that come from human hands. These variations aren't flaws – they're signatures of authenticity and craftsmanship.

### 2. Aging with Grace
Natural materials like wood, clay, and natural fibers don't just age – they mature, becoming more beautiful over time. This teaches us to value longevity over disposability.

## Creating Harmony

### 1. Balancing Elements
Traditional decorating principles emphasize balance – not just visual balance, but energetic harmony. Each piece should contribute to the overall sense of peace and well-being in the space.

### 2. Seasonal Connections
Heritage decor often reflects seasonal cycles, helping inhabitants stay connected to natural rhythms even in urban environments.

## The Ritual of Placement

### 1. Intentional Arrangement
Placing heritage pieces is a ritual that requires thought and intention. Each item should have a purpose beyond decoration – perhaps to inspire, to protect, or to remember.

### 2. Creating Focal Points
Traditional pieces often serve as focal points that draw the eye and center the spirit. These might be places for meditation, gratitude, or simply appreciation of beauty.

## Sustainable Beauty

### 1. Quality Over Quantity
Heritage decor philosophy emphasizes having fewer, better pieces rather than filling spaces with temporary items. This approach is both environmentally sustainable and spiritually satisfying.

### 2. Heirloom Potential
The best heritage pieces are designed to become heirlooms, carrying family history and cultural memory from one generation to the next.

## Modern Applications

### 1. Mixing Old and New
Heritage pieces can beautifully complement modern furnishings, creating spaces that honor the past while embracing the present.

### 2. Creating Personal Sanctuaries
In our busy world, heritage decor helps create quiet corners for reflection, meditation, and connection with our deeper selves.

## The Spiritual Dimension

Many cultures believe that objects carry energy from their creators. Heritage pieces made with love and intention can bring positive energy into homes, creating spaces that nurture and inspire.

## Conclusion

Heritage home decor is about more than aesthetics – it's about creating spaces that honor our cultural roots, nurture our spirits, and connect us to something larger than ourselves. When we fill our homes with meaningful objects, we create sanctuaries for the soul.`,
      excerpt: "Explore the philosophy behind heritage home decor and how traditional pieces can transform modern spaces into sacred, meaningful sanctuaries.",
      author: adminUser._id as mongoose.Types.ObjectId,
      coverImage: "/placeholder.png",
      tags: ["home decor", "heritage", "traditional", "sacred spaces", "philosophy"],
      published: true,
      publishedAt: new Date(),
    }
  ]
  await BlogPost.insertMany(blogsData)

  // Orders
  const ordersData = [
    {
      user: customerUsers[0]._id,
      items: [
        {
          productId: products[0]._id, // iPhone 15 Pro Max
          name: products[0].name,
          quantity: 1,
          price: products[0].price,
          image: products[0].images[0],
        },
        {
          productId: products[2]._id, // Premium Men's Dress Shirt
          name: products[2].name,
          quantity: 2,
          price: products[2].price,
          image: products[2].images[0],
        }
      ],
      subtotal: products[0].price + (products[2].price * 2),
      shipping: 15,
      total: products[0].price + (products[2].price * 2) + 15,
      shippingAddress: {
        firstName: "John",
        lastName: "Smith",
        address: "123 Main Street",
        city: "New York",
        state: "NY",
        zipCode: "10001",
        country: "United States",
      },
      paymentMethod: "credit_card",
      status: "delivered",
      paymentStatus: "paid",
    },
    {
      user: customerUsers[1]._id,
      items: [
        {
          productId: products[1]._id, // MacBook Air M3
          name: products[1].name,
          quantity: 1,
          price: products[1].price,
          image: products[1].images[0],
        }
      ],
      subtotal: products[1].price,
      shipping: 25,
      total: products[1].price + 25,
      shippingAddress: {
        firstName: "Sarah",
        lastName: "Johnson",
        address: "456 Oak Avenue",
        city: "Los Angeles",
        state: "CA",
        zipCode: "90210",
        country: "United States",
      },
      paymentMethod: "bank_transfer",
      status: "processing",
      paymentStatus: "pending",
    },
    {
      user: customerUsers[2]._id,
      items: [
        {
          productId: products[4]._id, // Premium Stainless Steel Cookware Set
          name: products[4].name,
          quantity: 1,
          price: products[4].price,
          image: products[4].images[0],
        },
        {
          productId: products[5]._id, // Smart Air Purifier
          name: products[5].name,
          quantity: 1,
          price: products[5].price,
          image: products[5].images[0],
        }
      ],
      subtotal: products[4].price + products[5].price,
      shipping: 20,
      total: products[4].price + products[5].price + 20,
      shippingAddress: {
        firstName: "Michael",
        lastName: "Brown",
        address: "789 Pine Street",
        city: "Chicago",
        state: "IL",
        zipCode: "60601",
        country: "United States",
      },
      paymentMethod: "cash_on_delivery",
      status: "shipped",
      paymentStatus: "paid",
    },
    {
      user: customerUsers[0]._id,
      items: [
        {
          productId: products[6]._id, // Nike Air Max Running Shoes
          name: products[6].name,
          quantity: 1,
          price: products[6].price,
          image: products[6].images[0],
        },
        {
          productId: products[7]._id, // Premium Yoga Mat
          name: products[7].name,
          quantity: 2,
          price: products[7].price,
          image: products[7].images[0],
        }
      ],
      subtotal: products[6].price + (products[7].price * 2),
      shipping: 18,
      total: products[6].price + (products[7].price * 2) + 18,
      shippingAddress: {
        firstName: "Emily",
        lastName: "Davis",
        address: "321 Elm Street",
        city: "Miami",
        state: "FL",
        zipCode: "33101",
        country: "United States",
      },
      paymentMethod: "credit_card",
      status: "pending",
      paymentStatus: "pending",
    },
    {
      user: customerUsers[1]._id,
      items: [
        {
          productId: products[8]._id, // How to Win Friends and Influence People
          name: products[8].name,
          quantity: 3,
          price: products[8].price,
          image: products[8].images[0],
        },
        {
          productId: products[9]._id, // Complete IELTS Preparation Book Set
          name: products[9].name,
          quantity: 1,
          price: products[9].price,
          image: products[9].images[0],
        }
      ],
      subtotal: (products[8].price * 3) + products[9].price,
      shipping: 8,
      total: (products[8].price * 3) + products[9].price + 8,
      shippingAddress: {
        firstName: "David",
        lastName: "Wilson",
        address: "654 Maple Drive",
        city: "Seattle",
        state: "WA",
        zipCode: "98101",
        country: "United States",
      },
      paymentMethod: "bank_transfer",
      status: "delivered",
      paymentStatus: "paid",
    }
  ]
  await Order.insertMany(ordersData)

  // Heritage-focused Messages
  const messagesData = [
    {
      firstName: "Emma",
      lastName: "Williams",
      email: "emma.williams@email.com",
      phone: "+1-555-0123",
      subject: "Inquiry about Traditional Ikat Silk Scarf",
      message: "Hello, I'm fascinated by your ikat silk scarves and the cultural heritage behind them. Could you tell me more about the weaving process and the artisans who create them? I'm particularly interested in the Sunset Bloom pattern. Is it possible to meet the artisan who made it?",
      priority: "normal",
      read: false,
    },
    {
      firstName: "James",
      lastName: "Chen",
      email: "james.chen@email.com",
      phone: "+1-555-0124",
      subject: "Custom ceramic tea set commission",
      message: "I was deeply moved by your ceramic tea set collection and would like to commission a custom piece for my tea ceremony practice. I'm looking for something that embodies the principles of wabi-sabi and connects me to traditional tea culture. Could we discuss design possibilities and timeline?",
      priority: "high",
      read: true,
    },
    {
      firstName: "Sofia",
      lastName: "Martinez",
      email: "sofia.martinez@email.com",
      phone: "+1-555-0125",
      subject: "Wooden jewelry box for wedding gift",
      message: "I'm searching for a meaningful wedding gift that represents lasting love and cultural heritage. Your handcrafted wooden jewelry boxes caught my attention. Could you tell me about the traditional joinery techniques used and whether custom engraving is possible?",
      priority: "normal",
      read: false,
    },
    {
      firstName: "Alexander",
      lastName: "Thompson",
      email: "alexander.thompson@email.com",
      phone: "+1-555-0126",
      subject: "Shipping to international destinations",
      message: "I live in London and am interested in purchasing several pieces from your heritage collection, including the silver pendant necklace and copper bracelet set. Do you ship internationally? I want to ensure these precious handcrafted items arrive safely.",
      priority: "normal",
      read: true,
    },
    {
      firstName: "Maria",
      lastName: "Rodriguez",
      email: "maria.rodriguez@email.com",
      phone: "+1-555-0127",
      subject: "Thank you for preserving traditions",
      message: "I recently purchased the traditional woven wall hanging and wanted to express my gratitude. As someone who grew up with my grandmother's handwoven textiles, your piece brought back beautiful memories. The craftsmanship is extraordinary and I can feel the love and tradition woven into every thread. Thank you for keeping these precious skills alive.",
      priority: "low",
      read: false,
    },
    {
      firstName: "David",
      lastName: "Kim",
      email: "david.kim@email.com",
      phone: "+1-555-0128",
      subject: "Collaboration opportunity - Cultural center",
      message: "I'm the director of the Metropolitan Cultural Heritage Center and we're organizing an exhibition on traditional craftsmanship. We would love to feature some of your artisans' work and perhaps arrange workshops where they could demonstrate their techniques. Would you be interested in collaborating to help preserve and share these beautiful traditions?",
      priority: "high",
      read: false,
    }
  ]
  await Message.insertMany(messagesData)

  // Create sample wishlist items
  const allUsers = await User.find({}, '_id').lean()
  const allProducts = await Product.find({}, '_id').lean()
  
  if (allUsers.length > 0 && allProducts.length > 0) {
    const wishlistData = []
    
    // Add some random wishlist items for each user
    for (const user of allUsers.slice(0, 3)) { // Only for first 3 users
      const randomProducts = allProducts
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.floor(Math.random() * 5) + 2) // 2-6 items per user
      
      for (const product of randomProducts) {
        wishlistData.push({
          userId: (user._id as mongoose.Types.ObjectId).toString(),
          productId: product._id as mongoose.Types.ObjectId,
          addedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) // Random date within last 30 days
        })
      }
    }
    
    if (wishlistData.length > 0) {
      await Wishlist.insertMany(wishlistData)
    }
  }

  // User Notifications
  const notificationsData = []
  
  // Create notifications for each customer user
  for (const user of customerUsers) {
    // Order notifications
    notificationsData.push({
      userId: user._id,
      type: "order",
      title: "Order Delivered Successfully",
      message: "Your order has been delivered. Thank you for shopping with us!",
      data: { orderId: "sample-order-id" },
      read: Math.random() > 0.5,
      createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Random within last week
    })

    notificationsData.push({
      userId: user._id,
      type: "order",
      title: "Order Shipped",
      message: "Great news! Your order is on its way and will arrive soon.",
      data: { orderId: "sample-order-id-2" },
      read: Math.random() > 0.7,
      createdAt: new Date(Date.now() - Math.random() * 3 * 24 * 60 * 60 * 1000), // Random within last 3 days
    })

    // Product notifications
    notificationsData.push({
      userId: user._id,
      type: "product",
      title: "New Heritage Collection Available",
      message: "Discover our latest handcrafted items celebrating traditional artistry.",
      data: { productSlug: "traditional-ikat-silk-scarf" },
      read: false,
      createdAt: new Date(Date.now() - Math.random() * 2 * 24 * 60 * 60 * 1000), // Random within last 2 days
    })

    // Wishlist notifications
    notificationsData.push({
      userId: user._id,
      type: "wishlist",
      title: "Wishlist Item Back in Stock",
      message: "Good news! An item from your wishlist is now available.",
      data: {},
      read: Math.random() > 0.6,
      createdAt: new Date(Date.now() - Math.random() * 5 * 24 * 60 * 60 * 1000), // Random within last 5 days
    })

    // Promotion notifications
    notificationsData.push({
      userId: user._id,
      type: "promotion",
      title: "Special Heritage Sale - 20% Off",
      message: "Limited time offer on our premium handcrafted collection.",
      data: { link: "/products?sale=true" },
      read: Math.random() > 0.4,
      createdAt: new Date(Date.now() - Math.random() * 1 * 24 * 60 * 60 * 1000), // Random within last day
    })

    // System notifications
    notificationsData.push({
      userId: user._id,
      type: "system",
      title: "Profile Updated Successfully",
      message: "Your profile information has been updated successfully.",
      data: {},
      read: true,
      createdAt: new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000), // Random within last 10 days
    })
  }

  await UserNotification.insertMany(notificationsData)

  const counts = await Promise.all([
    User.countDocuments({}),
    Category.countDocuments({}),
    Product.countDocuments({}),
    BlogPost.countDocuments({}),
    Order.countDocuments({}),
    Message.countDocuments({}),
    Wishlist.countDocuments({}),
    UserNotification.countDocuments({}),
  ])

  console.log(
    JSON.stringify(
      { 
        users: counts[0], 
        categories: counts[1], 
        products: counts[2], 
        blogs: counts[3],
        orders: counts[4],
        messages: counts[5],
        wishlist: counts[6],
        notifications: counts[7]
      },
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


