import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function GET() {
  try {
    const supabase = createServerSupabaseClient()

    // Insert sample data
    const serviceData = [
      {
        title: "Web Development",
        slug: "web-development",
        description: "Custom web development services for businesses of all sizes.",
        content:
          "<p>Our web development services include custom website development, e-commerce solutions, web applications, and more. We use the latest technologies to create fast, responsive, and user-friendly websites that help you achieve your business goals.</p><h3>Our Web Development Process</h3><ul><li>Discovery and planning</li><li>Design and wireframing</li><li>Development and testing</li><li>Deployment and maintenance</li></ul><p>We work closely with you throughout the entire process to ensure that your website meets your specific needs and requirements.</p>",
        icon: "🌐",
        featured: true,
      },
      {
        title: "UI/UX Design",
        slug: "ui-ux-design",
        description: "User-centered design that enhances user experience and engagement.",
        content:
          "<p>Our UI/UX design services focus on creating intuitive, engaging, and accessible user interfaces that provide an exceptional user experience. We combine aesthetics with functionality to design interfaces that are both beautiful and easy to use.</p><h3>Our Design Services</h3><ul><li>User research and personas</li><li>Information architecture</li><li>Wireframing and prototyping</li><li>Visual design and branding</li><li>Usability testing</li></ul><p>We believe that good design is not just about how something looks, but also about how it works.</p>",
        icon: "🎨",
        featured: true,
      },
      {
        title: "Digital Marketing",
        slug: "digital-marketing",
        description: "Comprehensive digital marketing strategies to grow your business.",
        content:
          "<p>Our digital marketing services help you reach your target audience, increase brand awareness, and drive conversions. We develop customized marketing strategies that align with your business goals and deliver measurable results.</p><h3>Our Marketing Services</h3><ul><li>Search Engine Optimization (SEO)</li><li>Pay-Per-Click (PPC) advertising</li><li>Social media marketing</li><li>Content marketing</li><li>Email marketing</li><li>Analytics and reporting</li></ul><p>We use data-driven approaches to optimize your marketing campaigns and maximize your return on investment.</p>",
        icon: "📈",
        featured: true,
      },
      {
        title: "Mobile App Development",
        slug: "mobile-app-development",
        description: "Native and cross-platform mobile applications for iOS and Android.",
        content:
          "<p>Our mobile app development services help you create custom mobile applications that engage users and drive business growth. We develop native and cross-platform apps for iOS and Android that are fast, reliable, and user-friendly.</p><h3>Our Mobile App Development Process</h3><ul><li>Concept and strategy</li><li>UI/UX design</li><li>Development and testing</li><li>Deployment and maintenance</li></ul><p>We use the latest technologies and best practices to create mobile apps that deliver exceptional user experiences.</p>",
        icon: "📱",
        featured: false,
      },
    ]

    const categoryData = [
      { name: "Technology", slug: "technology" },
      { name: "Design", slug: "design" },
      { name: "Business", slug: "business" },
      { name: "Marketing", slug: "marketing" },
    ]

    // Insert services
    for (const service of serviceData) {
      const { error } = await supabase.from("services").upsert(service, { onConflict: "slug" })
      if (error) {
        console.error("Error inserting service:", error)
        return NextResponse.json({ error: `Failed to insert service: ${error.message}` }, { status: 500 })
      }
    }

    // Insert categories
    for (const category of categoryData) {
      const { error } = await supabase.from("categories").upsert(category, { onConflict: "slug" })
      if (error) {
        console.error("Error inserting category:", error)
        return NextResponse.json({ error: `Failed to insert category: ${error.message}` }, { status: 500 })
      }
    }

    // Create a demo user for blog posts
    // First, check if we already have a demo user
    const { data: existingUsers } = await supabase.from("profiles").select("id").limit(1)

    let authorId

    if (existingUsers && existingUsers.length > 0) {
      // Use the first existing user
      authorId = existingUsers[0].id
    } else {
      // Create a demo user profile with a placeholder ID
      const demoUserId = "00000000-0000-0000-0000-000000000000"

      const { error: profileError } = await supabase.from("profiles").insert({
        id: demoUserId,
        full_name: "Demo User",
        role: "admin",
      })

      if (profileError) {
        console.error("Error creating demo user:", profileError)
        // Continue with a placeholder ID anyway
      }

      authorId = demoUserId
    }

    // Blog post data with author ID
    const blogPostData = [
      {
        title: "The Future of Web Development",
        slug: "future-of-web-development",
        excerpt: "Exploring the latest trends and technologies shaping the future of web development.",
        content:
          "<p>The web development landscape is constantly evolving, with new technologies and approaches emerging regularly. In this post, we'll explore some of the most exciting trends and technologies that are shaping the future of web development.</p><h3>1. JAMstack Architecture</h3><p>JAMstack (JavaScript, APIs, and Markup) is a modern web development architecture that delivers better performance, higher security, lower cost of scaling, and a better developer experience. By pre-rendering files and serving them directly from a CDN, JAMstack sites remove the need for server-side code and databases, resulting in faster websites.</p><h3>2. Serverless Functions</h3><p>Serverless computing allows developers to build and run applications without thinking about servers. It eliminates infrastructure management tasks and scales automatically with your application. This approach is becoming increasingly popular for web development as it reduces complexity and allows developers to focus on writing code.</p><h3>3. Web Assembly</h3><p>WebAssembly (Wasm) is a binary instruction format for a stack-based virtual machine that enables high-performance applications on the web. It provides a way to run code written in multiple languages on the web at near-native speed, opening new possibilities for web applications.</p><h3>4. Progressive Web Apps (PWAs)</h3><p>Progressive Web Apps combine the best of web and mobile apps, offering a fast, reliable, and engaging user experience. They work offline, can be installed on the home screen, and provide push notifications, making them a powerful alternative to native mobile apps.</p><h3>Conclusion</h3><p>The future of web development is exciting, with new technologies and approaches making it possible to create faster, more secure, and more engaging web experiences. By staying up-to-date with these trends, developers can build better web applications that meet the evolving needs of users.</p>",
        featured_image: "/placeholder.svg?height=200&width=400",
        author_id: authorId,
        published: true,
        published_at: new Date().toISOString(),
      },
      {
        title: "Designing for Accessibility",
        slug: "designing-for-accessibility",
        excerpt: "Best practices for creating accessible websites and applications.",
        content:
          "<p>Accessibility is a crucial aspect of web design that ensures everyone, including people with disabilities, can use and interact with websites and applications. In this post, we'll explore some best practices for designing accessible digital experiences.</p><h3>1. Use Semantic HTML</h3><p>Semantic HTML provides meaning to the structure of your content, making it easier for assistive technologies to interpret and navigate. Use appropriate HTML elements like <code>&lt;header&gt;</code>, <code>&lt;nav&gt;</code>, <code>&lt;main&gt;</code>, and <code>&lt;footer&gt;</code> to define the structure of your page.</p><h3>2. Provide Alternative Text for Images</h3><p>Alternative text (alt text) describes the content and function of images for users who cannot see them. Make sure to provide descriptive alt text for all meaningful images on your website.</p><h3>3. Ensure Sufficient Color Contrast</h3><p>Sufficient color contrast between text and background makes content readable for users with low vision or color blindness. The Web Content Accessibility Guidelines (WCAG) recommend a contrast ratio of at least 4.5:1 for normal text and 3:1 for large text.</p><h3>4. Make Interactive Elements Keyboard Accessible</h3><p>Many users navigate websites using only a keyboard. Ensure that all interactive elements, such as links, buttons, and form controls, can be accessed and operated using a keyboard.</p><h3>5. Use ARIA When Necessary</h3><p>Accessible Rich Internet Applications (ARIA) attributes can enhance accessibility when HTML alone is not sufficient. Use ARIA roles, states, and properties to provide additional information about the structure and behavior of your content to assistive technologies.</p><h3>Conclusion</h3><p>Designing for accessibility is not just about compliance with guidelines; it's about creating inclusive experiences that everyone can use and enjoy. By following these best practices, you can make your websites and applications more accessible to a wider audience, including people with disabilities. Remember that accessibility benefits everyone, not just users with disabilities, by creating more usable and flexible digital experiences.</p>",
        featured_image: "/placeholder.svg?height=200&width=400",
        author_id: authorId,
        published: true,
        published_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        title: "SEO Strategies for 2023",
        slug: "seo-strategies-2023",
        excerpt: "Effective SEO techniques to improve your website's visibility.",
        content:
          "<p>Search Engine Optimization (SEO) continues to evolve as search engines refine their algorithms and user behaviors change. In this post, we'll explore effective SEO strategies for 2023 that can help improve your website's visibility and drive organic traffic.</p><h3>1. Focus on User Experience</h3><p>Google's Page Experience update has made user experience a key ranking factor. Focus on creating websites that load quickly, are mobile-friendly, and provide a seamless browsing experience. Metrics like Core Web Vitals are now crucial for SEO success.</p><h3>2. Create High-Quality, Comprehensive Content</h3><p>Content remains king in SEO. Create in-depth, valuable content that thoroughly addresses user queries. Aim to provide the most comprehensive resource on a topic, covering all aspects that users might be interested in.</p><h3>3. Optimize for Voice Search</h3><p>With the increasing use of voice assistants, optimizing for voice search is becoming more important. Focus on natural language, question-based queries, and featured snippet optimization to capture voice search traffic.</p><h3>4. Leverage AI and Machine Learning</h3><p>AI tools can help analyze data, identify trends, and automate routine SEO tasks. Use AI-powered tools to gain insights into user behavior, content performance, and competitive analysis.</p><h3>5. Build a Strong E-E-A-T Signal</h3><p>Experience, Expertise, Authoritativeness, and Trustworthiness (E-E-A-T) are crucial for SEO, especially for YMYL (Your Money or Your Life) topics. Showcase your expertise, provide accurate information, and build trust with your audience.</p><h3>Conclusion</h3><p>SEO is an ongoing process that requires staying up-to-date with the latest trends and algorithm changes. By implementing these strategies, you can improve your website's visibility in search results and attract more organic traffic. Remember that SEO is a long-term investment that can deliver sustainable results for your business.</p>",
        featured_image: "/placeholder.svg?height=200&width=400",
        author_id: authorId,
        published: true,
        published_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ]

    // Insert blog posts
    for (const post of blogPostData) {
      const { data, error } = await supabase.from("blog_posts").upsert(post, { onConflict: "slug" }).select()

      if (error) {
        console.error("Error inserting blog post:", error)
        return NextResponse.json({ error: `Failed to insert blog post: ${error.message}` }, { status: 500 })
      }

      // Add categories to blog posts
      if (data && data[0]) {
        const postId = data[0].id
        const { data: categoryIds } = await supabase.from("categories").select("id").limit(2)

        if (categoryIds && categoryIds.length > 0) {
          const categoryRelations = categoryIds.map((category) => ({
            post_id: postId,
            category_id: category.id,
          }))

          await supabase.from("blog_posts_categories").upsert(categoryRelations)
        }
      }
    }

    return NextResponse.json({ success: true, message: "Sample data inserted successfully" })
  } catch (error) {
    console.error("Error inserting sample data:", error)
    return NextResponse.json({ error: "Failed to insert sample data. See server logs for details." }, { status: 500 })
  }
}
