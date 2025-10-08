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
import { Github, Mail } from "lucide-react"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle login logic here
    console.log("Login attempt:", { email, password })

    const userData = {
      name:
        email
          .split("@")[0]
          .replace(/[^a-zA-Z]/g, " ")
          .replace(/\b\w/g, (l) => l.toUpperCase()) || "User",
      email: email,
      joinDate: new Date().toISOString(),
    }
    localStorage.setItem("udgatiseo_user", JSON.stringify(userData))

    setTimeout(() => {
      router.push("/dashboard")
    }, 1000)
  }

  return (
    <Card className="glass-morphism shadow-xl hover-lift animate-scale-in transition-all duration-300">
      <CardHeader className="animate-fade-in">
        <CardTitle>Sign In</CardTitle>
        <CardDescription>Enter your credentials to access your account</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 animate-slide-up">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="transition-all duration-300 focus:scale-[1.02]"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="transition-all duration-300 focus:scale-[1.02]"
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full hover-lift bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 transition-all duration-300"
          >
            Sign In
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
          Don't have an account?{" "}
          <Link href="/auth/signup" className="text-primary hover:underline transition-colors duration-300">
            Sign up
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
