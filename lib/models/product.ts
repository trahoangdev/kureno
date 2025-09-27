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

export interface IProductMethods {
  updateStock(quantity: number): Promise<IProduct>
  updateRating(rating: number, reviewCount: number): Promise<IProduct>
  toggleFeatured(): Promise<IProduct>
  activate(): Promise<IProduct>
  deactivate(): Promise<IProduct>
}

export interface IProductStatics {
  findActive(): any
  findFeatured(limit?: number): any
  findOnSale(limit?: number): any
  findByCategory(category: string, limit?: number): any
  searchProducts(query: string, options?: any): any
}

export interface IProduct extends IProductMethods {
  name: string
  description: string
  price: number
  originalPrice?: number
  onSale: boolean
  saleStartDate?: Date
  saleEndDate?: Date
  images: string[]
  videos?: string[]
  category: string
  stock: number
  featured: boolean
  // Badge management
  isTrending: boolean
  isBestSeller: boolean
  isNewProduct: boolean
  // Advanced fields
  sku?: string
  weight?: number
  dimensions?: IProductDimensions
  seo?: IProductSEO
  variants?: IVariant[]
  tags?: string[]
  status: "draft" | "published" | "archived"
  visibility: "public" | "private" | "hidden"
  inventory?: IProductInventory
  // Computed fields
  slug?: string
  reviewCount?: number
  averageRating?: number
  // Virtual fields
  isActive: boolean
  discountPercentage: number
  isInStock: boolean
  isLowStock: boolean
  displayPrice: number
  createdAt: Date
  updatedAt: Date
}

export interface IProductModel extends IProductStatics {}

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
  options: { type: [variantOptionSchema], default: [] }
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
      maxlength: [5000, "Description cannot exceed 5000 characters"],
    },
    price: {
      type: Number,
      required: [true, "Please provide a product price"],
      min: [0, "Price must be positive"],
    },
    originalPrice: {
      type: Number,
      min: [0, "Original price must be positive"],
      default: null,
    },
    onSale: {
      type: Boolean,
      default: false,
    },
    saleStartDate: {
      type: Date,
      default: null,
    },
    saleEndDate: {
      type: Date,
      default: null,
    },
    images: {
      type: [String],
      required: [true, "Please provide at least one product image"],
      validate: [
        {
          validator: function(images: string[]) {
            return images && images.length > 0 && images.length <= 10;
          },
          message: "Product must have between 1 and 10 images"
        }
      ]
    },
    videos: {
      type: [String],
      default: [],
      validate: [
        {
          validator: function(videos: string[]) {
            return !videos || videos.length <= 5;
          },
          message: "Product cannot have more than 5 videos"
        }
      ]
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
    // Badge management
    isTrending: {
      type: Boolean,
      default: false,
    },
    isBestSeller: {
      type: Boolean,
      default: false,
    },
    isNewProduct: {
      type: Boolean,
      default: false,
    },
    // Advanced fields
    sku: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      uppercase: true,
    },
    weight: {
      type: Number,
      min: [0, "Weight must be positive"],
      default: 0,
    },
    dimensions: {
      type: dimensionsSchema,
      default: () => ({ length: 0, width: 0, height: 0 }),
    },
    seo: {
      type: seoSchema,
      default: () => ({ title: "", description: "", keywords: "" }),
    },
    variants: {
      type: [variantSchema],
      default: [],
    },
    tags: {
      type: [String],
      default: [],
      validate: [
        {
          validator: function(tags: string[]) {
            return tags.length <= 20;
          },
          message: "Cannot have more than 20 tags"
        }
      ]
    },
    status: {
      type: String,
      enum: {
        values: ["draft", "published", "archived"],
        message: "Status must be draft, published, or archived"
      },
      default: "draft",
    },
    visibility: {
      type: String,
      enum: {
        values: ["public", "private", "hidden"],
        message: "Visibility must be public, private, or hidden"
      },
      default: "public",
    },
    inventory: {
      type: inventorySchema,
      default: () => ({
        trackQuantity: true,
        allowBackorder: false,
        lowStockThreshold: 5
      }),
    },
    // Computed fields
    slug: {
      type: String,
      unique: true,
      sparse: true,
    },
    reviewCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  },
)

// Virtual fields
productSchema.virtual('isActive').get(function(this: any) {
  return this.status === 'published' && this.visibility === 'public'
})

productSchema.virtual('discountPercentage').get(function(this: any) {
  if (this.onSale && this.originalPrice && this.originalPrice > this.price) {
    return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100)
  }
  return 0
})

