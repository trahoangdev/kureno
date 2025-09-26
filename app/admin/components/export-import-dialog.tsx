"use client"

import React, { useState } from "react"
import { Download, Upload, FileDown, FileUp, AlertCircle, CheckCircle2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

interface ExportImportDialogProps {
  trigger?: React.ReactNode
  defaultTab?: "export" | "import"
  className?: string
}

const ENTITIES = [
  { value: "all", label: "All Data", description: "Export/Import all entities" },
  { value: "products", label: "Products", description: "Product catalog data" },
  { value: "categories", label: "Categories", description: "Product categories" },
  { value: "users", label: "Users", description: "User accounts" },
  { value: "blog", label: "Blog Posts", description: "Blog content" },
  { value: "orders", label: "Orders", description: "Customer orders" },
  { value: "comments", label: "Comments", description: "Blog comments" },
  { value: "notifications", label: "Notifications", description: "Admin notifications" },
]

const FORMATS = [
  { value: "json", label: "JSON", description: "Structured JSON format" },
  { value: "csv", label: "CSV", description: "Comma-separated values (single entity only)" },
]

const IMPORT_MODES = [
  { value: "create", label: "Create Only", description: "Only create new records" },
  { value: "upsert", label: "Create or Update", description: "Create new or update existing records" },
]

export default function ExportImportDialog({
  trigger,
  defaultTab = "export",
  className,
}: ExportImportDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState(defaultTab)
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  
  // Export state
  const [exportEntity, setExportEntity] = useState("all")
  const [exportFormat, setExportFormat] = useState("json")
  const [exportStartDate, setExportStartDate] = useState("")
  const [exportEndDate, setExportEndDate] = useState("")
  
  // Import state
  const [importEntity, setImportEntity] = useState("products")
  const [importMode, setImportMode] = useState("create")
  const [importFile, setImportFile] = useState<File | null>(null)
  const [importResult, setImportResult] = useState<any>(null)
  const [validateOnly, setValidateOnly] = useState(false)

  const { toast } = useToast()

  const handleExport = async () => {
    try {
      setIsLoading(true)
      setProgress(0)

      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90))
      }, 200)

      const params = new URLSearchParams({
        entity: exportEntity,
        format: exportFormat,
      })

      if (exportStartDate) params.append("startDate", exportStartDate)
      if (exportEndDate) params.append("endDate", exportEndDate)

      const response = await fetch(`/api/admin/export?${params}`)

      clearInterval(progressInterval)
      setProgress(100)

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Export failed")
      }

      // Get filename from response headers
      const contentDisposition = response.headers.get("content-disposition")
      const filename = contentDisposition
        ? contentDisposition.split("filename=")[1]?.replace(/"/g, "")
        : `kureno-${exportEntity}-export.${exportFormat}`

      // Download file
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)

      toast({
        title: "Export Successful",
        description: `${exportEntity} data exported successfully`,
      })

    } catch (error: any) {
      console.error("Export error:", error)
      toast({
        title: "Export Failed",
        description: error.message || "Failed to export data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setProgress(0)
    }
  }

  const handleImport = async () => {
    if (!importFile) {
      toast({
        title: "No File Selected",
        description: "Please select a file to import",
        variant: "destructive",
      })
      return
    }

    try {
      setIsLoading(true)
      setProgress(0)
      setImportResult(null)

      const formData = new FormData()
      formData.append("file", importFile)
      formData.append("entity", importEntity)
      formData.append("mode", importMode)
      formData.append("validateOnly", validateOnly.toString())

      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 5, 90))
      }, 500)

      const response = await fetch("/api/admin/import", {
        method: "POST",
        body: formData,
      })

      clearInterval(progressInterval)
      setProgress(100)

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Import failed")
      }

      setImportResult(result)

      toast({
        title: validateOnly ? "Validation Successful" : "Import Successful",
        description: validateOnly 
          ? `${result.summary.validRecords} records validated successfully`
          : `${result.summary.successCount} records imported successfully`,
      })

    } catch (error: any) {
      console.error("Import error:", error)
      setImportResult({
        success: false,
        error: error.message,
      })
      toast({
        title: "Import Failed",
        description: error.message || "Failed to import data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setProgress(0)
    }
  }

  const resetImport = () => {
    setImportFile(null)
    setImportResult(null)
    setValidateOnly(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className={cn("gap-2", className)}>
            <Download className="h-4 w-4" />
            Export/Import
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileDown className="h-5 w-5" />
            Data Export & Import
          </DialogTitle>
          <DialogDescription>
            Export data for backup or import data to populate your admin panel
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="export" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </TabsTrigger>
            <TabsTrigger value="import" className="gap-2">
              <Upload className="h-4 w-4" />
              Import
            </TabsTrigger>
          </TabsList>

          {/* Export Tab */}
          <TabsContent value="export" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="export-entity">Data to Export</Label>
                <Select value={exportEntity} onValueChange={setExportEntity}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select entity" />
                  </SelectTrigger>
                  <SelectContent>
                    {ENTITIES.map((entity) => (
                      <SelectItem key={entity.value} value={entity.value}>
                        <div>
                          <div className="font-medium">{entity.label}</div>
                          <div className="text-xs text-muted-foreground">{entity.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="export-format">Format</Label>
                <Select 
                  value={exportFormat} 
                  onValueChange={setExportFormat}
                  disabled={exportEntity === "all"} // CSV not supported for all entities
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    {FORMATS.map((format) => (
                      <SelectItem 
                        key={format.value} 
                        value={format.value}
                        disabled={format.value === "csv" && exportEntity === "all"}
                      >
                        <div>
                          <div className="font-medium">{format.label}</div>
                          <div className="text-xs text-muted-foreground">{format.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start-date">Start Date (Optional)</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={exportStartDate}
                  onChange={(e) => setExportStartDate(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="end-date">End Date (Optional)</Label>
                <Input
                  id="end-date"
                  type="date"
                  value={exportEndDate}
                  onChange={(e) => setExportEndDate(e.target.value)}
                />
              </div>
            </div>

            {isLoading && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Exporting data...</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleExport} disabled={isLoading} className="gap-2">
                <FileDown className="h-4 w-4" />
                {isLoading ? "Exporting..." : "Export Data"}
              </Button>
            </DialogFooter>
          </TabsContent>

          {/* Import Tab */}
          <TabsContent value="import" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="import-entity">Data Type</Label>
                <Select value={importEntity} onValueChange={setImportEntity}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select entity" />
                  </SelectTrigger>
                  <SelectContent>
                    {ENTITIES.filter(e => e.value !== "all").map((entity) => (
                      <SelectItem key={entity.value} value={entity.value}>
                        <div>
                          <div className="font-medium">{entity.label}</div>
                          <div className="text-xs text-muted-foreground">{entity.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Import Mode</Label>
                <RadioGroup value={importMode} onValueChange={setImportMode}>
                  {IMPORT_MODES.map((mode) => (
                    <div key={mode.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={mode.value} id={mode.value} />
                      <Label htmlFor={mode.value} className="cursor-pointer">
                        <div>
                          <div className="font-medium">{mode.label}</div>
                          <div className="text-xs text-muted-foreground">{mode.description}</div>
                        </div>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="import-file">Select File</Label>
                <Input
                  id="import-file"
                  type="file"
                  accept=".json,.csv"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    setImportFile(file || null)
                    setImportResult(null)
                  }}
                />
                <p className="text-xs text-muted-foreground">
                  Supported formats: JSON, CSV. Max file size: 10MB
                </p>
              </div>

              {importFile && (
                <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                  <FileUp className="h-4 w-4" />
                  <span className="text-sm font-medium">{importFile.name}</span>
                  <Badge variant="secondary">
                    {(importFile.size / 1024 / 1024).toFixed(2)} MB
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetImport}
                    className="ml-auto"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="validate-only"
                  checked={validateOnly}
                  onChange={(e) => setValidateOnly(e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor="validate-only" className="cursor-pointer">
                  Validate only (don't import data)
                </Label>
              </div>
            </div>

            {isLoading && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>{validateOnly ? "Validating..." : "Importing data..."}</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}

            {importResult && (
              <div className={cn(
                "p-4 rounded-lg border",
                importResult.success 
                  ? "bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800"
                  : "bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800"
              )}>
                <div className="flex items-center gap-2 mb-2">
                  {importResult.success ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  )}
                  <h4 className="font-medium">
                    {importResult.success ? "Success" : "Error"}
                  </h4>
                </div>
                
                {importResult.success && importResult.summary && (
                  <div className="text-sm space-y-1">
                    <p>Total Records: {importResult.summary.totalRecords}</p>
                    <p>Successful: {importResult.summary.successCount}</p>
                    {importResult.summary.errorCount > 0 && (
                      <p>Errors: {importResult.summary.errorCount}</p>
                    )}
                  </div>
                )}
                
                {importResult.error && (
                  <p className="text-sm text-red-600">{importResult.error}</p>
                )}
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleImport} 
                disabled={isLoading || !importFile}
                className="gap-2"
              >
                <FileUp className="h-4 w-4" />
                {isLoading 
                  ? (validateOnly ? "Validating..." : "Importing...") 
                  : (validateOnly ? "Validate Data" : "Import Data")
                }
              </Button>
            </DialogFooter>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
