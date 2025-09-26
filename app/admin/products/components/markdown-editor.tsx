"use client"

import React, { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Link, 
  Image, 
  Quote, 
  Code, 
  Heading1, 
  Heading2, 
  Heading3,
  Eye,
  Edit,
  Type,
  Minus,
  CheckSquare,
  Table,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo,
  Redo,
  Copy,
  Scissors,
  FileText
} from "lucide-react"
import { cn } from "@/lib/utils"

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  minHeight?: string
}

interface ToolbarButtonProps {
  icon: React.ComponentType<{ className?: string }>
  tooltip: string
  onClick: () => void
  isActive?: boolean
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({ icon: Icon, tooltip, onClick, isActive }) => (
  <Button
    type="button"
    variant={isActive ? "default" : "ghost"}
    size="sm"
    onClick={onClick}
    title={tooltip}
    className={cn(
      "h-8 w-8 p-0 hover:bg-slate-100 dark:hover:bg-slate-800",
      isActive && "bg-slate-200 dark:bg-slate-700"
    )}
  >
    <Icon className="h-4 w-4" />
  </Button>
)

export default function MarkdownEditor({ 
  value, 
  onChange, 
  placeholder = "Enter product description...",
  className,
  minHeight = "300px"
}: MarkdownEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write")

  const insertText = useCallback((before: string, after: string = "", placeholder: string = "") => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = value.substring(start, end)
    const textToInsert = selectedText || placeholder
    const newText = value.substring(0, start) + before + textToInsert + after + value.substring(end)
    
    onChange(newText)
    
    // Set cursor position after insertion
    setTimeout(() => {
      textarea.focus()
      const newCursorPos = start + before.length + textToInsert.length + after.length
      textarea.setSelectionRange(newCursorPos, newCursorPos)
    }, 0)
  }, [value, onChange])

