"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Zap } from "lucide-react"
import { useState } from "react"

export function DashboardHeader() {
  const [websiteUrl, setWebsiteUrl] = useState("")

  const handleOptimize = () => {
    if (websiteUrl) {
      console.log("Optimizing website:", websiteUrl)
      // Handle optimization logic
    }
  }

  return (
    <header className="border-b border-border/50 glass-morphism animate-slide-up">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="animate-fade-in">
            <h1 className="text-2xl font-bold gradient-text">UdgatiSEO Dashboard</h1>
            <p className="text-muted-foreground text-pretty">AI-powered SEO optimization at your fingertips</p>
          </div>
          <Button variant="outline" size="sm" className="hover-lift bg-transparent">
            Account
          </Button>
        </div>

        {/* Main URL Input Section */}
        <div className="max-w-4xl animate-scale-in">
          <div className="glass-morphism rounded-xl p-6 border border-border/50 shadow-lg hover-lift transition-all duration-300">
            <h2 className="text-lg font-semibold mb-4 text-center">Enter Website URL to Optimize</h2>
            <div className="flex gap-4 mobile-stack">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 transition-colors" />
                <Input
                  placeholder="https://example.com"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  className="pl-10 h-12 text-lg bg-background/50 transition-all duration-300 focus:bg-background/80 mobile-full"
                />
              </div>
              <Button
                onClick={handleOptimize}
                size="lg"
                className="px-8 h-12 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white shadow-lg hover-lift transition-all duration-300 mobile-full border-0 opacity-100"
                style={{
                  background: "linear-gradient(to right, rgb(37, 99, 235), rgb(22, 163, 74))",
                  color: "white",
                }}
              >
                <Zap className="mr-2 h-5 w-5 transition-transform group-hover:scale-110 text-white" />
                Optimize Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
