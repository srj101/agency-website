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

      <div className="mt-16 grid gap-12 md:grid-cols-2">
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
          <Image
            src="/placeholder.svg?height=300&width=400"
            alt="Our team"
            width={400}
            height={300}
            className="rounded-lg object-cover"
          />
        </div>
      </div>

      <div className="mt-16">
        <h2 className="text-2xl font-bold text-center">Our Values</h2>
        <div className="mt-8 grid gap-8 md:grid-cols-3">
          <div className="rounded-lg border p-6">
            <h3 className="text-xl font-bold">Innovation</h3>
            <p className="mt-2 text-muted-foreground">
              We constantly push the boundaries of what's possible in digital design and development.
            </p>
          </div>
          <div className="rounded-lg border p-6">
            <h3 className="text-xl font-bold">Collaboration</h3>
            <p className="mt-2 text-muted-foreground">
              We work closely with our clients to ensure their vision is realized in every project.
            </p>
          </div>
          <div className="rounded-lg border p-6">
            <h3 className="text-xl font-bold">Excellence</h3>
            <p className="mt-2 text-muted-foreground">
              We strive for excellence in everything we do, from design to development to client service.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-16">
        <h2 className="text-2xl font-bold text-center">Our Team</h2>
        <div className="mt-8 grid gap-8 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="text-center">
              <div className="mx-auto h-32 w-32 overflow-hidden rounded-full">
                <Image
                  src={`/placeholder.svg?height=128&width=128&text=Team+Member+${i}`}
                  alt={`Team Member ${i}`}
                  width={128}
                  height={128}
                  className="h-full w-full object-cover"
                />
              </div>
              <h3 className="mt-4 text-lg font-bold">Team Member {i}</h3>
              <p className="text-muted-foreground">Position</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
