import Link from "next/link"
import { Button } from "@/components/ui/button"
import { createServerSupabaseClient } from "@/lib/supabase"
import { notFound } from "next/navigation"

export const revalidate = 3600 // Revalidate every hour

async function getService(slug: string) {
  const supabase = createServerSupabaseClient()
  const { data } = await supabase.from("services").select("*").eq("slug", slug).single()

  return data
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const service = await getService(params.slug)

  if (!service) {
    return {
      title: "Service Not Found",
      description: "The requested service could not be found.",
    }
  }

  return {
    title: `${service.title} | Agency Website`,
    description: service.description,
  }
}

export default async function ServicePage({ params }: { params: { slug: string } }) {
  const service = await getService(params.slug)

  if (!service) {
    notFound()
  }

  return (
    <div className="container py-12 md:py-16">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">{service.title}</h1>
        <p className="mt-4 text-lg text-muted-foreground">{service.description}</p>

        <div className="mt-8 prose dark:prose-invert max-w-none">
          <div dangerouslySetInnerHTML={{ __html: service.content }} />
        </div>

        <div className="mt-12 flex flex-col gap-4 sm:flex-row">
          <Button asChild>
            <Link href="/contact">Contact Us</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/services">Back to Services</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
