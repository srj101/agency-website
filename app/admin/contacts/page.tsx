"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { DataTable } from "../components/data-table"
import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Eye, Trash } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { deleteContact, updateContactStatus } from "./actions"
import { getContacts, type Contact } from "./contacts-actions"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadContacts() {
      try {
        const data = await getContacts()
        setContacts(data)
      } catch (error) {
        console.error("Failed to load contacts:", error)
      } finally {
        setLoading(false)
      }
    }

    loadContacts()
  }, [])

  const columns: ColumnDef<Contact>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status
        return (
          <form action={updateContactStatus}>
            <input type="hidden" name="id" value={row.original.id} />
            <select
              name="status"
              defaultValue={status}
              onChange={(e) => e.target.form?.requestSubmit()}
              className="rounded-md border border-input bg-background px-3 py-1 text-sm"
            >
              <option value="new">New</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </form>
        )
      },
    },
    {
      accessorKey: "created_at",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Created
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => new Date(row.original.created_at).toLocaleDateString(),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button size="icon" variant="ghost">
                <Eye className="h-4 w-4" />
                <span className="sr-only">View</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Contact Submission</DialogTitle>
                <DialogDescription>Submitted on {new Date(row.original.created_at).toLocaleString()}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-4 gap-4">
                  <div className="font-medium">Name</div>
                  <div className="col-span-3">{row.original.name}</div>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  <div className="font-medium">Email</div>
                  <div className="col-span-3">{row.original.email}</div>
                </div>
                {row.original.phone && (
                  <div className="grid grid-cols-4 gap-4">
                    <div className="font-medium">Phone</div>
                    <div className="col-span-3">{row.original.phone}</div>
                  </div>
                )}
                <div className="grid grid-cols-4 gap-4">
                  <div className="font-medium">Status</div>
                  <div className="col-span-3">
                    <Badge
                      variant={
                        row.original.status === "new"
                          ? "default"
                          : row.original.status === "in-progress"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {row.original.status}
                    </Badge>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  <div className="font-medium">Message</div>
                  <div className="col-span-3 whitespace-pre-wrap">{row.original.message}</div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <form action={deleteContact}>
            <input type="hidden" name="id" value={row.original.id} />
            <Button size="icon" variant="ghost" type="submit">
              <Trash className="h-4 w-4" />
              <span className="sr-only">Delete</span>
            </Button>
          </form>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Contact Submissions</h1>
        <p className="text-muted-foreground">Manage contact form submissions.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <span className="ml-2">Loading contacts...</span>
        </div>
      ) : (
        <DataTable columns={columns} data={contacts} searchKey="name" />
      )}
    </div>
  )
}