productSchema.virtual('isInStock').get(function(this: any) {
  return this.stock > 0 || (this.inventory?.allowBackorder ?? false)
})

productSchema.virtual('isLowStock').get(function(this: any) {
  const threshold = this.inventory?.lowStockThreshold ?? 5
  return this.stock <= threshold && this.stock > 0
})

productSchema.virtual('displayPrice').get(function(this: any) {
  return this.onSale && this.originalPrice ? this.price : this.price
})

// Indexes for better performance
productSchema.index({ name: 'text', description: 'text', tags: 'text' })
productSchema.index({ category: 1, featured: -1 })
productSchema.index({ price: 1, onSale: -1 })
productSchema.index({ status: 1, visibility: 1 })
productSchema.index({ createdAt: -1 })

// Pre-save middleware
productSchema.pre('save', function(this: any, next: any) {
  // Generate slug from name if not provided
  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 50)
  }
  
  // Auto-generate SKU if not provided
  if (!this.sku && this.category && this.name) {
    const categoryPrefix = this.category.slice(0, 3).toUpperCase()
    const namePrefix = this.name.replace(/[^a-zA-Z0-9]/g, '').slice(0, 3).toUpperCase()
    const randomSuffix = Math.random().toString(36).substr(2, 4).toUpperCase()
    this.sku = `${categoryPrefix}-${namePrefix}-${randomSuffix}`
  }
  
  // Validate sale pricing
  if (this.onSale) {
    if (!this.originalPrice || this.originalPrice <= this.price) {
      return next(new Error('Original price must be greater than sale price when on sale'))
    }
    
    // Check sale date validity
    if (this.saleStartDate && this.saleEndDate && this.saleStartDate >= this.saleEndDate) {
      return next(new Error('Sale start date must be before sale end date'))
    }
  }
  
  // Ensure SEO title defaults to product name
  if (this.seo && !this.seo.title) {
    this.seo.title = this.name.substring(0, 60)
  }
  
  // Ensure SEO description defaults to product description
  if (this.seo && !this.seo.description) {
    this.seo.description = this.description.substring(0, 160)
  }
  
  next()
})

// Instance methods
productSchema.methods.updateStock = function(quantity: number) {
  this.stock = Math.max(0, this.stock + quantity)
  return this.save()
}

productSchema.methods.updateRating = function(rating: number, reviewCount: number) {
  this.averageRating = rating
  this.reviewCount = reviewCount
  return this.save()
}

productSchema.methods.toggleFeatured = function() {
  this.featured = !this.featured
  return this.save()
}

productSchema.methods.activate = function() {
  this.status = 'published'
  this.visibility = 'public'
  return this.save()
}

productSchema.methods.deactivate = function() {
  this.status = 'archived'
  return this.save()
}

// Static methods
productSchema.statics.findActive = function() {
  return this.find({ status: 'published', visibility: 'public' })
}

productSchema.statics.findFeatured = function(limit = 10) {
  return this.find({ 
    status: 'published', 
    visibility: 'public', 
    featured: true 
  }).limit(limit)
}

productSchema.statics.findOnSale = function(limit = 10) {
  return this.find({ 
    status: 'published', 
    visibility: 'public', 
    onSale: true,
    $or: [
      { saleEndDate: { $exists: false } },
      { saleEndDate: null },
      { saleEndDate: { $gte: new Date() } }
    ]
  }).limit(limit)
}

productSchema.statics.findByCategory = function(category: string, limit = 10) {
  return this.find({ 
    status: 'published', 
    visibility: 'public', 
    category 
  }).limit(limit)
}

productSchema.statics.searchProducts = function(query: string, options: any = {}) {
  const { limit = 10, page = 1, category, minPrice, maxPrice, sortBy = 'createdAt', sortOrder = -1 } = options
  const skip = (page - 1) * limit
  
  const searchQuery: any = {
    status: 'published',
    visibility: 'public',
    $text: { $search: query }
  }
  
  if (category) searchQuery.category = category
  if (minPrice !== undefined) searchQuery.price = { ...searchQuery.price, $gte: minPrice }
  if (maxPrice !== undefined) searchQuery.price = { ...searchQuery.price, $lte: maxPrice }
  
  return this.find(searchQuery)
    .sort({ [sortBy]: sortOrder })
    .skip(skip)
    .limit(limit)
}

export default mongoose.models.Product || mongoose.model("Product", productSchema)
