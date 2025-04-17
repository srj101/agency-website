"use server"

import { createServerSupabaseClient } from "@/lib/supabase"

export type Service = {
  id: string
  title: string
  slug: string
  featured: boolean
  created_at: string
}

export async function getServices() {
  const supabase = createServerSupabaseClient()

  const { data } = await supabase
    .from("services")
    .select("id, title, slug, featured, created_at")
    .order("created_at", { ascending: false })

  return (data as Service[]) || []
}
