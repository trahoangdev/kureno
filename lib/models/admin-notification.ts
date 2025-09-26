import mongoose from "mongoose"

export interface IAdminNotification extends mongoose.Document {
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  category: "system" | "orders" | "users" | "products" | "reviews" | "comments" | "messages"
  priority: "low" | "medium" | "high" | "urgent"
  isRead: boolean
  userId?: mongoose.Types.ObjectId // Admin user who should see this
  relatedEntity?: {
    type: "Order" | "User" | "Product" | "Review" | "Comment" | "Message"
    id: mongoose.Types.ObjectId
  }
  actionUrl?: string
  expiresAt?: Date
  createdAt: Date
  updatedAt: Date
  readAt?: Date
}

const adminNotificationSchema = new mongoose.Schema<IAdminNotification>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
      maxlength: [500, "Message cannot exceed 500 characters"],
    },
    type: {
      type: String,
      enum: ["info", "success", "warning", "error"],
      default: "info",
    },
    category: {
      type: String,
      enum: ["system", "orders", "users", "products", "reviews", "comments", "messages"],
      required: [true, "Category is required"],
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      // If null, notification is for all admins
    },
    relatedEntity: {
      type: {
        type: String,
        enum: ["Order", "User", "Product", "Review", "Comment", "Message"],
      },
      id: {
        type: mongoose.Schema.Types.ObjectId,
      },
    },
    actionUrl: {
      type: String,
      trim: true,
    },
    expiresAt: {
      type: Date,
    },
    readAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

// Index for efficient queries
adminNotificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 })
adminNotificationSchema.index({ category: 1, createdAt: -1 })
adminNotificationSchema.index({ priority: 1, isRead: 1 })
adminNotificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

// Virtual for checking if notification is expired
adminNotificationSchema.virtual("isExpired").get(function() {
  return this.expiresAt && this.expiresAt < new Date()
})

// Mark as read
adminNotificationSchema.methods.markAsRead = function() {
  this.isRead = true
  this.readAt = new Date()
  return this.save()
}

// Static method to create notification
adminNotificationSchema.statics.createNotification = async function(data: Partial<IAdminNotification>) {
  return this.create(data)
}

// Static method to get unread count for user
adminNotificationSchema.statics.getUnreadCount = async function(userId?: mongoose.Types.ObjectId) {
  const query: any = { 
    isRead: false,
    $or: [
      { expiresAt: null },
      { expiresAt: { $gt: new Date() } }
    ]
  }
  
  if (userId) {
    query.$or = [
      { userId: userId },
      { userId: null } // Global notifications
    ]
  } else {
    query.userId = null // Only global notifications
  }
  
  return this.countDocuments(query)
}

export default mongoose.models.AdminNotification || 
  mongoose.model<IAdminNotification>("AdminNotification", adminNotificationSchema)
