"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Search, TrendingUp, Target, Loader2, ArrowRight } from "lucide-react"

export function KeywordExtractionModule() {
  const [url, setUrl] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [keywords, setKeywords] = useState<
    Array<{ keyword: string; volume: number; difficulty: string; opportunity: string }>
  >([])

  const handleAnalyze = async () => {
    if (!url) return

    setIsAnalyzing(true)
    // Simulate API call
    setTimeout(() => {
      setKeywords([
        { keyword: "SEO optimization", volume: 12000, difficulty: "Medium", opportunity: "High" },
        { keyword: "keyword research", volume: 8500, difficulty: "Low", opportunity: "High" },
        { keyword: "content marketing", volume: 15000, difficulty: "High", opportunity: "Medium" },
        { keyword: "digital marketing", volume: 22000, difficulty: "High", opportunity: "Low" },
        { keyword: "search engine ranking", volume: 5500, difficulty: "Medium", opportunity: "High" },
      ])
      setIsAnalyzing(false)
    }, 3000)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Search className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Keyword Extraction</h1>
          <p className="text-muted-foreground">Discover high-impact keywords for your content strategy</p>
        </div>
      </div>

      <Card className="bg-card/60 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle>Analyze Website Keywords</CardTitle>
          <CardDescription>Enter your website URL to extract and analyze keywords</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="url">Website URL</Label>
            <div className="flex gap-4">
              <Input
                id="url"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleAnalyze} disabled={isAnalyzing || !url}>
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Extract Keywords
                  </>
                )}
              </Button>
            </div>
          </div>

          {isAnalyzing && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Analyzing content...</span>
                <span>75%</span>
              </div>
              <Progress value={75} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      {keywords.length > 0 && (
        <Card className="bg-card/60 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle>Extracted Keywords</CardTitle>
            <CardDescription>Keywords found with optimization opportunities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {keywords.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-lg bg-muted/20 border border-border/30"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold">{item.keyword}</h3>
                      <Badge
                        variant={
                          item.opportunity === "High"
                            ? "default"
                            : item.opportunity === "Medium"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {item.opportunity} Opportunity
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        {item.volume.toLocaleString()} searches/month
                      </span>
                      <span className="flex items-center gap-1">
                        <Target className="h-3 w-3" />
                        {item.difficulty} difficulty
                      </span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Optimize
                    <ArrowRight className="ml-2 h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
