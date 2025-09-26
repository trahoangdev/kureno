import { connectToDatabase } from "../lib/db"
import AdminNotification from "../lib/models/admin-notification"

const notificationsData = [
  {
    title: "New Order Received",
    message: "Order #12345 has been placed by customer John Doe",
    type: "success",
    category: "orders",
    priority: "medium",
    actionUrl: "/admin/orders/12345",
  },
  {
    title: "Low Stock Alert",
    message: "Product 'Handwoven Cotton Scarf' is running low on stock (5 items remaining)",
    type: "warning",
    category: "products",
    priority: "high",
    actionUrl: "/admin/products",
  },
  {
    title: "New User Registration",
    message: "5 new users have registered in the last 24 hours",
    type: "info",
    category: "users",
    priority: "low",
    actionUrl: "/admin/customers",
  },
  {
    title: "System Backup Completed",
    message: "Daily system backup has been completed successfully",
    type: "success",
    category: "system",
    priority: "low",
  },
  {
    title: "New Blog Comment",
    message: "New comment posted on 'Preserving Traditional Crafts'",
    type: "info",
    category: "comments",
    priority: "medium",
    actionUrl: "/admin/comments",
  },
  {
    title: "Payment Processing Error",
    message: "Payment gateway returned an error for order #12344",
    type: "error",
    category: "orders",
    priority: "urgent",
    actionUrl: "/admin/orders/12344",
  },
  {
    title: "New Customer Message",
    message: "Customer inquiry about wholesale pricing received",
    type: "info",
    category: "messages",
    priority: "medium",
    actionUrl: "/admin/messages",
  },
  {
    title: "Product Review Pending",
    message: "New product reviews are awaiting moderation",
    type: "warning",
    category: "reviews",
    priority: "medium",
    actionUrl: "/admin/reviews",
  },
  {
    title: "Server Maintenance Scheduled",
    message: "Scheduled maintenance will occur tonight at 2:00 AM",
    type: "info",
    category: "system",
    priority: "high",
  },
  {
    title: "Sales Target Achieved",
    message: "Monthly sales target has been achieved with 5 days remaining",
    type: "success",
    category: "system",
    priority: "low",
  },
]

async function seedNotifications() {
  try {
    await connectToDatabase()
    console.log("Connected to database")

    // Clear existing notifications
    await AdminNotification.deleteMany({})
    console.log("Cleared existing notifications")

    // Create new notifications
    const notifications = await AdminNotification.insertMany(notificationsData)
    console.log(`Created ${notifications.length} notifications`)

    console.log("Notification seeding completed successfully!")
  } catch (error) {
    console.error("Error seeding notifications:", error)
    process.exit(1)
  }
}

seedNotifications()
