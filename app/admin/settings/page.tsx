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
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"
import { 
  Loader2, 
  Globe, 
  Settings, 
  Save, 
  RefreshCw, 
  Download, 
  Upload, 
  Eye, 
  EyeOff, 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  Shield, 
  Mail, 
  Search, 
  Palette, 
  Database, 
  Server, 
  Lock, 
  Unlock, 
  Activity, 
  TrendingUp, 
  Users, 
  BarChart3, 
  Zap, 
  Target, 
  Award, 
  Star, 
  Clock, 
  Calendar, 
  MapPin, 
  Phone, 
  MessageSquare, 
  FileText, 
  Image, 
  Link, 
  ExternalLink, 
  Copy, 
  Edit, 
  Trash2, 
  Plus, 
  Minus, 
  X, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  ChevronDown, 
  ChevronUp, 
  MoreHorizontal, 
  MoreVertical, 
  Filter, 
  Search as SearchIcon, 
  Bell, 
  Bookmark, 
  Heart, 
  Share, 
  Send, 
  Archive, 
  Tag, 
  Layers, 
  Grid3X3, 
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
  Link as LinkIcon, 
  Unlink, 
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

export default function SiteSettingsPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("general")
  const [showPreview, setShowPreview] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

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
    setHasUnsavedChanges(true)
  }

  const handleSeoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setSeoSettings((prev) => ({ ...prev, [name]: value }))
    setHasUnsavedChanges(true)
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEmailSettings((prev) => ({ ...prev, [name]: value }))
    setHasUnsavedChanges(true)
  }

  const handleFeatureFlagChange = (name: string, checked: boolean) => {
    setFeatureFlags((prev) => ({ ...prev, [name]: checked }))
    setHasUnsavedChanges(true)
  }

  const handleExportSettings = () => {
    const settings = {
      general: generalSettings,
      seo: seoSettings,
      email: emailSettings,
      features: featureFlags,
      exportedAt: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `kureno-settings-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
    
    toast({
      title: "Settings exported",
      description: "Your settings have been exported successfully.",
    })
  }

  const handleImportSettings = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const settings = JSON.parse(event.target?.result as string)
        if (settings.general) setGeneralSettings(settings.general)
        if (settings.seo) setSeoSettings(settings.seo)
        if (settings.email) setEmailSettings(settings.email)
        if (settings.features) setFeatureFlags(settings.features)
        
        toast({
          title: "Settings imported",
          description: "Your settings have been imported successfully.",
        })
      } catch (error) {
        toast({
          title: "Import failed",
          description: "Invalid settings file format.",
          variant: "destructive"
        })
      }
    }
    reader.readAsText(file)
  }

  const handleResetSettings = () => {
    if (confirm("Are you sure you want to reset all settings to default values? This action cannot be undone.")) {
      setGeneralSettings({
        siteName: "Kureno",
        siteDescription: "A local brand with unique products and services",
        contactEmail: "info@kureno.com",
        supportEmail: "support@kureno.com",
        phoneNumber: "+1 (555) 123-4567",
        address: "123 Main Street, Anytown, ST 12345",
      })
      setSeoSettings({
        metaTitle: "Kureno - Local Craftsmanship",
        metaDescription: "Discover unique locally crafted products that celebrate our heritage and craftsmanship",
        ogImage: "https://kureno.com/og.jpg",
        twitterHandle: "@kureno",
        googleAnalyticsId: "UA-XXXXXXXXX-X",
      })
      setEmailSettings({
        smtpHost: "smtp.example.com",
        smtpPort: "587",
        smtpUser: "notifications@kureno.com",
        smtpPassword: "••••••••••••",
        senderName: "Kureno Notifications",
        senderEmail: "notifications@kureno.com",
      })
      setFeatureFlags({
        enableReviews: true,
        enableWishlist: true,
        enableBlog: true,
        enableNewsletter: true,
        maintenanceMode: false,
      })
      setHasUnsavedChanges(false)
      
      toast({
        title: "Settings reset",
        description: "All settings have been reset to default values.",
      })
    }
  }

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setHasUnsavedChanges(false)
    toast({
      title: "Settings saved",
      description: "Your site settings have been updated successfully.",
    })

    setIsLoading(false)
  }

  return (
    <div className="space-y-8">
      {/* Enhanced Header Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-950/20 dark:via-teal-950/20 dark:to-cyan-950/20 p-8">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(16,185,129,0.1),transparent_50%),radial-gradient(ellipse_at_bottom_left,rgba(6,182,212,0.1),transparent_50%)] -z-10" />
        
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-3 py-1 text-sm font-medium">
                <Settings className="h-3 w-3 mr-1" />
                Site Configuration
              </Badge>
              <Badge variant="outline" className="text-xs">
                <Shield className="h-3 w-3 mr-1" />
                Admin Panel
              </Badge>
            </div>
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
              Site Settings
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Configure your website's core settings, optimize for search engines, manage email services, and control feature availability.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="rounded-full" onClick={handleExportSettings}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button variant="outline" size="sm" className="rounded-full" asChild>
              <label htmlFor="import-settings" className="cursor-pointer">
                <Upload className="mr-2 h-4 w-4" />
                Import
                <input
                  id="import-settings"
                  type="file"
                  accept=".json"
                  onChange={handleImportSettings}
                  className="hidden"
                />
              </label>
            </Button>
            <Button variant="outline" size="sm" className="rounded-full" onClick={handleResetSettings}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Reset
            </Button>
          </div>
        </div>
        
        {/* Quick Stats Preview */}
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-600">4</div>
            <div className="text-xs text-muted-foreground">Active Tabs</div>
            <div className="text-xs text-green-600 flex items-center justify-center gap-1">
              <CheckCircle className="h-3 w-3" />
              Configured
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-teal-600">{Object.values(featureFlags).filter(Boolean).length}</div>
            <div className="text-xs text-muted-foreground">Features Enabled</div>
            <div className="text-xs text-green-600 flex items-center justify-center gap-1">
              <Zap className="h-3 w-3" />
              Active
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-cyan-600">2</div>
            <div className="text-xs text-muted-foreground">Email Services</div>
            <div className="text-xs text-green-600 flex items-center justify-center gap-1">
              <Mail className="h-3 w-3" />
              Connected
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">1</div>
            <div className="text-xs text-muted-foreground">Analytics</div>
            <div className="text-xs text-green-600 flex items-center justify-center gap-1">
              <BarChart3 className="h-3 w-3" />
              Tracking
            </div>
          </div>
        </div>
      </div>

      {/* Unsaved Changes Alert */}
      {hasUnsavedChanges && (
        <Alert className="border-orange-200 bg-orange-50 dark:border-orange-900 dark:bg-orange-950/20">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800 dark:text-orange-200">
            You have unsaved changes. Don't forget to save your settings.
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList className="grid w-full max-w-md grid-cols-4">
            <TabsTrigger value="general" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              General
            </TabsTrigger>
            <TabsTrigger value="seo" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              SEO
            </TabsTrigger>
            <TabsTrigger value="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email
            </TabsTrigger>
            <TabsTrigger value="features" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Features
            </TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowPreview(!showPreview)}
              className="rounded-full"
            >
              {showPreview ? <EyeOff className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
              {showPreview ? "Hide Preview" : "Show Preview"}
            </Button>
          </div>
        </div>

        <TabsContent value="general" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-emerald-600" />
                    General Settings
                  </CardTitle>
                  <CardDescription>Manage your site's basic information and branding</CardDescription>
                </CardHeader>
                <CardContent>
                  <form id="general-form" onSubmit={handleSaveSettings} className="space-y-6">
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="siteName" className="flex items-center gap-2">
                          <Type className="h-4 w-4" />
                          Site Name
                        </Label>
                        <Input
                          id="siteName"
                          name="siteName"
                          value={generalSettings.siteName}
                          onChange={handleGeneralChange}
                          placeholder="Enter your site name"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phoneNumber" className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          Phone Number
                        </Label>
                        <Input
                          id="phoneNumber"
                          name="phoneNumber"
                          value={generalSettings.phoneNumber}
                          onChange={handleGeneralChange}
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                      <div className="space-y-2 sm:col-span-2">
                        <Label htmlFor="siteDescription" className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          Site Description
                        </Label>
                        <Textarea
                          id="siteDescription"
                          name="siteDescription"
                          value={generalSettings.siteDescription}
                          onChange={handleGeneralChange}
                          placeholder="Describe your business and what you offer"
                          rows={3}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contactEmail" className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          Contact Email
                        </Label>
                        <Input
                          id="contactEmail"
                          name="contactEmail"
                          type="email"
                          value={generalSettings.contactEmail}
                          onChange={handleGeneralChange}
                          placeholder="info@yoursite.com"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="supportEmail" className="flex items-center gap-2">
                          <MessageSquare className="h-4 w-4" />
                          Support Email
                        </Label>
                        <Input
                          id="supportEmail"
                          name="supportEmail"
                          type="email"
                          value={generalSettings.supportEmail}
                          onChange={handleGeneralChange}
                          placeholder="support@yoursite.com"
                          required
                        />
                      </div>
                      <div className="space-y-2 sm:col-span-2">
                        <Label htmlFor="address" className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          Business Address
                        </Label>
                        <Textarea
                          id="address"
                          name="address"
                          value={generalSettings.address}
                          onChange={handleGeneralChange}
                          placeholder="Enter your business address"
                          rows={2}
                        />
                      </div>
                    </div>
                  </form>
                </CardContent>
                <CardFooter className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Last updated: {new Date().toLocaleDateString()}
                  </div>
                  <Button type="submit" form="general-form" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" /> Save Changes
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </div>
            
            {/* Preview Panel */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5 text-blue-600" />
                    Live Preview
                  </CardTitle>
                  <CardDescription>See how your settings will appear</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg bg-muted/30">
                      <h3 className="font-semibold text-lg">{generalSettings.siteName}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{generalSettings.siteDescription}</p>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{generalSettings.contactEmail}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{generalSettings.phoneNumber}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs">{generalSettings.address}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-green-600" />
                    Quick Stats
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Site Name Length</span>
                      <Badge variant="secondary">{generalSettings.siteName.length} chars</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Description Length</span>
                      <Badge variant="secondary">{generalSettings.siteDescription.length} chars</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Contact Methods</span>
                      <Badge variant="secondary">
                        {[generalSettings.contactEmail, generalSettings.supportEmail, generalSettings.phoneNumber].filter(Boolean).length}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="seo" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="h-5 w-5 text-teal-600" />
                    SEO Settings
                  </CardTitle>
                  <CardDescription>Optimize your site for search engines and social media</CardDescription>
                </CardHeader>
                <CardContent>
                  <form id="seo-form" onSubmit={handleSaveSettings} className="space-y-6">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="metaTitle" className="flex items-center gap-2">
                          <Type className="h-4 w-4" />
                          Default Meta Title
                        </Label>
                        <Input
                          id="metaTitle"
                          name="metaTitle"
                          value={seoSettings.metaTitle}
                          onChange={handleSeoChange}
                          placeholder="Your site title for search engines"
                          required
                        />
                        <p className="text-xs text-muted-foreground">
                          {seoSettings.metaTitle.length}/60 characters (recommended: 50-60)
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="metaDescription" className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          Default Meta Description
                        </Label>
                        <Textarea
                          id="metaDescription"
                          name="metaDescription"
                          value={seoSettings.metaDescription}
                          onChange={handleSeoChange}
                          placeholder="Describe your site for search engines"
                          rows={3}
                          required
                        />
                        <p className="text-xs text-muted-foreground">
                          {seoSettings.metaDescription.length}/160 characters (recommended: 150-160)
                        </p>
                      </div>
                      
                      <div className="grid gap-6 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="ogImage" className="flex items-center gap-2">
                            <Image className="h-4 w-4" />
                            Default OG Image URL
                          </Label>
                          <Input
                            id="ogImage"
                            name="ogImage"
                            value={seoSettings.ogImage}
                            onChange={handleSeoChange}
                            placeholder="https://yoursite.com/og-image.jpg"
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="twitterHandle" className="flex items-center gap-2">
                            <Link className="h-4 w-4" />
                            Twitter Handle
                          </Label>
                          <Input
                            id="twitterHandle"
                            name="twitterHandle"
                            value={seoSettings.twitterHandle}
                            onChange={handleSeoChange}
                            placeholder="@yourhandle"
                          />
                        </div>
                        
                        <div className="space-y-2 sm:col-span-2">
                          <Label htmlFor="googleAnalyticsId" className="flex items-center gap-2">
                            <BarChart3 className="h-4 w-4" />
                            Google Analytics ID
                          </Label>
                          <Input
                            id="googleAnalyticsId"
                            name="googleAnalyticsId"
                            value={seoSettings.googleAnalyticsId}
                            onChange={handleSeoChange}
                            placeholder="UA-XXXXXXXXX-X or G-XXXXXXXXXX"
                          />
                        </div>
                      </div>
                    </div>
                  </form>
                </CardContent>
                <CardFooter className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    SEO score: {seoSettings.metaTitle.length > 30 && seoSettings.metaDescription.length > 100 ? "Good" : "Needs improvement"}
                  </div>
                  <Button type="submit" form="seo-form" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" /> Save Changes
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </div>
            
            {/* SEO Preview Panel */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5 text-blue-600" />
                    Search Preview
                  </CardTitle>
                  <CardDescription>How your site appears in search results</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg bg-muted/30">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-xs text-muted-foreground">yoursite.com</span>
                      </div>
                      <h3 className="text-blue-600 hover:underline cursor-pointer text-sm font-medium line-clamp-1">
                        {seoSettings.metaTitle}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {seoSettings.metaDescription}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Share className="h-5 w-5 text-purple-600" />
                    Social Preview
                  </CardTitle>
                  <CardDescription>How your site appears when shared</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg bg-muted/30">
                      <div className="w-full h-32 bg-muted rounded mb-2 flex items-center justify-center">
                        <Image className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <h3 className="font-semibold text-sm line-clamp-1">{seoSettings.metaTitle}</h3>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {seoSettings.metaDescription}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">yoursite.com</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-green-600" />
                    SEO Score
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Title Length</span>
                      <Badge variant={seoSettings.metaTitle.length >= 30 && seoSettings.metaTitle.length <= 60 ? "default" : "secondary"}>
                        {seoSettings.metaTitle.length}/60
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Description Length</span>
                      <Badge variant={seoSettings.metaDescription.length >= 120 && seoSettings.metaDescription.length <= 160 ? "default" : "secondary"}>
                        {seoSettings.metaDescription.length}/160
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">OG Image</span>
                      <Badge variant={seoSettings.ogImage ? "default" : "secondary"}>
                        {seoSettings.ogImage ? "Set" : "Missing"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Analytics</span>
                      <Badge variant={seoSettings.googleAnalyticsId ? "default" : "secondary"}>
                        {seoSettings.googleAnalyticsId ? "Connected" : "Not Set"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="email" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-cyan-600" />
                    Email Settings
                  </CardTitle>
                  <CardDescription>Configure your email service for notifications and communications</CardDescription>
                </CardHeader>
                <CardContent>
                  <form id="email-form" onSubmit={handleSaveSettings} className="space-y-6">
                    <div className="space-y-6">
                      <div className="grid gap-6 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="smtpHost" className="flex items-center gap-2">
                            <Server className="h-4 w-4" />
                            SMTP Host
                          </Label>
                          <Input
                            id="smtpHost"
                            name="smtpHost"
                            value={emailSettings.smtpHost}
                            onChange={handleEmailChange}
                            placeholder="smtp.example.com"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="smtpPort" className="flex items-center gap-2">
                            <Database className="h-4 w-4" />
                            SMTP Port
                          </Label>
                          <Input
                            id="smtpPort"
                            name="smtpPort"
                            value={emailSettings.smtpPort}
                            onChange={handleEmailChange}
                            placeholder="587"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="smtpUser" className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            SMTP Username
                          </Label>
                          <Input
                            id="smtpUser"
                            name="smtpUser"
                            value={emailSettings.smtpUser}
                            onChange={handleEmailChange}
                            placeholder="your-email@example.com"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="smtpPassword" className="flex items-center gap-2">
                            <Lock className="h-4 w-4" />
                            SMTP Password
                          </Label>
                          <Input
                            id="smtpPassword"
                            name="smtpPassword"
                            type="password"
                            value={emailSettings.smtpPassword}
                            onChange={handleEmailChange}
                            placeholder="••••••••••••"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="senderName" className="flex items-center gap-2">
                            <Type className="h-4 w-4" />
                            Sender Name
                          </Label>
                          <Input
                            id="senderName"
                            name="senderName"
                            value={emailSettings.senderName}
                            onChange={handleEmailChange}
                            placeholder="Your Company Name"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="senderEmail" className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            Sender Email
                          </Label>
                          <Input
                            id="senderEmail"
                            name="senderEmail"
                            type="email"
                            value={emailSettings.senderEmail}
                            onChange={handleEmailChange}
                            placeholder="noreply@yoursite.com"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </form>
                </CardContent>
                <CardFooter className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Connection status: {emailSettings.smtpHost && emailSettings.smtpUser ? "Configured" : "Not configured"}
                  </div>
                  <Button type="submit" form="email-form" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" /> Save Changes
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </div>
            
            {/* Email Test Panel */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Send className="h-5 w-5 text-blue-600" />
                    Test Email
                  </CardTitle>
                  <CardDescription>Test your email configuration</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Button variant="outline" className="w-full">
                      <Send className="mr-2 h-4 w-4" />
                      Send Test Email
                    </Button>
                    <div className="text-xs text-muted-foreground">
                      This will send a test email to verify your SMTP configuration is working correctly.
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-green-600" />
                    Email Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">SMTP Host</span>
                      <Badge variant={emailSettings.smtpHost ? "default" : "secondary"}>
                        {emailSettings.smtpHost ? "Set" : "Missing"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Port</span>
                      <Badge variant={emailSettings.smtpPort ? "default" : "secondary"}>
                        {emailSettings.smtpPort || "Not set"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Username</span>
                      <Badge variant={emailSettings.smtpUser ? "default" : "secondary"}>
                        {emailSettings.smtpUser ? "Set" : "Missing"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Password</span>
                      <Badge variant={emailSettings.smtpPassword ? "default" : "secondary"}>
                        {emailSettings.smtpPassword ? "Set" : "Missing"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="features" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-purple-600" />
                    Feature Settings
                  </CardTitle>
                  <CardDescription>Enable or disable site features and functionality</CardDescription>
                </CardHeader>
                <CardContent>
                  <form id="features-form" onSubmit={handleSaveSettings} className="space-y-6">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <Label htmlFor="enableReviews" className="font-medium">Product Reviews</Label>
                          </div>
                          <p className="text-sm text-muted-foreground">Allow customers to leave reviews and ratings on products</p>
                        </div>
                        <Switch
                          id="enableReviews"
                          checked={featureFlags.enableReviews}
                          onCheckedChange={(checked) => handleFeatureFlagChange("enableReviews", checked)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Heart className="h-4 w-4 text-red-500" />
                            <Label htmlFor="enableWishlist" className="font-medium">Wishlist</Label>
                          </div>
                          <p className="text-sm text-muted-foreground">Allow customers to save products to a personal wishlist</p>
                        </div>
                        <Switch
                          id="enableWishlist"
                          checked={featureFlags.enableWishlist}
                          onCheckedChange={(checked) => handleFeatureFlagChange("enableWishlist", checked)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-blue-500" />
                            <Label htmlFor="enableBlog" className="font-medium">Blog</Label>
                          </div>
                          <p className="text-sm text-muted-foreground">Enable the blog section for content marketing and updates</p>
                        </div>
                        <Switch
                          id="enableBlog"
                          checked={featureFlags.enableBlog}
                          onCheckedChange={(checked) => handleFeatureFlagChange("enableBlog", checked)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Bell className="h-4 w-4 text-green-500" />
                            <Label htmlFor="enableNewsletter" className="font-medium">Newsletter</Label>
                          </div>
                          <p className="text-sm text-muted-foreground">Enable newsletter subscription forms and email marketing</p>
                        </div>
                        <Switch
                          id="enableNewsletter"
                          checked={featureFlags.enableNewsletter}
                          onCheckedChange={(checked) => handleFeatureFlagChange("enableNewsletter", checked)}
                        />
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg hover:bg-red-50/50 transition-colors">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                            <Label htmlFor="maintenanceMode" className="font-medium text-red-600">
                              Maintenance Mode
                            </Label>
                          </div>
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
                <CardFooter className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    {Object.values(featureFlags).filter(Boolean).length} of {Object.keys(featureFlags).length} features enabled
                  </div>
                  <Button type="submit" form="features-form" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" /> Save Changes
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </div>
            
            {/* Feature Status Panel */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-green-600" />
                    Feature Status
                  </CardTitle>
                  <CardDescription>Overview of enabled features</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Product Reviews</span>
                      <Badge variant={featureFlags.enableReviews ? "default" : "secondary"}>
                        {featureFlags.enableReviews ? "Enabled" : "Disabled"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Wishlist</span>
                      <Badge variant={featureFlags.enableWishlist ? "default" : "secondary"}>
                        {featureFlags.enableWishlist ? "Enabled" : "Disabled"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Blog</span>
                      <Badge variant={featureFlags.enableBlog ? "default" : "secondary"}>
                        {featureFlags.enableBlog ? "Enabled" : "Disabled"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Newsletter</span>
                      <Badge variant={featureFlags.enableNewsletter ? "default" : "secondary"}>
                        {featureFlags.enableNewsletter ? "Enabled" : "Disabled"}
                      </Badge>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Maintenance Mode</span>
                      <Badge variant={featureFlags.maintenanceMode ? "destructive" : "secondary"}>
                        {featureFlags.maintenanceMode ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    Feature Impact
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-sm">
                      <div className="flex items-center justify-between mb-1">
                        <span>User Engagement</span>
                        <span className="text-xs text-muted-foreground">
                          {featureFlags.enableReviews && featureFlags.enableWishlist ? "High" : "Medium"}
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${(featureFlags.enableReviews && featureFlags.enableWishlist ? 100 : 60)}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="text-sm">
                      <div className="flex items-center justify-between mb-1">
                        <span>Content Marketing</span>
                        <span className="text-xs text-muted-foreground">
                          {featureFlags.enableBlog && featureFlags.enableNewsletter ? "High" : "Low"}
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${(featureFlags.enableBlog && featureFlags.enableNewsletter ? 100 : 30)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
