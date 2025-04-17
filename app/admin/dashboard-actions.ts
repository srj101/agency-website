"use server"

import { createServerSupabaseClient } from "@/lib/supabase"

export async function getDashboardStats() {
  const supabase = createServerSupabaseClient()

  // Get blog posts count
  const { count: postsCount } = await supabase.from("blog_posts").select("*", { count: "exact", head: true })

  // Get services count
  const { count: servicesCount } = await supabase.from("services").select("*", { count: "exact", head: true })

  // Get contacts count
  const { count: contactsCount } = await supabase
    .from("contact_submissions")
    .select("*", { count: "exact", head: true })

  // Get users count
  const { count: usersCount } = await supabase.from("profiles").select("*", { count: "exact", head: true })

  return {
    postsCount: postsCount || 0,
    servicesCount: servicesCount || 0,
    contactsCount: contactsCount || 0,
    usersCount: usersCount || 0,
  }
}

export async function getRecentContacts() {
  const supabase = createServerSupabaseClient()

  const { data } = await supabase
    .from("contact_submissions")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5)

  return data || []
}
