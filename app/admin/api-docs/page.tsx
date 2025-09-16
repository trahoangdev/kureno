"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Code, Database, Key, Shield, Users, Package, ShoppingCart } from "lucide-react"

export default function ApiDocsPage() {
  const endpoints = [
    {
      method: "GET",
      path: "/api/products",
      description: "Get all products",
      auth: false,
      params: "?page=1&limit=10&category=electronics",
      response: `{
  "products": [...],
  "total": 100,
  "page": 1,
  "totalPages": 10
}`,
    },
    {
      method: "POST",
      path: "/api/products",
      description: "Create a new product",
      auth: true,
      permissions: "canManageProducts",
      body: `{
  "name": "Product Name",
  "description": "Product description",
  "price": 99.99,
  "category": "electronics",
  "stock": 50,
  "images": ["image1.jpg", "image2.jpg"]
}`,
      response: `{
  "message": "Product created successfully",
  "product": {...}
}`,
    },
    {
      method: "PUT",
      path: "/api/products/{id}",
      description: "Update a product",
      auth: true,
      permissions: "canManageProducts",
      body: `{
  "name": "Updated Product Name",
  "price": 89.99,
  "stock": 45
}`,
      response: `{
  "message": "Product updated successfully",
  "product": {...}
}`,
    },
    {
      method: "DELETE",
      path: "/api/products/{id}",
      description: "Delete a product",
      auth: true,
      permissions: "canManageProducts",
      response: `{
  "message": "Product deleted successfully"
}`,
    },
    {
      method: "GET",
      path: "/api/orders",
      description: "Get all orders",
      auth: true,
      permissions: "canManageOrders",
      params: "?status=pending&page=1&limit=10",
      response: `{
  "orders": [...],
  "total": 50,
  "page": 1,
  "totalPages": 5
}`,
    },
    {
      method: "POST",
      path: "/api/orders",
      description: "Create a new order",
      auth: true,
      body: `{
  "items": [
    {
      "productId": "product_id",
      "quantity": 2,
      "price": 99.99
    }
  ],
  "shippingAddress": {...},
  "paymentMethod": "credit_card"
}`,
      response: `{
  "message": "Order created successfully",
  "order": {...}
}`,
    },
    {
      method: "PUT",
      path: "/api/orders/{id}",
      description: "Update order status",
      auth: true,
      permissions: "canManageOrders",
      body: `{
  "status": "shipped",
  "trackingNumber": "TRACK123"
}`,
      response: `{
  "message": "Order updated successfully",
  "order": {...}
}`,
    },
    {
      method: "GET",
      path: "/api/admin/users",
      description: "Get all users",
      auth: true,
      permissions: "canManageUsers",
      params: "?role=admin&page=1&limit=10",
      response: `{
  "users": [...],
  "total": 25,
  "page": 1,
  "totalPages": 3
}`,
    },
    {
      method: "POST",
      path: "/api/admin/users",
      description: "Create a new user",
      auth: true,
      permissions: "canManageUsers",
      body: `{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "manager",
  "permissions": {...}
}`,
      response: `{
  "message": "User created successfully",
  "user": {...}
}`,
    },
    {
      method: "PUT",
      path: "/api/admin/users/{id}",
      description: "Update a user",
      auth: true,
      permissions: "canManageUsers",
      body: `{
  "name": "John Smith",
  "role": "admin",
  "isActive": true
}`,
      response: `{
  "message": "User updated successfully",
  "user": {...}
}`,
    },
    {
      method: "DELETE",
      path: "/api/admin/users/{id}",
      description: "Delete a user",
      auth: true,
      permissions: "canManageUsers",
      response: `{
  "message": "User deleted successfully"
}`,
    },
    {
      method: "POST",
      path: "/api/auth/token",
      description: "Generate JWT token",
      auth: false,
      body: `{
  "email": "admin@example.com",
  "password": "password123",
  "expiresIn": "1h"
}`,
      response: `{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": "1h",
  "user": {...}
}`,
    },
  ]

  const getMethodColor = (method: string) => {
    switch (method) {
      case "GET":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
      case "POST":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
      case "PUT":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
      case "DELETE":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold tracking-tight">API Documentation</h1>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="authentication">Authentication</TabsTrigger>
          <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
          <TabsTrigger value="examples">Examples</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Base URL
                </CardTitle>
              </CardHeader>
              <CardContent>
                <code className="text-sm bg-muted p-2 rounded block">https://your-domain.com/api</code>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Content Type
                </CardTitle>
              </CardHeader>
              <CardContent>
                <code className="text-sm bg-muted p-2 rounded block">application/json</code>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Authentication
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Most endpoints require JWT authentication. Include the token in the Authorization header.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  Permissions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Different endpoints require different permissions based on user role and capabilities.
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="authentication">
          <Card>
            <CardHeader>
              <CardTitle>JWT Authentication</CardTitle>
              <CardDescription>Learn how to authenticate with the API using JWT tokens</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">1. Generate a Token</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Use the token generation endpoint to get a JWT token:
                </p>
                <div className="bg-muted p-4 rounded-lg">
                  <code className="text-sm">
                    POST /api/auth/token
                    <br />
                    Content-Type: application/json
                    <br />
                    <br />
                    {`{
  "email": "admin@example.com",
  "password": "your-password",
  "expiresIn": "1h"
}`}
                  </code>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">2. Use the Token</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Include the token in the Authorization header of your requests:
                </p>
                <div className="bg-muted p-4 rounded-lg">
                  <code className="text-sm">Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...</code>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">3. Token Expiration</h3>
                <p className="text-sm text-muted-foreground">
                  Tokens have configurable expiration times. Available options: 15m, 30m, 1h, 2h, 6h, 12h, 1d, 7d, 30d
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">4. Permissions</h3>
                <p className="text-sm text-muted-foreground mb-4">Different endpoints require different permissions:</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    <span className="text-sm">canManageProducts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4" />
                    <span className="text-sm">canManageOrders</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span className="text-sm">canManageUsers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Code className="h-4 w-4" />
                    <span className="text-sm">canManageContent</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="endpoints">
          <div className="space-y-4">
            {endpoints.map((endpoint, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge className={getMethodColor(endpoint.method)}>{endpoint.method}</Badge>
                      <code className="text-sm font-mono">{endpoint.path}</code>
                    </div>
                    <div className="flex items-center gap-2">
                      {endpoint.auth && (
                        <Badge variant="outline">
                          <Shield className="h-3 w-3 mr-1" />
                          Auth Required
                        </Badge>
                      )}
                      {endpoint.permissions && <Badge variant="secondary">{endpoint.permissions}</Badge>}
                    </div>
                  </div>
                  <CardDescription>{endpoint.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {endpoint.params && (
                    <div>
                      <h4 className="font-medium mb-2">Query Parameters</h4>
                      <div className="bg-muted p-3 rounded-lg">
                        <code className="text-sm">{endpoint.params}</code>
                      </div>
                    </div>
                  )}
                  {endpoint.body && (
                    <div>
                      <h4 className="font-medium mb-2">Request Body</h4>
                      <div className="bg-muted p-3 rounded-lg">
                        <pre className="text-sm overflow-x-auto">{endpoint.body}</pre>
                      </div>
                    </div>
                  )}
                  <div>
                    <h4 className="font-medium mb-2">Response</h4>
                    <div className="bg-muted p-3 rounded-lg">
                      <pre className="text-sm overflow-x-auto">{endpoint.response}</pre>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="examples">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>JavaScript/Fetch Example</CardTitle>
                <CardDescription>Example of making authenticated API requests using JavaScript fetch</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-4 rounded-lg">
                  <pre className="text-sm overflow-x-auto">{`// Generate token
const tokenResponse = await fetch('/api/auth/token', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'admin@example.com',
    password: 'password123',
    expiresIn: '1h'
  }),
});

const { token } = await tokenResponse.json();

// Use token for authenticated requests
const response = await fetch('/api/products', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': \`Bearer \${token}\`,
  },
  body: JSON.stringify({
    name: 'New Product',
    price: 99.99,
    category: 'electronics',
    stock: 50
  }),
});

const result = await response.json();
console.log(result);`}</pre>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>cURL Example</CardTitle>
                <CardDescription>Example of making API requests using cURL</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-4 rounded-lg">
                  <pre className="text-sm overflow-x-auto">{`# Generate token
curl -X POST https://your-domain.com/api/auth/token \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "admin@example.com",
    "password": "password123",
    "expiresIn": "1h"
  }'

# Use token for authenticated requests
curl -X GET https://your-domain.com/api/products \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \\
  -H "Content-Type: application/json"

# Create a new product
curl -X POST https://your-domain.com/api/products \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "New Product",
    "description": "Product description",
    "price": 99.99,
    "category": "electronics",
    "stock": 50
  }'`}</pre>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Python Example</CardTitle>
                <CardDescription>Example of making API requests using Python requests library</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-4 rounded-lg">
                  <pre className="text-sm overflow-x-auto">{`import requests
import json

# Generate token
token_response = requests.post('https://your-domain.com/api/auth/token', 
    json={
        'email': 'admin@example.com',
        'password': 'password123',
        'expiresIn': '1h'
    }
)

token = token_response.json()['token']

# Use token for authenticated requests
headers = {
    'Authorization': f'Bearer {token}',
    'Content-Type': 'application/json'
}

# Get products
products_response = requests.get('https://your-domain.com/api/products', 
    headers=headers
)

products = products_response.json()
print(products)

# Create a new product
new_product = {
    'name': 'New Product',
    'description': 'Product description',
    'price': 99.99,
    'category': 'electronics',
    'stock': 50
}

create_response = requests.post('https://your-domain.com/api/products',
    headers=headers,
    json=new_product
)

result = create_response.json()
print(result)`}</pre>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
