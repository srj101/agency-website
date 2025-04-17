import { CategoryForm } from "../category-form"

export const metadata = {
  title: "New Category | Admin Panel",
  description: "Create a new category.",
}

export default function NewCategoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">New Category</h1>
        <p className="text-muted-foreground">Create a new category.</p>
      </div>

      <CategoryForm />
    </div>
  )
}
