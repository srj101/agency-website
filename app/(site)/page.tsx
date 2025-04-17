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
    featured_image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop",
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
    featured_image: "https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=2070&auto=format&fit=crop",
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
    featured_image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop",
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
      <section className="relative bg-gradient-to-r from-blue-600 to-indigo-700 py-20 md:py-32 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <Image
            src="https://images.unsplash.com/photo-1497215842964-222b430dc094?q=80&w=2070&auto=format&fit=crop"
            alt="Background pattern"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="container relative z-10">
          <div className="grid gap-8 md:grid-cols-2 md:gap-12 items-center">
            <div className="flex flex-col justify-center">
              <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                We build digital experiences that matter
              </h1>
              <p className="mt-4 text-lg md:text-xl opacity-90">
                Our agency specializes in creating stunning websites, powerful applications, and effective marketing
                strategies that help businesses grow.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                {needsSetup ? (
                  <Button asChild size="lg" variant="secondary">
                    <Link href="/setup">Setup Database</Link>
                  </Button>
                ) : (
                  <>
                    <Button asChild size="lg" variant="secondary">
                      <Link href="/contact">Get Started</Link>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      size="lg"
                      className="bg-white/10 hover:bg-white/20 text-white border-white/20"
                    >
                      <Link href="/services">Our Services</Link>
                    </Button>
                  </>
                )}
              </div>
              {needsSetup && (
                <div className="mt-6 rounded-md bg-white/10 p-4 text-white">
                  <p className="text-sm">
                    It looks like your database tables haven't been set up yet or there's an issue with the database
                    policies. Click the button above to set up your database with sample data.
                  </p>
                </div>
              )}
            </div>
            <div className="flex items-center justify-center">
              <div className="relative w-full max-w-md aspect-video rounded-lg overflow-hidden shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop"
                  alt="Team working together"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Services Section */}
      <section className="section bg-white">
        <div className="container">
          <div className="section-title">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Our Services</h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              We offer a wide range of services to help your business succeed in the digital landscape.
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {services.map((service, index) => (
              <div
                key={service.id}
                className="flex flex-col rounded-lg border shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
              >
                <div className="h-48 relative">
                  <Image
                    src={`https://images.unsplash.com/photo-${index === 0 ? "1498050108023-c5249f4df085" : index === 1 ? "1561070791-2526d30994b5" : "1533750349088-cd871a2e7b2c"}?q=80&w=2070&auto=format&fit=crop`}
                    alt={service.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                    <h3 className="text-xl font-bold text-white">{service.title}</h3>
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <p className="text-muted-foreground">{service.description}</p>
                  <div className="mt-auto pt-4">
                    <Button asChild variant="outline" className="w-full">
                      <Link href={needsSetup ? "/setup" : `/services/${service.slug}`}>
                        {needsSetup ? "Setup Database" : "Learn More"}
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button asChild size="lg">
              <Link href={needsSetup ? "/setup" : "/services"}>
                {needsSetup ? "Setup Database" : "View All Services"}
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-blue-700 text-white py-16">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold">250+</div>
              <div className="mt-2 text-white/80">Projects Completed</div>
            </div>
            <div>
              <div className="text-4xl font-bold">120+</div>
              <div className="mt-2 text-white/80">Happy Clients</div>
            </div>
            <div>
              <div className="text-4xl font-bold">15+</div>
              <div className="mt-2 text-white/80">Team Members</div>
            </div>
            <div>
              <div className="text-4xl font-bold">10+</div>
              <div className="mt-2 text-white/80">Years Experience</div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Blog Posts Section */}
      <section className="section bg-gray-50">
        <div className="container">
          <div className="section-title">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Latest Insights</h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              Check out our latest blog posts and stay updated with industry trends.
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {blogPosts.map((post) => (
              <div
                key={post.id}
                className="flex flex-col rounded-lg border bg-white shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
              >
                {post.featured_image && (
                  <div className="h-48 relative">
                    <Image
                      src={post.featured_image || "/placeholder.svg"}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold">{post.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    By {post.profiles?.full_name || "Anonymous"} •{" "}
                    {new Date(post.published_at || post.created_at).toLocaleDateString()}
                  </p>
                  <p className="mt-3 text-muted-foreground">{post.excerpt}</p>
                  <div className="mt-auto pt-4">
                    <Button asChild variant="outline" className="w-full">
                      <Link href={needsSetup ? "/setup" : `/blog/${post.slug}`}>
                        {needsSetup ? "Setup Database" : "Read More"}
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button asChild size="lg">
              <Link href={needsSetup ? "/setup" : "/blog"}>{needsSetup ? "Setup Database" : "View All Posts"}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section bg-white">
        <div className="container">
          <div className="section-title">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">What Our Clients Say</h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              Don't just take our word for it. Here's what our clients have to say about working with us.
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              {
                name: "Sarah Johnson",
                company: "Tech Innovators",
                image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop",
                quote:
                  "Working with this agency transformed our online presence. Their team delivered beyond our expectations and was a pleasure to work with.",
              },
              {
                name: "Michael Chen",
                company: "Growth Ventures",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1887&auto=format&fit=crop",
                quote:
                  "The team's attention to detail and strategic approach helped us achieve our business goals. I highly recommend their services.",
              },
              {
                name: "Emily Rodriguez",
                company: "Creative Solutions",
                image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1888&auto=format&fit=crop",
                quote:
                  "Their expertise in digital marketing has been invaluable to our business. We've seen a significant increase in engagement and conversions.",
              },
            ].map((testimonial, i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-6 shadow-sm">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-12 w-12 rounded-full overflow-hidden relative">
                    <Image
                      src={testimonial.image || "/placeholder.svg"}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.company}</p>
                  </div>
                </div>
                <p className="italic text-muted-foreground">"{testimonial.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container">
          <div className="rounded-2xl bg-white/10 p-8 text-center backdrop-blur-sm md:p-12 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Ready to get started?</h2>
            <p className="mt-4 text-lg text-white/90">
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
