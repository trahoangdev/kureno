"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/components/ui/use-toast"
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Shield, 
  Key, 
  Bell, 
  Eye, 
  EyeOff, 
  Camera, 
  Save, 
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
  Search, 
  Settings, 
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
  MessageSquare, 
  FileText, 
  Image, 
  Link, 
  ExternalLink, 
  Copy, 
  Download, 
  Upload, 
  RefreshCw, 
  AlertTriangle, 
  Info, 
  CheckCircle, 
  XCircle, 
  Loader2,
  Smartphone,
  Monitor,
  Globe,
  Database,
  Server,
  Palette,
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

interface UserProfile {
  id: string
  name: string
  email: string
  avatar?: string
  phone?: string
  bio?: string
  location?: string
  website?: string
  role: string
  permissions: string[]
  createdAt: string
  lastLogin: string
  isActive: boolean
  twoFactorEnabled: boolean
}

interface LoginSession {
  id: string
  device: string
  browser: string
  location: string
  ip: string
  timestamp: string
  isCurrent: boolean
}

export default function AccountSettingsPage() {
  const [activeTab, setActiveTab] = useState("profile")
  const [isLoading, setIsLoading] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const { toast } = useToast()

  // Profile state
  const [profile, setProfile] = useState<UserProfile>({
    id: "1",
    name: "John Doe",
    email: "john.doe@kureno.com",
    avatar: "",
    phone: "+1 (555) 123-4567",
    bio: "Administrator and system manager with 5+ years of experience in e-commerce platforms.",
    location: "San Francisco, CA",
    website: "https://johndoe.com",
    role: "Super Admin",
    permissions: ["all"],
    createdAt: "2023-01-15T10:30:00Z",
    lastLogin: "2024-01-20T14:22:00Z",
    isActive: true,
    twoFactorEnabled: false,
  })

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  // Notification preferences state
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    marketingEmails: false,
    securityAlerts: true,
    systemUpdates: true,
    orderUpdates: true,
    newMessages: true,
  })

  // Privacy settings state
  const [privacy, setPrivacy] = useState({
    profileVisibility: "public",
    showEmail: false,
    showPhone: false,
    showLocation: true,
    allowDirectMessages: true,
    dataSharing: false,
    analyticsTracking: true,
  })

  // Mock login sessions
  const [loginSessions] = useState<LoginSession[]>([
    {
      id: "1",
      device: "MacBook Pro",
      browser: "Chrome 120.0",
      location: "San Francisco, CA",
      ip: "192.168.1.100",
      timestamp: "2024-01-20T14:22:00Z",
      isCurrent: true,
    },
    {
      id: "2",
      device: "iPhone 15 Pro",
      browser: "Safari 17.2",
      location: "San Francisco, CA",
      ip: "192.168.1.101",
      timestamp: "2024-01-19T09:15:00Z",
      isCurrent: false,
    },
    {
      id: "3",
      device: "Windows PC",
      browser: "Firefox 121.0",
      location: "New York, NY",
      ip: "203.0.113.42",
      timestamp: "2024-01-18T16:45:00Z",
      isCurrent: false,
    },
  ])

  const handleProfileChange = (field: string, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }))
    setHasUnsavedChanges(true)
  }

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData(prev => ({ ...prev, [field]: value }))
  }

  const handleNotificationChange = (field: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [field]: value }))
    setHasUnsavedChanges(true)
  }

  const handlePrivacyChange = (field: string, value: string | boolean) => {
    setPrivacy(prev => ({ ...prev, [field]: value }))
    setHasUnsavedChanges(true)
  }

  const handleSaveProfile = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setHasUnsavedChanges(false)
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
      toast({
        title: "Password changed",
        description: "Your password has been changed successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to change password. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleTwoFactor = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setProfile(prev => ({ ...prev, twoFactorEnabled: !prev.twoFactorEnabled }))
      toast({
        title: "Two-factor authentication updated",
        description: `Two-factor authentication has been ${!profile.twoFactorEnabled ? "enabled" : "disabled"}.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update two-factor authentication.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleTerminateSession = async (sessionId: string) => {
    if (confirm("Are you sure you want to terminate this session?")) {
      setIsLoading(true)
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        toast({
          title: "Session terminated",
          description: "The selected session has been terminated.",
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to terminate session.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }
  }

  const getDeviceIcon = (device: string) => {
    if (device.includes("iPhone") || device.includes("Android")) return Smartphone
    if (device.includes("MacBook") || device.includes("Windows")) return Monitor
    return Monitor
  }

  return (
    <div className="space-y-8">
      {/* Enhanced Header Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 dark:from-slate-950/20 dark:via-gray-950/20 dark:to-zinc-950/20 p-8">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(71,85,105,0.1),transparent_50%),radial-gradient(ellipse_at_bottom_left,rgba(100,116,139,0.1),transparent_50%)] -z-10" />
        
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Badge className="bg-gradient-to-r from-slate-500 to-gray-500 text-white px-3 py-1 text-sm font-medium">
                <User className="h-3 w-3 mr-1" />
                Account Management
              </Badge>
              <Badge variant="outline" className="text-xs">
                <Shield className="h-3 w-3 mr-1" />
                Personal Settings
              </Badge>
            </div>
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-slate-600 via-gray-600 to-zinc-600 bg-clip-text text-transparent">
              Account Settings
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Manage your personal account settings, security preferences, and privacy controls. Keep your account secure and up to date.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="rounded-full">
              <Download className="mr-2 h-4 w-4" />
              Export Data
            </Button>
            <Button variant="outline" size="sm" className="rounded-full">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Button variant="outline" size="sm" className="rounded-full">
              <Settings className="mr-2 h-4 w-4" />
              Advanced
            </Button>
          </div>
        </div>
        
        {/* Quick Stats Preview */}
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-600">{profile.role}</div>
            <div className="text-xs text-muted-foreground">Account Role</div>
            <div className="text-xs text-green-600 flex items-center justify-center gap-1">
              <CheckCircle className="h-3 w-3" />
              Active
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600">{profile.twoFactorEnabled ? "Enabled" : "Disabled"}</div>
            <div className="text-xs text-muted-foreground">2FA Status</div>
            <div className="text-xs text-blue-600 flex items-center justify-center gap-1">
              <Shield className="h-3 w-3" />
              Security
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-zinc-600">{loginSessions.length}</div>
            <div className="text-xs text-muted-foreground">Active Sessions</div>
            <div className="text-xs text-green-600 flex items-center justify-center gap-1">
              <Activity className="h-3 w-3" />
              Online
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{new Date(profile.lastLogin).toLocaleDateString()}</div>
            <div className="text-xs text-muted-foreground">Last Login</div>
            <div className="text-xs text-green-600 flex items-center justify-center gap-1">
              <Clock className="h-3 w-3" />
              Recent
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
        <TabsList className="grid w-full max-w-2xl grid-cols-5">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Privacy
          </TabsTrigger>
          <TabsTrigger value="sessions" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Sessions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-slate-600" />
                    Personal Information
                  </CardTitle>
                  <CardDescription>Update your personal details and profile information</CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-6">
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Full Name
                        </Label>
                        <Input
                          id="name"
                          value={profile.name}
                          onChange={(e) => handleProfileChange("name", e.target.value)}
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          Email Address
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={profile.email}
                          onChange={(e) => handleProfileChange("email", e.target.value)}
                          placeholder="Enter your email"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          Phone Number
                        </Label>
                        <Input
                          id="phone"
                          value={profile.phone || ""}
                          onChange={(e) => handleProfileChange("phone", e.target.value)}
                          placeholder="Enter your phone number"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location" className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          Location
                        </Label>
                        <Input
                          id="location"
                          value={profile.location || ""}
                          onChange={(e) => handleProfileChange("location", e.target.value)}
                          placeholder="Enter your location"
                        />
                      </div>
                      <div className="space-y-2 sm:col-span-2">
                        <Label htmlFor="website" className="flex items-center gap-2">
                          <Link className="h-4 w-4" />
                          Website
                        </Label>
                        <Input
                          id="website"
                          value={profile.website || ""}
                          onChange={(e) => handleProfileChange("website", e.target.value)}
                          placeholder="https://your-website.com"
                        />
                      </div>
                      <div className="space-y-2 sm:col-span-2">
                        <Label htmlFor="bio" className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          Bio
                        </Label>
                        <Textarea
                          id="bio"
                          value={profile.bio || ""}
                          onChange={(e) => handleProfileChange("bio", e.target.value)}
                          placeholder="Tell us about yourself..."
                          rows={3}
                        />
                      </div>
                    </div>
                  </form>
                </CardContent>
                <CardHeader>
                  <Button onClick={handleSaveProfile} disabled={isLoading} className="w-full">
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </CardHeader>
              </Card>
            </div>
            
            {/* Profile Preview Panel */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5 text-blue-600" />
                    Profile Preview
                  </CardTitle>
                  <CardDescription>How your profile appears to others</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={profile.avatar} />
                        <AvatarFallback className="text-lg">
                          {profile.name.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-lg">{profile.name}</h3>
                        <p className="text-sm text-muted-foreground">{profile.role}</p>
                        <Badge variant="secondary" className="mt-1">
                          {profile.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </div>
                    {profile.bio && (
                      <p className="text-sm text-muted-foreground">{profile.bio}</p>
                    )}
                    <div className="space-y-2 text-sm">
                      {profile.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{profile.location}</span>
                        </div>
                      )}
                      {profile.website && (
                        <div className="flex items-center gap-2">
                          <Link className="h-4 w-4 text-muted-foreground" />
                          <a href={profile.website} className="text-blue-600 hover:underline">
                            {profile.website}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="h-5 w-5 text-green-600" />
                    Account Info
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span>Member since:</span>
                      <span className="font-medium">{new Date(profile.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Last login:</span>
                      <span className="font-medium">{new Date(profile.lastLogin).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Account status:</span>
                      <Badge variant={profile.isActive ? "default" : "secondary"}>
                        {profile.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Two-factor auth:</span>
                      <Badge variant={profile.twoFactorEnabled ? "default" : "secondary"}>
                        {profile.twoFactorEnabled ? "Enabled" : "Disabled"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5 text-red-600" />
                  Change Password
                </CardTitle>
                <CardDescription>Update your account password for better security</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword" className="flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      Current Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showPassword ? "text" : "password"}
                        value={passwordData.currentPassword}
                        onChange={(e) => handlePasswordChange("currentPassword", e.target.value)}
                        placeholder="Enter current password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword" className="flex items-center gap-2">
                      <Key className="h-4 w-4" />
                      New Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        value={passwordData.newPassword}
                        onChange={(e) => handlePasswordChange("newPassword", e.target.value)}
                        placeholder="Enter new password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Confirm New Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={passwordData.confirmPassword}
                        onChange={(e) => handlePasswordChange("confirmPassword", e.target.value)}
                        placeholder="Confirm new password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <Button onClick={handleChangePassword} disabled={isLoading} className="w-full">
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Changing Password...
                      </>
                    ) : (
                      <>
                        <Key className="mr-2 h-4 w-4" />
                        Change Password
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  Two-Factor Authentication
                </CardTitle>
                <CardDescription>Add an extra layer of security to your account</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Two-Factor Authentication</h4>
                      <p className="text-sm text-muted-foreground">
                        {profile.twoFactorEnabled 
                          ? "Your account is protected with 2FA" 
                          : "Add an extra layer of security to your account"
                        }
                      </p>
                    </div>
                    <Switch
                      checked={profile.twoFactorEnabled}
                      onCheckedChange={handleToggleTwoFactor}
                      disabled={isLoading}
                    />
                  </div>
                  
                  {profile.twoFactorEnabled ? (
                    <Alert className="border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/20">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-800 dark:text-green-200">
                        Two-factor authentication is enabled. Your account is protected with an additional security layer.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <Alert className="border-orange-200 bg-orange-50 dark:border-orange-900 dark:bg-orange-950/20">
                      <AlertTriangle className="h-4 w-4 text-orange-600" />
                      <AlertDescription className="text-orange-800 dark:text-orange-200">
                        Two-factor authentication is disabled. We recommend enabling it for better security.
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">Security Tips</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Use a strong, unique password</li>
                      <li>• Enable two-factor authentication</li>
                      <li>• Regularly review your login sessions</li>
                      <li>• Keep your recovery codes safe</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-blue-600" />
                Notification Preferences
              </CardTitle>
              <CardDescription>Choose how you want to be notified about different activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Email Notifications</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Email Notifications</div>
                        <div className="text-sm text-muted-foreground">Receive notifications via email</div>
                      </div>
                      <Switch
                        checked={notifications.emailNotifications}
                        onCheckedChange={(checked) => handleNotificationChange("emailNotifications", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Security Alerts</div>
                        <div className="text-sm text-muted-foreground">Important security-related notifications</div>
                      </div>
                      <Switch
                        checked={notifications.securityAlerts}
                        onCheckedChange={(checked) => handleNotificationChange("securityAlerts", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">System Updates</div>
                        <div className="text-sm text-muted-foreground">Updates about system maintenance and changes</div>
                      </div>
                      <Switch
                        checked={notifications.systemUpdates}
                        onCheckedChange={(checked) => handleNotificationChange("systemUpdates", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Marketing Emails</div>
                        <div className="text-sm text-muted-foreground">Promotional content and product updates</div>
                      </div>
                      <Switch
                        checked={notifications.marketingEmails}
                        onCheckedChange={(checked) => handleNotificationChange("marketingEmails", checked)}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Push Notifications</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Push Notifications</div>
                        <div className="text-sm text-muted-foreground">Receive push notifications in your browser</div>
                      </div>
                      <Switch
                        checked={notifications.pushNotifications}
                        onCheckedChange={(checked) => handleNotificationChange("pushNotifications", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Order Updates</div>
                        <div className="text-sm text-muted-foreground">Notifications about order status changes</div>
                      </div>
                      <Switch
                        checked={notifications.orderUpdates}
                        onCheckedChange={(checked) => handleNotificationChange("orderUpdates", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">New Messages</div>
                        <div className="text-sm text-muted-foreground">Notifications for new messages and comments</div>
                      </div>
                      <Switch
                        checked={notifications.newMessages}
                        onCheckedChange={(checked) => handleNotificationChange("newMessages", checked)}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">SMS Notifications</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">SMS Notifications</div>
                        <div className="text-sm text-muted-foreground">Receive notifications via SMS</div>
                      </div>
                      <Switch
                        checked={notifications.smsNotifications}
                        onCheckedChange={(checked) => handleNotificationChange("smsNotifications", checked)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-purple-600" />
                Privacy Settings
              </CardTitle>
              <CardDescription>Control your privacy and data sharing preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Profile Visibility</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Profile Visibility</div>
                        <div className="text-sm text-muted-foreground">Who can see your profile information</div>
                      </div>
                      <select
                        value={privacy.profileVisibility}
                        onChange={(e) => handlePrivacyChange("profileVisibility", e.target.value)}
                        className="p-2 border rounded-md bg-background"
                      >
                        <option value="public">Public</option>
                        <option value="private">Private</option>
                        <option value="friends">Friends Only</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Show Email</div>
                        <div className="text-sm text-muted-foreground">Display your email address on your profile</div>
                      </div>
                      <Switch
                        checked={privacy.showEmail}
                        onCheckedChange={(checked) => handlePrivacyChange("showEmail", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Show Phone</div>
                        <div className="text-sm text-muted-foreground">Display your phone number on your profile</div>
                      </div>
                      <Switch
                        checked={privacy.showPhone}
                        onCheckedChange={(checked) => handlePrivacyChange("showPhone", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Show Location</div>
                        <div className="text-sm text-muted-foreground">Display your location on your profile</div>
                      </div>
                      <Switch
                        checked={privacy.showLocation}
                        onCheckedChange={(checked) => handlePrivacyChange("showLocation", checked)}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Communication</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Allow Direct Messages</div>
                        <div className="text-sm text-muted-foreground">Let other users send you direct messages</div>
                      </div>
                      <Switch
                        checked={privacy.allowDirectMessages}
                        onCheckedChange={(checked) => handlePrivacyChange("allowDirectMessages", checked)}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Data & Analytics</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Data Sharing</div>
                        <div className="text-sm text-muted-foreground">Allow sharing of anonymized data for research</div>
                      </div>
                      <Switch
                        checked={privacy.dataSharing}
                        onCheckedChange={(checked) => handlePrivacyChange("dataSharing", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Analytics Tracking</div>
                        <div className="text-sm text-muted-foreground">Help improve our service with usage analytics</div>
                      </div>
                      <Switch
                        checked={privacy.analyticsTracking}
                        onCheckedChange={(checked) => handlePrivacyChange("analyticsTracking", checked)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sessions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-green-600" />
                Active Sessions
              </CardTitle>
              <CardDescription>Manage your active login sessions and devices</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loginSessions.map((session) => {
                  const DeviceIcon = getDeviceIcon(session.device)
                  return (
                    <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-lg bg-muted">
                          <DeviceIcon className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="font-medium">{session.device}</div>
                          <div className="text-sm text-muted-foreground">
                            {session.browser} • {session.location}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {session.ip} • {new Date(session.timestamp).toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {session.isCurrent && (
                          <Badge variant="default">Current</Badge>
                        )}
                        {!session.isCurrent && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleTerminateSession(session.id)}
                            disabled={isLoading}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
