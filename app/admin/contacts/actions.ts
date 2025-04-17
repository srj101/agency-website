"use server"

import { createServerSupabaseClient } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

export async function deleteContact(formData: FormData) {
  const id = formData.get("id") as string

  if (!id) {
    throw new Error("Contact ID is required")
  }

  const supabase = createServerSupabaseClient()

  const { error } = await supabase.from("contact_submissions").delete().eq("id", id)

  if (error) {
    throw new Error("Failed to delete contact")
  }

  revalidatePath("/admin/contacts")
}

export async function updateContactStatus(formData: FormData) {
  const id = formData.get("id") as string
  const status = formData.get("status") as string

  if (!id || !status) {
    throw new Error("Contact ID and status are required")
  }

  const supabase = createServerSupabaseClient()

  const { error } = await supabase
    .from("contact_submissions")
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)

  if (error) {
    throw new Error("Failed to update contact status")
  }

  revalidatePath("/admin/contacts")
}
