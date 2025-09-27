import mongoose from "mongoose"

export interface ICategory {
  name: string
  slug: string
  description?: string
  createdAt: Date
  updatedAt: Date
}

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    slug: { type: String, required: true, trim: true, lowercase: true, unique: true },
    description: { type: String, trim: true },
  },
  { timestamps: true },
)


export default mongoose.models.Category || mongoose.model("Category", categorySchema)


