"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Plus, Edit, Trash2, Shield, Settings } from "lucide-react"

interface AdminUser {
  _id: string
  name: string
  email: string
  role: "admin" | "manager" | "user"
  permissions: {
    canManageProducts: boolean
    canManageOrders: boolean
    canManageUsers: boolean
    canManageContent: boolean
    canViewAnalytics: boolean
    canManageSettings: boolean
  }
  isActive: boolean
  lastLogin?: string
  createdAt: string
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user" as "admin" | "manager" | "user",
    permissions: {
      canManageProducts: false,
      canManageOrders: false,
      canManageUsers: false,
      canManageContent: false,
      canViewAnalytics: false,
      canManageSettings: false,
    },
    isActive: true,
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/admin/users")
      if (response.ok) {
        const data = await response.json()
        setUsers(data.users)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const url = editingUser ? `/api/admin/users/${editingUser._id}` : "/api/admin/users"
      const method = editingUser ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: `User ${editingUser ? "updated" : "created"} successfully`,
        })
        setIsDialogOpen(false)
        setEditingUser(null)
        resetForm()
        fetchUsers()
      } else {
        const data = await response.json()
        toast({
          title: "Error",
          description: data.error || "Failed to save user",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (user: AdminUser) => {
    setEditingUser(user)
    setFormData({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
      permissions: user.permissions,
      isActive: user.isActive,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "User deleted successfully",
        })
        fetchUsers()
      } else {
        toast({
          title: "Error",
          description: "Failed to delete user",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "user",
      permissions: {
        canManageProducts: false,
        canManageOrders: false,
        canManageUsers: false,
        canManageContent: false,
        canViewAnalytics: false,
        canManageSettings: false,
      },
      isActive: true,
    })
  }

  const handleRoleChange = (role: "admin" | "manager" | "user") => {
    let permissions = { ...formData.permissions }

    if (role === "admin") {
      permissions = {
        canManageProducts: true,
        canManageOrders: true,
        canManageUsers: true,
        canManageContent: true,
        canViewAnalytics: true,
        canManageSettings: true,
      }
    } else if (role === "manager") {
      permissions = {
        canManageProducts: true,
        canManageOrders: true,
        canManageUsers: false,
        canManageContent: true,
        canViewAnalytics: true,
        canManageSettings: false,
      }
    } else {
      permissions = {
        canManageProducts: false,
        canManageOrders: false,
        canManageUsers: false,
        canManageContent: false,
        canViewAnalytics: false,
        canManageSettings: false,
      }
    }

    setFormData({ ...formData, role, permissions })
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Shield className="h-4 w-4" />
      case "manager":
        return <Settings className="h-4 w-4" />
      default:
        return <div className="h-4 w-4"></div> // Placeholder for User icon
    }
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin":
        return "destructive"
      case "manager":
        return "default"
      default:
        return "secondary"
    }
  }

  if (isLoading && users.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                resetForm()
                setEditingUser(null)
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingUser ? "Edit User" : "Add New User"}</DialogTitle>
              <DialogDescription>
                {editingUser ? "Update user information and permissions" : "Create a new user account"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="permissions">Permissions</TabsTrigger>
                </TabsList>
                <TabsContent value="basic" className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">
                        {editingUser ? "New Password (leave blank to keep current)" : "Password"}
                      </Label>
                      <Input
                        id="password"
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required={!editingUser}
                        minLength={6}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Select value={formData.role} onValueChange={handleRoleChange}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">User</SelectItem>
                          <SelectItem value="manager">Manager</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center space-x-2 sm:col-span-2">
                      <Switch
                        id="isActive"
                        checked={formData.isActive}
                        onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                      />
                      <Label htmlFor="isActive">Active Account</Label>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="permissions" className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="canManageProducts"
                        checked={formData.permissions.canManageProducts}
                        onCheckedChange={(checked) =>
                          setFormData({
                            ...formData,
                            permissions: { ...formData.permissions, canManageProducts: checked },
                          })
                        }
                      />
                      <Label htmlFor="canManageProducts">Manage Products</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="canManageOrders"
                        checked={formData.permissions.canManageOrders}
                        onCheckedChange={(checked) =>
                          setFormData({
                            ...formData,
                            permissions: { ...formData.permissions, canManageOrders: checked },
                          })
                        }
                      />
                      <Label htmlFor="canManageOrders">Manage Orders</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="canManageUsers"
                        checked={formData.permissions.canManageUsers}
                        onCheckedChange={(checked) =>
                          setFormData({
                            ...formData,
                            permissions: { ...formData.permissions, canManageUsers: checked },
                          })
                        }
                      />
                      <Label htmlFor="canManageUsers">Manage Users</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="canManageContent"
                        checked={formData.permissions.canManageContent}
                        onCheckedChange={(checked) =>
                          setFormData({
                            ...formData,
                            permissions: { ...formData.permissions, canManageContent: checked },
                          })
                        }
                      />
                      <Label htmlFor="canManageContent">Manage Content</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="canViewAnalytics"
                        checked={formData.permissions.canViewAnalytics}
                        onCheckedChange={(checked) =>
                          setFormData({
                            ...formData,
                            permissions: { ...formData.permissions, canViewAnalytics: checked },
                          })
                        }
                      />
                      <Label htmlFor="canViewAnalytics">View Analytics</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="canManageSettings"
                        checked={formData.permissions.canManageSettings}
                        onCheckedChange={(checked) =>
                          setFormData({
                            ...formData,
                            permissions: { ...formData.permissions, canManageSettings: checked },
                          })
                        }
                      />
                      <Label htmlFor="canManageSettings">Manage Settings</Label>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              <DialogFooter className="mt-6">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {editingUser ? "Updating..." : "Creating..."}
                    </>
                  ) : editingUser ? (
                    "Update User"
                  ) : (
                    "Create User"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>Manage user accounts and permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.map((user) => (
              <div key={user._id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    {getRoleIcon(user.role)}
                    <div>
                      <h3 className="font-medium">{user.name}</h3>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={getRoleBadgeVariant(user.role)}>{user.role}</Badge>
                    {!user.isActive && <Badge variant="outline">Inactive</Badge>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(user)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(user._id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
