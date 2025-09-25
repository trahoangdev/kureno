import mongoose from "mongoose"
import "./user" // Ensure User model is loaded

export interface IComment extends mongoose.Document {
  content: string
  author: mongoose.Types.ObjectId
  postId: mongoose.Types.ObjectId
  parentId?: mongoose.Types.ObjectId
  likes: number
  likedBy: mongoose.Types.ObjectId[]
  createdAt: Date
  updatedAt: Date
}

const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, "Comment content is required"],
    trim: true,
    maxlength: [2000, "Comment cannot exceed 2000 characters"],
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Author is required"],
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "Post ID is required"],
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null,
  },
  likes: {
    type: Number,
    default: 0,
  },
  likedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }],
}, {
  timestamps: true,
})

// Index for better query performance
commentSchema.index({ postId: 1, createdAt: -1 })
commentSchema.index({ parentId: 1 })

export default mongoose.models.Comment || mongoose.model<IComment>("Comment", commentSchema)
