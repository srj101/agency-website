import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { createServerSupabaseClient } from "@/lib/supabase"
import { notFound } from "next/navigation"

export const revalidate = 3600 // Revalidate every hour

async function getBlogPost(slug: string) {
  try {
    const supabase = createServerSupabaseClient()

    // First get the blog post without joining with profiles
    const { data: post, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .single()

    if (error) {
      console.error("Error fetching blog post:", error)
      return null
    }

    // If we have a post and it has an author_id, fetch the author separately
    if (post && post.author_id) {
      const { data: author, error: authorError } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", post.author_id)
        .single()

      if (!authorError && author) {
        return {
          ...post,
          profiles: author,
        }
      }
    }

    // Return the post with an anonymous author if we couldn't fetch the author
    return {
      ...post,
      profiles: { full_name: "Anonymous" },
    }
  } catch (error) {
    console.error("Error fetching blog post:", error)
    return null
  }
}

async function getPostCategories(postId: string) {
  try {
    const supabase = createServerSupabaseClient()

    // Get the category IDs for this post
    const { data: categoryLinks, error } = await supabase
      .from("blog_posts_categories")
      .select("category_id")
      .eq("post_id", postId)

    if (error || !categoryLinks || categoryLinks.length === 0) {
      return []
    }

    // Get the category details
    const categoryIds = categoryLinks.map((link) => link.category_id)
    const { data: categories, error: categoriesError } = await supabase
      .from("categories")
      .select("*")
      .in("id", categoryIds)

    if (categoriesError) {
      return []
    }

    return categories || []
  } catch (error) {
    console.error("Error fetching post categories:", error)
    return []
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getBlogPost(params.slug)

  if (!post) {
    return {
      title: "Post Not Found",
      description: "The requested blog post could not be found.",
    }
  }

  return {
    title: `${post.title} | Agency Website`,
    description: post.excerpt || post.title,
  }
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getBlogPost(params.slug)

  if (!post) {
    notFound()
  }

  const categories = await getPostCategories(post.id)

  return (
    <div className="container py-12 md:py-16">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">{post.title}</h1>
        <p className="mt-4 text-muted-foreground">
          By {post.profiles?.full_name || "Anonymous"} •{" "}
          {new Date(post.published_at || post.created_at).toLocaleDateString()}
        </p>

        {categories.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/blog/category/${category.slug}`}
                className="rounded-full bg-muted px-3 py-1 text-xs"
              >
                {category.name}
              </Link>
            ))}
          </div>
        )}

        {post.featured_image && (
          <div className="mt-8">
            <Image
              src={post.featured_image || "/placeholder.svg"}
              alt={post.title}
              width={800}
              height={400}
              className="rounded-lg object-cover"
            />
          </div>
        )}

        <div className="mt-8 prose dark:prose-invert max-w-none">
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>

        <div className="mt-12">
          <Button asChild variant="outline">
            <Link href="/blog">Back to Blog</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
