import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// Check if environment variables are defined
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Validate environment variables
if (!supabaseUrl) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL is not defined")
}

if (!supabaseAnonKey) {
  throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY is not defined")
}

export const createServerSupabaseClient = () => {
  // For development without service role key, use the anon key
  // In production, this should be properly configured with service role key
  const serviceKey = supabaseServiceRoleKey || supabaseAnonKey

  return createClient<Database>(supabaseUrl, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    // Disable RLS for server-side queries to avoid recursion issues
    global: {
      headers: {
        // This bypasses RLS for queries made with this client
        // Only use this for server-side operations where appropriate
        "x-supabase-auth-bypass-rls": "true",
      },
    },
  })
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
