import mongoose from "mongoose"

export interface IProduct extends mongoose.Document {
  name: string
  description: string
  price: number
  images: string[]
  category: string
  stock: number
  featured: boolean
  createdAt: Date
  updatedAt: Date
}

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
  },
  { timestamps: true },
)

export default mongoose.models.Product || mongoose.model<IProduct>("Product", productSchema)
