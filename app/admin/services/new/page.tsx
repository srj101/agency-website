import { ServiceForm } from "../service-form"

export const metadata = {
  title: "New Service | Admin Panel",
  description: "Create a new service.",
}

export default function NewServicePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">New Service</h1>
        <p className="text-muted-foreground">Create a new service.</p>
      </div>

      <ServiceForm />
    </div>
  )
}
