import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { createServerSupabaseClient } from "@/lib/supabase"

// Mock data to use when database tables don't exist yet
const mockServices = [
  {
    id: "1",
    title: "Web Development",
    slug: "web-development",
    description: "Custom web development services for businesses of all sizes.",
    icon: "🌐",
    featured: true,
  },
  {
    id: "2",
    title: "UI/UX Design",
    slug: "ui-ux-design",
    description: "User-centered design that enhances user experience and engagement.",
    icon: "🎨",
    featured: true,
  },
  {
    id: "3",
    title: "Digital Marketing",
    slug: "digital-marketing",
    description: "Comprehensive digital marketing strategies to grow your business.",
    icon: "📈",
    featured: true,
  },
]

const mockBlogPosts = [
  {
    id: "1",
    title: "The Future of Web Development",
    slug: "future-of-web-development",
    excerpt: "Exploring the latest trends and technologies shaping the future of web development.",
    featured_image: "/placeholder.svg?height=200&width=400",
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
    featured_image: "/placeholder.svg?height=200&width=400",
    published: true,
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    profiles: { full_name: "Jane Smith" },
  },
  {
    id: "3",
    title: "SEO Strategies for 2023",
    slug: "seo-strategies-2023",
    excerpt: "Effective SEO techniques to improve your website's visibility.",
    featured_image: "/placeholder.svg?height=200&width=400",
    published: true,
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    profiles: { full_name: "Alex Johnson" },
  },
]

async function getServices() {
  try {
    const supabase = createServerSupabaseClient()

    // Disable Row Level Security temporarily for this query
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .eq("featured", true)
      .order("created_at", { ascending: false })
      .limit(3)

    if (error) {
      // Check if the error is because the table doesn't exist or RLS issues
      if (error.message.includes("does not exist") || error.message.includes("recursion")) {
        console.log("Services table doesn't exist yet or RLS issue, using mock data")
        return mockServices
      }
      throw error
    }
    return data.length > 0 ? data : mockServices
  } catch (error) {
    console.error("Error fetching services:", error)
    return mockServices
  }
}

async function getBlogPosts() {
  try {
    const supabase = createServerSupabaseClient()

    // Try to fetch blog posts without joining with profiles first
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*") // Don't join with profiles
      .eq("published", true)
      .order("published_at", { ascending: false })
      .limit(3)

    if (error) {
      // Check if the error is because the table doesn't exist or RLS issues
      if (error.message.includes("does not exist") || error.message.includes("recursion")) {
        console.log("Blog posts table doesn't exist yet or RLS issue, using mock data")
        return mockBlogPosts
      }
      throw error
    }

    // If we have data, try to fetch author information separately
    if (data && data.length > 0) {
      // Create a map of author IDs to fetch
      const authorIds = data.map((post) => post.author_id).filter((id) => id !== null && id !== undefined)

      // Only fetch authors if we have valid author IDs
      if (authorIds.length > 0) {
        try {
          const { data: authors } = await supabase.from("profiles").select("id, full_name").in("id", authorIds)

          // Create a map of author IDs to names for quick lookup
          const authorMap = new Map()
          authors?.forEach((author) => {
            authorMap.set(author.id, author)
          })

          // Add author information to each post
          const postsWithAuthors = data.map((post) => ({
            ...post,
            profiles: post.author_id
              ? authorMap.get(post.author_id) || { full_name: "Anonymous" }
              : { full_name: "Anonymous" },
          }))

          return postsWithAuthors
        } catch (authorError) {
          console.error("Error fetching authors:", authorError)
          // If we can't fetch authors, just return posts without author info
          return data.map((post) => ({
            ...post,
            profiles: { full_name: "Anonymous" },
          }))
        }
      } else {
        // No valid author IDs, just return posts with anonymous authors
        return data.map((post) => ({
          ...post,
          profiles: { full_name: "Anonymous" },
        }))
      }
    }

    return data.length > 0 ? data : mockBlogPosts
  } catch (error) {
    console.error("Error fetching blog posts:", error)
    return mockBlogPosts
  }
}

