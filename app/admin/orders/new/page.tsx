"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "../../../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Input } from "../../../../components/ui/input"
import { Label } from "../../../../components/ui/label"
import { Textarea } from "../../../../components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select"
import { Badge } from "../../../../components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../components/ui/tabs"
import { Separator } from "../../../../components/ui/separator"
import { useToast } from "../../../../components/ui/use-toast"
import { 
  ArrowLeft,
  Plus,
  Minus,
  Trash2,
  Search,
  User,
  Mail,
  Phone,
  MapPin,
  Package,
  ShoppingCart,
  CreditCard,
  Truck,
  Calendar,
  Clock,
  Save,
  X,
  Check,
  AlertTriangle,
  Info,
  Eye,
  Edit,
  Copy,
  Download,
  Upload,
  RefreshCw,
  Filter,
  Settings,
  MoreHorizontal,
  ExternalLink,
  Star,
  Heart,
  Share,
  Bookmark,
  Tag,
  DollarSign,
  Percent,
  Hash,
  FileText,
  Image,
  Link as LinkIcon,
  Globe,
  Lock,
  Unlock,
  Shield,
  Zap,
  Target,
  Award,
  TrendingUp,
  BarChart3,
  PieChart,
  Activity,
  Bell,
  MessageSquare,
  Mail as MailIcon,
  Phone as PhoneIcon,
  MapPin as MapPinIcon,
  Home,
  Building,
  Car,
  Plane,
  Ship,
  Train,
  Bike,
  Walk,
  Navigation,
  Compass,
  Flag,
  Map,
  Layers,
  Grid,
  List,
  Layout,
  Maximize,
  Minimize,
  RotateCcw,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Move,
  MousePointer,
  Hand,
  Type,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  ListOrdered,
  Quote,
  Code,
  Terminal,
  FileCode,
  GitBranch,
  GitCommit,
  GitMerge,
  GitPullRequest,
  GitCompare,
  GitFork,
  Github,
  Gitlab,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Sun,
  Moon,
  Sunrise,
  Sunset,
  Thermometer,
  Droplets,
  Wind,
  Waves,
  Mountain,
  Trees,
  Leaf,
  Flower,
  Bug,
  Fish,
  Bird,
  Cat,
  Dog,
  Rabbit,
  Turtle
} from "lucide-react"

interface OrderItem {
  id: string
  productId: string
  name: string
  price: number
  quantity: number
  image?: string
  sku?: string
}

interface Customer {
  id: string
  name: string
  email: string
  phone?: string
  address?: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
}

