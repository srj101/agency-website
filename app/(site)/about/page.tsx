import Image from "next/image"

export const metadata = {
  title: "About Us | Agency Website",
  description: "Learn more about our agency and our team.",
}

export default function AboutPage() {
  return (
    <div className="container py-12 md:py-16">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">About Us</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          We're a team of passionate designers, developers, and marketers.
        </p>
      </div>

      <div className="mt-16 grid gap-12 md:grid-cols-2 items-center">
        <div>
          <h2 className="text-2xl font-bold">Our Story</h2>
          <p className="mt-4 text-muted-foreground">
            Founded in 2010, our agency has been at the forefront of digital innovation for over a decade. What started
            as a small team of passionate individuals has grown into a full-service digital agency with a global client
            base.
          </p>
          <p className="mt-4 text-muted-foreground">
            We believe in creating digital experiences that not only look great but also drive results. Our approach
            combines creativity with data-driven insights to deliver solutions that make a real impact.
          </p>
        </div>
        <div className="flex items-center justify-center">
          <div className="relative w-full max-w-md aspect-video rounded-lg overflow-hidden shadow-lg">
            <Image
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop"
              alt="Our team"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>

      <div className="mt-20">
        <h2 className="text-2xl font-bold text-center mb-10">Our Values</h2>
        <div className="grid gap-8 md:grid-cols-3">
          <div className="rounded-lg border p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-blue-600"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
            </div>
            <h3 className="text-xl font-bold">Innovation</h3>
            <p className="mt-2 text-muted-foreground">
              We constantly push the boundaries of what's possible in digital design and development.
            </p>
          </div>
          <div className="rounded-lg border p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-indigo-600"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold">Collaboration</h3>
            <p className="mt-2 text-muted-foreground">
              We work closely with our clients to ensure their vision is realized in every project.
            </p>
          </div>
          <div className="rounded-lg border p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-purple-600"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <h3 className="text-xl font-bold">Excellence</h3>
            <p className="mt-2 text-muted-foreground">
              We strive for excellence in everything we do, from design to development to client service.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-20">
        <h2 className="text-2xl font-bold text-center mb-10">Our Team</h2>
        <div className="grid gap-8 md:grid-cols-4">
          {[
            {
              name: "Alex Johnson",
              position: "CEO & Founder",
              image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1887&auto=format&fit=crop",
            },
            {
              name: "Sarah Williams",
              position: "Creative Director",
              image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=1887&auto=format&fit=crop",
            },
            {
              name: "Michael Chen",
              position: "Lead Developer",
              image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1770&auto=format&fit=crop",
            },
            {
              name: "Emily Rodriguez",
              position: "Marketing Strategist",
              image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop",
            },
          ].map((member, i) => (
            <div key={i} className="text-center">
              <div className="mx-auto h-40 w-40 overflow-hidden rounded-full shadow-md">
                <div className="relative h-full w-full">
                  <Image src={member.image || "/placeholder.svg"} alt={member.name} fill className="object-cover" />
                </div>
              </div>
              <h3 className="mt-4 text-lg font-bold">{member.name}</h3>
              <p className="text-muted-foreground">{member.position}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
