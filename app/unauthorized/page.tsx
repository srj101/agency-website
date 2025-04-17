import Link from "next/link"
import { Button } from "@/components/ui/button"

export const metadata = {
  title: "Unauthorized | Agency Website",
  description: "You do not have permission to access this page.",
}

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Unauthorized</h1>
        <p className="mt-4 text-lg text-muted-foreground">You do not have permission to access this page.</p>
        <div className="mt-8">
          <Button asChild>
            <Link href="/">Go Home</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