export default async function HomePage() {
  const services = await getServices()
  const blogPosts = await getBlogPosts()

  // Check if database needs setup
  const needsSetup = services === mockServices || blogPosts === mockBlogPosts

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-muted py-20 md:py-32">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-2 md:gap-12">
            <div className="flex flex-col justify-center">
              <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                We build digital experiences that matter
              </h1>
              <p className="mt-4 text-lg text-muted-foreground md:text-xl">
                Our agency specializes in creating stunning websites, powerful applications, and effective marketing
                strategies that help businesses grow.
              </p>
              <div className="mt-6 flex flex-col gap-4 sm:flex-row">
                {needsSetup ? (
                  <Button asChild size="lg" variant="default">
                    <Link href="/setup">Setup Database</Link>
                  </Button>
                ) : (
                  <>
                    <Button asChild size="lg">
                      <Link href="/contact">Get Started</Link>
                    </Button>
                    <Button asChild variant="outline" size="lg">
                      <Link href="/services">Our Services</Link>
                    </Button>
                  </>
                )}
              </div>
              {needsSetup && (
                <div className="mt-4 rounded-md bg-amber-100 p-4 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                  <p className="text-sm">
                    It looks like your database tables haven't been set up yet or there's an issue with the database
                    policies. Click the button above to set up your database with sample data.
                  </p>
                </div>
              )}
            </div>
            <div className="flex items-center justify-center">
              <Image
                src="/placeholder.svg?height=400&width=400"
                alt="Hero"
                width={400}
                height={400}
                className="rounded-lg object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Services Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Our Services</h2>
            <p className="mt-4 text-muted-foreground">
              We offer a wide range of services to help your business succeed.
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {services.map((service) => (
              <div key={service.id} className="flex flex-col rounded-lg border p-6">
                <div className="mb-4 text-4xl">{service.icon || "🚀"}</div>
                <h3 className="text-xl font-bold">{service.title}</h3>
                <p className="mt-2 text-muted-foreground">{service.description}</p>
                <div className="mt-auto pt-4">
                  <Button asChild variant="outline">
                    <Link href={needsSetup ? "/setup" : `/services/${service.slug}`}>
                      {needsSetup ? "Setup Database" : "Learn More"}
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button asChild>
              <Link href={needsSetup ? "/setup" : "/services"}>
                {needsSetup ? "Setup Database" : "View All Services"}
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Recent Blog Posts Section */}
      <section className="bg-muted py-16 md:py-24">
        <div className="container">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Latest Insights</h2>
            <p className="mt-4 text-muted-foreground">
              Check out our latest blog posts and stay updated with industry trends.
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {blogPosts.map((post) => (
              <div key={post.id} className="flex flex-col rounded-lg border bg-background p-6">
                {post.featured_image && (
                  <Image
                    src={post.featured_image || "/placeholder.svg?height=200&width=400"}
                    alt={post.title}
                    width={400}
                    height={200}
                    className="mb-4 rounded-lg object-cover"
                  />
                )}
                <h3 className="text-xl font-bold">{post.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  By {post.profiles?.full_name || "Anonymous"} •{" "}
                  {new Date(post.published_at || post.created_at).toLocaleDateString()}
                </p>
                <p className="mt-2 text-muted-foreground">{post.excerpt}</p>
                <div className="mt-auto pt-4">
                  <Button asChild variant="outline">
                    <Link href={needsSetup ? "/setup" : `/blog/${post.slug}`}>
                      {needsSetup ? "Setup Database" : "Read More"}
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button asChild>
              <Link href={needsSetup ? "/setup" : "/blog"}>{needsSetup ? "Setup Database" : "View All Posts"}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="rounded-lg bg-primary p-8 text-center text-primary-foreground md:p-12">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Ready to get started?</h2>
            <p className="mt-4 text-lg">
              {needsSetup
                ? "Set up your database to start building your agency website."
                : "Contact us today to discuss your project and how we can help."}
            </p>
            <div className="mt-8">
              <Button asChild size="lg" variant="secondary">
                <Link href={needsSetup ? "/setup" : "/contact"}>{needsSetup ? "Setup Database" : "Contact Us"}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
