import { RegisterForm } from "./register-form"

export const metadata = {
  title: "Register | Agency Website",
  description: "Create a new account.",
}

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="mx-auto max-w-md w-full p-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Register</h1>
          <p className="mt-2 text-muted-foreground">Create a new account</p>
        </div>
        <div className="mt-8">
          <RegisterForm />
        </div>
      </div>
    </div>
  )
}
