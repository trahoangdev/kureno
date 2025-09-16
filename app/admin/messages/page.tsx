"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, MoreHorizontal, Eye, Trash, CheckCircle, Download, CheckSquare, XSquare } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface MessageItem {
  _id: string
  firstName: string
  lastName: string
  email: string
  subject: string
  message: string
  read: boolean
  createdAt: string
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<MessageItem[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [viewItem, setViewItem] = useState<MessageItem | null>(null)
  const [statusFilter, setStatusFilter] = useState("all")
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [total, setTotal] = useState(0)
  const [selected, setSelected] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const params = new URLSearchParams({ page: String(page), limit: String(limit) })
      if (search) params.set("q", search)
      if (statusFilter !== "all") params.set("status", statusFilter)
      const res = await fetch(`/api/admin/messages?${params.toString()}`)
      const data = await res.json()
      setMessages(data.messages)
      setTotal(data.pagination?.total || 0)
      setLoading(false)
    }
    fetchData()
  }, [page, limit, search, statusFilter])

  const filtered = useMemo(() => {
    if (!search) return messages
    return messages.filter((m) =>
      [m.firstName, m.lastName, m.email, m.subject].some((v) => v?.toLowerCase().includes(search.toLowerCase())),
    )
  }, [messages, search])

  const markRead = async (id: string, read: boolean) => {
    const res = await fetch("/api/admin/messages", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, read }),
    })
    if (res.ok) setMessages((prev) => prev.map((m) => (m._id === id ? { ...m, read } : m)))
  }

  const remove = async (id: string) => {
    if (!confirm("Delete this message?")) return
    const res = await fetch(`/api/admin/messages?id=${id}`, { method: "DELETE" })
    if (res.ok) setMessages((prev) => prev.filter((m) => m._id !== id))
  }

  const selectedIds = Object.entries(selected).filter(([, v]) => v).map(([k]) => k)
  const toggleSelect = (id: string, value: boolean) => setSelected((p) => ({ ...p, [id]: value }))
  const selectPage = (value: boolean) => {
    const ids = messages.map((m) => m._id)
    setSelected((p) => {
      const copy = { ...p }
      ids.forEach((id) => (copy[id] = value))
      return copy
    })
  }
  const bulkMark = async (read: boolean) => {
    await Promise.all(selectedIds.map((id) => markRead(id, read)))
    setSelected({})
  }
  const bulkDelete = async () => {
    if (!selectedIds.length) return
    if (!confirm(`Delete ${selectedIds.length} messages?`)) return
    const res = await fetch(`/api/admin/messages?ids=${selectedIds.join(",")}`, { method: "DELETE" })
    if (res.ok) {
      setMessages((prev) => prev.filter((m) => !selectedIds.includes(m._id)))
      setSelected({})
    }
  }
  const exportCsv = () => {
    const rows = [["Name", "Email", "Subject", "Date", "Read"], ...messages.map((m) => [
      `${m.firstName} ${m.lastName}`.trim(), m.email, m.subject, new Date(m.createdAt).toISOString(), String(m.read),
    ])]
    const csv = rows.map((r) => r.map((f) => `"${String(f).replace(/"/g, '""')}"`).join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `messages_page_${page}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Contact Messages</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Message Management</CardTitle>
          <CardDescription>View and manage messages from your contact form.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search messages..."
                className="w-full pl-8"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]"><SelectValue placeholder="Filter" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="read">Read</SelectItem>
                  <SelectItem value="unread">Unread</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={() => selectPage(true)}>
                <CheckSquare className="mr-2 h-4 w-4" /> Select page
              </Button>
              <Button variant="outline" size="sm" onClick={() => setSelected({})}>
                <XSquare className="mr-2 h-4 w-4" /> Clear
              </Button>
              <Button variant="outline" size="sm" onClick={exportCsv}>
                <Download className="mr-2 h-4 w-4" /> CSV
              </Button>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead></TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                      No messages found
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((m) => (
                    <TableRow key={m._id}>
                      <TableCell>
                        <input type="checkbox" checked={!!selected[m._id]} onChange={(e) => toggleSelect(m._id, e.target.checked)} />
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{m.firstName} {m.lastName}</div>
                      </TableCell>
                      <TableCell>{m.email}</TableCell>
                      <TableCell>
                        <div className="max-w-[250px] truncate">{m.subject}</div>
                      </TableCell>
                      <TableCell>{new Date(m.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge variant={m.read ? "default" : "outline"} className={m.read ? "bg-green-500" : ""}>
                          {m.read ? "Read" : "Unread"}
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
                            <DropdownMenuItem onClick={() => setViewItem(m)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => markRead(m._id, !m.read)}>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Mark as {m.read ? "Unread" : "Read"}
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => remove(m._id)}>
                              <Trash className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {selectedIds.length > 0 && (
            <div className="sticky bottom-4 z-10 mt-4 flex items-center justify-between rounded-md border bg-background p-3 shadow-sm">
              <div className="text-sm text-muted-foreground">Selected: {selectedIds.length}</div>
              <div className="flex items-center gap-2">
                <Button size="sm" onClick={() => bulkMark(true)}>Mark Read</Button>
                <Button size="sm" onClick={() => bulkMark(false)}>Mark Unread</Button>
                <Button variant="destructive" size="sm" onClick={bulkDelete}>Delete</Button>
              </div>
            </div>
          )}

          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">Showing {(page - 1) * limit + 1}–{Math.min(page * limit, total || messages.length)} of {total || messages.length}</div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Previous</Button>
              <Button variant="outline" size="sm" disabled={total ? page * limit >= total : messages.length < limit} onClick={() => setPage((p) => p + 1)}>Next</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!viewItem} onOpenChange={(o) => !o && setViewItem(null)}>
        <DialogContent className="max-w-xl">
          {viewItem && (
            <>
              <DialogHeader>
                <DialogTitle>{viewItem.subject}</DialogTitle>
                <DialogDescription>
                  From {viewItem.firstName} {viewItem.lastName} • {viewItem.email}
                </DialogDescription>
              </DialogHeader>
              <div className="whitespace-pre-wrap text-sm leading-6 text-muted-foreground">{viewItem.message}</div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
