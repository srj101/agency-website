"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { saveService } from "./actions"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"

// Import the editor dynamically to avoid SSR issues
const RichTextEditor = dynamic(() => import("../components/rich-text-editor"), {
  ssr: false,
  loading: () => <div className="h-64 w-full rounded-md border border-input bg-muted" />,
})

const formSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, {
    message: "Title is required.",
  }),
  slug: z
    .string()
    .min(1, {
      message: "Slug is required.",
    })
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      message: "Slug must be lowercase, with no spaces, and only hyphens as separators.",
    }),
  description: z.string().min(1, {
    message: "Description is required.",
  }),
  content: z.string().min(1, {
    message: "Content is required.",
  }),
  icon: z.string().optional(),
  featured: z.boolean().default(false),
})

interface ServiceFormProps {
  service?: {
    id: string
    title: string
    slug: string
    description: string
    content: string
    icon: string | null
    featured: boolean
  }
}

export function ServiceForm({ service }: ServiceFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: service?.id || "",
      title: service?.title || "",
      slug: service?.slug || "",
      description: service?.description || "",
      content: service?.content || "",
      icon: service?.icon || "",
      featured: service?.featured || false,
    },
  })

  // Generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim()
  }

  // Update slug when title changes (only if slug is empty or user hasn't modified it)
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (
        name === "title" &&
        value.title &&
        (!form.getValues("slug") || form.getValues("slug") === generateSlug(form.getValues("title")))
      ) {
        form.setValue("slug", generateSlug(value.title as string))
      }
    })

    return () => subscription.unsubscribe()
  }, [form])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    try {
      const formData = new FormData()

      formData.append("id", values.id || "")
      formData.append("title", values.title)
      formData.append("slug", values.slug)
      formData.append("description", values.description)
      formData.append("content", values.content)
      formData.append("icon", values.icon || "")
      formData.append("featured", values.featured.toString())

      await saveService(formData)

      toast({
        title: "Success",
        description: `Service ${service ? "updated" : "created"} successfully.`,
      })

      router.push("/admin/services")
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Service title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <Input placeholder="service-slug" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Brief description of the service" className="min-h-20" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <RichTextEditor value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="icon"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Icon (emoji or icon code)</FormLabel>
              <FormControl>
                <Input placeholder="🚀" {...field} value={field.value || ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="featured"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Featured</FormLabel>
                <div className="text-sm text-muted-foreground">Feature this service on the homepage.</div>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.push("/admin/services")}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : service ? "Update Service" : "Create Service"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
