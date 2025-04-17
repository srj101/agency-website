import { BlogForm } from "../blog-form"
import { createServerSupabaseClient } from "@/lib/supabase"
import { notFound } from "next/navigation"

export const metadata = {
  title: "Edit Blog Post | Admin Panel",
  description: "Edit an existing blog post.",
}

async function getBlogPost(id: string) {
  const supabase = createServerSupabaseClient()

  const { data } = await supabase.from("blog_posts").select("*").eq("id", id).single()

  return data
}

async function getCategories() {
  const supabase = createServerSupabaseClient()

  const { data } = await supabase.from("categories").select("*").order("name", { ascending: true })

  return data || []
}

async function getPostCategories(postId: string) {
  const supabase = createServerSupabaseClient()

  const { data } = await supabase.from("blog_posts_categories").select("category_id").eq("post_id", postId)

  return data?.map((item) => item.category_id) || []
}

export default async function EditBlogPostPage({ params }: { params: { id: string } }) {
  const post = await getBlogPost(params.id)

  if (!post) {
    notFound()
  }

  const categories = await getCategories()
  const postCategories = await getPostCategories(params.id)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Blog Post</h1>
        <p className="text-muted-foreground">Edit an existing blog post.</p>
      </div>

      <BlogForm post={post} categories={categories} postCategories={postCategories} />
    </div>
  )
}
