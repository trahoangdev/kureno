import mongoose from "mongoose"
import bcrypt from "bcryptjs"

export interface IAddress {
  street: string
  city: string
  state: string
  zipCode: string
  country: string
}

export interface IPermissions {
  canManageProducts: boolean
  canManageOrders: boolean
  canManageUsers: boolean
  canManageContent: boolean
  canViewAnalytics: boolean
  canManageSettings: boolean
}

export interface IUser extends mongoose.Document {
  name: string
  email: string
  password: string
  role: "admin" | "manager" | "user"
  permissions: IPermissions
  phone?: string
  bio?: string
  address?: IAddress
  preferences: {
    emailNotifications: boolean
    marketingEmails: boolean
  }
  lastLogin?: Date
  isActive: boolean
  resetPasswordToken?: string
  resetPasswordExpires?: Date
  createdAt: Date
  updatedAt: Date
  comparePassword(candidatePassword: string): Promise<boolean>
}

const addressSchema = new mongoose.Schema(
  {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
  },
  { _id: false },
)

const permissionsSchema = new mongoose.Schema(
  {
    canManageProducts: { type: Boolean, default: false },
    canManageOrders: { type: Boolean, default: false },
    canManageUsers: { type: Boolean, default: false },
    canManageContent: { type: Boolean, default: false },
    canViewAnalytics: { type: Boolean, default: false },
    canManageSettings: { type: Boolean, default: false },
  },
  { _id: false },
)

const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    role: {
      type: String,
      enum: ["admin", "manager", "user"],
      default: "user",
    },
    permissions: {
      type: permissionsSchema,
      default: () => ({
        canManageProducts: false,
        canManageOrders: false,
        canManageUsers: false,
        canManageContent: false,
        canViewAnalytics: false,
        canManageSettings: false,
      }),
    },
    phone: {
      type: String,
      trim: true,
    },
    bio: {
      type: String,
      trim: true,
    },
    address: addressSchema,
    preferences: {
      emailNotifications: {
        type: Boolean,
        default: true,
      },
      marketingEmails: {
        type: Boolean,
        default: false,
      },
    },
    lastLogin: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    resetPasswordToken: {
      type: String,
      select: false,
    },
    resetPasswordExpires: {
      type: Date,
      select: false,
    },
  },
  { timestamps: true },
)

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()

  try {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error: any) {
    next(error)
  }
})

// Set permissions based on role
userSchema.pre("save", function (next) {
  if (this.isModified("role")) {
    if (this.role === "admin") {
      this.permissions = {
        canManageProducts: true,
        canManageOrders: true,
        canManageUsers: true,
        canManageContent: true,
        canViewAnalytics: true,
        canManageSettings: true,
      }
    } else if (this.role === "manager") {
      this.permissions = {
        canManageProducts: true,
        canManageOrders: true,
        canManageUsers: false,
        canManageContent: true,
        canViewAnalytics: true,
        canManageSettings: false,
      }
    } else {
      this.permissions = {
        canManageProducts: false,
        canManageOrders: false,
        canManageUsers: false,
        canManageContent: false,
        canViewAnalytics: false,
        canManageSettings: false,
      }
    }
  }
  next()
})

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password)
}

export default mongoose.models.User || mongoose.model<IUser>("User", userSchema)
