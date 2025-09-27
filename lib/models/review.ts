import mongoose, { Schema, Document } from "mongoose"

export interface IReview extends Document {
  productId: string
  userId: string
  userName: string
  userEmail: string
  rating: number
  title: string
  comment: string
  verified: boolean
  helpful: number
  helpfulUsers: string[]
  createdAt: Date
  updatedAt: Date
}

const reviewSchema = new Schema<IReview>({
  productId: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  userEmail: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  title: {
    type: String,
    required: true,
    maxlength: 200
  },
  comment: {
    type: String,
    required: true,
    maxlength: 1000
  },
  verified: {
    type: Boolean,
    default: false
  },
  helpful: {
    type: Number,
    default: 0
  },
  helpfulUsers: [{
    type: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
})

// Update the updatedAt field before saving
reviewSchema.pre('save', function(next) {
  this.updatedAt = new Date()
  next()
})

// Create indexes for better performance
reviewSchema.index({ productId: 1, createdAt: -1 })
reviewSchema.index({ userId: 1, productId: 1 }, { unique: true })

export default mongoose.models.Review || mongoose.model<IReview>("Review", reviewSchema)
