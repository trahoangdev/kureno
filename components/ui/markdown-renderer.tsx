"use client"

import ReactMarkdown from "react-markdown"

interface MarkdownRendererProps {
  content: string
  className?: string
}

export default function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
  return (
    <div className={`prose prose-sm max-w-none dark:prose-invert ${className}`}>
      <ReactMarkdown
        components={{
          h1: ({ children }) => <h1 className="text-xl font-bold mb-2 text-foreground">{children}</h1>,
          h2: ({ children }) => <h2 className="text-lg font-semibold mb-2 text-foreground">{children}</h2>,
          h3: ({ children }) => <h3 className="text-base font-medium mb-1 text-foreground">{children}</h3>,
          h4: ({ children }) => <h4 className="text-sm font-medium mb-1 text-foreground">{children}</h4>,
          h5: ({ children }) => <h5 className="text-sm font-medium mb-1 text-foreground">{children}</h5>,
          h6: ({ children }) => <h6 className="text-xs font-medium mb-1 text-foreground">{children}</h6>,
          p: ({ children }) => <p className="mb-2 text-muted-foreground leading-relaxed">{children}</p>,
          ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1 text-muted-foreground">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1 text-muted-foreground">{children}</ol>,
          li: ({ children }) => <li className="text-sm">{children}</li>,
          strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
          em: ({ children }) => <em className="italic text-foreground">{children}</em>,
          code: ({ children }) => (
            <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono text-foreground">
              {children}
            </code>
          ),
          pre: ({ children }) => (
            <pre className="bg-muted p-3 rounded-md overflow-x-auto text-sm font-mono text-foreground">
              {children}
            </pre>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-muted-foreground pl-4 italic text-muted-foreground">
              {children}
            </blockquote>
          ),
          a: ({ children, href }) => (
            <a 
              href={href} 
              className="text-primary hover:text-primary/80 underline underline-offset-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
          hr: () => <hr className="border-muted-foreground my-4" />,
          table: ({ children }) => (
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse border border-muted-foreground">
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border border-muted-foreground px-3 py-2 bg-muted text-left font-medium text-foreground">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-muted-foreground px-3 py-2 text-muted-foreground">
              {children}
            </td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
