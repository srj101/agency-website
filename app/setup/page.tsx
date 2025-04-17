"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, Loader2, Database, Info } from "lucide-react"
import Link from "next/link"
import { Steps, Step } from "@/components/ui/steps"

export default function SetupPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
  const [message, setMessage] = useState("")
  const [currentStep, setCurrentStep] = useState(0)

  const setupDatabase = async () => {
    setIsLoading(true)
    setStatus("idle")
    setMessage("")
    setCurrentStep(1)

    try {
      // Step 1: Create tables
      setCurrentStep(1)
      const tablesResponse = await fetch("/api/setup/create-tables")
      if (!tablesResponse.ok) {
        const error = await tablesResponse.json()
        throw new Error(error.error || "Failed to create tables")
      }
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate some processing time

      // Step 2: Insert sample data
      setCurrentStep(2)
      const dataResponse = await fetch("/api/setup/insert-data")
      if (!dataResponse.ok) {
        const error = await dataResponse.json()
        throw new Error(error.error || "Failed to insert sample data")
      }
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate some processing time

      // Step 3: Setup complete
      setCurrentStep(3)
      setStatus("success")
      setMessage("Database setup completed successfully! You can now start using your agency website.")
    } catch (error) {
      setStatus("error")
      setMessage(error instanceof Error ? error.message : "An unexpected error occurred")
      console.error("Setup error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container flex min-h-screen items-center justify-center py-8">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Agency Website Setup
          </CardTitle>
          <CardDescription>Initialize your database with tables and sample data</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6 border-blue-500 bg-blue-50 dark:bg-blue-950">
            <Info className="h-4 w-4 text-blue-500" />
            <AlertTitle>Development Mode</AlertTitle>
            <AlertDescription>
              This setup creates simplified Row Level Security (RLS) policies for development purposes. In a production
              environment, you would want to implement more restrictive policies.
            </AlertDescription>
          </Alert>

          <p className="mb-6 text-sm text-muted-foreground">
            This will create the necessary tables and sample data in your Supabase database to get started with the
            agency website. The setup process includes:
          </p>

          <Steps currentStep={currentStep} className="mb-6">
            <Step title="Prepare" description="Getting ready to set up your database" />
            <Step title="Create Tables" description="Creating the necessary database tables" />
            <Step title="Insert Data" description="Adding sample content to your website" />
            <Step title="Complete" description="Setup process completed successfully" />
          </Steps>

          {status === "success" && (
            <Alert className="mb-4 border-green-500 bg-green-50 dark:bg-green-950">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          {status === "error" && (
            <Alert className="mb-4 border-red-500 bg-red-50 dark:bg-red-950">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          {status === "success" ? (
            <Button asChild>
              <Link href="/">Go to Homepage</Link>
            </Button>
          ) : (
            <>
              <Button variant="outline" asChild disabled={isLoading}>
                <Link href="/">Back to Home</Link>
              </Button>
              <Button onClick={setupDatabase} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Setting Up...
                  </>
                ) : (
                  "Set Up Database"
                )}
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
