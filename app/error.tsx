"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Error:", error)
  }, [error])

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
      <h2 className="mb-2 text-2xl font-bold">Something went wrong!</h2>
      <p className="mb-6 text-muted-foreground">{error.message || "An unexpected error occurred"}</p>
      <Button onClick={reset}>Try again</Button>
    </div>
  )
}
