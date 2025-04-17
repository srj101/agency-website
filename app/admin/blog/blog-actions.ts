"use server"

import { createServerSupabaseClient } from "@/lib/supabase"

export type BlogPost = {
  id: string
  title: string
  slug: string
  published: boolean
  published_at: string | null
  created_at: string
  profiles: {
    full_name: string | null
  } | null
}

export async function getBlogPosts() {
  const supabase = createServerSupabaseClient()

  const { data } = await supabase
    .from("blog_posts")
    .select("id, title, slug, published, published_at, created_at, profiles(full_name)")
    .order("created_at", { ascending: false })

  return (data as BlogPost[]) || []
}
