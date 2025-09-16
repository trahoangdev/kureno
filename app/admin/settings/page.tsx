"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

export default function SiteSettingsPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  // General settings state
  const [generalSettings, setGeneralSettings] = useState({
    siteName: "Kureno",
    siteDescription: "A local brand with unique products and services",
    contactEmail: "info@kureno.com",
    supportEmail: "support@kureno.com",
    phoneNumber: "+1 (555) 123-4567",
    address: "123 Main Street, Anytown, ST 12345",
  })

  // SEO settings state
  const [seoSettings, setSeoSettings] = useState({
    metaTitle: "Kureno - Local Craftsmanship",
    metaDescription: "Discover unique locally crafted products that celebrate our heritage and craftsmanship",
    ogImage: "https://kureno.com/og.jpg",
    twitterHandle: "@kureno",
    googleAnalyticsId: "UA-XXXXXXXXX-X",
  })

  // Email settings state
  const [emailSettings, setEmailSettings] = useState({
    smtpHost: "smtp.example.com",
    smtpPort: "587",
    smtpUser: "notifications@kureno.com",
    smtpPassword: "••••••••••••",
    senderName: "Kureno Notifications",
    senderEmail: "notifications@kureno.com",
  })

  // Feature flags state
  const [featureFlags, setFeatureFlags] = useState({
    enableReviews: true,
    enableWishlist: true,
    enableBlog: true,
    enableNewsletter: true,
    maintenanceMode: false,
  })

  const handleGeneralChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setGeneralSettings((prev) => ({ ...prev, [name]: value }))
  }

  const handleSeoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setSeoSettings((prev) => ({ ...prev, [name]: value }))
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEmailSettings((prev) => ({ ...prev, [name]: value }))
  }

  const handleFeatureFlagChange = (name: string, checked: boolean) => {
    setFeatureFlags((prev) => ({ ...prev, [name]: checked }))
  }

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast({
      title: "Settings saved",
      description: "Your site settings have been updated successfully.",
    })

    setIsLoading(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Site Settings</h1>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Manage your site's basic information</CardDescription>
            </CardHeader>
            <CardContent>
              <form id="general-form" onSubmit={handleSaveSettings} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="siteName">Site Name</Label>
                    <Input
                      id="siteName"
                      name="siteName"
                      value={generalSettings.siteName}
                      onChange={handleGeneralChange}
                      required
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="siteDescription">Site Description</Label>
                    <Textarea
                      id="siteDescription"
                      name="siteDescription"
                      value={generalSettings.siteDescription}
                      onChange={handleGeneralChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">Contact Email</Label>
                    <Input
                      id="contactEmail"
                      name="contactEmail"
                      type="email"
                      value={generalSettings.contactEmail}
                      onChange={handleGeneralChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="supportEmail">Support Email</Label>
                    <Input
                      id="supportEmail"
                      name="supportEmail"
                      type="email"
                      value={generalSettings.supportEmail}
                      onChange={handleGeneralChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      value={generalSettings.phoneNumber}
                      onChange={handleGeneralChange}
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="address">Business Address</Label>
                    <Textarea
                      id="address"
                      name="address"
                      value={generalSettings.address}
                      onChange={handleGeneralChange}
                    />
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter>
              <Button type="submit" form="general-form" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="seo">
          <Card>
            <CardHeader>
              <CardTitle>SEO Settings</CardTitle>
              <CardDescription>Optimize your site for search engines</CardDescription>
            </CardHeader>
            <CardContent>
              <form id="seo-form" onSubmit={handleSaveSettings} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="metaTitle">Default Meta Title</Label>
                    <Input
                      id="metaTitle"
                      name="metaTitle"
                      value={seoSettings.metaTitle}
                      onChange={handleSeoChange}
                      required
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="metaDescription">Default Meta Description</Label>
                    <Textarea
                      id="metaDescription"
                      name="metaDescription"
                      value={seoSettings.metaDescription}
                      onChange={handleSeoChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ogImage">Default OG Image URL</Label>
                    <Input
                      id="ogImage"
                      name="ogImage"
                      value={seoSettings.ogImage}
                      onChange={handleSeoChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="twitterHandle">Twitter Handle</Label>
                    <Input
                      id="twitterHandle"
                      name="twitterHandle"
                      value={seoSettings.twitterHandle}
                      onChange={handleSeoChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="googleAnalyticsId">Google Analytics ID</Label>
                    <Input
                      id="googleAnalyticsId"
                      name="googleAnalyticsId"
                      value={seoSettings.googleAnalyticsId}
                      onChange={handleSeoChange}
                    />
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter>
              <Button type="submit" form="seo-form" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle>Email Settings</CardTitle>
              <CardDescription>Configure your email service for notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <form id="email-form" onSubmit={handleSaveSettings} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="smtpHost">SMTP Host</Label>
                    <Input
                      id="smtpHost"
                      name="smtpHost"
                      value={emailSettings.smtpHost}
                      onChange={handleEmailChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtpPort">SMTP Port</Label>
                    <Input
                      id="smtpPort"
                      name="smtpPort"
                      value={emailSettings.smtpPort}
                      onChange={handleEmailChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtpUser">SMTP Username</Label>
                    <Input
                      id="smtpUser"
                      name="smtpUser"
                      value={emailSettings.smtpUser}
                      onChange={handleEmailChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtpPassword">SMTP Password</Label>
                    <Input
                      id="smtpPassword"
                      name="smtpPassword"
                      type="password"
                      value={emailSettings.smtpPassword}
                      onChange={handleEmailChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="senderName">Sender Name</Label>
                    <Input
                      id="senderName"
                      name="senderName"
                      value={emailSettings.senderName}
                      onChange={handleEmailChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="senderEmail">Sender Email</Label>
                    <Input
                      id="senderEmail"
                      name="senderEmail"
                      type="email"
                      value={emailSettings.senderEmail}
                      onChange={handleEmailChange}
                      required
                    />
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter>
              <Button type="submit" form="email-form" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="features">
          <Card>
            <CardHeader>
              <CardTitle>Feature Settings</CardTitle>
              <CardDescription>Enable or disable site features</CardDescription>
            </CardHeader>
            <CardContent>
              <form id="features-form" onSubmit={handleSaveSettings} className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="enableReviews">Product Reviews</Label>
                      <p className="text-sm text-muted-foreground">Allow customers to leave reviews on products</p>
                    </div>
                    <Switch
                      id="enableReviews"
                      checked={featureFlags.enableReviews}
                      onCheckedChange={(checked) => handleFeatureFlagChange("enableReviews", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="enableWishlist">Wishlist</Label>
                      <p className="text-sm text-muted-foreground">Allow customers to save products to a wishlist</p>
                    </div>
                    <Switch
                      id="enableWishlist"
                      checked={featureFlags.enableWishlist}
                      onCheckedChange={(checked) => handleFeatureFlagChange("enableWishlist", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="enableBlog">Blog</Label>
                      <p className="text-sm text-muted-foreground">Enable the blog section on the site</p>
                    </div>
                    <Switch
                      id="enableBlog"
                      checked={featureFlags.enableBlog}
                      onCheckedChange={(checked) => handleFeatureFlagChange("enableBlog", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="enableNewsletter">Newsletter</Label>
                      <p className="text-sm text-muted-foreground">Enable newsletter subscription forms</p>
                    </div>
                    <Switch
                      id="enableNewsletter"
                      checked={featureFlags.enableNewsletter}
                      onCheckedChange={(checked) => handleFeatureFlagChange("enableNewsletter", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="maintenanceMode" className="text-destructive">
                        Maintenance Mode
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Put the site in maintenance mode (only admins can access)
                      </p>
                    </div>
                    <Switch
                      id="maintenanceMode"
                      checked={featureFlags.maintenanceMode}
                      onCheckedChange={(checked) => handleFeatureFlagChange("maintenanceMode", checked)}
                    />
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter>
              <Button type="submit" form="features-form" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
