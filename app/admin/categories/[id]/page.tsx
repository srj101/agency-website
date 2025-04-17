import { CategoryForm } from "../category-form"
import { createServerSupabaseClient } from "@/lib/supabase"
import { notFound } from "next/navigation"

export const metadata = {
  title: "Edit Category | Admin Panel",
  description: "Edit an existing category.",
}

async function getCategory(id: string) {
  const supabase = createServerSupabaseClient()

  const { data } = await supabase.from("categories").select("*").eq("id", id).single()

  return data
}

export default async function EditCategoryPage({ params }: { params: { id: string } }) {
  const category = await getCategory(params.id)

  if (!category) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Category</h1>
        <p className="text-muted-foreground">Edit an existing category.</p>
      </div>

      <CategoryForm category={category} />
    </div>
  )
}
