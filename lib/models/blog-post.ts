import mongoose from "mongoose"

export interface IBlogPost extends mongoose.Document {
  title: string
  slug: string
  content: string
  excerpt: string
  author: mongoose.Types.ObjectId
  coverImage: string
  tags: string[]
  published: boolean
  publishedAt: Date
  views: number
  likes: number
  bookmarks: number
  likedBy: mongoose.Types.ObjectId[]
  bookmarkedBy: mongoose.Types.ObjectId[]
  createdAt: Date
  updatedAt: Date
}

const blogPostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a blog post title"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    slug: {
      type: String,
      required: [true, "Please provide a slug"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    content: {
      type: String,
      required: [true, "Please provide blog post content"],
    },
    excerpt: {
      type: String,
      required: [true, "Please provide a blog post excerpt"],
      maxlength: [500, "Excerpt cannot exceed 500 characters"],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide an author"],
    },
    coverImage: {
      type: String,
      required: [true, "Please provide a cover image"],
    },
    tags: {
      type: [String],
      default: [],
    },
    published: {
      type: Boolean,
      default: false,
    },
    publishedAt: {
      type: Date,
      default: null,
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
    bookmarks: {
      type: Number,
      default: 0,
    },
    likedBy: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }],
    bookmarkedBy: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }],
  },
  { timestamps: true },
)

export default mongoose.models.BlogPost || mongoose.model<IBlogPost>("BlogPost", blogPostSchema)
