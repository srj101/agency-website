"use server"

import { createServerSupabaseClient } from "@/lib/supabase"

export type User = {
  id: string
  full_name: string | null
  role: "admin" | "editor" | "user"
  created_at: string
}

export async function getUsers() {
  const supabase = createServerSupabaseClient()
  const { data } = await supabase.from("profiles").select("*").order("created_at", { ascending: false })
  return (data as User[]) || []
}
