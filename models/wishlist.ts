import mongoose from "mongoose"

export interface IWishlist extends mongoose.Document {
  userId: string
  productId: mongoose.Types.ObjectId
  addedAt: Date
}

const WishlistSchema = new mongoose.Schema<IWishlist>({
  userId: {
    type: String,
    required: true,
    index: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
})

// Create compound index to prevent duplicate entries
WishlistSchema.index({ userId: 1, productId: 1 }, { unique: true })

// Index for faster queries
WishlistSchema.index({ userId: 1, addedAt: -1 })

const Wishlist = mongoose.models.Wishlist || mongoose.model<IWishlist>("Wishlist", WishlistSchema)

export default Wishlist
