"use server"

import { createServerSupabaseClient } from "@/lib/supabase"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function deleteBlogPost(formData: FormData) {
  const id = formData.get("id") as string

  if (!id) {
    throw new Error("Post ID is required")
  }

  const supabase = createServerSupabaseClient()

  // Delete post categories first
  await supabase.from("blog_posts_categories").delete().eq("post_id", id)

  // Then delete the post
  const { error } = await supabase.from("blog_posts").delete().eq("id", id)

  if (error) {
    throw new Error("Failed to delete post")
  }

  revalidatePath("/admin/blog")
  revalidatePath("/blog")
}

export async function saveBlogPost(formData: FormData) {
  const id = formData.get("id") as string
  const title = formData.get("title") as string
  const slug = formData.get("slug") as string
  const excerpt = formData.get("excerpt") as string
  const content = formData.get("content") as string
  const featuredImage = formData.get("featuredImage") as string
  const published = formData.get("published") === "true"
  const categoryIds = formData.getAll("categories") as string[]

  if (!title || !slug || !content) {
    throw new Error("Title, slug, and content are required")
  }

  const supabase = createServerSupabaseClient()

  // Get current user
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    throw new Error("You must be logged in to save a post")
  }

  const authorId = session.user.id

  // Check if slug is unique (except for the current post)
  const { data: existingPost } = await supabase
    .from("blog_posts")
    .select("id")
    .eq("slug", slug)
    .neq("id", id || "")
    .single()

  if (existingPost) {
    throw new Error("A post with this slug already exists")
  }

  let postId = id

  if (id) {
    // Update existing post
    const { error, data } = await supabase
      .from("blog_posts")
      .update({
        title,
        slug,
        excerpt,
        content,
        featured_image: featuredImage,
        published,
        published_at: published ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select("id")
      .single()

    if (error) {
      throw new Error("Failed to update post")
    }

    postId = data.id
  } else {
    // Create new post
    const { error, data } = await supabase
      .from("blog_posts")
      .insert({
        title,
        slug,
        excerpt,
        content,
        featured_image: featuredImage,
        author_id: authorId,
        published,
        published_at: published ? new Date().toISOString() : null,
      })
      .select("id")
      .single()

    if (error) {
      throw new Error("Failed to create post")
    }

    postId = data.id
  }

  // Update categories
  if (postId) {
    // First, delete all existing categories for this post
    await supabase.from("blog_posts_categories").delete().eq("post_id", postId)

    // Then, add the new categories
    if (categoryIds.length > 0) {
      const categoryRelations = categoryIds.map((categoryId) => ({
        post_id: postId,
        category_id: categoryId,
      }))

      await supabase.from("blog_posts_categories").insert(categoryRelations)
    }
  }

  revalidatePath("/admin/blog")
  revalidatePath("/blog")
  revalidatePath(`/blog/${slug}`)

  redirect("/admin/blog")
}