export default function NewOrderPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("customer")
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  // Form state
  const [orderData, setOrderData] = useState({
    customerId: "",
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    shippingAddress: {
      firstName: "",
      lastName: "",
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "Vietnam"
    },
    billingAddress: {
      firstName: "",
      lastName: "",
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "Vietnam"
    },
    items: [] as OrderItem[],
    subtotal: 0,
    shipping: 0,
    tax: 0,
    discount: 0,
    total: 0,
    paymentMethod: "credit_card",
    paymentStatus: "pending",
    status: "pending",
    notes: "",
    priority: "normal"
  })

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [showCustomerSearch, setShowCustomerSearch] = useState(false)

  // Mock customers data
  const customers = [
    { id: "1", name: "Nguyễn Văn An", email: "an.nguyen@email.com", phone: "0123456789" },
    { id: "2", name: "Trần Thị Bình", email: "binh.tran@email.com", phone: "0987654321" },
    { id: "3", name: "Lê Văn Cường", email: "cuong.le@email.com", phone: "0369852147" },
    { id: "4", name: "Phạm Thị Dung", email: "dung.pham@email.com", phone: "0741258963" },
    { id: "5", name: "Hoàng Văn Em", email: "em.hoang@email.com", phone: "0852147963" }
  ]

  // Mock products data
  const products = [
    { id: "1", name: "Artisan Ceramic Bowl Set", price: 89.99, sku: "ACB-001", image: "/placeholder.png" },
    { id: "2", name: "Handwoven Textile Collection", price: 129.99, sku: "HTC-002", image: "/placeholder.png" },
    { id: "3", name: "Wooden Kitchen Utensils", price: 45.99, sku: "WKU-003", image: "/placeholder.png" },
    { id: "4", name: "Handmade Jewelry Set", price: 199.99, sku: "HJS-004", image: "/placeholder.png" },
    { id: "5", name: "Leather Crafted Wallet", price: 79.99, sku: "LCW-005", image: "/placeholder.png" }
  ]

  // Calculate totals
  useEffect(() => {
    const subtotal = orderData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    const tax = subtotal * 0.1 // 10% tax
    const total = subtotal + orderData.shipping + tax - orderData.discount
    
    setOrderData(prev => ({
      ...prev,
      subtotal,
      tax,
      total
    }))
  }, [orderData.items, orderData.shipping, orderData.discount])

  const handleInputChange = (field: string, value: any) => {
    setOrderData(prev => ({ ...prev, [field]: value }))
    setHasUnsavedChanges(true)
  }

  const handleAddressChange = (type: 'shipping' | 'billing', field: string, value: string) => {
    setOrderData(prev => ({
      ...prev,
      [`${type}Address`]: {
        ...prev[`${type}Address`],
        [field]: value
      }
    }))
    setHasUnsavedChanges(true)
  }

  const handleSelectCustomer = (customer: Customer) => {
    setSelectedCustomer(customer)
    setOrderData(prev => ({
      ...prev,
      customerId: customer.id,
      customerName: customer.name,
      customerEmail: customer.email,
      customerPhone: customer.phone || "",
      shippingAddress: {
        ...prev.shippingAddress,
        firstName: customer.name.split(' ')[0] || "",
        lastName: customer.name.split(' ').slice(1).join(' ') || ""
      }
    }))
    setShowCustomerSearch(false)
    setSearchQuery("")
    setHasUnsavedChanges(true)
  }

  const handleAddItem = () => {
    const newItem: OrderItem = {
      id: Date.now().toString(),
      productId: "",
      name: "",
      price: 0,
      quantity: 1,
      sku: ""
    }
    setOrderData(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }))
    setHasUnsavedChanges(true)
  }

  const handleUpdateItem = (index: number, field: string, value: any) => {
    setOrderData(prev => ({
      ...prev,
      items: prev.items.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }))
    setHasUnsavedChanges(true)
  }

  const handleRemoveItem = (index: number) => {
    setOrderData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }))
    setHasUnsavedChanges(true)
  }

  const handleSaveOrder = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      toast({
        title: "Order Created",
        description: "The new order has been created successfully.",
      })
      
      setHasUnsavedChanges(false)
      router.push("/admin/orders")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create order. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-8">
      {/* Enhanced Header Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/20 dark:via-indigo-950/20 dark:to-purple-950/20 p-8">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.1),transparent_50%),radial-gradient(ellipse_at_bottom_left,rgba(147,51,234,0.1),transparent_50%)] -z-10" />
        
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Badge className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-3 py-1 text-sm font-medium">
                <Plus className="h-3 w-3 mr-1" />
                New Order
              </Badge>
              <Badge variant="outline" className="text-xs">
                <ShoppingCart className="h-3 w-3 mr-1" />
                Order Management
              </Badge>
            </div>
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Create New Order
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Create a new order for a customer with complete order details, shipping information, and payment processing.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" asChild className="rounded-full">
              <Link href="/admin/orders" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Orders
              </Link>
            </Button>
            <Button 
              onClick={handleSaveOrder}
              disabled={isLoading || !hasUnsavedChanges}
              className="rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
            >
              {isLoading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              {isLoading ? "Creating..." : "Create Order"}
            </Button>
          </div>
        </div>
      </div>

      {/* Unsaved Changes Alert */}
      {hasUnsavedChanges && (
        <div className="rounded-lg bg-orange-50 p-4 text-orange-800 shadow-md dark:bg-orange-950/20 dark:text-orange-200">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            <div>
              <h4 className="font-semibold">Unsaved Changes</h4>
              <p className="text-sm">You have unsaved changes. Don't forget to save your order.</p>
            </div>
          </div>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList className="grid w-full max-w-2xl grid-cols-4">
            <TabsTrigger value="customer" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Customer
            </TabsTrigger>
            <TabsTrigger value="items" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Items
            </TabsTrigger>
            <TabsTrigger value="shipping" className="flex items-center gap-2">
              <Truck className="h-4 w-4" />
              Shipping
            </TabsTrigger>
            <TabsTrigger value="payment" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Payment
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Customer Tab */}
        <TabsContent value="customer" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-600" />
                  Customer Information
                </CardTitle>
                <CardDescription>Select or enter customer details for this order</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Customer Search */}
                <div className="space-y-2">
                  <Label>Search Customer</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by name or email..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => setShowCustomerSearch(true)}
                      className="pl-10"
                    />
                  </div>
                  
                  {/* Customer Search Results */}
                  {showCustomerSearch && searchQuery && (
                    <div className="absolute z-10 w-full mt-1 bg-white dark:bg-slate-800 border border-border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {filteredCustomers.map((customer) => (
                        <div
                          key={customer.id}
                          onClick={() => handleSelectCustomer(customer)}
                          className="p-3 hover:bg-muted cursor-pointer border-b border-border last:border-b-0"
                        >
                          <div className="font-medium">{customer.name}</div>
                          <div className="text-sm text-muted-foreground">{customer.email}</div>
                          {customer.phone && (
                            <div className="text-sm text-muted-foreground">{customer.phone}</div>
                          )}
                        </div>
                      ))}
                      {filteredCustomers.length === 0 && (
                        <div className="p-3 text-muted-foreground text-center">
                          No customers found
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Selected Customer */}
                {selectedCustomer && (
                  <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-green-900 dark:text-green-100">
                          {selectedCustomer.name}
                        </h4>
                        <p className="text-sm text-green-700 dark:text-green-300">
                          {selectedCustomer.email}
                        </p>
                        {selectedCustomer.phone && (
                          <p className="text-sm text-green-700 dark:text-green-300">
                            {selectedCustomer.phone}
                          </p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedCustomer(null)
                          setOrderData(prev => ({
                            ...prev,
                            customerId: "",
                            customerName: "",
                            customerEmail: "",
                            customerPhone: ""
                          }))
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Manual Customer Entry */}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="customerName">Customer Name</Label>
                      <Input
                        id="customerName"
                        value={orderData.customerName}
                        onChange={(e) => handleInputChange("customerName", e.target.value)}
                        placeholder="Enter customer name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="customerEmail">Email</Label>
                      <Input
                        id="customerEmail"
                        type="email"
                        value={orderData.customerEmail}
                        onChange={(e) => handleInputChange("customerEmail", e.target.value)}
                        placeholder="customer@example.com"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customerPhone">Phone</Label>
                    <Input
                      id="customerPhone"
                      value={orderData.customerPhone}
                      onChange={(e) => handleInputChange("customerPhone", e.target.value)}
                      placeholder="Phone number"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Summary Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-green-600" />
                  Order Summary
                </CardTitle>
                <CardDescription>Preview of the order being created</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Customer:</span>
                    <span className="font-medium">{orderData.customerName || "Not selected"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Items:</span>
                    <span className="font-medium">{orderData.items.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal:</span>
                    <span className="font-medium">${orderData.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping:</span>
                    <span className="font-medium">${orderData.shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax:</span>
                    <span className="font-medium">${orderData.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Discount:</span>
                    <span className="font-medium text-green-600">-${orderData.discount.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span>${orderData.total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Items Tab */}
        <TabsContent value="items" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-purple-600" />
                    Order Items
                  </CardTitle>
                  <CardDescription>Add products to this order</CardDescription>
                </div>
                <Button onClick={handleAddItem} className="rounded-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {orderData.items.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No items added yet</p>
                  <p className="text-sm">Click "Add Item" to start building this order</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orderData.items.map((item, index) => (
                    <div key={item.id} className="p-4 border border-border rounded-lg">
                      <div className="grid gap-4 md:grid-cols-6">
                        <div className="md:col-span-2 space-y-2">
                          <Label>Product Name</Label>
                          <Input
                            value={item.name}
                            onChange={(e) => handleUpdateItem(index, "name", e.target.value)}
                            placeholder="Enter product name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>SKU</Label>
                          <Input
                            value={item.sku || ""}
                            onChange={(e) => handleUpdateItem(index, "sku", e.target.value)}
                            placeholder="SKU"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Price</Label>
                          <Input
                            type="number"
                            step="0.01"
                            value={item.price}
                            onChange={(e) => handleUpdateItem(index, "price", parseFloat(e.target.value) || 0)}
                            placeholder="0.00"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Quantity</Label>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUpdateItem(index, "quantity", Math.max(1, item.quantity - 1))}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <Input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => handleUpdateItem(index, "quantity", parseInt(e.target.value) || 1)}
                              className="w-16 text-center"
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUpdateItem(index, "quantity", item.quantity + 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex items-end gap-2">
                          <div className="flex-1">
                            <Label>Total</Label>
                            <div className="h-10 flex items-center font-semibold">
                              ${(item.price * item.quantity).toFixed(2)}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveItem(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Shipping Tab */}
        <TabsContent value="shipping" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5 text-orange-600" />
                  Shipping Address
                </CardTitle>
                <CardDescription>Where should we ship this order?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="shippingFirstName">First Name</Label>
                    <Input
                      id="shippingFirstName"
                      value={orderData.shippingAddress.firstName}
                      onChange={(e) => handleAddressChange("shipping", "firstName", e.target.value)}
                      placeholder="First name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="shippingLastName">Last Name</Label>
                    <Input
                      id="shippingLastName"
                      value={orderData.shippingAddress.lastName}
                      onChange={(e) => handleAddressChange("shipping", "lastName", e.target.value)}
                      placeholder="Last name"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shippingStreet">Street Address</Label>
                  <Input
                    id="shippingStreet"
                    value={orderData.shippingAddress.street}
                    onChange={(e) => handleAddressChange("shipping", "street", e.target.value)}
                    placeholder="Street address"
                  />
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="shippingCity">City</Label>
                    <Input
                      id="shippingCity"
                      value={orderData.shippingAddress.city}
                      onChange={(e) => handleAddressChange("shipping", "city", e.target.value)}
                      placeholder="City"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="shippingState">State</Label>
                    <Input
                      id="shippingState"
                      value={orderData.shippingAddress.state}
                      onChange={(e) => handleAddressChange("shipping", "state", e.target.value)}
                      placeholder="State"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="shippingZipCode">ZIP Code</Label>
                    <Input
                      id="shippingZipCode"
                      value={orderData.shippingAddress.zipCode}
                      onChange={(e) => handleAddressChange("shipping", "zipCode", e.target.value)}
                      placeholder="ZIP code"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shippingCountry">Country</Label>
                  <Select
                    value={orderData.shippingAddress.country}
                    onValueChange={(value) => handleAddressChange("shipping", "country", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Vietnam">Vietnam</SelectItem>
                      <SelectItem value="United States">United States</SelectItem>
                      <SelectItem value="Canada">Canada</SelectItem>
                      <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                      <SelectItem value="Germany">Germany</SelectItem>
                      <SelectItem value="France">France</SelectItem>
                      <SelectItem value="Japan">Japan</SelectItem>
                      <SelectItem value="South Korea">South Korea</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-gray-600" />
                  Shipping Options
                </CardTitle>
                <CardDescription>Configure shipping method and costs</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="shippingCost">Shipping Cost</Label>
                  <Input
                    id="shippingCost"
                    type="number"
                    step="0.01"
                    value={orderData.shipping}
                    onChange={(e) => handleInputChange("shipping", parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="discount">Discount</Label>
                  <Input
                    id="discount"
                    type="number"
                    step="0.01"
                    value={orderData.discount}
                    onChange={(e) => handleInputChange("discount", parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Order Priority</Label>
                  <Select
                    value={orderData.priority}
                    onValueChange={(value) => handleInputChange("priority", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Order Notes</Label>
                  <Textarea
                    id="notes"
                    value={orderData.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                    placeholder="Special instructions or notes for this order..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Payment Tab */}
        <TabsContent value="payment" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-green-600" />
                  Payment Information
                </CardTitle>
                <CardDescription>Configure payment method and status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="paymentMethod">Payment Method</Label>
                  <Select
                    value={orderData.paymentMethod}
                    onValueChange={(value) => handleInputChange("paymentMethod", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="credit_card">Credit Card</SelectItem>
                      <SelectItem value="debit_card">Debit Card</SelectItem>
                      <SelectItem value="paypal">PayPal</SelectItem>
                      <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                      <SelectItem value="cash_on_delivery">Cash on Delivery</SelectItem>
                      <SelectItem value="cryptocurrency">Cryptocurrency</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="paymentStatus">Payment Status</Label>
                  <Select
                    value={orderData.paymentStatus}
                    onValueChange={(value) => handleInputChange("paymentStatus", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                      <SelectItem value="refunded">Refunded</SelectItem>
                      <SelectItem value="partially_refunded">Partially Refunded</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="orderStatus">Order Status</Label>
                  <Select
                    value={orderData.status}
                    onValueChange={(value) => handleInputChange("status", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-yellow-600" />
                  Order Total
                </CardTitle>
                <CardDescription>Final order summary and pricing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal ({orderData.items.length} items):</span>
                    <span className="font-medium">${orderData.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping:</span>
                    <span className="font-medium">${orderData.shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax (10%):</span>
                    <span className="font-medium">${orderData.tax.toFixed(2)}</span>
                  </div>
                  {orderData.discount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Discount:</span>
                      <span className="font-medium text-green-600">-${orderData.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total:</span>
                    <span>${orderData.total.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button 
                    onClick={handleSaveOrder}
                    disabled={isLoading || !hasUnsavedChanges}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                  >
                    {isLoading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    {isLoading ? "Creating Order..." : "Create Order"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
