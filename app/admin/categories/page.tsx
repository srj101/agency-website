"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { DataTable } from "../components/data-table"
import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Edit, Trash } from "lucide-react"
import { deleteCategory } from "./actions"
import { getCategories, type Category } from "./categories-actions"

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await getCategories()
        setCategories(data)
      } catch (error) {
        console.error("Failed to load categories:", error)
      } finally {
        setLoading(false)
      }
    }

    loadCategories()
  }, [])

  const columns: ColumnDef<Category>[] = [
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
      accessorKey: "slug",
      header: "Slug",
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
            <Link href={`/admin/categories/${row.original.id}`}>
              <Edit className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Link>
          </Button>
          <form action={deleteCategory}>
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
          <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
          <p className="text-muted-foreground">Manage your blog categories.</p>
        </div>
        <Button asChild>
          <Link href="/admin/categories/new">New Category</Link>
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-pulse text-muted-foreground">Loading categories...</div>
        </div>
      ) : (
        <DataTable columns={columns} data={categories} searchKey="name" />
      )}
    </div>
  )
}
