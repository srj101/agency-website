"use server"

import { createServerSupabaseClient } from "@/lib/supabase"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function deleteService(formData: FormData) {
  const id = formData.get("id") as string

  if (!id) {
    throw new Error("Service ID is required")
  }

  const supabase = createServerSupabaseClient()

  const { error } = await supabase.from("services").delete().eq("id", id)

  if (error) {
    throw new Error("Failed to delete service")
  }

  revalidatePath("/admin/services")
  revalidatePath("/services")
}

export async function saveService(formData: FormData) {
  const id = formData.get("id") as string
  const title = formData.get("title") as string
  const slug = formData.get("slug") as string
  const description = formData.get("description") as string
  const content = formData.get("content") as string
  const icon = formData.get("icon") as string
  const featured = formData.get("featured") === "true"

  if (!title || !slug || !description || !content) {
    throw new Error("Title, slug, description, and content are required")
  }

  const supabase = createServerSupabaseClient()

  // Check if slug is unique (except for the current service)
  const { data: existingService } = await supabase
    .from("services")
    .select("id")
    .eq("slug", slug)
    .neq("id", id || "")
    .single()

  if (existingService) {
    throw new Error("A service with this slug already exists")
  }

  if (id) {
    // Update existing service
    const { error } = await supabase
      .from("services")
      .update({
        title,
        slug,
        description,
        content,
        icon,
        featured,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)

    if (error) {
      throw new Error("Failed to update service")
    }
  } else {
    // Create new service
    const { error } = await supabase.from("services").insert({
      title,
      slug,
      description,
      content,
      icon,
      featured,
    })

    if (error) {
      throw new Error("Failed to create service")
    }
  }

  revalidatePath("/admin/services")
  revalidatePath("/services")
  revalidatePath(`/services/${slug}`)

  redirect("/admin/services")
}
