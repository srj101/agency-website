import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { createServerSupabaseClient } from "@/lib/supabase"
import { FallbackContent } from "@/components/fallback-content"

export const metadata = {
  title: "Blog | Agency Website",
  description: "Read our latest articles and insights.",
}

export const revalidate = 3600 // Revalidate every hour

// Mock data for when the database isn't available
const mockPosts = [
  {
    id: "1",
    title: "The Future of Web Development",
    slug: "future-of-web-development",
    excerpt: "Exploring the latest trends and technologies shaping the future of web development.",
    featured_image: "/placeholder.svg?height=200&width=600",
    published: true,
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    profiles: { full_name: "John Doe" },
  },
  {
    id: "2",
    title: "Designing for Accessibility",
    slug: "designing-for-accessibility",
    excerpt: "Best practices for creating accessible websites and applications.",
    featured_image: "/placeholder.svg?height=200&width=600",
    published: true,
    published_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    profiles: { full_name: "Jane Smith" },
  },
  {
    id: "3",
    title: "SEO Strategies for 2023",
    slug: "seo-strategies-2023",
    excerpt: "Effective SEO techniques to improve your website's visibility.",
    featured_image: "/placeholder.svg?height=200&width=600",
    published: true,
    published_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    profiles: { full_name: "Alex Johnson" },
  },
]

async function getBlogPosts() {
  try {
    const supabase = createServerSupabaseClient()

    // First, try to get posts without joining with profiles
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("published", true)
      .order("published_at", { ascending: false })

    if (error) {
      console.error("Error fetching blog posts:", error)
      return mockPosts
    }

    // If we have posts, try to fetch author information separately
    if (data && data.length > 0) {
      // Get unique author IDs
      const authorIds = [...new Set(data.map((post) => post.author_id).filter(Boolean))]

      if (authorIds.length > 0) {
        // Fetch author information
        const { data: authors, error: authorsError } = await supabase
          .from("profiles")
          .select("id, full_name")
          .in("id", authorIds)

        if (!authorsError && authors) {
          // Create a map of author IDs to names
          const authorMap = new Map()
          authors.forEach((author) => {
            authorMap.set(author.id, author)
          })

          // Add author information to each post
          return data.map((post) => ({
            ...post,
            profiles: post.author_id
              ? authorMap.get(post.author_id) || { full_name: "Anonymous" }
              : { full_name: "Anonymous" },
          }))
        }
      }

      // If we couldn't fetch authors or there are no author IDs, return posts with anonymous authors
      return data.map((post) => ({
        ...post,
        profiles: { full_name: "Anonymous" },
      }))
    }

    return data.length > 0 ? data : mockPosts
  } catch (error) {
    console.error("Error fetching blog posts:", error)
    return mockPosts
  }
}

async function getCategories() {
  try {
    const supabase = createServerSupabaseClient()
    const { data, error } = await supabase.from("categories").select("*").order("name", { ascending: true })

    if (error) {
      console.error("Error fetching categories:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error fetching categories:", error)
    return []
  }
}

export default async function BlogPage() {
  const posts = await getBlogPosts()
  const categories = await getCategories()

  const needsSetup = posts === mockPosts || categories.length === 0

  return (
    <div className="container py-12 md:py-16">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">Blog</h1>
        <p className="mt-4 text-lg text-muted-foreground">Read our latest articles and insights.</p>
      </div>

      {needsSetup ? (
        <div className="mt-8">
          <FallbackContent
            title="Blog Not Set Up"
            message="The blog database hasn't been set up yet. Please run the setup process to create sample blog posts."
            showHomeButton={false}
          />
          <div className="mt-8 flex justify-center">
            <Button asChild>
              <Link href="/setup">Setup Database</Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="mt-16 grid gap-12 md:grid-cols-[2fr_1fr]">
          <div>
            {posts.map((post) => (
              <div key={post.id} className="mb-12 flex flex-col rounded-lg border p-6">
                {post.featured_image && (
                  <Image
                    src={post.featured_image || "/placeholder.svg?height=200&width=600"}
                    alt={post.title}
                    width={600}
                    height={200}
                    className="mb-4 rounded-lg object-cover"
                  />
                )}
                <h2 className="text-2xl font-bold">{post.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  By {post.profiles?.full_name || "Anonymous"} •{" "}
                  {new Date(post.published_at || post.created_at).toLocaleDateString()}
                </p>
                <p className="mt-4 text-muted-foreground">{post.excerpt}</p>
                <div className="mt-6">
                  <Button asChild variant="outline">
                    <Link href={`/blog/${post.slug}`}>Read More</Link>
                  </Button>
                </div>
              </div>
            ))}

            {posts.length === 0 && (
              <div className="text-center">
                <p className="text-muted-foreground">No blog posts found.</p>
              </div>
            )}
          </div>

          <div>
            <div className="rounded-lg border p-6">
              <h2 className="text-xl font-bold">Categories</h2>
              {categories.length > 0 ? (
                <ul className="mt-4 space-y-2">
                  {categories.map((category) => (
                    <li key={category.id}>
                      <Link
                        href={`/blog/category/${category.slug}`}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        {category.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 text-muted-foreground">No categories found.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
