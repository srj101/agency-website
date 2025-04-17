import { BlogForm } from "../blog-form"
import { createServerSupabaseClient } from "@/lib/supabase"

export const metadata = {
  title: "New Blog Post | Admin Panel",
  description: "Create a new blog post.",
}

async function getCategories() {
  const supabase = createServerSupabaseClient()

  const { data } = await supabase.from("categories").select("*").order("name", { ascending: true })

  return data || []
}

export default async function NewBlogPostPage() {
  const categories = await getCategories()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">New Blog Post</h1>
        <p className="text-muted-foreground">Create a new blog post.</p>
      </div>

      <BlogForm categories={categories} postCategories={[]} />
    </div>
  )
}
