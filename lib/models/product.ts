import mongoose from "mongoose"

export interface IVariant {
  id: string
  name: string
  type: string
  options: IVariantOption[]
}

export interface IVariantOption {
  id: string
  name: string
  value: string
  priceModifier: number
  stock: number
  sku: string
  available: boolean
  image?: string
}

export interface IProductDimensions {
  length: number
  width: number
  height: number
}

export interface IProductSEO {
  title: string
  description: string
  keywords: string
}

export interface IProductInventory {
  trackQuantity: boolean
  allowBackorder: boolean
  lowStockThreshold: number
}

export interface IProduct extends mongoose.Document {
  name: string
  description: string
  price: number
  images: string[]
  category: string
  stock: number
  featured: boolean
  // Advanced fields
  sku: string
  weight: number
  dimensions: IProductDimensions
  seo: IProductSEO
  variants: IVariant[]
  tags: string[]
  status: "draft" | "published" | "archived"
  visibility: "public" | "private" | "hidden"
  inventory: IProductInventory
  createdAt: Date
  updatedAt: Date
}

const variantOptionSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  value: { type: String, required: true },
  priceModifier: { type: Number, default: 0 },
  stock: { type: Number, default: 0, min: 0 },
  sku: { type: String, required: true },
  available: { type: Boolean, default: true },
  image: { type: String }
}, { _id: false })

const variantSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  type: { type: String, required: true },
  options: [variantOptionSchema]
}, { _id: false })

const dimensionsSchema = new mongoose.Schema({
  length: { type: Number, default: 0, min: 0 },
  width: { type: Number, default: 0, min: 0 },
  height: { type: Number, default: 0, min: 0 }
}, { _id: false })

const seoSchema = new mongoose.Schema({
  title: { type: String, maxlength: [60, "SEO title cannot exceed 60 characters"] },
  description: { type: String, maxlength: [160, "SEO description cannot exceed 160 characters"] },
  keywords: { type: String }
}, { _id: false })

const inventorySchema = new mongoose.Schema({
  trackQuantity: { type: Boolean, default: true },
  allowBackorder: { type: Boolean, default: false },
  lowStockThreshold: { type: Number, default: 5, min: 0 }
}, { _id: false })

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a product name"],
      trim: true,
      maxlength: [100, "Product name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Please provide a product description"],
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    price: {
      type: Number,
      required: [true, "Please provide a product price"],
      min: [0, "Price must be positive"],
    },
    images: {
      type: [String],
      required: [true, "Please provide at least one product image"],
    },
    category: {
      type: String,
      required: [true, "Please provide a product category"],
      trim: true,
    },
    stock: {
      type: Number,
      required: [true, "Please provide product stock"],
      min: [0, "Stock cannot be negative"],
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    // Advanced fields
    sku: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    weight: {
      type: Number,
      min: [0, "Weight must be positive"],
      default: 0,
    },
    dimensions: dimensionsSchema,
    seo: seoSchema,
    variants: [variantSchema],
    tags: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    visibility: {
      type: String,
      enum: ["public", "private", "hidden"],
      default: "public",
    },
    inventory: inventorySchema,
  },
  { timestamps: true },
)

export default mongoose.models.Product || mongoose.model<IProduct>("Product", productSchema)
