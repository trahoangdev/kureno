"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, MoreHorizontal, Eye, Edit, Trash, Download, CheckSquare, XSquare, Truck, Clock } from "lucide-react"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer"
import { formatPrice } from "@/lib/utils"

interface Order {
  _id: string
  user: {
    _id: string
    name: string
    email: string
  }
  items: Array<{
    name: string
    quantity: number
    price: number
  }>
  subtotal: number
  shipping: number
  total: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  paymentStatus: "pending" | "paid" | "failed"
  createdAt: string
  updatedAt?: string
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [total, setTotal] = useState(0)
  const [selected, setSelected] = useState<Record<string, boolean>>({})
  const [openId, setOpenId] = useState<string | null>(null)
  const openOrder = orders.find((o) => o._id === openId) || null

  useEffect(() => {
    fetchOrders()
  }, [page, statusFilter])

  const fetchOrders = async () => {
    try {
      setIsLoading(true)
      const params = new URLSearchParams({ limit: String(limit), page: String(page) })
      if (statusFilter && statusFilter !== "all") params.set("status", statusFilter)
      const response = await fetch(`/api/orders?${params.toString()}`)

      if (!response.ok) {
        throw new Error("Failed to fetch orders")
      }

      const data = await response.json()
      setOrders(data.orders)
      if (data.pagination?.total) setTotal(data.pagination.total)
    } catch (error) {
      console.error("Error fetching orders:", error)
      setError("Failed to load orders. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  const selectedIds = Object.entries(selected)
    .filter(([, v]) => v)
    .map(([k]) => k)

  const toggleSelect = (id: string, value: boolean) => {
    setSelected((prev) => ({ ...prev, [id]: value }))
  }

  const selectAllOnPage = (value: boolean) => {
    const pageIds = orders.map((o) => o._id)
    setSelected((prev) => {
      const copy = { ...prev }
      pageIds.forEach((id) => (copy[id] = value))
      return copy
    })
  }

  const bulkUpdate = async (status: string) => {
    if (selectedIds.length === 0) return
    await fetch("/api/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: selectedIds, status }),
    })
    setOrders((prev) => prev.map((o) => (selected[o._id] ? { ...o, status: status as any } : o)))
    setSelected({})
  }

  const exportCsv = () => {
    const rows = [
      ["OrderID", "Customer", "Email", "Date", "Total", "Status"],
      ...orders.map((o) => [
        o._id,
        o.user?.name || "Guest",
        o.user?.email || "",
        new Date(o.createdAt).toISOString(),
        String(o.total),
        o.status,
      ]),
    ]
    const csv = rows.map((r) => r.map((f) => `"${String(f).replace(/"/g, '""')}"`).join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `orders_page_${page}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleStatusChange = async (orderId: string, status: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      })

      if (!response.ok) {
        throw new Error("Failed to update order status")
      }

      // Update the order in the local state
      setOrders((prevOrders) =>
        prevOrders.map((order) => (order._id === orderId ? { ...order, status: status as any } : order)),
      )
    } catch (error) {
      console.error("Error updating order status:", error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
      case "processing":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
      case "shipped":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
      case "delivered":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
      default:
        return ""
    }
  }

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        searchTerm === "" ||
        order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === "" || statusFilter === "all" || order.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [orders, searchTerm, statusFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Order Management</CardTitle>
          <CardDescription>View and manage customer orders</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search orders..."
                className="w-full pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={() => selectAllOnPage(true)}>
                <CheckSquare className="mr-2 h-4 w-4" /> Select page
              </Button>
              <Button variant="outline" size="sm" onClick={() => setSelected({})}>
                <XSquare className="mr-2 h-4 w-4" /> Clear
              </Button>
              <Button variant="outline" size="sm" onClick={() => fetchOrders()}>
                Refresh
              </Button>
              <Button variant="outline" size="sm" onClick={exportCsv}>
                <Download className="mr-2 h-4 w-4" /> CSV
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
          ) : error ? (
            <div className="py-8 text-center">
              <p className="text-destructive">{error}</p>
              <Button variant="outline" className="mt-4" onClick={fetchOrders}>
                Try Again
              </Button>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">No orders found</p>
            </div>
          ) : (
            <>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <input
                        type="checkbox"
                        aria-label="Select all"
                        onChange={(e) => selectAllOnPage(e.target.checked)}
                      />
                    </TableHead>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order._id}>
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={!!selected[order._id]}
                          onChange={(e) => toggleSelect(order._id, e.target.checked)}
                        />
                      </TableCell>
                      <TableCell className="font-medium">#{order._id.substring(order._id.length - 6)}</TableCell>
                      <TableCell>
                        <div>
                          <p>{order.user?.name || "Guest"}</p>
                          <p className="text-xs text-muted-foreground">{order.user?.email || "N/A"}</p>
                        </div>
                      </TableCell>
                      <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>{formatPrice(order.total)}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(order.status)}>
                          <span className="capitalize">{order.status}</span>
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setOpenId(order._id)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(order._id, "processing")}>
                              <Edit className="mr-2 h-4 w-4" />
                              Mark as Processing
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(order._id, "shipped")}>
                              <Edit className="mr-2 h-4 w-4" />
                              Mark as Shipped
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(order._id, "delivered")}>
                              <Edit className="mr-2 h-4 w-4" />
                              Mark as Delivered
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => handleStatusChange(order._id, "cancelled")}
                            >
                              <Trash className="mr-2 h-4 w-4" />
                              Cancel Order
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {selectedIds.length > 0 && (
            <div className="sticky bottom-4 z-10 mt-4 flex items-center justify-between rounded-md border bg-background p-3 shadow-sm">
              <div className="text-sm text-muted-foreground">Selected: {selectedIds.length}</div>
              <div className="flex items-center gap-2">
                <Button size="sm" onClick={() => bulkUpdate("processing")}>Mark Processing</Button>
                <Button size="sm" onClick={() => bulkUpdate("shipped")}>Mark Shipped</Button>
                <Button size="sm" onClick={() => bulkUpdate("delivered")}>Mark Delivered</Button>
                <Button variant="destructive" size="sm" onClick={() => bulkUpdate("cancelled")}>Cancel</Button>
              </div>
            </div>
            )}
            </>
          )}
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {(page - 1) * limit + 1}–{Math.min(page * limit, total || orders.length)} of {total || orders.length}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={total ? page * limit >= total : orders.length < limit}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Drawer open={!!openId} onOpenChange={(o) => !o && setOpenId(null)}>
        <DrawerContent>
          {openOrder && (
            <div className="p-4">
              <DrawerHeader>
                <DrawerTitle>Order #{openOrder._id.substring(openOrder._id.length - 6)}</DrawerTitle>
                <DrawerDescription>
                  {openOrder.user?.name || "Guest"} • {openOrder.user?.email || "N/A"} • {new Date(openOrder.createdAt).toLocaleString()}
                </DrawerDescription>
                <div className="mt-2 flex items-center gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleStatusChange(openOrder._id, "processing")}>
                    Mark Processing
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleStatusChange(openOrder._id, "shipped")}>
                    Mark Shipped
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleStatusChange(openOrder._id, "delivered")}>
                    Mark Delivered
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleStatusChange(openOrder._id, "cancelled")}>
                    Cancel
                  </Button>
                </div>
              </DrawerHeader>
              <div className="grid gap-6 p-4 pt-0 md:grid-cols-2">
                <div>
                  <h3 className="mb-2 text-sm font-medium">Items</h3>
                  <div className="space-y-2">
                    {openOrder.items.map((it, idx) => (
                      <div key={idx} className="flex items-center justify-between rounded-md border p-2">
                        <div>
                          <div className="font-medium">{it.name}</div>
                          <div className="text-xs text-muted-foreground">Qty {it.quantity}</div>
                        </div>
                        <div className="text-sm">{formatPrice(it.price * it.quantity)}</div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 space-y-1 text-sm">
                    <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(openOrder.subtotal)}</span></div>
                    <div className="flex justify-between"><span>Shipping</span><span>{formatPrice(openOrder.shipping)}</span></div>
                    <div className="flex justify-between font-medium"><span>Total</span><span>{formatPrice(openOrder.total)}</span></div>
                  </div>
                </div>
                <div>
                  <h3 className="mb-2 text-sm font-medium">Shipping Timeline</h3>
                  <ol className="relative ml-3 border-l">
                    <li className="mb-6 ml-4">
                      <span className="absolute -left-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground"><Clock className="h-3 w-3" /></span>
                      <p className="text-sm">Placed • {new Date(openOrder.createdAt).toLocaleString()}</p>
                    </li>
                    {openOrder.status !== "pending" && (
                      <li className="mb-6 ml-4">
                        <span className="absolute -left-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-white"><Truck className="h-3 w-3" /></span>
                        <p className="text-sm">{openOrder.status === "processing" ? "Processing" : openOrder.status === "shipped" ? "Shipped" : openOrder.status === "delivered" ? "Delivered" : "Updated"}</p>
                      </li>
                    )}
                    {openOrder.status === "delivered" && (
                      <li className="ml-4 opacity-90 text-sm">Delivered • {new Date(openOrder.updatedAt || openOrder.createdAt).toLocaleString()}</li>
                    )}
                  </ol>
                </div>
              </div>
            </div>
          )}
        </DrawerContent>
      </Drawer>
    </div>
  )
}
