"use server"

import { createServerSupabaseClient } from "@/lib/supabase"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function deleteCategory(formData: FormData) {
  const id = formData.get("id") as string

  if (!id) {
    throw new Error("Category ID is required")
  }

  const supabase = createServerSupabaseClient()

  // First, check if the category is used in any posts
  const { data: usedInPosts } = await supabase.from("blog_posts_categories").select("post_id").eq("category_id", id)

  if (usedInPosts && usedInPosts.length > 0) {
    throw new Error("Cannot delete category that is used in blog posts")
  }

  const { error } = await supabase.from("categories").delete().eq("id", id)

  if (error) {
    throw new Error("Failed to delete category")
  }

  revalidatePath("/admin/categories")
  revalidatePath("/blog")
}

export async function saveCategory(formData: FormData) {
  const id = formData.get("id") as string
  const name = formData.get("name") as string
  const slug = formData.get("slug") as string

  if (!name || !slug) {
    throw new Error("Name and slug are required")
  }

  const supabase = createServerSupabaseClient()

  // Check if slug is unique (except for the current category)
  const { data: existingCategory } = await supabase
    .from("categories")
    .select("id")
    .eq("slug", slug)
    .neq("id", id || "")
    .single()

  if (existingCategory) {
    throw new Error("A category with this slug already exists")
  }

  if (id) {
    // Update existing category
    const { error } = await supabase
      .from("categories")
      .update({
        name,
        slug,
      })
      .eq("id", id)

    if (error) {
      throw new Error("Failed to update category")
    }
  } else {
    // Create new category
    const { error } = await supabase.from("categories").insert({
      name,
      slug,
    })

    if (error) {
      throw new Error("Failed to create category")
    }
  }

  revalidatePath("/admin/categories")
  revalidatePath("/blog")

  redirect("/admin/categories")
}
