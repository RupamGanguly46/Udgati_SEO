import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10 animate-gradient flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 text-center animate-fade-in">
        <div className="space-y-4 animate-slide-up">
          <h1 className="text-4xl md:text-5xl font-bold gradient-text animate-pulse-glow">UdgatiSEO</h1>
          <p className="text-lg text-muted-foreground text-balance">Agentic SEO Automation Platform</p>
        </div>

        <div className="space-y-4 animate-scale-in">
          <Link href="/auth/login" className="block">
            <Button
              size="lg"
              className="w-full hover-lift !bg-gradient-to-r !from-blue-600 !to-green-600 hover:!from-blue-700 hover:!to-green-700 !text-white shadow-lg transition-all duration-300 font-semibold !border-0 opacity-100"
              style={{
                background: "linear-gradient(to right, rgb(37, 99, 235), rgb(22, 163, 74)) !important",
                color: "white !important",
                border: "none !important",
              }}
            >
              Get Started
            </Button>
          </Link>
          <p className="text-sm text-muted-foreground text-pretty">Transform your SEO with AI-powered automation</p>
        </div>
      </div>
    </div>
  )
}
