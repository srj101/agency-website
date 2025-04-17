"use server"

import { createServerSupabaseClient } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

export async function updateUserRole(formData: FormData) {
  const id = formData.get("id") as string
  const role = formData.get("role") as "admin" | "editor" | "user"

  if (!id || !role) {
    throw new Error("User ID and role are required")
  }

  const supabase = createServerSupabaseClient()

  // Get current user
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    throw new Error("You must be logged in to update user roles")
  }

  // Check if current user is admin
  const { data: currentUser } = await supabase.from("profiles").select("role").eq("id", session.user.id).single()

  if (!currentUser || currentUser.role !== "admin") {
    throw new Error("Only admins can update user roles")
  }

  // Prevent changing own role
  if (id === session.user.id) {
    throw new Error("You cannot change your own role")
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      role,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)

  if (error) {
    throw new Error("Failed to update user role")
  }

  revalidatePath("/admin/users")
}
