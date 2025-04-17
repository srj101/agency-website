"use client"

import { Button } from "@/components/ui/button"
import { ThemeProvider } from "@/components/theme-provider"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="flex h-screen flex-col items-center justify-center p-4 text-center">
            <h1 className="mb-2 text-3xl font-bold">Something went wrong!</h1>
            <p className="mb-6 text-muted-foreground">{error.message || "An unexpected error occurred"}</p>
            <Button onClick={reset}>Try again</Button>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
