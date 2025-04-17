"use server"

import { createServerSupabaseClient } from "@/lib/supabase"

export type Contact = {
  id: string
  name: string
  email: string
  phone: string | null
  message: string
  status: string
  created_at: string
}

export async function getContacts() {
  const supabase = createServerSupabaseClient()

  const { data } = await supabase.from("contact_submissions").select("*").order("created_at", { ascending: false })

  return (data as Contact[]) || []
}
