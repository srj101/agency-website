"use server"

import { createServerSupabaseClient } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

type ContactFormData = {
  name: string
  email: string
  phone?: string
  message: string
}

export async function submitContactForm(data: ContactFormData) {
  const supabase = createServerSupabaseClient()

  const { error } = await supabase.from("contact_submissions").insert([
    {
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      message: data.message,
      status: "new",
    },
  ])

  if (error) {
    console.error("Error submitting contact form:", error)
    throw new Error("Failed to submit contact form")
  }

  revalidatePath("/admin/contacts")

  return { success: true }
}
