import { ServiceForm } from "../service-form"
import { createServerSupabaseClient } from "@/lib/supabase"
import { notFound } from "next/navigation"

export const metadata = {
  title: "Edit Service | Admin Panel",
  description: "Edit an existing service.",
}

async function getService(id: string) {
  const supabase = createServerSupabaseClient()

  const { data } = await supabase.from("services").select("*").eq("id", id).single()

  return data
}

export default async function EditServicePage({ params }: { params: { id: string } }) {
  const service = await getService(params.id)

  if (!service) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Service</h1>
        <p className="text-muted-foreground">Edit an existing service.</p>
      </div>

      <ServiceForm service={service} />
    </div>
  )
}
