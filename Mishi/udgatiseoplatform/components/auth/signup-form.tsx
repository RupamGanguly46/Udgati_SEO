"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Github, Mail } from "lucide-react"

export function SignupForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Signup attempt:", formData)

    const userData = {
      name: formData.name,
      email: formData.email,
      joinDate: new Date().toISOString(),
    }
    localStorage.setItem("udgatiseo_user", JSON.stringify(userData))

    // Simulate successful signup and redirect to dashboard
    setTimeout(() => {
      router.push("/dashboard")
    }, 1000)
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Card className="glass-morphism shadow-xl hover-lift animate-scale-in transition-all duration-300">
      <CardHeader className="animate-fade-in">
        <CardTitle>Create Account</CardTitle>
        <CardDescription>Join UdgatiSEO and start optimizing your website</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 animate-slide-up">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="transition-all duration-300 focus:scale-[1.02]"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="transition-all duration-300 focus:scale-[1.02]"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              className="transition-all duration-300 focus:scale-[1.02]"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
              className="transition-all duration-300 focus:scale-[1.02]"
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="terms"
              checked={formData.agreeToTerms}
              onCheckedChange={(checked) => handleInputChange("agreeToTerms", checked as boolean)}
              className="transition-all duration-300"
            />
            <Label htmlFor="terms" className="text-sm text-pretty">
              I agree to the{" "}
              <Link href="/terms" className="text-primary hover:underline transition-colors duration-300">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-primary hover:underline transition-colors duration-300">
                Privacy Policy
              </Link>
            </Label>
          </div>

          <Button
            type="submit"
            className="w-full hover-lift bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 transition-all duration-300"
            disabled={!formData.agreeToTerms}
          >
            Create Account
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button variant="outline" className="w-full bg-transparent hover-lift transition-all duration-300 group">
            <Github className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
            GitHub
          </Button>
          <Button variant="outline" className="w-full bg-transparent hover-lift transition-all duration-300 group">
            <Mail className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
            Google
          </Button>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center animate-fade-in">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-primary hover:underline transition-colors duration-300">
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