  const insertAtCursor = useCallback((text: string) => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const newText = value.substring(0, start) + text + value.substring(end)
    
    onChange(newText)
    
    setTimeout(() => {
      textarea.focus()
      const newCursorPos = start + text.length
      textarea.setSelectionRange(newCursorPos, newCursorPos)
    }, 0)
  }, [value, onChange])

  const wrapSelection = useCallback((wrapper: string) => {
    insertText(wrapper, wrapper, "text")
  }, [insertText])

  const insertLine = useCallback((prefix: string) => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const beforeCursor = value.substring(0, start)
    const afterCursor = value.substring(start)
    
    // Find the start of the current line
    const lastNewline = beforeCursor.lastIndexOf('\n')
    const lineStart = lastNewline === -1 ? 0 : lastNewline + 1
    
    const newText = beforeCursor.substring(0, lineStart) + prefix + beforeCursor.substring(lineStart) + afterCursor
    onChange(newText)
    
    setTimeout(() => {
      textarea.focus()
      const newCursorPos = start + prefix.length
      textarea.setSelectionRange(newCursorPos, newCursorPos)
    }, 0)
  }, [value, onChange])

  // Markdown toolbar actions
  const actions = {
    bold: () => wrapSelection("**"),
    italic: () => wrapSelection("*"),
    underline: () => insertText("<u>", "</u>", "text"),
    heading1: () => insertLine("# "),
    heading2: () => insertLine("## "),
    heading3: () => insertLine("### "),
    unorderedList: () => insertLine("- "),
    orderedList: () => insertLine("1. "),
    link: () => insertText("[", "](https://example.com)", "link text"),
    image: () => insertText("![", "](https://example.com/image.jpg)", "alt text"),
    quote: () => insertLine("> "),
    code: () => wrapSelection("`"),
    codeBlock: () => insertText("```\n", "\n```", "code"),
    horizontalRule: () => insertAtCursor("\n---\n"),
    table: () => insertAtCursor("\n| Column 1 | Column 2 | Column 3 |\n|----------|----------|----------|\n| Cell 1   | Cell 2   | Cell 3   |\n"),
    checkbox: () => insertLine("- [ ] "),
  }

  // Convert markdown to HTML for preview (basic implementation)
  const renderMarkdown = (text: string): string => {
    return text
      // Headers
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mt-6 mb-3">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-8 mb-4">$1</h1>')
      // Bold and Italic
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      // Underline
      .replace(/<u>(.*?)<\/u>/g, '<u class="underline">$1</u>')
      // Code
      .replace(/`([^`]+)`/g, '<code class="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-sm font-mono">$1</code>')
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">$1</a>')
      // Images
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto rounded-lg shadow-sm my-2" />')
      // Lists
      .replace(/^\- (.*$)/gim, '<li class="ml-4">• $1</li>')
      .replace(/^1\. (.*$)/gim, '<li class="ml-4">1. $1</li>')
      // Blockquotes
      .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-slate-300 pl-4 italic text-slate-600 dark:text-slate-400 my-2">$1</blockquote>')
      // Horizontal rules
      .replace(/^---$/gim, '<hr class="border-t border-slate-300 my-6" />')
      // Line breaks
      .replace(/\n/g, '<br />')
  }

  return (
    <div className={cn("space-y-3", className)}>
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "write" | "preview")}>
        <div className="flex items-center justify-between">
          <TabsList className="grid w-fit grid-cols-2">
            <TabsTrigger value="write" className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              Write
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Preview
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <FileText className="h-3 w-3" />
            <span>{value.length} characters</span>
          </div>
        </div>

        <TabsContent value="write" className="mt-3 space-y-3">
          {/* Markdown Toolbar */}
          <Card>
            <CardContent className="p-3">
              <div className="flex flex-wrap items-center gap-1">
                {/* Text Formatting */}
                <div className="flex items-center gap-1">
                  <ToolbarButton icon={Bold} tooltip="Bold (**text**)" onClick={actions.bold} />
                  <ToolbarButton icon={Italic} tooltip="Italic (*text*)" onClick={actions.italic} />
                  <ToolbarButton icon={Underline} tooltip="Underline" onClick={actions.underline} />
                </div>

                <Separator orientation="vertical" className="h-6 mx-1" />

                {/* Headers */}
                <div className="flex items-center gap-1">
                  <ToolbarButton icon={Heading1} tooltip="Header 1 (# text)" onClick={actions.heading1} />
                  <ToolbarButton icon={Heading2} tooltip="Header 2 (## text)" onClick={actions.heading2} />
                  <ToolbarButton icon={Heading3} tooltip="Header 3 (### text)" onClick={actions.heading3} />
                </div>

                <Separator orientation="vertical" className="h-6 mx-1" />

                {/* Lists */}
                <div className="flex items-center gap-1">
                  <ToolbarButton icon={List} tooltip="Bullet List (- item)" onClick={actions.unorderedList} />
                  <ToolbarButton icon={ListOrdered} tooltip="Numbered List (1. item)" onClick={actions.orderedList} />
                  <ToolbarButton icon={CheckSquare} tooltip="Checkbox (- [ ] item)" onClick={actions.checkbox} />
                </div>

                <Separator orientation="vertical" className="h-6 mx-1" />

                {/* Links and Media */}
                <div className="flex items-center gap-1">
                  <ToolbarButton icon={Link} tooltip="Link ([text](url))" onClick={actions.link} />
                  <ToolbarButton icon={Image} tooltip="Image (![alt](url))" onClick={actions.image} />
                </div>

                <Separator orientation="vertical" className="h-6 mx-1" />

                {/* Code and Quotes */}
                <div className="flex items-center gap-1">
                  <ToolbarButton icon={Code} tooltip="Inline Code (`code`)" onClick={actions.code} />
                  <ToolbarButton icon={Quote} tooltip="Quote (> text)" onClick={actions.quote} />
                  <ToolbarButton icon={Table} tooltip="Table" onClick={actions.table} />
                </div>

                <Separator orientation="vertical" className="h-6 mx-1" />

                {/* Misc */}
                <div className="flex items-center gap-1">
                  <ToolbarButton icon={Minus} tooltip="Horizontal Rule (---)" onClick={actions.horizontalRule} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Text Editor */}
          <Textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={cn(
              "font-mono text-sm resize-none bg-white/50 dark:bg-slate-800/50 border-slate-200 focus:border-teal-500 focus:ring-teal-500/20",
              className
            )}
            style={{ minHeight }}
          />

          {/* Quick Help */}
          <Card className="bg-slate-50 dark:bg-slate-900/50">
            <CardContent className="p-3">
              <div className="text-xs text-muted-foreground space-y-1">
                <div className="font-medium mb-2">Markdown Quick Reference:</div>
                <div className="grid grid-cols-2 gap-x-6 gap-y-1">
                  <span><code>**bold**</code> → <strong>bold</strong></span>
                  <span><code>*italic*</code> → <em>italic</em></span>
                  <span><code># Header 1</code> → Large header</span>
                  <span><code>## Header 2</code> → Medium header</span>
                  <span><code>- List item</code> → • List item</span>
                  <span><code>1. Numbered</code> → 1. Numbered</span>
                  <span><code>[link](url)</code> → Clickable link</span>
                  <span><code>`code`</code> → Inline code</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="mt-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Eye className="h-4 w-4" />
                Preview
              </CardTitle>
            </CardHeader>
            <CardContent 
              className="prose prose-sm max-w-none dark:prose-invert p-6 bg-white dark:bg-slate-900 rounded-lg border min-h-[300px]"
              style={{ minHeight }}
            >
              {value.trim() ? (
                <div 
                  dangerouslySetInnerHTML={{ 
                    __html: renderMarkdown(value) 
                  }} 
                />
              ) : (
                <div className="text-muted-foreground italic flex items-center justify-center h-full">
                  No content to preview. Start writing in the Write tab.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
