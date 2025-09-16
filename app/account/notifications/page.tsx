"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Bell, ShoppingBag, Tag, Truck, CreditCard, Heart } from "lucide-react"

export default function NotificationsPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  // Notification preferences state
  const [preferences, setPreferences] = useState({
    email: {
      orderUpdates: true,
      shipping: true,
      promotions: false,
      newProducts: false,
      backInStock: true,
      accountActivity: true,
      newsletter: false,
    },
    push: {
      orderUpdates: true,
      shipping: true,
      promotions: true,
      newProducts: false,
      backInStock: true,
      accountActivity: false,
    },
  })

  const handleToggle = (category: "email" | "push", setting: string, checked: boolean) => {
    setPreferences((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: checked,
      },
    }))
  }

  const handleSavePreferences = async () => {
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast({
      title: "Preferences saved",
      description: "Your notification preferences have been updated successfully.",
    })

    setIsLoading(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>Manage how you receive notifications from Kureno</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-4 flex items-center">
            <Bell className="mr-2 h-5 w-5" /> Email Notifications
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="flex items-center">
                  <ShoppingBag className="mr-2 h-4 w-4 text-muted-foreground" />
                  Order Updates
                </Label>
                <p className="text-sm text-muted-foreground">Receive notifications about your order status</p>
              </div>
              <Switch
                checked={preferences.email.orderUpdates}
                onCheckedChange={(checked) => handleToggle("email", "orderUpdates", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="flex items-center">
                  <Truck className="mr-2 h-4 w-4 text-muted-foreground" />
                  Shipping Updates
                </Label>
                <p className="text-sm text-muted-foreground">Get notified when your order ships or is delivered</p>
              </div>
              <Switch
                checked={preferences.email.shipping}
                onCheckedChange={(checked) => handleToggle("email", "shipping", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="flex items-center">
                  <Tag className="mr-2 h-4 w-4 text-muted-foreground" />
                  Promotions and Discounts
                </Label>
                <p className="text-sm text-muted-foreground">
                  Receive special offers, discounts, and promotional emails
                </p>
              </div>
              <Switch
                checked={preferences.email.promotions}
                onCheckedChange={(checked) => handleToggle("email", "promotions", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="flex items-center">
                  <Heart className="mr-2 h-4 w-4 text-muted-foreground" />
                  Back in Stock
                </Label>
                <p className="text-sm text-muted-foreground">
                  Get notified when items from your wishlist are back in stock
                </p>
              </div>
              <Switch
                checked={preferences.email.backInStock}
                onCheckedChange={(checked) => handleToggle("email", "backInStock", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="flex items-center">
                  <CreditCard className="mr-2 h-4 w-4 text-muted-foreground" />
                  Account Activity
                </Label>
                <p className="text-sm text-muted-foreground">
                  Receive notifications about account activity and security
                </p>
              </div>
              <Switch
                checked={preferences.email.accountActivity}
                onCheckedChange={(checked) => handleToggle("email", "accountActivity", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Newsletter</Label>
                <p className="text-sm text-muted-foreground">
                  Receive our weekly newsletter with product updates and blog posts
                </p>
              </div>
              <Switch
                checked={preferences.email.newsletter}
                onCheckedChange={(checked) => handleToggle("email", "newsletter", checked)}
              />
            </div>
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="text-lg font-medium mb-4 flex items-center">
            <Bell className="mr-2 h-5 w-5" /> Push Notifications
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="flex items-center">
                  <ShoppingBag className="mr-2 h-4 w-4 text-muted-foreground" />
                  Order Updates
                </Label>
                <p className="text-sm text-muted-foreground">Receive push notifications about your order status</p>
              </div>
              <Switch
                checked={preferences.push.orderUpdates}
                onCheckedChange={(checked) => handleToggle("push", "orderUpdates", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="flex items-center">
                  <Truck className="mr-2 h-4 w-4 text-muted-foreground" />
                  Shipping Updates
                </Label>
                <p className="text-sm text-muted-foreground">
                  Get push notifications when your order ships or is delivered
                </p>
              </div>
              <Switch
                checked={preferences.push.shipping}
                onCheckedChange={(checked) => handleToggle("push", "shipping", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="flex items-center">
                  <Tag className="mr-2 h-4 w-4 text-muted-foreground" />
                  Promotions and Discounts
                </Label>
                <p className="text-sm text-muted-foreground">
                  Receive push notifications for special offers and promotions
                </p>
              </div>
              <Switch
                checked={preferences.push.promotions}
                onCheckedChange={(checked) => handleToggle("push", "promotions", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="flex items-center">
                  <Heart className="mr-2 h-4 w-4 text-muted-foreground" />
                  Back in Stock
                </Label>
                <p className="text-sm text-muted-foreground">
                  Get push notifications when items from your wishlist are back in stock
                </p>
              </div>
              <Switch
                checked={preferences.push.backInStock}
                onCheckedChange={(checked) => handleToggle("push", "backInStock", checked)}
              />
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSavePreferences} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
            </>
          ) : (
            "Save Preferences"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
