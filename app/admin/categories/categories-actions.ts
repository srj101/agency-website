"use server"

import { createServerSupabaseClient } from "@/lib/supabase"

export type Category = {
  id: string
  name: string
  slug: string
  created_at: string
}

export async function getCategories() {
  const supabase = createServerSupabaseClient()

  const { data } = await supabase.from("categories").select("*").order("name", { ascending: true })

  return (data as Category[]) || []
}
