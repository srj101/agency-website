"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { DataTable } from "../components/data-table"
import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Edit, Eye, Trash } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { deleteService } from "./actions"
import { getServices, type Service } from "./services-actions"

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadServices() {
      try {
        const data = await getServices()
        setServices(data)
      } catch (error) {
        console.error("Failed to load services:", error)
      } finally {
        setLoading(false)
      }
    }

    loadServices()
  }, [])

  const columns: ColumnDef<Service>[] = [
    {
      accessorKey: "title",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "featured",
      header: "Featured",
      cell: ({ row }) => (
        <Badge variant={row.original.featured ? "default" : "secondary"}>
          {row.original.featured ? "Featured" : "Not Featured"}
        </Badge>
      ),
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
          <Button asChild size="icon" variant="ghost">
            <Link href={`/services/${row.original.slug}`} target="_blank">
              <Eye className="h-4 w-4" />
              <span className="sr-only">View</span>
            </Link>
          </Button>
          <Button asChild size="icon" variant="ghost">
            <Link href={`/admin/services/${row.original.id}`}>
              <Edit className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Link>
          </Button>
          <form action={deleteService}>
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Services</h1>
          <p className="text-muted-foreground">Manage your services.</p>
        </div>
        <Button asChild>
          <Link href="/admin/services/new">New Service</Link>
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      ) : (
        <DataTable columns={columns} data={services} />
      )}
    </div>
  )
}
