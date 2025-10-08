import { SignupForm } from "@/components/auth/signup-form"

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-accent/20 via-background to-primary/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent mb-2">
            Get Started
          </h1>
          <p className="text-muted-foreground">Create your UdgatiSEO account</p>
        </div>
        <SignupForm />
      </div>
    </div>
  )
}
