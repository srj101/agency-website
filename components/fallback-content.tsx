import { Button } from "@/components/ui/button"
import Link from "next/link"

interface FallbackContentProps {
  title?: string
  message?: string
  showHomeButton?: boolean
}

export function FallbackContent({
  title = "Content Unavailable",
  message = "We're having trouble loading this content right now. Please try again later.",
  showHomeButton = true,
}: FallbackContentProps) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center text-center p-4">
      <h2 className="text-2xl font-bold">{title}</h2>
      <p className="mt-2 text-muted-foreground max-w-md">{message}</p>
      {showHomeButton && (
        <Button asChild className="mt-4">
          <Link href="/">Go Home</Link>
        </Button>
      )}
    </div>
  )
}
