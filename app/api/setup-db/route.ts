import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function GET() {
  try {
    const supabase = createServerSupabaseClient()

    // Create basic tables for development
    const queries = [
      // Create user_role enum if it doesn't exist
      `DO $$ BEGIN
        CREATE TYPE user_role AS ENUM ('admin', 'editor', 'user');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;`,

      // Create profiles table
      `CREATE TABLE IF NOT EXISTS public.profiles (
        id UUID PRIMARY KEY,
        full_name TEXT,
        avatar_url TEXT,
        role user_role DEFAULT 'user'::user_role,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
      );`,

      // Create services table
      `CREATE TABLE IF NOT EXISTS public.services (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        description TEXT NOT NULL,
        content TEXT NOT NULL,
        icon TEXT,
        featured BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
      );`,

      // Create blog_posts table
      `CREATE TABLE IF NOT EXISTS public.blog_posts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        excerpt TEXT,
        content TEXT NOT NULL,
        featured_image TEXT,
        author_id UUID,
        published BOOLEAN DEFAULT false,
        published_at TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
      );`,

      // Create categories table
      `CREATE TABLE IF NOT EXISTS public.categories (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
      );`,

      // Create blog_posts_categories table
      `CREATE TABLE IF NOT EXISTS public.blog_posts_categories (
        post_id UUID REFERENCES public.blog_posts(id) ON DELETE CASCADE,
        category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
        PRIMARY KEY (post_id, category_id)
      );`,

      // Create contact_submissions table
      `CREATE TABLE IF NOT EXISTS public.contact_submissions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        message TEXT NOT NULL,
        status TEXT DEFAULT 'new',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
      );`,

      // Insert sample data for development
      `INSERT INTO public.services (title, slug, description, content, icon, featured)
      VALUES 
        ('Web Development', 'web-development', 'Custom web development services', '<p>Our web development services include...</p>', '🌐', true),
        ('UI/UX Design', 'ui-ux-design', 'User interface and experience design', '<p>Our design services include...</p>', '🎨', true),
        ('Digital Marketing', 'digital-marketing', 'Comprehensive digital marketing solutions', '<p>Our marketing services include...</p>', '📈', true)
      ON CONFLICT (slug) DO NOTHING;`,

      `INSERT INTO public.categories (name, slug)
      VALUES 
        ('Technology', 'technology'),
        ('Design', 'design'),
        ('Business', 'business')
      ON CONFLICT (slug) DO NOTHING;`,
    ]

    // Execute each query
    for (const query of queries) {
      const { error } = await supabase.rpc("pgclient", { query })
      if (error) {
        console.error("Error executing query:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
    }

    return NextResponse.json({ success: true, message: "Database setup completed" })
  } catch (error) {
    console.error("Error setting up database:", error)
    return NextResponse.json({ error: "Failed to set up database. See server logs for details." }, { status: 500 })
  }
}
