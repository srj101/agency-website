"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { DataTable } from "../components/data-table"
import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Edit, Eye, Trash } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { deleteBlogPost } from "./actions"
import { getBlogPosts, type BlogPost } from "./blog-actions"

export default function AdminBlogPostsPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadPosts() {
      try {
        const data = await getBlogPosts()
        setPosts(data)
      } catch (error) {
        console.error("Failed to load blog posts:", error)
      } finally {
        setLoading(false)
      }
    }

    loadPosts()
  }, [])

  const columns: ColumnDef<BlogPost>[] = [
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
      accessorKey: "profiles.full_name",
      header: "Author",
      cell: ({ row }) => row.original.profiles?.full_name || "Anonymous",
    },
    {
      accessorKey: "published",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={row.original.published ? "default" : "secondary"}>
          {row.original.published ? "Published" : "Draft"}
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
            <Link href={`/blog/${row.original.slug}`} target="_blank">
              <Eye className="h-4 w-4" />
              <span className="sr-only">View</span>
            </Link>
          </Button>
          <Button asChild size="icon" variant="ghost">
            <Link href={`/admin/blog/${row.original.id}`}>
              <Edit className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Link>
          </Button>
          <form action={deleteBlogPost}>
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
          <h1 className="text-3xl font-bold tracking-tight">Blog Posts</h1>
          <p className="text-muted-foreground">Manage your blog posts.</p>
        </div>
        <Button asChild>
          <Link href="/admin/blog/new">New Post</Link>
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      ) : (
        <DataTable columns={columns} data={posts} />
      )}
    </div>
  )
}
