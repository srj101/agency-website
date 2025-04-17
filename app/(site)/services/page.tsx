import Link from "next/link"
import { Button } from "@/components/ui/button"
import { createServerSupabaseClient } from "@/lib/supabase"

export const metadata = {
  title: "Services | Agency Website",
  description: "Explore our range of services designed to help your business grow.",
}

export const revalidate = 3600 // Revalidate every hour

async function getServices() {
  const supabase = createServerSupabaseClient()
  const { data } = await supabase.from("services").select("*").order("created_at", { ascending: false })

  return data || []
}

export default async function ServicesPage() {
  const services = await getServices()

  return (
    <div className="container py-12 md:py-16">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">Our Services</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          We offer a wide range of services to help your business succeed in the digital world.
        </p>
      </div>

      <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <div key={service.id} className="flex flex-col rounded-lg border p-6">
            <div className="mb-4 text-4xl">{service.icon || "🚀"}</div>
            <h2 className="text-xl font-bold">{service.title}</h2>
            <p className="mt-2 text-muted-foreground">{service.description}</p>
            <div className="mt-auto pt-4">
              <Button asChild variant="outline">
                <Link href={`/services/${service.slug}`}>Learn More</Link>
              </Button>
            </div>
          </div>
        ))}
      </div>

      {services.length === 0 && (
        <div className="mt-16 text-center">
          <p className="text-muted-foreground">No services found.</p>
        </div>
      )}

      <div className="mt-16 rounded-lg bg-muted p-8 text-center md:p-12">
        <h2 className="text-2xl font-bold">Need a custom solution?</h2>
        <p className="mt-4 text-muted-foreground">
          Contact us to discuss your specific requirements and how we can help.
        </p>
        <div className="mt-8">
          <Button asChild>
            <Link href="/contact">Contact Us</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
